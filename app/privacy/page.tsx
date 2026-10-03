import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { OPERATOR } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy | Melonality" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {OPERATOR.name} is a free personality quiz. This page explains what the site records, why, and what you can do about it.
        Short version: the quiz needs no account and stores nothing that identifies you. Accounts are optional; if you
        create one, we keep only what it needs to work.
      </p>

      <h2>What we collect</h2>
      <p>When you finish the test we store three things, none of which identify you:</p>
      <ul>
        <li>Your twenty answers on the 1 to 7 scale.</li>
        <li>The colour family, type and five trait scores the answers produced.</li>
        <li>The time the result was saved.</li>
      </ul>
      <p>
        We do not ask for or store your name, email address, IP address, device identifiers, or location with a result.
        Nothing links a saved result to you, to your browser, or to your account, even when you are signed in.
      </p>

      <h2>Accounts (optional)</h2>
      <p>You can use everything on the site as a Guest. If you create an account, we store:</p>
      <ul>
        <li>Your name and email address.</li>
        <li>
          A one-way hash of your password (scrypt), never the password itself. We cannot see or recover your password.
        </li>
        <li>
          If you sign in with Google, Facebook or LINE instead: the name, email address and profile picture that service
          shares with us. No password is stored.
        </li>
        <li>
          While you are signed in: a session record with your IP address and browser name, so you stay signed in. It
          expires after 7 days, or when you sign out.
        </li>
      </ul>
      <p>
        To stop password guessing, sign-in and sign-up attempts are counted per IP address for a short time, and too many
        attempts are blocked for a minute. Saved test results are counted the same way, under a one-way hash of the
        address rather than the address itself, so no single connection can flood the stats.
      </p>

      <h2>Why</h2>
      <p>
        To show you your result, and to compute the aggregate figures on the site, such as how many people have taken the
        test and what share of players got each type.
      </p>

      <h2>Cookies and browser storage</h2>
      <p>
        The site sets no cookies unless you sign in. Then one cookie keeps you signed in: the page&rsquo;s own scripts
        cannot read it, and it is deleted when you sign out. There are no analytics or advertising trackers. While you
        take the test, your answers are
        kept in your browser&rsquo;s session storage so the results page can read them. That data stays on your device and
        is cleared when you close the tab.
      </p>

      <h2>Who processes the data</h2>
      <ul>
        <li>Hosting: Vercel serves the site. Like any web host, it handles the requests your browser makes.</li>
        <li>Database: Neon stores the saved results and accounts.</li>
        <li>Google, Facebook and LINE: only if you choose to sign in with one of them.</li>
        <li>
          Have I Been Pwned: when you choose a password, the first five characters of its SHA-1 hash are sent to check it
          against known data breaches. The password itself never leaves our server.
        </li>
      </ul>
      <p>No data is sold or shared with anyone else.</p>

      <h2>Deleting your result</h2>
      <p>
        Because results are anonymous, we cannot look one up for you afterwards. The results page has a &ldquo;Delete my
        response&rdquo; button that removes the row your test created, for as long as you keep that tab open.
      </p>

      <h2>Deleting your account</h2>
      <p>
        Signed in, open the menu under your name and choose &ldquo;Delete account&rdquo;. Your account, its sessions and
        any linked Google, Facebook or LINE sign-in are removed at once.
      </p>

      <h2>Children</h2>
      <p>
        The site is not directed at children under 13. The quiz collects no personal information, so no parental consent
        is required to take it. Accounts are for people aged 13 and over.
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
