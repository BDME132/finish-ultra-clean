import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      {/* Main content — offset for sidebar on desktop, offset for top bar on mobile */}
      <div className="md:ml-56 pt-14 md:pt-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}
