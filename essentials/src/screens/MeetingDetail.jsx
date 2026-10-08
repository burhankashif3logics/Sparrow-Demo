import { useState } from "react";
import {
  VideoCamera,
  WhatsappLogo,
  PhoneCall,
  PhoneSlash,
  Megaphone,
  Export,
  Pause,
  Play,
  CaretDown,
  ListChecks,
  FileText,
  Hourglass,
} from "@phosphor-icons/react";
import {
  meetings,
  ledger,
  people,
  meetingKindLabel,
  meetingAgenda,
  meetingMessages,
  meetingRecords,
  NOW,
} from "../data/mock";
import {
  Panel,
  PanelBar,
  PanelHead,
  Badge,
  Button,
  Reveal,
  Row,
  BackLink,
  Stat,
} from "../components/ui";
import { attendeeState, joinedCount, PersonInline } from "../components/pieces";
import { useApp } from "../state";

/* The ten minute reminder goes out before the start, whatever the start is. */
function reminderTime(start) {
  const [h, m] = start.split(":").map(Number);
  const mins = h * 60 + m - 10;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(
    mins % 60,
  ).padStart(2, "0")}`;
}

/* The trail of contact attempts for one attendee, built from the meeting state. */
function trail(a, meeting) {
  const steps = [
    {
      icon: WhatsappLogo,
      text: `Link sent ${reminderTime(meeting.time)}`,
      ok: true,
    },
  ];
  if (meeting.state === "upcoming") {
    steps[0] = { icon: WhatsappLogo, text: "Invite sent 09:04", ok: true };
    if (a.rsvp === "confirmed-on-call")
      steps.push({ icon: PhoneCall, text: "Confirmed on call 12:42", ok: true });
    if (a.queued)
      steps.push({ icon: PhoneCall, text: `Call queued ${a.queued}`, pending: true });
    return steps;
  }
  if (a.id === "suresh") {
    steps.push({ icon: PhoneSlash, text: "Call 14:03 no answer", ok: false });
    steps.push({ icon: PhoneSlash, text: "Call 14:10 no answer", ok: false });
    steps.push({ icon: Megaphone, text: "Escalated to you 14:11", ok: false });
    return steps;
  }
  if (a.calls) {
    steps.push({
      icon: PhoneCall,
      text: `Call ${meeting.state === "live" ? "14:00" : "09:32"} answered`,
      ok: true,
    });
  }
  if (a.joined)
    steps.push({ icon: VideoCamera, text: `Joined ${a.joined}`, ok: true });
  return steps;
}

function AttendeeBlock({ a, meeting }) {
  const { open, toast, paused } = useApp();
  const s = attendeeState(a, meeting.state);
  const p = people[a.id];
  const problem = s.tone === "stop";
  const steps = trail(a, meeting);
  /* Nothing can be called or stopped once a meeting is over. */
  const done = meeting.state === "closed";

  return (
    <div className={`px-6 py-5 ${problem ? "bg-stop-soft/25" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <button
              type="button"
              onClick={() => open("contact", a.id)}
              className="rounded-[6px] text-left transition-opacity hover:opacity-70"
            >
              <PersonInline id={a.id} size={30} />
            </button>
            <Badge tone={s.tone}>{s.label}</Badge>
            {!a.required ? <Badge tone="mute">Optional</Badge> : null}
            {p.kind !== "internal" ? (
              <Badge tone="mute">
                {p.kind === "client" ? "Client" : "Vendor"}
              </Badge>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <span key={i} className="flex items-center gap-2.5">
                  {i > 0 ? (
                    <span className="h-px w-3 bg-line-strong" aria-hidden="true" />
                  ) : null}
                  <span
                    className={`flex items-center gap-1.5 text-[11.5px] ${
                      st.pending
                        ? "text-wait-ink"
                        : st.ok
                          ? "text-ink-2"
                          : "text-stop-ink"
                    }`}
                  >
                    <Icon size={12} weight="bold" />
                    {st.text}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {done ? null : problem ? (
            <>
              <Button
                icon={PhoneCall}
                disabled={paused}
                onClick={() => toast(`Calling ${p.name.split(" ")[0]} now.`)}
              >
                Call again
              </Button>
              <Button
                onClick={() =>
                  toast(`${p.name.split(" ")[0]} marked as excused.`, "warn")
                }
              >
                Mark as excused
              </Button>
            </>
          ) : (
            <Button
              onClick={() =>
                toast(`Reminders stopped for ${p.name.split(" ")[0]}.`, "warn")
              }
            >
              Stop reminders
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/*
  The written record. It exists only once a meeting has ended, so a meeting that
  is still running or still to come shows what will be in it and when, rather
  than an empty panel pretending to be the real thing.
*/
function PendingRecord({ meeting }) {
  return (
    <Panel flush>
      <PanelBar
        title="The record for this meeting"
        meta="Written once, when the meeting ends"
        action={<Badge tone="wait">Not written yet</Badge>}
      />
      <div className="flex items-start gap-3.5 px-6 py-5">
        <Hourglass
          size={17}
          weight="bold"
          className="mt-[2px] shrink-0 text-wait-ink"
        />
        <div className="min-w-0 flex-1">
          <p className="max-w-[64ch] text-[13px] leading-relaxed text-ink-2">
            This meeting {meeting.state === "live" ? "is running" : "has not started"}.
            The record is compiled at{" "}
            <span className="num font-semibold text-ink">{meeting.ends}</span>, when
            it ends, and sent to you on WhatsApp. Until then you are looking at the
            live view below.
          </p>
          <ul className="mt-3.5 space-y-1.5">
            {[
              "Who joined, at what time, and who did not",
              "Every reminder sent and every call placed, with the outcome",
              "Anything escalated to you and what you decided",
              "The agenda as it was circulated",
            ].map((l) => (
              <li
                key={l}
                className="flex gap-2 text-[12.5px] leading-relaxed text-ink-2"
              >
                <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-line-strong" />
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}

function WrittenRecord({ record }) {
  return (
    <Panel flush>
      {/* Inverted header. On a finished meeting this is the page. */}
      <div className="bg-rail px-6 py-5">
        <div className="flex items-center gap-2">
          <FileText size={14} weight="bold" className="text-accent-lift" />
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.11em] text-accent-lift">
            Record
          </span>
        </div>
        <p className="num mt-1.5 text-[11.5px] leading-snug text-rail-text">
          Written {record.generatedAt}, at the end of the meeting
        </p>
        <p className="mt-2.5 max-w-[60ch] text-[14px] leading-relaxed text-rail-text-strong">
          {record.headline}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-y-5 px-6 py-5 sm:grid-cols-4 sm:divide-x sm:divide-line">
        {record.coordination.map((c, i) => (
          <div
            key={c.label}
            className={`sm:px-6 ${i === 0 ? "sm:pl-0" : ""} ${
              i === record.coordination.length - 1 ? "sm:pr-0" : ""
            }`}
          >
            <Stat value={c.value} label={c.label} />
          </div>
        ))}
      </dl>

      <div className="border-t border-line px-6 py-5">
        <p className="label mb-3">Attendance</p>
        <ul className="space-y-1.5">
          {record.attendance.map((l) => (
            <li
              key={l}
              className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink-2"
            >
              <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-line-strong" />
              {l}
            </li>
          ))}
        </ul>

        <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink-2">
          <span className="label mr-2">Left open</span>
          {record.carried}
        </p>
      </div>

      <div className="border-t border-line bg-paper-2 px-6 py-3.5">
        <p className="max-w-[80ch] text-[12px] leading-relaxed text-ink-2">
          Compiled from your calendar, the Google Meet joining data and the
          assistant's own log of what it sent and called. The conversation in the
          room is not recorded, so nothing here is a summary of what was said.
        </p>
      </div>
    </Panel>
  );
}

export default function MeetingDetail({ id }) {
  const { back, toast, paused } = useApp();
  const [openAgenda, setOpenAgenda] = useState(true);
  const meeting = meetings.find((m) => m.id === id) ?? meetings[0];
  const { joined, total } = joinedCount(meeting);
  const entries = ledger.filter((e) => e.meeting === meeting.id);
  const agenda = meetingAgenda[meeting.id] ?? [];
  const messages = meetingMessages[meeting.id] ?? [];
  const live = meeting.state === "live";
  const closed = meeting.state === "closed";
  const record = meetingRecords[meeting.id] ?? null;
  const callCount = meeting.attendees.reduce((n, a) => n + (a.calls ?? 0), 0);

  return (
    <>
      <BackLink onClick={back}>All meetings</BackLink>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {live ? <Badge tone="accent">In progress</Badge> : null}
            <Badge tone="mute">{meetingKindLabel[meeting.kind]}</Badge>
            {meeting.recurring ? (
              <span className="text-[12px] text-ink-3">{meeting.recurring}</span>
            ) : null}
          </div>
          <h1 className="mt-2.5 text-[26px] font-semibold leading-tight tracking-[-0.027em] text-ink">
            {meeting.title}
          </h1>
          <p className="num mt-1.5 text-[13px] text-ink-3">
            {NOW.short} · {meeting.time} to {meeting.ends} {NOW.zone} · Google Meet
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {closed ? (
            <Button
              icon={Export}
              onClick={() => toast("Record exported as a PDF.")}
            >
              Export the record
            </Button>
          ) : (
            <>
              <Button
                icon={live ? Pause : Play}
                onClick={() =>
                  toast(
                    live
                      ? "Reminders paused for this meeting."
                      : "Reminders are on for this meeting.",
                    live ? "warn" : "ok",
                  )
                }
              >
                {live ? "Pause reminders" : "Reminders on"}
              </Button>
              <Button
                variant="solid"
                icon={VideoCamera}
                onClick={() => toast("Opening Google Meet in a new tab.")}
              >
                Join on Meet
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Headline numbers for this meeting */}
      <Reveal>
        <Panel className="mb-6 py-5">
          <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-line">
            <div className="sm:pr-6">
              <Stat value={`${joined} of ${total}`} label="Required attendees in" />
            </div>
            <div className="sm:px-6">
              <Stat value={callCount} label="Calls placed" />
            </div>
            <div className="sm:px-6">
              <Stat value={messages.length ? messages.length : 2} label="Messages sent" />
            </div>
            <div className="sm:pl-6">
              <Stat
                value={record ? record.generatedAt : meeting.ends}
                label={record ? "Record written" : "Record due"}
                tone={record ? "ink" : "accent"}
              />
            </div>
          </dl>
        </Panel>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="min-w-0 space-y-6 lg:col-span-7">
          <Reveal delay={0.04}>
            {record ? (
              <WrittenRecord record={record} />
            ) : (
              <PendingRecord meeting={meeting} />
            )}
          </Reveal>

          <Reveal delay={0.08}>
            <Panel flush>
              <PanelBar
                title="Attendees"
                meta={meeting.summary}
                action={
                  closed ? null : (
                    <Button
                      icon={PhoneCall}
                      disabled={paused}
                      onClick={() => toast("Calling everyone who has not joined.")}
                    >
                      Call all missing
                    </Button>
                  )
                }
              />
              <div className="divide-y divide-line">
                {meeting.attendees.map((a) => (
                  <AttendeeBlock key={a.id} a={a} meeting={meeting} />
                ))}
              </div>
            </Panel>
          </Reveal>

          {messages.length ? (
            <Reveal delay={0.12}>
              <Panel flush>
                <PanelBar
                  title="Messages sent"
                  meta="Every WhatsApp message for this meeting, with delivery state"
                />
                <ul className="divide-y divide-line">
                  {messages.map((m, i) => (
                    <li
                      key={i}
                      className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 px-6 py-3"
                    >
                      <span className="num w-[46px] shrink-0 text-[12px] text-ink-3">
                        {m.at}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12.5px] leading-snug text-ink">
                          {m.kind}
                        </span>
                        <span className="block text-[11.5px] leading-snug text-ink-3">
                          to {m.to}
                        </span>
                      </span>
                      <Badge tone={m.state === "read" ? "ok" : "mute"}>
                        {m.state}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          ) : null}
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-5">
          {agenda.length ? (
            <Reveal delay={0.04}>
              <Panel flush>
                <button
                  type="button"
                  onClick={() => setOpenAgenda((o) => !o)}
                  aria-expanded={openAgenda}
                  className="flex w-full items-center justify-between gap-4 border-b border-line bg-paper-2 px-6 py-4 text-left"
                >
                  <span className="flex items-center gap-2">
                    <ListChecks size={15} weight="bold" className="text-ink-3" />
                    <span className="text-[14px] font-semibold text-ink">
                      Agenda
                    </span>
                    <span className="num text-[11.5px] text-ink-3">
                      {agenda.length} items
                    </span>
                  </span>
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={`shrink-0 text-ink-3 transition-transform duration-200 ${
                      openAgenda ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAgenda ? (
                  <ol className="divide-y divide-line">
                    {agenda.map((a, i) => (
                      <li key={i} className="flex gap-3 px-6 py-3">
                        <span className="num shrink-0 text-[11.5px] text-ink-3">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[13px] leading-snug text-ink-2">
                          {a}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </Panel>
            </Reveal>
          ) : null}

          <Reveal delay={0.08}>
            <Panel>
              <PanelHead title="Details" />
              <dl className="mt-3 divide-y divide-line">
                <Row label="Organiser" value="Bhaskar Arya" />
                <Row label="Platform" value="Google Meet" />
                <Row label="Created" value={meeting.id === "m5" ? "By WhatsApp, 09:04" : "In Google Calendar"} />
                <Row label="Attendees" value={<span className="num">{meeting.attendees.length}</span>} />
                <Row label="Reminder sent" value="10 minutes before" />
                <Row label="Escalation" value="10 minutes past the start" />
                <Row
                  label="Record"
                  value={record ? `Written ${record.generatedAt}` : `Due ${meeting.ends}`}
                />
              </dl>
            </Panel>
          </Reveal>

          {entries.length ? (
            <Reveal delay={0.12}>
              <Panel flush>
                <PanelBar title="What happened" meta="This meeting only, newest first" />
                <ol className="divide-y divide-line">
                  {entries.map((e, i) => (
                    <li key={i} className="flex gap-3 px-6 py-2.5">
                      <span className="num shrink-0 text-[11.5px] text-ink-3">
                        {e.time}
                      </span>
                      <span className="min-w-0 text-[12.5px] leading-snug text-ink-2">
                        {e.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </Panel>
            </Reveal>
          ) : null}
        </div>
      </div>
    </>
  );
}
