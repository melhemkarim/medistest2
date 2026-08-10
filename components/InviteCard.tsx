"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RSVPForm from "./RSVPForm";
import GallerySlide from "./GallerySlide";
import SchedulePanel from "./SchedulePanel";
import { event } from "@/lib/event";

/**
 * A different photo per screen. Drop your photos into /public/images
 * named exactly photo-1.jpg through photo-5.jpg (greeting, date/location,
 * program, countdown, RSVP — in that order). Any one that's missing just
 * falls back to the generated gradient automatically, so it's safe to add
 * them gradually.
 */
const PHOTOS = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
];

const mapLinkHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`;

// Container/item pair: re-triggers every time a panel becomes active
// (animate="show" only when its index === the current active index),
// so the reveal plays again on every swipe, not just on first load.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

function useCountdown(target: string) {
  const calc = () => {
    const diff = new Date(target).getTime() - Date.now();
    const clamped = Math.max(diff, 0);
    return {
      days: Math.floor(clamped / 86400000),
      hours: Math.floor((clamped / 3600000) % 24),
      minutes: Math.floor((clamped / 60000) % 60),
      seconds: Math.floor((clamped / 1000) % 60),
      done: diff <= 0,
    };
  };
  // Start as null so the server-rendered markup and the client's first render match
  // exactly (both render the placeholder). The real, Date.now()-based value is only
  // computed after mount, client-side only — this avoids a hydration mismatch since
  // the server and the browser would otherwise compute this at slightly different times.
  const [t, setT] = useState<ReturnType<typeof calc> | null>(null);
  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return t;
}

function PanelBackground({ photoIndex, active }: { photoIndex: number; active: boolean }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-brand-deep">
      {/* generated placeholder texture — shows through until a real photo is added, or behind transparent areas of one */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(255,255,255,0.16), transparent 42%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.10), transparent 38%), radial-gradient(circle at 50% 100%, rgba(0,0,0,0.35), transparent 50%)",
        }}
      />
      <motion.img
        src={PHOTOS[photoIndex % PHOTOS.length]}
        alt=""
        className="relative h-full w-full object-cover"
        initial={{ scale: 1.06 }}
        animate={{ scale: active ? 1.14 : 1.06 }}
        transition={{ duration: 12, ease: "linear" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-grain" />
    </div>
  );
}

// Container/item pair for the details panel: each info block fades/slides in
// one after another and then STAYS on screen — nothing is removed or swapped out.
const detailsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.5, delayChildren: 0.3 } },
};
const detailsItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function DetailsPanel({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col items-center px-8 text-center text-white">
      <motion.div
        variants={detailsContainer}
        initial="hidden"
        animate={active ? "show" : "hidden"}
        className="m-auto flex w-full max-w-xs flex-col items-center gap-7"
      >
        {/* Date */}
        <motion.div variants={detailsItem} className="flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Save the date</p>
          <p className="font-display text-3xl italic sm:text-4xl">{event.dateLabel}</p>
          <div className="hairline w-12" />
        </motion.div>

        {/* Schedule stop(s) */}
        {event.schedule.map((stop) => (
          <motion.div key={stop.venue} variants={detailsItem} className="flex flex-col items-center gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">{stop.time}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">{stop.label}</p>
            <p className="font-display text-2xl italic sm:text-3xl">{stop.venue}</p>
            <p className="text-sm text-white/60">{stop.city}</p>
          </motion.div>
        ))}

        {/* Location — a static card, not a live embedded map, so a swipe that
            starts here isn't swallowed by the map's own pan/zoom gesture. */}
        <motion.a
          variants={detailsItem}
          href={mapLinkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-xl border border-white/25 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 flex-shrink-0 text-white/80">
            <path
              d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] uppercase tracking-[0.2em] text-white/50">Find us here</span>
            <span className="block truncate text-sm text-white/90">{event.mapQuery}</span>
          </span>
          <span className="flex-shrink-0 text-[10px] uppercase tracking-[0.15em] text-white/60">Open ↗</span>
        </motion.a>
      </motion.div>
    </div>
  );
}

function Dots({ count, index }: { count: number; index: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-7 z-20 flex justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

function NextButton({ onClick, label = "Swipe" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="group absolute bottom-16 right-6 z-20 flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-white sm:right-10"
      aria-label="Next"
    >
      <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group absolute bottom-16 left-6 z-20 flex flex-col items-center gap-1 text-white/70 transition-colors hover:text-white sm:left-10"
      aria-label="Back"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:-translate-x-1">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[10px] uppercase tracking-[0.2em]">Back</span>
    </button>
  );
}

export default function InviteCard({ name, slug }: { name: string; slug: string }) {
  const PANEL_COUNT = 6;
  const [index, setIndex] = useState(0);
  const [vw, setVw] = useState(0);
  const t = useCountdown(event.isoDateTime);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(PANEL_COUNT - 1, i)));

  return (
    <div className="fixed inset-0 overflow-hidden bg-brand-deep">
      <motion.div
        className="flex h-full"
        animate={{ x: -index * vw }}
        transition={{ type: "tween", duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        drag="x"
        dragDirectionLock
        dragMomentum={false}
        dragConstraints={{ left: -(PANEL_COUNT - 1) * vw, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          const offsetThreshold = vw * 0.15;
          const swipePower = Math.abs(info.offset.x) * info.velocity.x;
          const flungLeft = swipePower < -8000;
          const flungRight = swipePower > 8000;
          if (flungLeft || info.offset.x < -offsetThreshold) goTo(index + 1);
          else if (flungRight || info.offset.x > offsetThreshold) goTo(index - 1);
        }}
      >
        {/* Panel 1 — Greeting */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={0} active={index === 0} />
          <motion.div
            variants={container}
            initial="hidden"
            animate={index === 0 ? "show" : "hidden"}
            className="flex h-full flex-col items-center justify-center px-8 text-center text-white"
          >
            <motion.p variants={item} className="text-3xl uppercase tracking-[0.3em] text-white">
              Medispharm and AWMU invite you to
            </motion.p>

            <motion.h1 variants={item} className="mt-5 font-display text-6xl  leading-none sm:text-7xl">
              {event.title}
            </motion.h1>

            {event.tagline && (
              <motion.p variants={item} className="mt-5  text-sm uppercase tracking-[0.25em] text-white">
                {event.tagline}
              </motion.p>
            )}
          </motion.div>
          <NextButton onClick={() => goTo(1)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 2 — Date, time & location, revealed one piece at a time + map */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={1} active={index === 1} />
          <DetailsPanel active={index === 1} />
          <BackButton onClick={() => goTo(0)} />
          <NextButton onClick={() => goTo(2)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 3 — Full program / schedule, revealed one event at a time */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={2} active={index === 2} />
          <SchedulePanel active={index === 2} />
          <BackButton onClick={() => goTo(1)} />
          <NextButton onClick={() => goTo(3)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 4 — Countdown */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={3} active={index === 3} />
          <motion.div
            variants={container}
            initial="hidden"
            animate={index === 3 ? "show" : "hidden"}
            className="flex h-full flex-col items-center justify-center px-8 text-center text-white"
          >
            <motion.p variants={item} className="text-xs uppercase tracking-[0.3em] text-white/60">
              Counting down to
            </motion.p>
            <motion.div variants={item} className="mt-6 flex items-end justify-center gap-6">
              <div className="text-center">
                <p className="font-display text-7xl italic leading-none">{t ? t.days : "--"}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/60">Days</p>
              </div>
              <div className="h-16 w-px bg-white/25" />
              <div className="space-y-3 text-left">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl italic">{t ? t.hours : "--"}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Hours</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl italic">{t ? t.minutes : "--"}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Minutes</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl italic">{t ? t.seconds : "--"}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Seconds</span>
                </div>
              </div>
            </motion.div>
            <motion.p variants={item} className="mt-10 font-display text-lg italic text-white/80">
              {t?.done ? "the celebration has begun" : "celebrate together"}
            </motion.p>
          </motion.div>
          <BackButton onClick={() => goTo(2)} />
          <NextButton onClick={() => goTo(4)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 5 — Photo slideshow from a previous event */}
        <div className="relative h-full w-screen flex-shrink-0">
          <GallerySlide active={index === 4} />
          <motion.div
            variants={container}
            initial="hidden"
            animate={index === 4 ? "show" : "hidden"}
            className="flex h-full flex-col items-center justify-end px-8 pb-28 text-center text-white"
          >
            <motion.p variants={item} className="text-xs uppercase tracking-[0.3em] text-white/60">
              A look back
            </motion.p>
            <motion.p variants={item} className="mt-3 font-display text-2xl italic sm:text-3xl">
              Moments from last time
            </motion.p>
          </motion.div>
          <BackButton onClick={() => goTo(3)} />
          <NextButton onClick={() => goTo(5)} label="RSVP" />
          <Dots count={PANEL_COUNT} index={index} />
        </div>

        {/* Panel 6 — Guest name + RSVP */}
        <div className="relative h-full w-screen flex-shrink-0">
          <PanelBackground photoIndex={4} active={index === 5} />
          <motion.div
            variants={container}
            initial="hidden"
            animate={index === 5 ? "show" : "hidden"}
            className="flex h-full flex-col items-center justify-center px-8 text-center text-white"
          >
            <motion.p variants={item} className="text-sm uppercase tracking-[0.2em] text-white/60">
              Dear
            </motion.p>
            <motion.h1 variants={item} className="mt-3 font-display text-4xl italic sm:text-5xl">
              {name}
            </motion.h1>

            <motion.p variants={item} className="mt-6 font-display text-xl italic text-white/85">
              Will you attend?
            </motion.p>

            <motion.div variants={item} className="mt-8 w-full max-w-xs">
              <RSVPForm name={name} slug={slug} />
            </motion.div>
          </motion.div>
          <BackButton onClick={() => goTo(4)} />
          <Dots count={PANEL_COUNT} index={index} />
        </div>
      </motion.div>
    </div>
  );
}
