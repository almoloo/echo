import VisitorCard from "@/components/analytics/visitor-card";
import VisitorsChart from "@/components/analytics/visitors-chart";
import Heading from "@/components/layout/heading";
import { getVisitors } from "@/lib/data/analytics";
import { EyeIcon, LayoutDashboardIcon } from "lucide-react";

export default async function DashboardPage() {
  const visitors = await getVisitors();
  console.log(visitors);
  return (
    <div>
      <Heading
        title="Dashboard"
        subtitle="These are the people who’ve visited your profile — curious minds, potential connections, or future collaborators."
        icon={<LayoutDashboardIcon />}
      />

      <VisitorsChart data={visitors} className="mb-5" />

      <Heading title="Visitors" icon={<EyeIcon />} />

      {visitors.length > 0 ? (
        <div className="flex flex-col gap-2">
          {visitors.reverse().map((visitor) => (
            <VisitorCard visitor={visitor} key={visitor.id} />
          ))}
        </div>
      ) : (
        <div>no visitors!</div>
      )}
    </div>
  );
}
