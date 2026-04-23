import PheidiProvider from "./PheidiProvider";
import PheidiSidebarMount from "./PheidiSidebarMount";

export default function PheidiShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PheidiProvider>
      {children}
      <PheidiSidebarMount />
    </PheidiProvider>
  );
}
