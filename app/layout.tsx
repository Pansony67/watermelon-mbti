import type { Metadata, Viewport } from "next";
import { Fredoka, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const TITLE = "Watermelon MBTI - What Kind of Watermelon Are You?";
const DESCRIPTION =
  "Twenty questions, ten watermelon types. Find the one hiding under your rind, and what it says about how you operate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Watermelon MBTI",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A2015",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-flesh focus:px-4 focus:py-2 focus:font-medium focus:text-rind-deep"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
