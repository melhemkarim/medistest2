"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Status = "idle" | "submitting" | "done" | "error";

export default function RSVPForm({ name, slug }: { name: string; slug: string }) {
  const [attending, setAttending] = useState<"yes" | "no" | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function submit() {
    if (!attending) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, attending }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="font-display text-3xl italic text-white">
          {attending === "yes" ? "We look forward to seeing you." : "Thank you for letting us know."}
        </p>
        <p className="mt-3 text-sm text-white/60">Your response has been recorded.</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-center gap-3">
        {(["yes", "no"] as const).map((choice) => (
          <button
            key={choice}
            onClick={() => setAttending(choice)}
            className={`rounded-sm border px-6 py-2 text-sm uppercase tracking-[0.15em] transition-colors ${
              attending === choice
                ? "border-white bg-white text-brand-deep"
                : "border-white/40 text-white/80 hover:border-white hover:text-white"
            }`}
          >
            {choice === "yes" ? "Joyfully accept" : "Regretfully decline"}
          </button>
        ))}
      </div>

      {attending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex justify-center"
        >
          <button
            onClick={submit}
            disabled={status === "submitting"}
            className="rounded-sm bg-white px-8 py-2.5 text-sm font-medium uppercase tracking-[0.15em] text-brand-deep transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Sending..." : "Confirm response"}
          </button>
        </motion.div>
      )}

      {status === "error" && (
        <p className="mt-3 text-center text-sm text-red-200">
          Something went wrong sending your response — please try again.
        </p>
      )}
    </div>
  );
}
