import { getSessionUserAttrOrRedirect } from "@/lib/session";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function UserDashboardLayout({ children }: DashboardLayoutProps) {
  await getSessionUserAttrOrRedirect();

  return (
    <>
      <div className="px-4> mx-auto grid w-full max-w-[1000px] gap-12">{children}</div>
    </>
  );
}
