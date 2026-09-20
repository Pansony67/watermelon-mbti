"use client";

import { useRef, useState } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";

/** Comfortable for a background loop; full volume is never wanted here. */
const VOLUME = 0.35;

/**
 * Looping background music with a floating toggle. Lives in the root layout so
 * client-side navigation never remounts it. Off by default and nothing is
 * downloaded (preload="none") until the listener presses play.
 */
export default function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      return;
    }
    el.volume = VOLUME;
    try {
      await el.play();
    } catch {
      // Autoplay policy or a missing file: the pause event keeps state honest.
    }
  };

  return (
    <>
      {/* State follows the element's own events, so it stays correct if playback ends or is blocked. */}
      <audio
        ref={audio}
        src="/audio/watermelon-vibe.mp3"
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title={playing ? "Music on" : "Music off"}
        className="fixed right-5 bottom-5 z-[45] grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-rind-deep/85 text-cream/70 shadow-rind ring-1 ring-cream/15 backdrop-blur-xl transition-[transform,color,background-color] duration-500 ease-settle hover:scale-105 hover:text-cream focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none active:scale-95 aria-pressed:text-flesh"
      >
        {playing ? <SpeakerHigh size={18} weight="fill" aria-hidden /> : <SpeakerSlash size={18} aria-hidden />}
      </button>
    </>
  );
}
