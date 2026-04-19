import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

function extensionFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: "Unsupported image format." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 4 MB." }, { status: 400 });
    }

    const ext = extensionFromMime(file.type);
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        contentType: file.type,
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Avatar upload failed:", uploadError);
      return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 });
    }

    const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = publicUrl.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert(
        { id: user.id, avatar_url: avatarUrl, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );

    if (updateError) {
      console.error("Avatar profile update failed:", updateError);
      return NextResponse.json({ error: "Failed to save avatar" }, { status: 500 });
    }

    return NextResponse.json({ avatar_url: avatarUrl });
  } catch (error) {
    console.error("Avatar POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
