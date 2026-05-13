import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "../styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/theme-provider";
import OnThisPage from "@/components/OnThisPage";

export const metadata: Metadata = {
  title: "NEF2 | The AI Operating Substrate",
  description: "A hardware-native, unified multi-backend intelligence stack for distributed AI execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 items-start lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
              <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-border/50 py-6 pr-2 lg:sticky lg:block">
                <Sidebar />
              </aside>
              <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_200px]">
                <div className="mx-auto w-full min-w-0 max-w-3xl px-4 lg:px-0">
                  {children}
                </div>
                <aside className="hidden text-sm xl:block">
                  <div className="sticky top-16 -mt-10 pt-4">
                    <OnThisPage />
                  </div>
                </aside>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
