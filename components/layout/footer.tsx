import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="flex justify-between items-center p-5 md:px-10">
      <p className="text-slate-500 text-sm">
        Built by{" "}
        <Link
          href="https://github.com/almoloo"
          className="underline"
          target="_blank"
        >
          almoloo
        </Link>
        .
      </p>
      <div className="flex justify-end items-center">
        <Link href="https://github.com/almoloo/echo" target="_blank" passHref>
          <Button variant="ghost" size="icon">
            <GithubIcon />
          </Button>
        </Link>
      </div>
    </footer>
  );
}
