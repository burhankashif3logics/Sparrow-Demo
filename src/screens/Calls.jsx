import { useState } from "react";
import {
  Export,
  ClockCountdown,
  ShieldCheck,
  PhoneCall,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { calls, people, NOW } from "../data/mock";
import {
  Panel,
  PanelBar,
  PageHead,
  Badge,
  Button,
  Reveal,
  Empty,
  Stat,
} from "../components/ui";
import {
  RecordingPlayer,
  Transcript,
  CallOutcome,
  PersonInline,
} from "../components/pieces";
import { useApp } from "../state";

const FILTERS = [
  { id: "all", label: "All", test: () => true },
  { id: "answered", label: "Answered", test: (c) => c.outcome === "answered" },
  { id: "missed", label: "No answer", test: (c) => c.outcome !== "answered" },
];

export default function Calls() {
  const { open, toast, paused } = useApp();
  /* Newest first. The source array is grouped by meeting, not by clock. */
  const ordered = [...calls].sort((a, b) => b.at.localeCompare(a.at));
  const [filter, setFilter] = useState("all");
  const active = FILTERS.find((f) => f.id === filter);
  const list = ordered.filter(active.test);

  const [sel, setSel] = useState(
    ordered.find((c) => c.recording)?.id ?? ordered[0].id,
  );
  const call = ordered.find((c) => c.id === sel);
  const p = call ? people[call.person] : null;

  const answered = ordered.filter((c) => c.outcome === "answered").length;
  const totalSec = ordered
    .filter((c) => c.duration)
    .reduce(
      (n, c) => n + c.duration.split(":").reduce((m, s) => m * 60 + Number(s), 0),
      0,
    );

  return (
    <>
      <PageHead
        title="Calls and recordings"
        meta="Every call the assistant placed, who answered, what was said and how long it ran. Recordings are kept for 90 days and can be exported."
        action={
          <Button
            icon={Export}
            onClick={() => toast("Today's call log exported as a spreadsheet.")}
          >
            Export the day
          </Button>
        }
      />

      <Reveal>
        <Panel className="mb-6 py-5">
          <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-line">
            <div className="sm:pr-6">
              <Stat value={ordered.length} label="Calls placed" />
            </div>
            <div className="sm:px-6">
              <Stat value={answered} label="Answered" />
            </div>
            <div className="sm:px-6">
              <Stat
                value={`${Math.floor(totalSec / 60)}m ${totalSec % 60}s`}
                label="Time on calls"
              />
            </div>
            <div className="sm:pl-6">
              <Stat value="3" label="Languages used" sub="English, Hindi, Hinglish" />
            </div>
          </dl>
        </Panel>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Master list */}
        <div className="min-w-0 lg:col-span-5">
          <Reveal delay={0.04}>
            <Panel flush>
              <PanelBar
                title={NOW.short}
                action={
                  <div className="flex gap-1">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        className={`rounded-[6px] px-2 py-[3px] text-[11.5px] transition-colors duration-150 ${
                          filter === f.id
                            ? "bg-ink font-medium text-paper"
                            : "text-ink-3 hover:text-ink"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                }
              />

              {list.length === 0 ? (
                <Empty
                  icon={ClockCountdown}
                  title="No calls match"
                  detail="Change the filter to see the rest of the day."
                />
              ) : (
                <ul className="divide-y divide-line">
                  {list.map((c) => {
                    const on = c.id === sel;
                    const person = people[c.person];
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => setSel(c.id)}
                          className={`relative flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors duration-150 ${
                            on ? "bg-paper-2" : "hover:bg-paper-2/60"
                          }`}
                        >
                          {on ? (
                            <span className="absolute left-0 top-1/2 h-[24px] w-[2px] -translate-y-1/2 rounded-full bg-accent" />
                          ) : null}
                          <span className="num w-[38px] shrink-0 pt-[1px] text-[12px] text-ink-3">
                            {c.at}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium leading-snug text-ink">
                              {person.name}
                            </span>
                            <span className="block truncate text-[12px] leading-snug text-ink-3">
                              {c.purpose}
                            </span>
                          </span>
                          <span className="shrink-0 pt-[1px] text-right">
                            {c.duration ? (
                              <span className="num block text-[12px] text-ink-2">
                                {c.duration}
                              </span>
                            ) : (
                              <span className="num block text-[12px] text-ink-3">
                                {c.attempt}
                              </span>
                            )}
                            <span
                              className={`mt-1 block text-[10.5px] font-semibold uppercase tracking-[0.06em] ${
                                c.outcome === "answered"
                                  ? "text-ok-ink"
                                  : "text-stop-ink"
                              }`}
                            >
                              {c.outcome === "answered" ? "answered" : "no answer"}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </Reveal>
        </div>

        {/* Detail */}
        <div className="min-w-0 lg:col-span-7">
          <Reveal delay={0.08}>
            {!call ? (
              <Panel>
                <Empty
                  icon={ClockCountdown}
                  title="Pick a call"
                  detail="Choose any call on the left to hear the recording and read the transcript."
                />
              </Panel>
            ) : (
              <div className="space-y-6">
                <Panel>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => open("contact", call.person)}
                      className="min-w-0 rounded-[6px] text-left transition-opacity hover:opacity-70"
                    >
                      <PersonInline id={call.person} size={34} />
                      <p className="num mt-3 text-[12.5px] text-ink-3">{p.phone}</p>
                    </button>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <CallOutcome outcome={call.outcome} />
                      {call.scheduled ? (
                        <Badge tone="mute">Scheduled call</Badge>
                      ) : null}
                      {call.attempt ? (
                        <span className="num text-[11.5px] text-ink-3">
                          Attempt {call.attempt}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-4 sm:grid-cols-3">
                    <div>
                      <dt className="label">Reason</dt>
                      <dd className="mt-0.5 text-[12.5px] text-ink">{call.purpose}</dd>
                    </div>
                    <div>
                      <dt className="label">Placed at</dt>
                      <dd className="num mt-0.5 text-[12.5px] text-ink">
                        {call.at} {NOW.zone}
                      </dd>
                    </div>
                    <div>
                      <dt className="label">Language</dt>
                      <dd className="mt-0.5 text-[12.5px] text-ink">
                        {call.language}
                      </dd>
                    </div>
                    {call.meeting ? (
                      <div className="col-span-2 sm:col-span-3">
                        <dt className="label">Meeting</dt>
                        <dd className="mt-0.5 text-[12.5px] text-ink">
                          {call.meeting}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {call.recording ? (
                    <div className="mt-5">
                      <RecordingPlayer call={call} />
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[10px] border border-line bg-paper-2 px-4 py-5">
                      <p className="text-[12.5px] leading-relaxed text-ink-2">
                        The call was not answered, so there is no recording. The
                        attempt is still logged with its time and outcome.
                      </p>
                      <div className="mt-3">
                        <Button
                          icon={PhoneCall}
                          disabled={paused}
                          onClick={() =>
                            toast(`Calling ${p.name.split(" ")[0]} again now.`)
                          }
                        >
                          Try again
                        </Button>
                      </div>
                    </div>
                  )}

                  {call.notes ? (
                    <p className="mt-5 border-t border-line pt-4 text-[12.5px] leading-relaxed text-ink-2">
                      <span className="label mr-2">Outcome</span>
                      {call.notes}
                    </p>
                  ) : null}
                </Panel>

                {call.transcript ? (
                  <Panel flush>
                    <PanelBar
                      title="Transcript"
                      meta="Word for word, in the language the call was held in"
                      action={
                        <Button
                          icon={Export}
                          onClick={() => toast("Transcript copied to the clipboard.")}
                        >
                          Copy
                        </Button>
                      }
                    />
                    <div className="p-6">
                      <Transcript
                        lines={call.transcript}
                        other={p.name.split(" ")[0]}
                      />
                    </div>
                  </Panel>
                ) : null}

                <Panel className="bg-paper-2">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={17}
                      weight="bold"
                      className="mt-[2px] shrink-0 text-ink-2"
                    />
                    <p className="text-[12.5px] leading-relaxed text-ink-2">
                      Every call opens by saying it is an automated assistant
                      calling for Mr. Bhaskar Arya. The assistant can confirm
                      attendance and nothing else. If the other side raises
                      price, scope or payment, the call is summarised and sent to
                      you instead.
                    </p>
                  </div>
                </Panel>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </>
  );
}
