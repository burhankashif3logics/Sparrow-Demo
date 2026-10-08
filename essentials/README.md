# Sparrow Assistant Console, essentials build

A click-through demonstration of the owner-facing console for the AI assistant
proposed to Mr. Bhaskar Arya, Managing Director, Sparrow Shopfits.

This is the smaller of the two demonstration builds. It covers meeting
coordination end to end and nothing else. The fuller build is the app in the
repository root, one level up.

Built to be driven live in a sales meeting. There is no backend and no real
account behind it. Every figure on screen is demonstration data, and the header
says so.

## Running it

```bash
npm install
npm run dev     # http://localhost:5190
```

The port is deliberately different from the fuller build, so both can run side
by side on one machine during a meeting.

`npm run build` produces a static `dist/` that can be hosted anywhere.

## What this build does

1. Reads the Managing Director's calendar and sends the invite and the joining
   link on WhatsApp.
2. Calls anyone who has not responded to an invite, and anyone who has not
   joined once a meeting has started, in English, Hindi or a mix.
3. Tells the Managing Director when the room is ready, and escalates to him and
   the EA when an attendee cannot be reached inside the attempt limit.
4. Places scheduled outbound calls from a sheet the EA keeps.
5. Writes the record for each meeting when that meeting ends.

## What this build does not do

These are in the fuller build and are not present here, by design:

- No assistant to chat to. Nothing in the corner of the screen to ask questions
  of. Everything is read from the screens themselves.
- No task follow-up. It does not chase delegated work, ask for completion dates
  or record reasons for delay.
- No email briefing. The mailbox is not connected and not read.
- No recording of the meeting itself. The conversation in the room is never
  captured or transcribed.
- No settings screen. The timings, limits and rules are fixed at the values
  agreed during setup, and changing one is a change request rather than
  something the owner edits himself. The master pause stays in the header.

The assistant's own outbound calls are still recorded and transcribed, because
that is the evidence of what it said on the owner's behalf. Those are on
**Calls and recordings**.

## Signing in

The sign-in screen offers two accounts. Pick either one to see the console as
that person sees it:

- **Bhaskar Arya**, Managing Director. Can schedule, cancel, override and pause.
- **Omkar Sawant**, Executive Assistant. Can schedule, cancel and release new
  contacts for calling.

Any password works.

## The meeting record

A meeting's record is produced once, when the meeting ends. It is compiled from
the calendar, the Google Meet joining data and the assistant's own log of what
it sent and called. It is not a summary of the discussion, because the
discussion is not recorded in this build, and the panel says so in those words.

So the meeting page reads differently depending on the state of the meeting:

- **Finished** meetings open on the written record: when it was produced, who
  joined and when, the coordination totals, and what was left open. It exports
  as a PDF.
- **Running or upcoming** meetings have no record yet. The page says when it
  will be written, lists what will be in it, and shows the live attendance trail
  underneath.

Open the 09:30 daily site review for the first case and the 14:00 vendor review
for the second.

## What it is meant to prove

1. **Complete visibility.** Every message, call, call outcome and escalation is
   on screen with a timestamp. Today carries a full ledger of the day. Each
   meeting carries a per-attendee trail showing what was sent, who was called,
   when, and what came back.
2. **Complete control.** The owner can pause everything from the header, which
   immediately disables every outbound action across the app. Any individual
   attendee can be overridden, and reminders can be stopped for one person or
   one meeting. What the assistant will never do on his behalf is stated on
   Today, under "What it is not allowed to do".

## Things to try in a demo

- Press `/` anywhere to search meetings, people and calls. Arrow keys and enter.
- Toggle the switch in the header. The banner appears and every call and message
  button across the app goes dead.
- Collapse the left rail with the button beside the wordmark.
- Open the live meeting from Today, then open an attendee to reach their contact
  record.
- Open a finished meeting to read the record that was generated at its end.
- Play a recording on Calls and recordings and read the transcript underneath.

## The screens

| Screen | What it shows |
| --- | --- |
| Today | Day at a glance, the live meeting, decisions waiting on you, attendance, connected systems and the full action ledger |
| Meetings | All meetings by state, plus the WhatsApp commands received and what was done with each |
| Meeting detail | The record once the meeting has ended, the per-attendee contact trail, overrides, agenda and messages sent |
| Calls and recordings | Every call the assistant placed, with player, transcript and outcome, filterable |
| Contacts | The Contacts Directory with the do-not-call and approval gates |
| Contact detail | One person's history, reach rate, meetings and record |
| Scheduled calls | The sheet-driven outbound calling queue |

The master pause sits in the header and works from every screen.

## Demonstration data

`src/data/mock.js` holds everything, frozen at **Thursday 8 October 2026,
14:06 IST** so one story reads consistently across all screens: the 14:00 vendor
review is running, three of four required attendees are in the room, and the
fourth has missed two calls and been escalated.

Internal people and roles follow the proposal. Client and vendor firms are
invented, so nothing here implies a real commercial relationship.

## Design notes

- Light content with inverted chrome. The rail, the sign-in panel, the live
  meeting header and the meeting record header are ink; the content sits on warm
  paper. One accent, cobalt, used throughout. Status colours are semantic only.
- Instrument Sans for text, Geist Mono for times, numbers and identifiers.
- Radius system: panels 10px, controls 6px, pills reserved for status badges.
- Icons are Phosphor at a single weight. No emoji, no hand-drawn SVG icons.
- Motion is sequenced on mount rather than on scroll, so nothing is invisible in
  a screenshot, a PDF or a fast scroll.
- No horizontal scroll at 390px. Wide data tables scroll inside their own panel.
