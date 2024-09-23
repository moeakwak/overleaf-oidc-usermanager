import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getVersion } from "@/lib/version";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage({}) {
  const currentVersion = getVersion();

  return (
    <div className="grid gap-10">
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
          <CardDescription>服务状态</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          当前版本：<Badge variant="outline">{currentVersion}</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
