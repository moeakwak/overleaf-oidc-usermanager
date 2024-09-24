"use client";

import { useLogout } from "@/hooks/logout";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function LogoutButton() {
  const logout = useLogout();

  return <Button onClick={logout} variant="outline" size="icon" ><Icons.logout className="w-4" /></Button>; 
}
