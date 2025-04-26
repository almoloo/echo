interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className="flex md:flex-col items-start gap-4">
      <div className="flex gap-1">
        <div className="bg-indigo-200 p-3 rounded-sm aspect-square text-indigo-700">
          {icon}
        </div>
        <div className="bg-indigo-200/50 px-1 rounded-sm"></div>
        <div className="bg-indigo-200/25 px-1 rounded-sm"></div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-xl">{title}</h3>
        <p className="text-slate-700">{description}</p>
      </div>
    </div>
  );
}
