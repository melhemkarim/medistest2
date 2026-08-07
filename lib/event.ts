export const event = {
  hosts: ["Medispharm", "AWMU"],
  // Leave empty for now if you haven't decided the event title yet —
  // it's only shown on the first screen when this isn't empty.
  title: "",
  dateLabel: "Friday, September 18, 2026",
  dressCode: "Formal attire",
  // Plain-text address used to build the embedded map + the "Open in Maps" link.
  // Be as specific as you can — exact address works best.
  mapQuery: "Le Royal Hotel, Beirut, Lebanon",
  // ISO string, drives the live countdown on screen 3
  isoDateTime: "2026-09-18T19:00:00+03:00",
  // The vertical timeline on screen 2. Add as many stops as you need —
  // e.g. Cocktail Hour, Dinner, Awards — each gets its own row.
  schedule: [{ time: "7:00 PM", label: "Reception", venue: "Le Royal Hotel, Ballroom", city: "Beirut, Lebanon" }],
};
