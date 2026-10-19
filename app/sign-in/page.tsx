import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm, { explainSocial } from "@/components/SignInForm";
import { Wordmark } from "@/components/SiteNav";
import ThemeToggle from "@/components/ThemeToggle";
import { auth, enabledProviders } from "@/lib/auth";
import { TYPES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Sign in | Melonality",
  description: "Sign in to your Melonality pass, or keep playing as a Guest.",
};

/** The character on the pass: the Saviour-Eater greets everyone at the door. */
const GREETER = TYPES.find((type) => type.slug === "the-saviour-eater")!;

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  // Already signed in: nothing to do here. If the database is down, just show the form.
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null);
  if (session) redirect("/");
  const { mode, error } = await searchParams;

  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="border-b border-line bg-paper">
        <div className="container-page flex h-16 items-center justify-between">
          <Wordmark />
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="container-page flex flex-1 items-center py-10 lg:py-16">
        <SignInForm
          initialMode={mode === "sign-up" ? "sign-up" : "sign-in"}
          initialProblem={typeof error === "string" ? explainSocial(error) : null}
          enabled={enabledProviders}
          showUnconfigured={process.env.NODE_ENV !== "production"}
          character={GREETER}
        />
      </main>
    </div>
  );
}
