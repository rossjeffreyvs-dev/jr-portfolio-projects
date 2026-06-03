import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI FX Insights",
  description: "Stream client-ready FX commentary from rates, market headlines, and AI-assisted analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
