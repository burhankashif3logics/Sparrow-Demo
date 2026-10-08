import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  WhatsappLogo,
  PhoneCall,
  PhoneSlash,
  VideoCamera,
  Megaphone,
  CalendarDots,
  Table,
  ArrowsClockwise,
  Microphone,
} from "@phosphor-icons/react";
import { people, meetingKindLabel } from "../data/mock";
import { Badge, Avatar } from "./ui";

/* ------------------------------------------------- attendee state model --- */

/*
  One place that decides what an attendee's state is and how it reads.
  Keeping this in one function is why the same person never shows two
  different statuses on two different screens.
*/
export function attendeeState(a, meetingState) {
  if (a.joined) {
    return { tone: "ok", label: `Joined ${a.joined}`, short: "Joined", in: true };
  }
  if (meetingState === "live") {
    if (a.calls >= 2) {
      return { tone: "stop", label: "No answer, 2 attempts", short: "No answer" };
    }
    return { tone: "wait", label: "Being called now", short: "Calling" };
  }
  if (meetingState === "closed") {
    return { tone: "stop", label: "Did not join", short: "Missed" };
  }
  if (a.rsvp === "accepted") {
    return { tone: "ok", label: "Accepted", short: "Accepted" };
  }
  if (a.rsvp === "confirmed-on-call") {
    return { tone: "ok", label: "Confirmed on call", short: "Confirmed" };
  }
  if (a.rsvp === "declined") {
    return { tone: "stop", label: "Declined", short: "Declined" };
  }
  return {
    tone: "wait",
    label: a.queued ? `No response, call at ${a.queued}` : "No response",
    short: "No response",
  };
}

export function joinedCount(m) {
  const req = m.attendees.filter((a) => a.required);
  return { joined: req.filter((a) => a.joined).length, total: req.length };
}

/* ------------------------------------------------------- attendance pips --- */

/* Filled pip = in the room. Hollow = not yet. Required attendees only. */
export function Pips({ meeting }) {
  const req = meeting.attendees.filter((a) => a.required);
  return (
    <span className="inline-flex items-center gap-[3px]" aria-hidden="true">
      {req.map((a, i) => {
        const s = attendeeState(a, meeting.state);
        return (
          <span
            key={i}
            className={`h-[7px] w-[7px] rounded-full ${
              s.in
                ? "bg-ink"
                : s.tone === "stop"
                  ? "bg-stop-ink/45"
                  : "border border-line-strong"
            }`}
          />
        );
      })}
    </span>
  );
}

/* -------------------------------------------------------------- ledger --- */

const CHANNEL = {
  whatsapp: { icon: WhatsappLogo, label: "WhatsApp" },
  call: { icon: PhoneCall, label: "Call" },
  join: { icon: VideoCamera, label: "Google Meet" },
  escalation: { icon: Megaphone, label: "Escalation" },
  meeting: { icon: CalendarDots, label: "Meeting" },
  sheet: { icon: Table, label: "Contacts sheet" },
  agenda: { icon: ArrowsClockwise, label: "Agenda" },
};

export function LedgerItem({ entry, last = false }) {
  const meta = CHANNEL[entry.channel] ?? CHANNEL.meeting;
  const Icon = meta.icon;
  const failed = entry.outcome === "no-answer";
  const isEscalation = entry.channel === "escalation";

  return (
    <li className="relative flex gap-3.5 pl-0">
      {/* Spine. Drawn once per item so the column reads as one continuous line. */}
      <div className="relative flex w-[26px] shrink-0 justify-center">
        {!last ? (
          <span className="absolute left-1/2 top-[26px] bottom-[-14px] w-px -translate-x-1/2 bg-line" />
        ) : null}
        <span
          className={`relative z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full border ${
            isEscalation
              ? "border-stop-soft bg-stop-soft text-stop-ink"
              : failed
                ? "border-line bg-paper text-ink-3"
                : "border-line bg-surface text-ink-2"
          }`}
        >
          <Icon size={13} weight="bold" />
        </span>
      </div>

      <div className="min-w-0 flex-1 pb-6">
        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <span className="num text-[12px] text-ink-3">{entry.time}</span>
          <p className="text-[13.5px] font-medium leading-snug text-ink">
            {entry.title}
          </p>
        </div>
        <p className="mt-1 max-w-[70ch] text-[12.5px] leading-relaxed text-ink-2">
          {entry.detail}
        </p>
      </div>
    </li>
  );
}

export function Ledger({ entries }) {
  return (
    <ul className="pt-1">
      {entries.map((e, i) => (
        <LedgerItem key={i} entry={e} last={i === entries.length - 1} />
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------- meeting row --- */

export function MeetingRow({ meeting, onOpen }) {
  const { joined, total } = joinedCount(meeting);
  const live = meeting.state === "live";
  const names = meeting.attendees
    .map((a) => people[a.id].name.split(" ")[0])
    .slice(0, 3)
    .join(", ");
  const more = meeting.attendees.length - 3;

  return (
    <button
      type="button"
      onClick={() => onOpen(meeting.id)}
      className="group flex w-full items-start gap-4 px-6 py-4 text-left transition-colors duration-150 hover:bg-paper-2/60 sm:gap-6"
    >
      <span className="num w-[44px] shrink-0 pt-[1px] text-[13px] font-medium text-ink">
        {meeting.time}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="text-[14px] font-medium leading-snug text-ink">
            {meeting.title}
          </span>
          {live ? <Badge tone="accent">In progress</Badge> : null}
          {meeting.kind !== "internal" ? (
            <Badge tone="mute">{meetingKindLabel[meeting.kind]}</Badge>
          ) : null}
        </span>
        <span className="mt-1 block truncate text-[12.5px] text-ink-3">
          {names}
          {more > 0 ? ` and ${more} more` : ""}
          {meeting.recurring ? ` · ${meeting.recurring}` : ""}
        </span>
      </span>

      <span className="flex shrink-0 flex-col items-end gap-1.5 pt-[1px]">
        <Pips meeting={meeting} />
        <span className="num text-[11.5px] text-ink-3">
          {meeting.state === "upcoming"
            ? `${total} required`
            : `${joined} of ${total} joined`}
        </span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------- sparkline --- */

export function AttendanceBars({ data }) {
  /*
    Scaled from a 60% floor rather than from the series max. These values sit
    between 78 and 94, so a max-relative scale renders seven near-identical
    blocks and the trend disappears.
  */
  const FLOOR = 60;
  const height = (pct) => ((pct - FLOOR) / (100 - FLOOR)) * 100;

  return (
    <div
      className="flex items-end gap-[7px]"
      role="img"
      aria-label="Attendance over the last seven working days, ending at 92 percent today"
    >
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-[56px] w-full items-end justify-center">
            <div
              style={{ height: `${height(d.pct)}%` }}
              title={`${d.day}: ${d.pct}%`}
              className={`w-[10px] rounded-[2px] ${
                d.current ? "bg-accent" : "bg-ink-3/55"
              }`}
            />
          </div>
          <span
            className={`text-[10.5px] ${
              d.current ? "font-medium text-ink" : "text-ink-3"
            }`}
          >
            {d.day}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- player --- */

/* Deterministic waveform, so the shape is stable across renders. */
function bars(seed, n = 72) {
  const out = [];
  let x = seed;
  for (let i = 0; i < n; i++) {
    x = (x * 1103515245 + 12345) % 2147483648;
    const base = 0.25 + (x / 2147483648) * 0.75;
    // Taper the ends so it reads as speech rather than noise
    const taper = Math.sin((i / (n - 1)) * Math.PI) * 0.45 + 0.55;
    out.push(Math.max(0.12, base * taper));
  }
  return out;
}

export function RecordingPlayer({ call }) {
  const [playing, setPlaying] = useState(false);
  const [pct, setPct] = useState(0);
  const timer = useRef(null);

  const totalSec = call.duration
    ? call.duration.split(":").reduce((m, s) => m * 60 + Number(s), 0)
    : 0;

  /*
    No audio file ships with this mockup, so the scrubber is driven by a timer
    to show the interaction. Swapping in a real <audio> element later only means
    replacing this effect with timeupdate events.
  */
  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          setPlaying(false);
          return 100;
        }
        return p + 100 / (totalSec * 10 || 10);
      });
    }, 100);
    return () => clearInterval(timer.current);
  }, [playing, totalSec]);

  const shape = bars(call.id.charCodeAt(1) * 7919 + 13);
  const elapsed = Math.round((pct / 100) * totalSec);
  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="rounded-[10px] border border-line bg-paper-2/60 p-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            if (pct >= 100) setPct(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? "Pause recording" : "Play recording"}
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-150 active:scale-95"
        >
          {playing ? (
            <Pause size={15} weight="fill" />
          ) : (
            <Play size={15} weight="fill" className="ml-[1px]" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex h-[34px] items-center gap-[2px]">
            {shape.map((h, i) => {
              const played = (i / shape.length) * 100 <= pct;
              return (
                <span
                  key={i}
                  style={{ height: `${h * 100}%` }}
                  className={`min-h-[2px] w-full rounded-[1px] transition-colors duration-100 ${
                    played ? "bg-accent" : "bg-line-strong"
                  }`}
                />
              );
            })}
          </div>
        </div>

        <span className="num shrink-0 text-[12px] text-ink-2">
          {fmt(elapsed)} / {call.duration}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-[12px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <Microphone size={13} weight="bold" />
          Recorded and transcribed
        </span>
        <span>Language on the call: {call.language}</span>
        <span>Kept until 6 January 2027</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- transcript --- */

export function Transcript({ lines, other = "Attendee" }) {
  return (
    <ol className="space-y-4">
      {lines.map((l, i) => {
        const bot = l.who === "assistant";
        return (
          <li key={i} className="flex gap-3">
            <span
              className={`mt-[2px] w-[72px] shrink-0 text-[10.5px] font-semibold uppercase tracking-[0.07em] ${
                bot ? "text-accent-ink" : "text-ink-3"
              }`}
            >
              {bot ? "Assistant" : other}
            </span>
            <p
              className={`max-w-[66ch] text-[13px] leading-relaxed ${
                bot ? "text-ink" : "text-ink-2"
              }`}
            >
              {l.text}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------- person inline --- */

export function PersonInline({ id, size = 26, showOrg = true }) {
  const p = people[id];
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar person={p} size={size} />
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium leading-tight text-ink">
          {p.name}
        </span>
        {showOrg ? (
          <span className="block truncate text-[11.5px] leading-tight text-ink-3">
            {p.kind === "internal" ? p.role : `${p.role}, ${p.org}`}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function CallOutcome({ outcome }) {
  if (outcome === "answered") {
    return (
      <span className="flex items-center gap-1.5 text-[12.5px] text-ok-ink">
        <PhoneCall size={13} weight="bold" />
        Answered
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[12.5px] text-ink-3">
      <PhoneSlash size={13} weight="bold" />
      No answer
    </span>
  );
}
