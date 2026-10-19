"use client";

import { useState, useSyncExternalStore } from "react";
import { LinkSimple, ShareNetwork } from "@phosphor-icons/react";
import { SITE_URL } from "@/lib/site";

const noop = () => () => {};

/**
 * Share a type: the phone's own share sheet where there is one, the clipboard
 * everywhere else. The link goes to the type's page, whose preview card shows
 * the character, so the share looks good in any chat.
 */
export default function ShareButtons({ slug, name, mine = true, tone = "stage" }: { slug: string; name: string; mine?: boolean; tone?: "stage" | "page" }) {
  const url = `${SITE_URL}/types/${slug}`;
  const text = mine
    ? `I got the ${name} on Melonality. What kind of watermelon are you?`
    : `The ${name}, on Melonality. What kind of watermelon are you?`;
  const canShare = useSyncExternalStore(noop, () => typeof navigator.share === "function", () => false);
  const [status, setStatus] = useState<"" | "copied" | "failed">("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus(""), 2500);
  };

  const share = async () => {
    if (!canShare) return copy();
    try {
      await navigator.share({ title: `${name} | Melonality`, text, url });
    } catch (error) {
      // Closing the share sheet is not a failure.
      if ((error as Error).name !== "AbortError") await copy();
    }
  };

  const quiet = tone === "stage" ? "text-cine-ink focus-visible:outline-cine-ink" : "text-ink";
  return (
    <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-5">
      <button type="button" onClick={share} className="btn-primary w-full cursor-pointer sm:w-auto">
        <ShareNetwork size={20} weight="bold" aria-hidden />
        {mine ? "Share my result" : "Share this type"}
      </button>
      <button type="button" onClick={copy} className={`link-arrow cursor-pointer ${quiet}`}>
        <LinkSimple size={18} weight="bold" aria-hidden />
        {status === "copied" ? "Link copied" : status === "failed" ? "Copy failed, try again" : "Copy link"}
      </button>
      <span aria-live="polite" className="sr-only">
        {status === "copied" ? "Link copied to the clipboard" : status === "failed" ? "Could not copy the link" : ""}
      </span>
    </div>
  );
}
