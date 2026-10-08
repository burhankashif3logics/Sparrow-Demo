# Sparrow Assistant Console

A click-through demonstration of the owner-facing console for the AI assistant
proposed to Mr. Bhaskar Arya, Managing Director, Sparrow Shopfits.

Built to be driven live in a sales meeting. There is no backend and no real
account behind it. Every figure on screen is demonstration data, and the header
says so.

## Running it

```bash
npm install
npm run dev     # http://localhost:5173
```

`npm run build` produces a static `dist/` that can be hosted anywhere.

## Signing in

The sign-in screen offers two accounts. Pick either one to see the console as
that person sees it:

- **Bhaskar Arya**, Managing Director. Can schedule, cancel, override and pause.
- **Omkar Sawant**, Executive Assistant. Can schedule, cancel and release new
  contacts for calling.

Any password works.

## What it is meant to prove

1. **Complete visibility.** Every message, call, call outcome, recording and
   escalation is on screen with a timestamp. Today carries a full ledger of the
   day. Each meeting carries a per-attendee trail showing what was sent, who was
   called, when, and what came back. Each task carries the whole exchange,
   including the replies in Hindi and Hinglish.
2. **Complete control.** The owner can pause everything from the header, which
   immediately disables every outbound action across the app. Any individual
   attendee can be overridden. Every rule is readable and editable on Controls,
   and the limits that cannot be switched off are listed there, locked.

## Things to try in a demo

- Press `/` anywhere to search meetings, people and calls. Arrow keys and enter.
- Toggle the switch in the header. The banner appears, the Controls panel
  inverts and every call and message button in the app goes dead.
- Collapse the left rail with the button beside the wordmark.
- Open the live meeting, then open an attendee to reach their contact record.
- On Task follow-up, expand "Show the full exchange" on the delayed task.
- Play a recording on Calls and recordings and read the transcript underneath.

## The screens

| Screen | What it shows |
| --- | --- |
| Today | Day at a glance, the live meeting, decisions waiting on you, attendance, connected systems and the full action ledger |
| Meetings | All meetings by state, plus the WhatsApp commands received and what was done with each |
| Meeting detail | Agenda, per-attendee contact trail, overrides, messages sent, recording and transcript |
| Calls and recordings | Every call with player, transcript and outcome, filterable |
| Contacts | The Contacts Directory with the do-not-call and approval gates |
| Contact detail | One person's history, reach rate, meetings and record |
| Task follow-up | The EA Delegation sheet chased by message then by call, with the full thread |
| Email briefing | Mail that needs a decision, summarised, with what it will not touch |
| Scheduled calls | The sheet-driven outbound calling queue |
| Controls | Master pause, every timing and limit, connected systems and the locked guardrails |

## Demonstration data

`src/data/mock.js` holds everything, frozen at **Thursday 8 October 2026,
14:06 IST** so one story reads consistently across all screens: the 14:00 vendor
review is running, three of four required attendees are in the room, and the
fourth has missed two calls and been escalated.

Internal people and roles follow the proposal. Client and vendor firms are
invented, so nothing here implies a real commercial relationship.

## Design notes

- Light content with inverted chrome. The rail, the sign-in panel and the live
  meeting header are ink; the content sits on warm paper. One accent, cobalt,
  used throughout. Status colours are semantic only.
- Instrument Sans for text, Geist Mono for times, numbers and identifiers.
- Radius system: panels 10px, controls 6px, pills reserved for status badges.
- Icons are Phosphor at a single weight. No emoji, no hand-drawn SVG icons.
- Motion is sequenced on mount rather than on scroll, so nothing is invisible in
  a screenshot, a PDF or a fast scroll.
- No horizontal scroll at 390px. Wide data tables scroll inside their own panel.
