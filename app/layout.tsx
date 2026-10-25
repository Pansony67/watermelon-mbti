import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import MusicPlayer from "@/components/MusicPlayer";
import { SITE_URL } from "@/lib/site";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

/* Display: a grotesque with character. Optical size and width axes are used for the giant family words. */
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const TITLE = "Melonality - What Kind of Watermelon Are You?";
const DESCRIPTION =
  "Twenty questions, twenty watermelon types. Find the one hiding under your rind, and what it says about how you operate.";

/* Structured data: tells Google the site's name is "Melonality" (shown above the result in search). */
const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Melonality",
  alternateName: ["Melonality Quiz", "Watermelon MBTI"],
  url: `${SITE_URL}/`,
  description: DESCRIPTION,
};

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
  // The image comes from app/twitter-image (and each type's own); the card shows it full width.
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
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
    // data-scroll-behavior: page changes jump to the top instantly; smooth scrolling stays for in-page links.
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${bricolage.variable} ${figtree.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        {/* Facebook appends "#_=_" to its sign-in redirect; drop it so shared links stay clean. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(location.hash==="#_=_")history.replaceState(null,"",location.pathname+location.search)`,
          }}
        />
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
        {/* Cookieless page-view counts; described on /privacy. */}
        <Analytics />
      </body>
    </html>
  );
}
