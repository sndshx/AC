import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Raleway } from "next/font/google";
import { cn } from "@/lib/utils";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export const metadata: Metadata = {
  title: "Article Craft",
  description: "Article writing and content creation management platform for teams and individuals."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", raleway.variable)}>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
