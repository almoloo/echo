import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/services/providers";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Echo - AI-powered Widget for Lukso Universal Profiles",
  description:
    "Echo enables Lukso Universal Profile owners to create personalized AI assistants that learn from their responses and engage with visitors through questions, messages, and LYX donations.",
  applicationName: "Echo",
  keywords: [
    "Lukso",
    "Universal Profiles",
    "AI",
    "Web3",
    "blockchain",
    "assistant",
    "widget",
  ],
  authors: [{ name: "Ali Mousavi" }],
  openGraph: {
    type: "website",
    siteName: "Echo",
    title: "Echo - AI-powered Widget for Lukso Universal Profiles",
    description: "Personalized AI assistants for Lukso Universal Profiles",
    url: "https://echo.almoloo.com",
    images: [
      {
        url: "/public/banner.png",
        width: 1280,
        height: 640,
        alt: "Echo - AI-powered Widget for Lukso Universal Profiles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Echo - AI-powered Widget for Lukso Universal Profiles",
    description:
      "Create a personalized AI assistant for your Lukso Universal Profile",
    images: ["/public/banner.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
