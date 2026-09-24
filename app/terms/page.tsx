import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { OPERATOR } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms | Watermelon MBTI" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>By using {OPERATOR.name} you agree to these terms. They are short because the site is simple.</p>

      <h2>It is a joke, not a diagnosis</h2>
      <p>
        The test and its results are entertainment. They are not a psychological assessment, personality science, or
        advice of any kind, and they are not affiliated with the Myers-Briggs Type Indicator or its owners. Please do not
        make decisions about your life, health, or relationships based on which watermelon you are.
      </p>

      <h2>Price and refunds</h2>
      <p>The site is free. Nothing is sold, so there is nothing to refund.</p>

      <h2>Acceptable use</h2>
      <p>
        Do not try to break the site, overload it, scrape the saved results, or use it in a way that is unlawful where you
        live. We may block traffic that does.
      </p>

      <h2>Content and licences</h2>
      <p>
        The questions, result types, and design are &copy; {OPERATOR.name}. The site is built with open-source software
        and openly licensed assets:
      </p>
      <ul>
        <li>Fredoka and Figtree typefaces, SIL Open Font License 1.1.</li>
        <li>Phosphor Icons, MIT License.</li>
        <li>three.js, react-three-fiber and drei, MIT License.</li>
        <li>Motion and anime.js, MIT License.</li>
        <li>Animated grid background and border beam adapted from Magic UI, MIT License.</li>
      </ul>

      <h2>No warranty</h2>
      <p>
        The site is provided as is. We do not promise it will be available, accurate, or free of errors, and to the extent
        the law allows, we are not liable for any loss arising from its use.
      </p>

      {OPERATOR.jurisdiction && (
        <>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of {OPERATOR.jurisdiction}.</p>
        </>
      )}

      <h2>Changes</h2>
      <p>If these terms change, the date at the top will change with it.</p>

      {OPERATOR.contactEmail && (
        <>
          <h2>Contact</h2>
          <p>
            <a href={`mailto:${OPERATOR.contactEmail}`}>{OPERATOR.contactEmail}</a>
          </p>
        </>
      )}

      <p className="mt-10 text-sm">
        See also the <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
