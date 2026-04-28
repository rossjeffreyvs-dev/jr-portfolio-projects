import "./globals.css";

export const metadata = {
  title: "JR Projects | Claude Clinical Protocol Reasoning",
  description:
    "Clinical protocol reasoning demo using trials, synthetic patients, and Claude-style evaluation.",
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
