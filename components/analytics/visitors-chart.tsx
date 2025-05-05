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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleSlashIcon } from "lucide-react";

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
        {data.length > 0 ? (
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
        ) : (
          <Alert className="bg-slate-50">
            <CircleSlashIcon className="w-4 h-4" />
            <AlertTitle>Nothing to Show</AlertTitle>
            <AlertDescription>
              Your Universal Profile hasn’t had any visitors yet. Share your
              profile link to start tracking views and engagement.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
