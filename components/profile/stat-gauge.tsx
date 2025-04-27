import { Progress } from "@/components/ui/progress";

interface StatGaugeProps {
  label: string;
  title: string;
  percent: number;
  min: number;
  max: number;
  current: number;
  level: number;
}

export default function StatGauge(props: StatGaugeProps) {
  return (
    <div>
      {/* <div className="text-center">
        <small className="absolute text-xs">{props.title}</small>
      </div> */}
      <div className="flex justify-between items-end mb-1">
        <strong className="font-black text-3xl">{props.level}</strong>
        <div className="flex justify-end items-center mt-1">
          <small>{props.current}</small>/<small>{props.max}</small>
        </div>
      </div>
      <div>
        <Progress value={props.percent} />
      </div>
      <div className="text-center">
        <small className="text-slate-500 text-xs">{props.label}</small>
      </div>
    </div>
  );
}
