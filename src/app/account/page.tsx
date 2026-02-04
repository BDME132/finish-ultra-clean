"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase-browser";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CustomKitRequest {
  id: string;
  created_at: string;
  target_distance: string;
  race_name: string | null;
  race_date: string;
  budget_range: string;
  experience_level: string;
}

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [requests, setRequests] = useState<CustomKitRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchRequests() {
      if (!user) return;

      const { data, error } = await supabase
        .from("custom_kit_requests")
        .select("id, created_at, target_distance, race_name, race_date, budget_range, experience_level")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
      } else {
        setRequests(data || []);
      }
      setLoadingRequests(false);
    }

    if (user) {
      fetchRequests();
    }
  }, [user, supabase]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-gray">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <h1 className="font-headline text-3xl font-bold text-dark mb-8">
          My Account
        </h1>

        {/* Profile Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="font-headline text-xl font-semibold text-dark mb-4">
            Profile
          </h2>
          <div className="space-y-2">
            <p className="text-gray">
              <span className="font-medium text-dark">Email:</span> {user.email}
            </p>
            <p className="text-gray">
              <span className="font-medium text-dark">Member since:</span>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-6 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Log Out
          </button>
        </section>

        {/* Order History Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-headline text-xl font-semibold text-dark mb-4">
            Custom Kit Requests
          </h2>

          {loadingRequests ? (
            <p className="text-gray">Loading your requests...</p>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray mb-4">You haven&apos;t submitted any custom kit requests yet.</p>
              <a
                href="/custom-kit"
                className="inline-block bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Request a Custom Kit
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-100 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-dark">
                      {request.race_name || request.target_distance}
                    </h3>
                    <span className="text-xs text-gray">
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray">
                    <p>
                      <span className="font-medium">Distance:</span>{" "}
                      {request.target_distance}
                    </p>
                    <p>
                      <span className="font-medium">Race Date:</span>{" "}
                      {new Date(request.race_date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Budget:</span>{" "}
                      {request.budget_range}
                    </p>
                    <p>
                      <span className="font-medium">Experience:</span>{" "}
                      {request.experience_level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
