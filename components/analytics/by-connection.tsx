import { Bar, BarChart, CartesianGrid, Legend, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { groupByDate, mergeByDate } from "@/lib/utils";

interface ByConnectionProps {
  data: VisitData[];
}

export default function ByConnection({ data }: ByConnectionProps) {
  const chartConfig = {} satisfies ChartConfig;

  const connectedVisitors = data
    .filter((elem) => elem.wallet)
    .map((elem) => ({ timestamp: Number(elem.date) }));
  const anonymousVisitors = data
    .filter((elem) => !elem.wallet)
    .map((elem) => ({ timestamp: Number(elem.date) }));
  const connectedVisitorsCData = groupByDate(connectedVisitors);
  const anonymousVisitorsCData = groupByDate(anonymousVisitors);

  const mergedData = mergeByDate(
    connectedVisitorsCData,
    anonymousVisitorsCData
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full h-[250px] aspect-auto"
    >
      <BarChart accessibilityLayer data={mergedData}>
        <CartesianGrid />
        <XAxis
          dataKey="date"
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <Legend />
        <Bar dataKey="connected" stackId="a" barSize={20} fill="#4834d4" />
        <Bar dataKey="anonymous" stackId="a" barSize={20} fill="#a29bfe" />
      </BarChart>
    </ChartContainer>
  );
}
