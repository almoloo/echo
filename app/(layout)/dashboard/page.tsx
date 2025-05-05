import VisitorCard from "@/components/analytics/visitor-card";
import VisitorsChart from "@/components/analytics/visitors-chart";
import Heading from "@/components/layout/heading";
import WidgetUrlCard from "@/components/profile/widget-url-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getVisitors } from "@/lib/data/analytics";
import { EyeIcon, EyeOffIcon, LayoutDashboardIcon } from "lucide-react";

export default async function DashboardPage() {
  const visitors = await getVisitors();

  return (
    <div>
      <Heading
        title="Dashboard"
        subtitle="These are the people who’ve visited your profile — curious minds, potential connections, or future collaborators."
        icon={<LayoutDashboardIcon />}
      />

      <WidgetUrlCard className="mb-5" />

      <VisitorsChart data={visitors} className="mb-5" />

      <Heading title="Visitors" icon={<EyeIcon />} />

      {visitors.length > 0 ? (
        <div className="flex flex-col gap-2">
          {visitors.reverse().map((visitor) => (
            <VisitorCard visitor={visitor} key={visitor.id} />
          ))}
        </div>
      ) : (
        <Alert className="bg-slate-50">
          <EyeOffIcon className="w-4 h-4" />
          <AlertTitle>No Visitors Yet</AlertTitle>
          <AlertDescription>
            Looks like no one’s dropped by your profile just yet. Once someone
            checks it out, you’ll see them listed here — both anonymous and
            connected visitors.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
