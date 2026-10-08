import {
  PhoneCall,
  WhatsappLogo,
  EnvelopeSimple,
  Prohibit,
  CheckCircle,
  CalendarDots,
} from "@phosphor-icons/react";
import {
  people,
  meetings,
  calls,
  personHistory,
  defaultHistory,
} from "../data/mock";
import {
  Panel,
  PanelBar,
  PanelHead,
  Badge,
  Button,
  Reveal,
  BackLink,
  Avatar,
  Row,
  Stat,
} from "../components/ui";
import { useApp } from "../state";

const KIND_LABEL = { internal: "Internal", client: "Client", vendor: "Vendor" };

export default function ContactDetail({ id }) {
  const { back, open, toast, paused } = useApp();
  const p = people[id] ?? people.bhaskar;
  const history = personHistory[id] ?? defaultHistory;

  const theirMeetings = meetings.filter((m) =>
    m.attendees.some((a) => a.id === id),
  );
  const theirCalls = calls.filter((c) => c.person === id);
  const answered = theirCalls.filter((c) => c.outcome === "answered").length;

  return (
    <>
      <BackLink onClick={back}>Contacts</BackLink>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-5">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar person={p} size={52} />
          <div className="min-w-0">
            <h1 className="text-[25px] font-semibold leading-tight tracking-[-0.025em] text-ink">
              {p.name}
            </h1>
            <p className="mt-1 text-[13.5px] text-ink-2">
              {p.role}
              {p.kind !== "internal" ? `, ${p.org}` : ""}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <Badge tone="mute">{KIND_LABEL[p.kind]}</Badge>
              {id === "rajat" ? (
                <Badge tone="mute">Do not call</Badge>
              ) : id === "nitin" ? (
                <Badge tone="wait">Held for approval</Badge>
              ) : (
                <Badge tone="ok">Calling allowed</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            icon={WhatsappLogo}
            disabled={paused}
            onClick={() => toast(`Message queued to ${p.name.split(" ")[0]}.`)}
          >
            Message
          </Button>
          <Button
            icon={PhoneCall}
            variant="solid"
            disabled={paused || id === "rajat" || id === "nitin"}
            title={
              id === "rajat"
                ? "This contact is on the do not call list"
                : id === "nitin"
                  ? "Waiting for the EA to release this number"
                  : undefined
            }
            onClick={() => toast(`Calling ${p.name.split(" ")[0]} now.`)}
          >
            Call now
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="min-w-0 space-y-6 lg:col-span-7">
          <Reveal>
            <Panel flush>
              <PanelBar
                title="Contact history"
                meta={history.note}
                action={
                  <span className="num text-[12px] text-ink-3">
                    {history.rows.length} events
                  </span>
                }
              />
              <ul className="divide-y divide-line">
                {history.rows.map((r, i) => {
                  const failed = r.outcome.startsWith("No answer");
                  return (
                    <li
                      key={i}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-3.5"
                    >
                      <span className="num w-[110px] shrink-0 text-[12px] text-ink-3">
                        {r.when}
                      </span>
                      <span className="min-w-0 flex-1 text-[13px] text-ink">
                        {r.what}
                      </span>
                      <span
                        className={`shrink-0 text-[12.5px] ${
                          failed ? "text-stop-ink" : "text-ink-2"
                        }`}
                      >
                        {r.outcome}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </Reveal>

          <Reveal delay={0.05}>
            <Panel flush>
              <PanelBar
                title="Meetings with you"
                meta="Today's calendar only"
                action={
                  <span className="num text-[12px] text-ink-3">
                    {theirMeetings.length}
                  </span>
                }
              />
              {theirMeetings.length === 0 ? (
                <p className="px-6 py-8 text-center text-[13px] text-ink-3">
                  No meetings with this contact today.
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {theirMeetings.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => open("meeting", m.id)}
                        className="flex w-full items-center gap-4 px-6 py-3.5 text-left transition-colors duration-150 hover:bg-paper-2/70"
                      >
                        <span className="num w-[44px] shrink-0 text-[12.5px] font-medium text-ink">
                          {m.time}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                          {m.title}
                        </span>
                        <CalendarDots
                          size={14}
                          weight="bold"
                          className="shrink-0 text-ink-3"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </Reveal>
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-5">
          <Reveal delay={0.05}>
            <Panel>
              <PanelHead title="Reach" />
              <div className="mt-5 grid grid-cols-3 divide-x divide-line">
                <div className="pr-4">
                  <Stat
                    value={`${history.reliability}%`}
                    label="Answers calls"
                    tone={history.reliability < 60 ? "ink" : "ink"}
                  />
                </div>
                <div className="px-4">
                  <Stat value={theirCalls.length} label="Calls today" />
                </div>
                <div className="pl-4">
                  <Stat value={answered} label="Answered" />
                </div>
              </div>
            </Panel>
          </Reveal>

          <Reveal delay={0.1}>
            <Panel>
              <PanelHead title="Details" />
              <dl className="mt-3 divide-y divide-line">
                <Row label="Phone">
                  <span className="num">{p.phone}</span>
                </Row>
                <Row label="Email">
                  <span className="num text-[12px]">{p.email}</span>
                </Row>
                <Row label="Organisation" value={p.org} />
                <Row label="Source" value="Contacts Directory" />
                <Row label="Last synced" value="07:34 today" />
              </dl>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <Button icon={EnvelopeSimple}>Open in the sheet</Button>
                <Button
                  icon={Prohibit}
                  onClick={() =>
                    toast(
                      `${p.name.split(" ")[0]} added to the do not call list.`,
                      "warn",
                    )
                  }
                >
                  Do not call
                </Button>
              </div>
            </Panel>
          </Reveal>

          {id === "nitin" ? (
            <Reveal delay={0.15}>
              <Panel className="bg-wait-soft/50">
                <h2 className="text-[13.5px] font-semibold text-ink">
                  Waiting for release
                </h2>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
                  This number was added to the sheet at 07:34 today. The
                  assistant will not dial it until the EA releases it, so a
                  number typed in by mistake never results in a cold call.
                </p>
                <div className="mt-3">
                  <Button
                    icon={CheckCircle}
                    variant="solid"
                    onClick={() => toast(`${p.name} released for calling.`)}
                  >
                    Release for calling
                  </Button>
                </div>
              </Panel>
            </Reveal>
          ) : null}
        </div>
      </div>
    </>
  );
}
