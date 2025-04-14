import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import { ClerkThemeProvider } from "@/components/ClerkThemeProvider";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PigStar",
  description: "Only you and me",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (user) {
    await syncUser(user);
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-12">{children}</div>
                  </div>
                </div>
              </main>
              <SpeedInsights />
            </div>
            <Toaster />
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
