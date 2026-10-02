import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import TypeDetail from "@/components/TypeDetail";
import { FAMILY_STYLE, TYPES } from "@/lib/types";

const find = (slug: string) => TYPES.find((type) => type.slug === slug);

export function generateStaticParams() {
  return TYPES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/types/[slug]">): Promise<Metadata> {
  const type = find((await params).slug);
  if (!type) notFound();
  const title = `${type.name} | Melonality`;
  // Set in full: a page's openGraph replaces the layout's rather than merging with it.
  return {
    title,
    description: type.tagline,
    openGraph: { title, description: type.tagline, url: `/types/${type.slug}`, siteName: "Melonality", type: "website", images: type.image },
  };
}

/** One type's own shareable page, on its family's dark band. */
export default async function TypePage({ params }: PageProps<"/types/[slug]">) {
  const type = find((await params).slug);
  if (!type) notFound();

  return (
    <main id="main" className="relative flex min-h-dvh flex-col bg-paper text-ink">
      <SiteNav />

      <div className={`flex-1 ${FAMILY_STYLE[type.family].band}`}>
        <div className="mx-auto w-full max-w-5xl px-5 pt-8 pb-20 sm:px-8 sm:pt-12 sm:pb-28">
          <Link
            href="/types"
            className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-cine-ink-2 transition-colors hover:text-cine-ink"
          >
            <ArrowLeft size={16} weight="bold" aria-hidden />
            Back to all types
          </Link>
          <div className="mt-8">
            <TypeDetail type={type} />
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
