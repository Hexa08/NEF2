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
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-[#020202]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1 items-start lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 container mx-auto px-4 lg:px-8">
              <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto py-8 pr-2 lg:sticky lg:block scrollbar-hide">
                <Sidebar />
              </aside>
              <main className="relative py-8 lg:gap-10 lg:py-12 xl:grid xl:grid-cols-[1fr_240px]">
                <div className="mx-auto w-full min-w-0 max-w-2xl lg:max-w-3xl">
                  {children}
                </div>
                <aside className="hidden text-sm xl:block">
                  <div className="sticky top-28">
                    <OnThisPage />
                  </div>
                </aside>
              </main>
            </div>
            
            {/* Background elements */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
              <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[100px]" />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
