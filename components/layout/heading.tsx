interface HeadingProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function Heading(props: HeadingProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        {props.icon && props.icon}
        <h1 className="font-bold text-2xl">{props.title}</h1>
      </div>
      <p className="mt-1 text-slate-600 text-sm leading-relaxed">
        {props.subtitle}
      </p>
    </div>
  );
}
