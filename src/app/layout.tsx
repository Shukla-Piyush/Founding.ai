import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foundingai.in — Autonomous Business Intelligence",
  description: "Foundingai.in deploys intelligent AI agents across your tools, workflows, and data — executing real work without manual effort.",
  keywords: ["AI", "Foundingai.in", "autonomous agents", "business automation", "multi-agent", "startup AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="noise-overlay grid-bg" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
