import { useState } from "react";
import {
  WhatsappLogo,
  CheckCircle,
  WarningCircle,
  Microphone,
  CalendarDots,
  Plus,
} from "@phosphor-icons/react";
import { meetings, NOW } from "../data/mock";
import {
  Panel,
  PanelBar,
  PageHead,
  Badge,
  Button,
  Reveal,
  Empty,
} from "../components/ui";
import { MeetingRow } from "../components/pieces";
import { useApp } from "../state";

/*
  Inbound commands. This is the console's record of instructions that arrived on
  WhatsApp and exactly what was done with each one. It is deliberately the
  assistant's own log, not a recreation of the WhatsApp app.
*/
const commands = [
  {
    at: "08:12",
    from: "Bhaskar Arya",
    voice: true,
    text: "Tuesday 2 baje Anurag aur Omkar ke saath P&L meeting lagao",
    read: "Schedule a meeting, Tuesday 14:00, with Anurag Deshpande and Omkar Sawant",
    result: "clash",
    steps: [
      "Both names matched in the Contacts Directory",
      "Your calendar already holds the Thane site visit at 14:00",
      "Replied with three free slots: Tue 11:30, Tue 16:00, Wed 10:00",
    ],
  },
  {
    at: "09:04",
    from: "Omkar Sawant",
    voice: false,
    text: "Schedule handover checklist with Farida today 6 pm, add Prakash",
    read: "Schedule a meeting, today 18:00, with Farida Merchant and Prakash Iyer",
    result: "created",
    steps: [
      "Farida Merchant matched as an external contact at Kalyan Interiors",
      "Created on your calendar with a Google Meet link",
      "Invites sent, joining link delivered on WhatsApp to both",
    ],
  },
  {
    at: "11:21",
    from: "Bhaskar Arya",
    voice: true,
    text: "Kal ka site review cancel kar do",
    read: "Cancel tomorrow's recurring daily site review",
    result: "question",
    steps: [
      "This is a recurring meeting with 42 future occurrences",
      "Asked whether to cancel tomorrow only or the whole series",
      "No change made to the calendar yet",
    ],
  },
];

function CommandCard({ c }) {
  const tone =
    c.result === "created" ? "ok" : c.result === "clash" ? "wait" : "wait";
  const line =
    c.result === "created"
      ? "Meeting created and confirmed back on WhatsApp"
      : c.result === "clash"
        ? "Not created. Waiting for you to pick a slot."
        : "Not actioned. Waiting for you to confirm the scope.";

  return (
    <div className="px-6 py-5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <WhatsappLogo size={14} weight="bold" className="shrink-0 text-ink-3" />
        <span className="text-[12.5px] font-semibold text-ink">{c.from}</span>
        <span className="num text-[11.5px] text-ink-3">{c.at}</span>
        {c.voice ? (
          <span className="flex items-center gap-1 text-[11.5px] text-ink-3">
            <Microphone size={11} weight="bold" />
            voice note
          </span>
        ) : null}
      </div>

      <blockquote className="mt-2.5 rounded-r-[6px] border-l-2 border-ink bg-paper-2 py-2 pl-3 pr-3 text-[13.5px] leading-relaxed text-ink">
        {c.text}
      </blockquote>

      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-2">
        <span className="label mr-2">Read as</span>
        {c.read}
      </p>

      <ul className="mt-3 space-y-1.5">
        {c.steps.map((s, i) => (
          <li
            key={i}
            className="flex gap-2 text-[12.5px] leading-relaxed text-ink-2"
          >
            <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-line-strong" />
            {s}
          </li>
        ))}
      </ul>

      <div className="mt-3.5">
        {tone === "ok" ? (
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-ok-ink">
            <CheckCircle size={14} weight="bold" />
            {line}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-wait-ink">
            <WarningCircle size={14} weight="bold" />
            {line}
          </span>
        )}
      </div>
    </div>
  );
}

const FILTERS = [
  { id: "today", label: "Today", test: () => true },
  { id: "external", label: "Client and vendor", test: (m) => m.kind !== "internal" },
  { id: "recurring", label: "Recurring", test: (m) => Boolean(m.recurring) },
  {
    id: "attention",
    label: "Needs attention",
    test: (m) =>
      m.attendees.some((a) => a.calls >= 2 && !a.joined) ||
      m.attendees.some((a) => a.rsvp === "none"),
  },
];

export default function Meetings() {
  const { open, toast } = useApp();
  const [filter, setFilter] = useState("today");

  const active = FILTERS.find((f) => f.id === filter);
  const shown = meetings.filter(active.test);

  const groups = [
    { key: "live", label: "In progress" },
    { key: "upcoming", label: "Later today" },
    { key: "closed", label: "Finished" },
  ];

  return (
    <>
      <PageHead
        title="Meetings"
        meta="Every meeting on your calendar, however it was created. Meetings you add in Google Calendar yourself follow the same reminders and calls."
        action={
          <Button
            variant="solid"
            icon={Plus}
            onClick={() => toast("Send the assistant a WhatsApp note to add a meeting.")}
          >
            New meeting
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-line">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          const count = meetings.filter(f.test).length;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`relative -mb-px flex items-center gap-2 px-3 py-2.5 text-[13px] transition-colors duration-150 ${
                on ? "font-semibold text-ink" : "text-ink-3 hover:text-ink"
              }`}
            >
              {f.label}
              <span
                className={`num rounded-full px-1.5 text-[10.5px] ${
                  on ? "bg-ink text-paper" : "bg-paper-3 text-ink-3"
                }`}
              >
                {count}
              </span>
              {on ? (
                <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-ink" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="space-y-6">
        {shown.length === 0 ? (
          <Panel>
            <Empty
              icon={CalendarDots}
              title="Nothing matches this filter"
              detail="Try another filter, or add a meeting by sending a WhatsApp note to the assistant."
              action={<Button onClick={() => setFilter("today")}>Show today</Button>}
            />
          </Panel>
        ) : (
          groups.map((g, gi) => {
            const list = shown.filter((m) => m.state === g.key);
            if (list.length === 0) return null;
            return (
              <Reveal key={g.key} delay={gi * 0.05}>
                <Panel flush>
                  <PanelBar
                    title={g.label}
                    action={
                      <span className="num text-[11.5px] text-ink-3">
                        {g.key === "live"
                          ? `${NOW.clock} ${NOW.zone}`
                          : `${list.length}`}
                      </span>
                    }
                  />
                  <div className="divide-y divide-line">
                    {list.map((m) => (
                      <MeetingRow
                        key={m.id}
                        meeting={m}
                        onOpen={(id) => open("meeting", id)}
                      />
                    ))}
                  </div>
                </Panel>
              </Reveal>
            );
          })
        )}

        <Reveal delay={0.1}>
          <Panel flush>
            <PanelBar
              title="Scheduled by message"
              meta="Instructions that arrived on WhatsApp today, in English, Hindi or a mix"
              action={<Badge tone="mute">{commands.length} today</Badge>}
            />
            <div className="divide-y divide-line">
              {commands.map((c, i) => (
                <CommandCard key={i} c={c} />
              ))}
            </div>
            <div className="border-t border-line bg-paper-2 px-6 py-3.5">
              <p className="text-[12px] leading-relaxed text-ink-2">
                Only your number and Omkar Sawant's number can instruct the
                assistant. Anything ambiguous comes back as a question before a
                meeting is created or cancelled.
              </p>
            </div>
          </Panel>
        </Reveal>
      </div>
    </>
  );
}
