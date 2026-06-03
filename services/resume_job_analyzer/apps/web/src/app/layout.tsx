import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Match Analyzer",
  description: "Compare a resume against a job description and generate an AI-powered match analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
