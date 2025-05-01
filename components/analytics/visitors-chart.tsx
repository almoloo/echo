"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ByConnection from "@/components/analytics/by-connection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ByBrowser from "@/components/analytics/by-browser";
import ByOS from "@/components/analytics/by-os";

interface VisitorsChartProps {
  data: VisitData[];
  className?: string;
}

export default function VisitorsChart({ data, className }: VisitorsChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Universal Profile Views</CardTitle>
        <CardDescription>
          The total number of people who have visited your Universal Profile
          over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="connection">
          <TabsList>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="browser">Browser</TabsTrigger>
            <TabsTrigger value="os">Operating System</TabsTrigger>
          </TabsList>
          <TabsContent value="connection">
            <ByConnection data={data} />
          </TabsContent>
          <TabsContent value="browser">
            <ByBrowser data={data} />
          </TabsContent>
          <TabsContent value="os">
            <ByOS data={data} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
