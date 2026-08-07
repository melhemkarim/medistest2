"use client";

import { motion } from "framer-motion";
import { event } from "@/lib/event";

// Cascades in one row at a time (day headers included) and then everything
// stays on screen — same reveal pattern as the details panel, just with a
// shorter stagger since there are more rows to get through.
const scheduleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
};
const scheduleItem = {
  hidden: { opacity: 0, x: -14 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function SchedulePanel({ active }: { active: boolean }) {
  return (
    <div className="flex h-full flex-col items-center overflow-y-auto px-6 pb-24 pt-16 text-white">
      <motion.div
        variants={scheduleContainer}
        initial="hidden"
        animate={active ? "show" : "hidden"}
        className="m-auto w-full max-w-sm"
      >
        <motion.p
          variants={scheduleItem}
          className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-white/60"
        >
          The Program
        </motion.p>

        {event.program.map((day, di) => (
          <div key={day.day} className={di > 0 ? "mt-10" : ""}>
            <motion.p
              variants={scheduleItem}
              className="text-center font-display text-2xl italic sm:text-3xl"
            >
              {day.day}
            </motion.p>
            <motion.p
              variants={scheduleItem}
              className="mb-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/50"
            >
              {day.date}
            </motion.p>

            <div className="relative pl-9">
              <div className="absolute bottom-2 left-[9px] top-2 w-px bg-white/20" />
              {day.items.map((it, ii) => (
                <motion.div
                  key={ii}
                  variants={scheduleItem}
                  className="relative flex items-baseline gap-3 pb-5 last:pb-0"
                >
                  <span className="absolute -left-9 top-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-white ring-4 ring-white/10" />
                  <span className="w-16 flex-shrink-0 text-[11px] uppercase tracking-[0.15em] text-white/45">
                    {it.time}
                  </span>
                  <span className="font-display text-lg italic sm:text-xl">{it.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
