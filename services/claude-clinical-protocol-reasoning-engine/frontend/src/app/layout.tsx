import "./globals.css";

export const metadata = {
  title: "Claude Clinical Protocol Reasoning Engine",
  description:
    "Clinical protocol reasoning demo using trials, synthetic patients, and Claude-style evaluation.",
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
