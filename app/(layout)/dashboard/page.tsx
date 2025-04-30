"use client";

import Heading from "@/components/layout/heading";
import { LayoutDashboardIcon } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <Heading
        title="Dashboard"
        subtitle="These are the people who’ve visited your profile — curious minds, potential connections, or future collaborators."
        icon={<LayoutDashboardIcon />}
      />
    </div>
  );
}
