import type { Metadata, Viewport } from "next";
import { Figtree, Fredoka } from "next/font/google";
import MusicPlayer from "@/components/MusicPlayer";
import { SITE_URL } from "@/lib/site";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const TITLE = "Melonality - What Kind of Watermelon Are You?";
const DESCRIPTION =
  "Twenty questions, twenty watermelon types. Find the one hiding under your rind, and what it says about how you operate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Melonality",
    type: "website",
  },
  // Search Console: the token only; Next renders the <meta name="google-site-verification"> tag.
  verification: {
    google: "-ieHpQmBVmaZaYHuBgOUw0SAV2CD7P5mnP8YlDWjm1o",
  },
};

/* Browser chrome follows the system theme; the page follows the visitor's choice. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1816" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The inline script sets data-theme before paint; suppressHydrationWarning lets the DOM win.
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${fredoka.variable} ${figtree.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-control focus:bg-ink focus:px-4 focus:py-2 focus:font-medium focus:text-paper"
        >
          Skip to content
        </a>
        {children}
        {/* Outside the page tree: route changes must not restart playback. */}
        <MusicPlayer />
      </body>
    </html>
  );
}
