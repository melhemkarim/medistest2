export const event = {
  hosts: ["Medispharm", "AWMU"],
  // Short event name — shown big on the first screen.
  title: "OATH",
  // Tagline shown under the event name on the first screen.
  tagline: "One Aim To Accelerate Healing",
  dateLabel: "September 5–6, 2026",
  dressCode: "Formal attire",
  // Plain-text address used to build the embedded map + the "Open in Maps" link.
  // Be as specific as you can — exact address works best.
  mapQuery: "InterContinental Mzaar Lebanon, Mzaar Kfardebian",
  // ISO string, drives the live countdown on screen 3
  isoDateTime: "2026-09-05T09:30:00+03:00",
  // The vertical timeline on screen 2 (date / location card). Add as many
  // stops as you need — each gets its own row.
  schedule: [
    {
      time: "9:30 AM · Sept 5",
      label: "Arrival",
      venue: "InterContinental Mzaar",
      city: "Mzaar, Lebanon",
    },
  ],
  // Full two-day program — drives the dedicated schedule screen.
  // Leave "time" empty on an item if it doesn't need one shown.
  program: [
    {
      day: "Day One",
      date: "Friday, September 5",
      items: [
        { time: "9:30 AM", label: "Arrival" },
        { time: "", label: "Breakfast" },
        { time: "", label: "Conference" },
        { time: "", label: "Lunch" },
        { time: "", label: "Buggy Road Trip" },
        { time: "", label: "Abaya Night" },
      ],
    },
    {
      day: "Day Two",
      date: "Saturday, September 6",
      items: [
        { time: "", label: "Hotel Stay" },
        { time: "", label: "Special Activity" },
        { time: "", label: "Breakfast" },
      ],
    },
  ],
};
