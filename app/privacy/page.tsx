import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { OPERATOR } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy | Watermelon MBTI" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {OPERATOR.name} is a free personality quiz. This page explains what the site records, why, and what you can do about it.
        Short version: no account, no name, no email, no cookies.
      </p>

      <h2>What we collect</h2>
      <p>When you finish the test we store three things, none of which identify you:</p>
      <ul>
        <li>Your twenty answers on the 1 to 7 scale.</li>
        <li>The result type the answers produced.</li>
        <li>The time the result was saved.</li>
      </ul>
      <p>
        We do not ask for or store your name, email address, IP address, device identifiers, or location. Nothing links a
        saved result to you or to your browser.
      </p>

      <h2>Why</h2>
      <p>
        To show you your result, and to compute the aggregate figures on the site, such as how many people have taken the
        test and what share of players got each type.
      </p>

      <h2>Cookies and browser storage</h2>
      <p>
        The site sets no cookies and runs no analytics or advertising trackers. While you take the test, your answers are
        kept in your browser&rsquo;s session storage so the results page can read them. That data stays on your device and
        is cleared when you close the tab.
      </p>

      <h2>Who processes the data</h2>
      <ul>
        <li>Hosting: Vercel serves the site. Like any web host, it handles the requests your browser makes.</li>
        <li>Database: Neon stores the saved results.</li>
      </ul>
      <p>No data is sold or shared with anyone else.</p>

      <h2>Deleting your result</h2>
      <p>
        Because results are anonymous, we cannot look one up for you afterwards. The results page has a &ldquo;Delete my
        response&rdquo; button that removes the row your test created, for as long as you keep that tab open.
      </p>

      <h2>Children</h2>
      <p>
        The site is not directed at children under 13 and collects no personal information from anyone, so no parental
        consent is required to take the test.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, the date at the top will change with it.</p>

      {OPERATOR.contactEmail && (
        <>
          <h2>Contact</h2>
          <p>
            Questions about this policy: <a href={`mailto:${OPERATOR.contactEmail}`}>{OPERATOR.contactEmail}</a>
          </p>
        </>
      )}

      <p className="mt-10 text-sm">
        See also the <Link href="/terms">Terms of Service</Link>.
      </p>
    </LegalPage>
  );
}
