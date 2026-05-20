import "./globals.css";

export const metadata = {
  title: "Projects | Open Finance Insights Platform",
  description:
    "AI-powered open finance platform that ingests and normalizes financial data into a common data model to generate explainable cash flow, subscription, and financial health insights.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
