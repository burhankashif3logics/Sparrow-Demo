import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  WarningCircle,
  PhoneCall,
  ShieldCheck,
  CaretRight,
  VideoCamera,
  Plugs,
  CheckCircle,
} from "@phosphor-icons/react";
import {
  meetings,
  ledger,
  attendanceWeek,
  people,
  todayKpis,
  connections,
  NOW,
} from "../data/mock";
import {
  Panel,
  PanelBar,
  PanelHead,
  PageHead,
  Badge,
  Button,
  Reveal,
  Stat,
} from "../components/ui";
import {
  MeetingRow,
  Ledger,
  AttendanceBars,
  attendeeState,
  joinedCount,
  PersonInline,
} from "../components/pieces";
import { useApp } from "../state";

/* Live meeting indicator. Semantic state, one per page, motion-motivated. */
function LiveDot() {
  const reduce = useReducedMotion();
  if (reduce)
    return <span className="h-[7px] w-[7px] rounded-full bg-accent-lift" />;
  return (
    <span className="relative flex h-[7px] w-[7px]">
      <motion.span
        className="absolute inset-0 rounded-full bg-accent-lift"
        animate={{ scale: [1, 2.4], opacity: [0.55, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative h-[7px] w-[7px] rounded-full bg-accent-lift" />
    </span>
  );
}

function LiveMeeting({ meeting }) {
  const { open, toast, paused } = useApp();
  const { joined, total } = joinedCount(meeting);

  return (
    <Panel flush>
      {/* Inverted header. The one thing happening right now should dominate. */}
      <div className="bg-rail px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <LiveDot />
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-accent-lift">
                In progress
              </span>
              <span className="num text-[11.5px] text-rail-text">
                started {meeting.time}
              </span>
            </div>
            <h2 className="mt-2 text-[20px] font-semibold leading-tight tracking-[-0.02em] text-rail-text-strong">
              {meeting.title}
            </h2>
            <p className="num mt-1 text-[12.5px] text-rail-text">
              {meeting.time} to {meeting.ends} {NOW.zone} · Google Meet
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => open("meeting", meeting.id)}
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-rail-line px-3 py-[7px] text-[12.5px] font-medium text-rail-text transition-colors duration-150 hover:bg-rail-2 hover:text-rail-text-strong"
            >
              Open meeting
              <ArrowRight size={14} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => toast("Opening Google Meet in a new tab.")}
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-paper px-3 py-[7px] text-[12.5px] font-medium text-ink transition-colors duration-150 hover:bg-white"
            >
              <VideoCamera size={14} weight="bold" />
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {meeting.attendees.map((a) => {
            const s = attendeeState(a, meeting.state);
            return (
              <div key={a.id} className="min-w-0">
                <PersonInline id={a.id} />
                <div className="mt-2 flex items-center gap-2">
                  <Badge tone={s.tone}>{s.short}</Badge>
                  {a.calls ? (
                    <span className="num text-[11px] text-ink-3">
                      {a.calls} {a.calls === 1 ? "call" : "calls"}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="max-w-[72ch] text-[13px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">
              {joined} of {total} required attendees are in the room.
            </span>{" "}
            {meeting.summary}
          </p>
          <Button
            icon={PhoneCall}
            disabled={paused}
            onClick={() => toast("Calling Suresh Patil now.")}
          >
            Call Suresh again
          </Button>
        </div>
      </div>
    </Panel>
  );
}

function NeedsYou() {
  const { open, toast, paused } = useApp();
  const [done, setDone] = useState({});

  const items = [
    {
      key: "suresh",
      person: "suresh",
      head: "Not reachable for the meeting running now",
      body: "Two calls placed, no answer. The assistant has stopped calling and is waiting on your decision.",
      meeting: "m3",
      tone: "stop",
      actions: [
        { label: "Start without him", say: "Noted. The meeting continues without Suresh Patil." },
        { label: "Move the meeting", say: "Reschedule options sent to you on WhatsApp." },
      ],
    },
    {
      key: "sneha",
      person: "sneha",
      head: "Has not responded to the 16:30 invite",
      body: "A response call is queued for 15:30. You can bring it forward.",
      meeting: "m4",
      tone: "wait",
      actions: [{ label: "Call now", say: "Calling Sneha Kulkarni now." }],
    },
  ];

  const openCount = items.filter((i) => !done[i.key]).length;

  return (
    <Panel flush>
      <PanelBar
        title="Waiting on you"
        meta="Decisions the assistant will not make on its own"
        action={
          <Badge tone={openCount ? "stop" : "ok"}>
            {openCount ? `${openCount} open` : "All clear"}
          </Badge>
        }
      />

      {openCount === 0 ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <CheckCircle size={22} weight="bold" className="mb-2.5 text-ok-ink" />
          <p className="text-[13.5px] font-medium text-ink">Nothing is waiting</p>
          <p className="mt-1 text-[12.5px] text-ink-3">
            Both items have been handled.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {items
            .filter((it) => !done[it.key])
            .map((it) => {
              const p = people[it.person];
              return (
                <li key={it.key} className="px-6 py-5">
                  <div className="flex items-start gap-3">
                    <WarningCircle
                      size={16}
                      weight="bold"
                      className={`mt-[2px] shrink-0 ${
                        it.tone === "stop" ? "text-stop-ink" : "text-wait-ink"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold leading-snug text-ink">
                        {p.name}
                      </p>
                      <p className="text-[12.5px] leading-snug text-ink-3">
                        {it.head}
                      </p>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-2">
                        {it.body}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {it.actions.map((a) => (
                          <Button
                            key={a.label}
                            disabled={paused}
                            onClick={() => {
                              setDone((d) => ({ ...d, [it.key]: true }));
                              toast(a.say);
                            }}
                          >
                            {a.label}
                          </Button>
                        ))}
                        <Button
                          variant="quiet"
                          icon={CaretRight}
                          onClick={() => open("meeting", it.meeting)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </Panel>
  );
}

export default function Today() {
  const { open, account } = useApp();
  const live = meetings.find((m) => m.state === "live");
  const rest = meetings.filter((m) => m.state !== "live");
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? ledger : ledger.slice(0, 7);

  const hour = Number(NOW.clock.split(":")[0]);
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHead
        title={`${greeting}, ${account.label.split(" ")[0]}`}
        meta={`Five meetings today. One is running now and two things need a decision from you.`}
      />

      <div className="space-y-6">
        {/* Day at a glance. One panel, divided, never five floating tiles. */}
        <Reveal>
          <Panel className="py-5">
            <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-line">
              {todayKpis.map((k, i) => (
                <div
                  key={k.label}
                  className={`lg:px-6 ${i === 0 ? "lg:pl-0" : ""} ${
                    i === todayKpis.length - 1 ? "lg:pr-0" : ""
                  }`}
                >
                  <Stat
                    value={k.value}
                    label={k.label}
                    sub={k.sub}
                    tone={k.label === "Escalated to you" ? "accent" : "ink"}
                  />
                </div>
              ))}
            </dl>
          </Panel>
        </Reveal>

        {live ? (
          <Reveal delay={0.04}>
            <LiveMeeting meeting={live} />
          </Reveal>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-7">
            <Reveal delay={0.08}>
              <Panel flush>
                <PanelBar
                  title="The rest of the day"
                  meta={NOW.label}
                  action={
                    <Button variant="quiet" onClick={() => open("meeting", "m4")}>
                      Next up
                    </Button>
                  }
                />
                <div className="divide-y divide-line">
                  {rest.map((m) => (
                    <MeetingRow
                      key={m.id}
                      meeting={m}
                      onOpen={(id) => open("meeting", id)}
                    />
                  ))}
                </div>
              </Panel>
            </Reveal>

            <Reveal delay={0.12}>
              <Panel flush>
                <PanelBar
                  title="Everything the assistant did today"
                  meta="Newest first. Nothing is hidden and nothing is deleted."
                  action={<Badge tone="mute">{ledger.length} actions</Badge>}
                />
                <div className="px-6 pt-5">
                  <Ledger entries={shown} />
                </div>
                {ledger.length > 7 ? (
                  <div className="border-t border-line bg-paper-2 px-6 py-3">
                    <Button
                      variant="quiet"
                      onClick={() => setShowAll((s) => !s)}
                      className="w-full justify-center"
                    >
                      {showAll
                        ? "Show less"
                        : `Show ${ledger.length - 7} earlier actions`}
                    </Button>
                  </div>
                ) : null}
              </Panel>
            </Reveal>
          </div>

          <div className="min-w-0 space-y-6 lg:col-span-5">
            <Reveal delay={0.08}>
              <NeedsYou />
            </Reveal>

            <Reveal delay={0.12}>
              <Panel>
                <PanelHead
                  title="Attendance"
                  meta="Required attendees who joined, last seven working days"
                />
                <div className="mt-6 flex items-end justify-between gap-6">
                  <div>
                    <p className="num text-[34px] font-semibold leading-none tracking-[-0.035em] text-ink">
                      92%
                    </p>
                    <p className="mt-1.5 text-[12px] text-ink-3">today</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <AttendanceBars data={attendanceWeek} />
                  </div>
                </div>
                <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink-2">
                  Before the assistant, the EA was calling attendees by hand for
                  most of the morning. The figure above is the share who were in
                  the room at the start time.
                </p>
              </Panel>
            </Reveal>

            <Reveal delay={0.16}>
              <Panel flush>
                <PanelBar
                  title="Connected systems"
                  meta="What it reads from and writes to"
                  action={
                    <Plugs size={15} weight="bold" className="text-ink-3" />
                  }
                />
                <ul className="divide-y divide-line">
                  {connections.map((c) => (
                    <li
                      key={c.name}
                      className="flex items-center justify-between gap-4 px-6 py-2.5"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px] font-medium leading-tight text-ink">
                          {c.name}
                        </span>
                        <span className="block truncate text-[11.5px] leading-tight text-ink-3">
                          {c.detail}
                        </span>
                      </span>
                      <span className="num shrink-0 text-[11px] text-ink-3">
                        {c.meta}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>

            <Reveal delay={0.2}>
              <Panel className="bg-paper-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={17}
                    weight="bold"
                    className="mt-[2px] shrink-0 text-ink-2"
                  />
                  <div>
                    <h2 className="text-[13.5px] font-semibold text-ink">
                      What it is not allowed to do
                    </h2>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
                      It never agrees to a price, a payment or a date on your
                      behalf. It says it is an assistant at the start of every
                      call. Anything beyond confirming attendance comes back to
                      you.
                    </p>
                  </div>
                </div>
              </Panel>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
