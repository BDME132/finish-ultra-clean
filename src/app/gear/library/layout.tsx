import { KitProvider } from "@/lib/kit-context";
import KitDrawer from "@/components/KitDrawer";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KitProvider>
      {children}
      <KitDrawer />
    </KitProvider>
  );
}
