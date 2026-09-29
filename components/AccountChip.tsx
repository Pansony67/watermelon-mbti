"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignOut, Trash, UserCircle } from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";

const CHIP =
  "flex h-11 items-center gap-2 rounded-control text-sm ring-1 ring-line ring-inset transition-colors duration-300 hover:bg-paper-2 focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none";

/**
 * Who is visiting, in the nav. Everyone is a Guest until they sign in; then
 * the chip shows their picture or initial and first name, and opens a small
 * menu with the full name, email and Sign out.
 */
export default function AccountChip() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const menu = useRef<HTMLDetailsElement>(null);
  const [notice, setNotice] = useState("");

  // A native <details> doesn't close on an outside click or Escape; this adds both.
  useEffect(() => {
    const close = (event: Event) => {
      const el = menu.current;
      if (!el?.open) return;
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !el.contains(event.target as Node)) el.open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  // Hold the chip's space while the session loads, so the nav doesn't shift.
  if (isPending) return <span aria-hidden className="h-11 w-24" />;

  if (!session) {
    return (
      <Link href="/sign-in" className={`${CHIP} px-3 text-ink-2 hover:text-ink`}>
        <UserCircle size={20} aria-hidden />
        Guest
        <span className="hidden font-semibold text-ink sm:inline">Sign in</span>
      </Link>
    );
  }

  const { name, email, image } = session.user;
  const signOut = async () => {
    await authClient.signOut();
    router.refresh();
  };
  const deleteAccount = async () => {
    if (!window.confirm("Delete your Melonality account? This can't be undone.")) return;
    const { error } = await authClient.deleteUser();
    if (error) {
      setNotice(
        error.code === "SESSION_EXPIRED"
          ? "For safety, sign out and back in, then try again."
          : "Couldn't delete it right now. Please try again.",
      );
      return;
    }
    router.refresh();
  };

  return (
    <details ref={menu} className="relative">
      <summary className={`${CHIP} cursor-pointer list-none pr-3 pl-1.5 text-ink [&::-webkit-details-marker]:hidden`}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- provider avatars come from many hosts; next/image would need each one allow-listed
          <img src={image} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-flesh font-display text-sm font-semibold text-paper">
            {name.trim()[0]?.toUpperCase() ?? "?"}
          </span>
        )}
        <span className="max-w-28 truncate font-semibold">{name.split(" ")[0]}</span>
      </summary>
      <div className="absolute top-full right-0 z-10 mt-2 w-64 rounded-card bg-paper p-2 shadow-panel ring-1 ring-line">
        <p className="truncate px-3 pt-2 text-sm font-semibold text-ink">{name}</p>
        <p className="truncate px-3 pb-2 text-xs text-ink-3">{email}</p>
        <button
          type="button"
          onClick={signOut}
          className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-control px-3 text-sm text-ink-2 transition-colors duration-300 hover:bg-paper-2 hover:text-ink"
        >
          <SignOut size={18} aria-hidden />
          Sign out
        </button>
        <button
          type="button"
          onClick={deleteAccount}
          className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-control px-3 text-sm text-flesh-deep transition-colors duration-300 hover:bg-blush"
        >
          <Trash size={18} aria-hidden />
          Delete account
        </button>
        {notice && (
          <p role="alert" className="px-3 pt-1 pb-2 text-xs text-ink-2">
            {notice}
          </p>
        )}
      </div>
    </details>
  );
}
