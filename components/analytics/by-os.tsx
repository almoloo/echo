import { Cell, Legend, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { calculateDataPercentages } from "@/lib/utils";
import { _colors } from "@/lib/constants";

interface ByOSProps {
  data: VisitData[];
}

export default function ByOS({ data }: ByOSProps) {
  const chartConfig = {} satisfies ChartConfig;

  const simpleData = data.map((elem) => ({
    name: elem.userAgentData?.os.name!,
  }));
  const osData = calculateDataPercentages(simpleData);

  return (
    <ChartContainer
      config={chartConfig}
      className="w-full h-[250px] aspect-auto"
    >
      <PieChart data={osData} accessibilityLayer>
        <Pie
          data={osData}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="percent"
          cornerRadius={5}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={_colors[index % _colors.length]}
            />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              formatter={(val, payload) => (
                <div className="flex justify-between items-center w-full">
                  <span>{payload}</span>
                  <strong>{val}%</strong>
                </div>
              )}
            />
          }
        />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
}
