import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "NEF2 Documentation",
  description: "Next-generation AI model serialization and inference infrastructure framework.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen bg-background text-zinc-300 antialiased selection:bg-indigo-500/30`}>
        {children}
      </body>
    </html>
  );
}
