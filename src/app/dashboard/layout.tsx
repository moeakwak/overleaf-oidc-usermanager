import { getSessionUserAttrOrRedirect } from "@/lib/session";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import LogoutButton from "../_components/logout-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function UserDashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getSessionUserAttrOrRedirect();

  return (
    <>
      <div className="px-4> mx-auto grid w-full max-w-[1000px] gap-12">{children}</div>
    </>
  );
}
