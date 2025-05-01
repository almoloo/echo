import VisitorsChart from "@/components/analytics/visitors-chart";
import Heading from "@/components/layout/heading";
import { getVisitors } from "@/lib/data/analytics";
import { LayoutDashboardIcon } from "lucide-react";

export default async function DashboardPage() {
  const visitors = await getVisitors();
  console.log(visitors);
  // const mainChartData = visitors.map
  return (
    <div>
      <Heading
        title="Dashboard"
        subtitle="These are the people who’ve visited your profile — curious minds, potential connections, or future collaborators."
        icon={<LayoutDashboardIcon />}
      />

      <VisitorsChart data={visitors} className="mb-5" />

      {visitors.length > 0 ? (
        <>
          {visitors.map((visitor) => (
            <div key={visitor.id}>
              <div>id: {visitor.id}</div>
              <div>date: {visitor.date}</div>
              <div>languages: {visitor.languages?.join(", ")}</div>
              <div>
                location: {visitor.location?.country}, {visitor.location?.city}
              </div>
              <div>referrer: {visitor.referrer}</div>
              <div>resolution: {visitor.resolution}</div>
              <div>userAgent: {visitor.userAgent}</div>
              <div>wallet: {visitor.wallet}</div>
              <div>UA: {JSON.stringify(visitor.userAgentData)}</div>
              <div>---</div>
            </div>
          ))}
        </>
      ) : (
        <div>no visitors!</div>
      )}
    </div>
  );
}
