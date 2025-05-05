import { LoaderIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center py-10 h-full grow">
      <LoaderIcon className="w-12 h-12 text-slate-500 animate-spin" />
    </div>
  );
}
