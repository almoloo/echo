import { Button } from "@/components/ui/button";
import {
  ChevronsRightIcon,
  IceCreamConeIcon,
  PencilLineIcon,
  TreePineIcon,
  WalletIcon,
} from "lucide-react";
import gradientBG from "@/public/gradient.png";
import Image from "next/image";
import FeatureCard from "@/components/home/feature-card";
import CTAButton from "@/components/home/cta-button";

export default function Home() {
  return (
    <main className="flex flex-col gap-20 grow">
      <section className="flex flex-col items-center gap-10 md:gap-16 md:grid md:grid-cols-2 lg:grid-cols-3 mx-10">
        <div className="md:order-2 lg:col-span-2">
          <Image
            src={gradientBG}
            alt="Gradient background"
            className="shadow-2xl rounded-4xl"
            priority
          />
        </div>
        <div className="flex flex-col items-start gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="font-black text-4xl">
              Turn Your Voice Into an Echo.
            </h2>
            <p className="font-medium text-slate-700 text-lg">
              Build your personal AI — a playful reflection of you, ready to
              connect with the world. Echo is where your story gets its own
              voice.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <CTAButton />
            <ChevronsRightIcon className="text-slate-400 animate-pulse" />
            <span className="text-slate-600">It's free!</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-10 md:gap-15 md:grid md:grid-cols-3 mx-10 my-auto">
        <FeatureCard
          title="Shape Your Voice"
          description="Answer a few playful questions to teach Echo who you are. Your assistant becomes a mirror of your ideas, values, and vibe."
          icon={<PencilLineIcon />}
        />
        <FeatureCard
          title="Instantly Create Your AI"
          description="No code, no hassle. Echo turns your answers into a smart, friendly assistant that talks just like you."
          icon={<IceCreamConeIcon />}
        />
        <FeatureCard
          title="Grow Your Echo Over Time"
          description="Add new answers whenever you want. The more you share, the richer and smarter your Echo becomes."
          icon={<TreePineIcon />}
        />
      </section>
    </main>
  );
}
