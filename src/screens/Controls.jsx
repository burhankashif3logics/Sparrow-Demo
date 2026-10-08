import { useState } from "react";
import {
  Lock,
  ShieldCheck,
  Pause,
  Play,
  Export,
  Plugs,
  CheckCircle,
} from "@phosphor-icons/react";
import { controls, guardrails, connections } from "../data/mock";
import {
  Panel,
  PanelBar,
  PanelHead,
  PageHead,
  Button,
  Switch,
  Reveal,
  Badge,
} from "../components/ui";
import { useApp } from "../state";

export default function Controls() {
  const { paused, setPaused, toast, account } = useApp();
  const [edit, setEdit] = useState(null);

  return (
    <>
      <PageHead
        title="Controls"
        meta="Every timing, limit and rule the assistant follows. Change any of these and the next meeting uses the new setting. Nothing here is hidden from you."
        action={
          <Button
            icon={Export}
            onClick={() => toast("Settings exported as a PDF.")}
          >
            Export settings
          </Button>
        }
      />

      <div className="space-y-6">
        {/* The master switch gets its own treatment, inverted for weight. */}
        <Reveal>
          <Panel flush>
            <div
              className={`flex flex-wrap items-start justify-between gap-5 px-6 py-6 transition-colors duration-300 ${
                paused ? "bg-wait-soft" : "bg-rail"
              }`}
            >
              <div className="min-w-0 max-w-[62ch]">
                <h2
                  className={`text-[17px] font-semibold tracking-[-0.02em] ${
                    paused ? "text-wait-ink" : "text-rail-text-strong"
                  }`}
                >
                  {paused
                    ? "The assistant is paused"
                    : "The assistant is running"}
                </h2>
                <p
                  className={`mt-1.5 text-[13px] leading-relaxed ${
                    paused ? "text-wait-ink/85" : "text-rail-text"
                  }`}
                >
                  {paused
                    ? "Nothing is going out. Queued reminders, calls and escalations are all on hold until you resume."
                    : "Pause it and every queued message and call stops at once, including the ones already scheduled for later today. Your calendar and your contacts are left exactly as they are."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Switch
                  on={!paused}
                  onChange={(next) => {
                    setPaused(!next);
                    toast(
                      next
                        ? "Assistant resumed. Queued reminders and calls will run."
                        : "Assistant paused. Every queued message and call is on hold.",
                      next ? "ok" : "warn",
                    );
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setPaused(!paused);
                    toast(
                      paused
                        ? "Assistant resumed. Queued reminders and calls will run."
                        : "Assistant paused. Every queued message and call is on hold.",
                      paused ? "ok" : "warn",
                    );
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-[6px] px-3 py-[8px] text-[12.5px] font-medium transition-colors duration-150 ${
                    paused
                      ? "bg-ink text-paper hover:bg-[#2d2922]"
                      : "border border-rail-line text-rail-text hover:bg-rail-2 hover:text-rail-text-strong"
                  }`}
                >
                  {paused ? (
                    <>
                      <Play size={14} weight="bold" />
                      Resume everything
                    </>
                  ) : (
                    <>
                      <Pause size={14} weight="bold" />
                      Pause everything
                    </>
                  )}
                </button>
              </div>
            </div>
          </Panel>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-7">
            {controls.map((group, gi) => {
              const editing = edit === group.group;
              return (
                <Reveal key={group.group} delay={0.05 + gi * 0.04}>
                  <Panel flush>
                    <PanelBar
                      title={group.group}
                      action={
                        <Button
                          onClick={() => {
                            if (editing) {
                              setEdit(null);
                              toast(`${group.group} saved. It applies from the next meeting.`);
                            } else {
                              setEdit(group.group);
                            }
                          }}
                        >
                          {editing ? "Save changes" : "Change these"}
                        </Button>
                      }
                    />
                    <dl className="divide-y divide-line">
                      {group.items.map((it) => (
                        <div
                          key={it.label}
                          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3"
                        >
                          <dt className="max-w-[42ch] text-[13px] leading-snug text-ink-2">
                            {it.label}
                          </dt>
                          <dd className="text-right">
                            {editing ? (
                              <input
                                defaultValue={it.value}
                                aria-label={it.label}
                                className="w-[260px] max-w-full rounded-[6px] border border-accent bg-accent-soft/40 px-2.5 py-[5px] text-right text-[12.5px] font-medium text-ink outline-none"
                              />
                            ) : (
                              <span className="text-[13px] font-semibold text-ink">
                                {it.value}
                              </span>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </Panel>
                </Reveal>
              );
            })}

            <Reveal delay={0.2}>
              <Panel flush>
                <PanelBar
                  title="Connected systems"
                  meta="What the assistant reads from and writes to"
                  action={<Plugs size={15} weight="bold" className="text-ink-3" />}
                />
                <ul className="divide-y divide-line">
                  {connections.map((c) => (
                    <li
                      key={c.name}
                      className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-6 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium leading-tight text-ink">
                          {c.name}
                        </span>
                        <span className="block text-[11.5px] leading-tight text-ink-3">
                          {c.detail}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <span className="num text-[11.5px] text-ink-3">
                          {c.meta}
                        </span>
                        <Badge tone={c.state === "ok" ? "ok" : "mute"}>
                          {c.state === "ok" ? "Connected" : "Idle"}
                        </Badge>
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>
          </div>

          <div className="min-w-0 space-y-6 lg:col-span-5">
            {/* Guardrails. Deliberately not switchable, and shown that way. */}
            <Reveal delay={0.05}>
              <Panel flush>
                <PanelBar
                  title="Fixed limits"
                  meta="Built in. They cannot be switched off from here, by you or by anyone else."
                  action={<Badge tone="ink">Locked</Badge>}
                />
                <ul className="divide-y divide-line">
                  {guardrails.map((g) => (
                    <li key={g.label} className="flex gap-3 px-6 py-4">
                      <Lock
                        size={14}
                        weight="bold"
                        className="mt-[3px] shrink-0 text-ink-3"
                      />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold leading-snug text-ink">
                          {g.label}
                        </p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
                          {g.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>

            <Reveal delay={0.1}>
              <Panel flush>
                <PanelBar
                  title="Who can instruct it"
                  meta="Commands from any other number are ignored and logged"
                />
                <ul className="divide-y divide-line">
                  {[
                    {
                      who: "Bhaskar Arya",
                      what: "Schedule, cancel, override, pause",
                      me: account.id === "bhaskar",
                    },
                    {
                      who: "Omkar Sawant",
                      what: "Schedule, cancel, release new contacts",
                      me: account.id === "omkar",
                    },
                    {
                      who: "Anurag Deshpande",
                      what: "Technical alerts only",
                      me: false,
                    },
                  ].map((r) => (
                    <li key={r.who} className="flex items-start gap-3 px-6 py-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                          {r.who}
                          {r.me ? <Badge tone="accent">You</Badge> : null}
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-ink-2">{r.what}</p>
                      </div>
                      <CheckCircle
                        size={15}
                        weight="bold"
                        className="mt-[3px] shrink-0 text-ok-ink"
                      />
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>

            <Reveal delay={0.15}>
              <Panel className="bg-paper-2">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={17}
                    weight="bold"
                    className="mt-[2px] shrink-0 text-ink-2"
                  />
                  <div>
                    <h2 className="text-[13.5px] font-semibold text-ink">
                      Records and retention
                    </h2>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
                      Messages, calls, recordings, transcripts, responses and
                      failures are written to one log. You can read it here or as
                      a Google Sheet. Recordings are kept 90 days, written records
                      are kept indefinitely, and nothing is deleted inside that
                      window.
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
