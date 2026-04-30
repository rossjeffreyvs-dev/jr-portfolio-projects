import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Train Jazz Agent | JR Projects",
  description: "A TrainJazz-inspired multi-agent system that turns subway movement into an ambient, explainable jazz soundscape.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
