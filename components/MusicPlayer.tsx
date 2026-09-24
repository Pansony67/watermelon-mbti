"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakerHigh, SpeakerLow, SpeakerSlash } from "@phosphor-icons/react";

/** Comfortable for a background loop; full volume is never the default. */
const DEFAULT_VOLUME = 0.35;
const VOLUME_KEY = "watermelon-mbti:volume";

/**
 * Looping background music with a floating toggle and a volume slider. Lives
 * in the root layout so client-side navigation never remounts it. Off by
 * default and nothing is downloaded (preload="none") until the listener
 * presses play. The chosen volume is remembered across visits.
 */
export default function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  // Restore the remembered level once, directly on the elements (no re-render needed).
  useEffect(() => {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw === null) return; // Number(null) is 0, which would silently mute first-time visitors.
    const stored = Number(raw);
    if (!Number.isFinite(stored) || stored < 0 || stored > 1) return;
    if (audio.current) audio.current.volume = stored;
    if (slider.current) slider.current.value = String(stored);
  }, []);

  const toggle = async () => {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      return;
    }
    el.volume = Number(slider.current?.value ?? DEFAULT_VOLUME);
    try {
      await el.play();
    } catch {
      // Autoplay policy or a missing file: the pause event keeps state honest.
    }
  };

  const onVolume = (value: number) => {
    if (audio.current) audio.current.volume = value;
    localStorage.setItem(VOLUME_KEY, String(value));
    setVolume(value);
  };

  const Icon = !playing ? SpeakerSlash : volume < 0.4 ? SpeakerLow : SpeakerHigh;

  return (
    <div className="fixed right-5 bottom-5 z-[45] flex items-center gap-2">
      {/* State follows the element's own events, so it stays correct if playback ends or is blocked. */}
      <audio
        ref={audio}
        src="/audio/watermelon-vibe.mp3"
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Volume is only adjustable while something is playing. */}
      <label
        className={`flex h-11 items-center rounded-control bg-paper px-4 shadow-card ring-1 ring-line transition-[opacity,transform] duration-500 ease-settle ${
          playing ? "opacity-100" : "pointer-events-none translate-x-3 opacity-0"
        }`}
      >
        <span className="sr-only">Music volume</span>
        <input
          ref={slider}
          type="range"
          min={0}
          max={1}
          step={0.05}
          defaultValue={DEFAULT_VOLUME}
          onInput={(event) => onVolume(Number(event.currentTarget.value))}
          tabIndex={playing ? 0 : -1}
          className="h-1 w-24 cursor-pointer accent-flesh"
        />
      </label>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title={playing ? "Music on" : "Music off"}
        className="grid h-11 w-11 cursor-pointer place-items-center rounded-control bg-paper text-ink-2 shadow-card ring-1 ring-line transition-colors duration-300 hover:text-ink focus-visible:ring-2 focus-visible:ring-flesh focus-visible:outline-none aria-pressed:text-flesh"
      >
        <Icon size={18} weight={playing ? "fill" : "regular"} aria-hidden />
      </button>
    </div>
  );
}
