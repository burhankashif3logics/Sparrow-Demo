import { useState } from "react";
import {
  WhatsappLogo,
  PhoneCall,
  ArrowsClockwise,
  ArrowUpRight,
  CaretDown,
  Gear,
} from "@phosphor-icons/react";
import { tasks, taskStateLabel, taskThread, people } from "../data/mock";
import {
  Panel,
  PanelBar,
  PageHead,
  Badge,
  Button,
  Reveal,
  Stat,
} from "../components/ui";
import { PersonInline } from "../components/pieces";
import { useApp } from "../state";

const TONE = {
  delayed: "stop",
  "in-progress": "ok",
  "awaiting-date": "wait",
  "not-started": "mute",
};

function Thread({ lines }) {
  return (
    <ol className="mt-4 space-y-3 border-t border-line pt-4">
      {lines.map((l, i) => {
        const bot = l.who === "assistant";
        const Icon = l.via === "call" ? PhoneCall : WhatsappLogo;
        return (
          <li key={i} className="flex gap-3">
            <span className="num w-[86px] shrink-0 pt-[2px] text-[11px] text-ink-3">
              {l.at}
            </span>
            <span
              className={`mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
                l.via === "system"
                  ? "bg-paper-3 text-ink-3"
                  : bot
                    ? "bg-ink text-paper"
                    : "border border-line-strong bg-surface text-ink-2"
              }`}
            >
              {l.via === "system" ? (
                <Gear size={10} weight="bold" />
              ) : (
                <Icon size={10} weight="bold" />
              )}
            </span>
            <span
              className={`max-w-[66ch] text-[12.5px] leading-relaxed ${
                l.via === "system"
                  ? "text-ink-3"
                  : bot
                    ? "text-ink"
                    : "text-ink-2"
              }`}
            >
              {l.text}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function Tasks() {
  const { toast, paused } = useApp();
  const [expanded, setExpanded] = useState("t1");

  const delayed = tasks.filter((t) => t.state === "delayed");
  const waiting = tasks.filter((t) => t.state === "awaiting-date");
  const onTrack = tasks.filter((t) => t.state === "in-progress");

  return (
    <>
      <PageHead
        title="Task follow-up"
        meta="The assistant reads the EA Delegation sheet, asks each person for a date, chases them on that date, and calls anyone who does not reply. Site teams miss messages but answer calls, so follow-up here is call-first."
        action={
          <Button
            icon={ArrowUpRight}
            onClick={() => toast("Opening the EA Delegation sheet.")}
          >
            Open the sheet
          </Button>
        }
      />

      <Reveal>
        <Panel className="mb-6 py-5">
          <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-line">
            <div className="sm:pr-6">
              <Stat value={tasks.length} label="Open tasks" />
            </div>
            <div className="sm:px-6">
              <Stat value={delayed.length} label="Delayed" tone="accent" />
            </div>
            <div className="sm:px-6">
              <Stat value={waiting.length} label="No date yet" />
            </div>
            <div className="sm:pl-6">
              <Stat value={onTrack.length} label="On track" />
            </div>
          </dl>
        </Panel>
      </Reveal>

      <Reveal delay={0.05}>
        <Panel flush>
          <PanelBar
            title="Delegated work"
            meta="One row per task, with the latest answer the assistant collected"
            action={<Badge tone="mute">Daily report at 18:00</Badge>}
          />

          <ul className="divide-y divide-line">
            {tasks.map((t) => {
              const byCall = t.lastContact.startsWith("Call");
              const thread = taskThread[t.id];
              const isOpen = expanded === t.id;
              const p = people[t.person];
              return (
                <li
                  key={t.id}
                  className={`px-6 py-5 ${t.state === "delayed" ? "bg-stop-soft/25" : ""}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Badge tone={TONE[t.state]}>{taskStateLabel[t.state]}</Badge>
                        <span className="num text-[11.5px] text-ink-3">
                          due {t.due}
                        </span>
                        {t.revised ? (
                          <span className="num flex items-center gap-1 text-[11.5px] font-medium text-wait-ink">
                            <ArrowsClockwise size={11} weight="bold" />
                            moved to {t.revised}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 max-w-[70ch] text-[14px] font-medium leading-snug text-ink">
                        {t.task}
                      </p>

                      {t.reason ? (
                        <p className="mt-2 max-w-[70ch] text-[12.5px] leading-relaxed text-ink-2">
                          <span className="label mr-2">Reason given</span>
                          {t.reason}
                        </p>
                      ) : null}

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1.5 text-[12px] text-ink-3">
                          {byCall ? (
                            <PhoneCall size={12} weight="bold" />
                          ) : (
                            <WhatsappLogo size={12} weight="bold" />
                          )}
                          {t.lastContact}
                        </span>
                        {thread ? (
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : t.id)}
                            aria-expanded={isOpen}
                            className="flex items-center gap-1 text-[12px] font-medium text-ink-2 transition-colors hover:text-ink"
                          >
                            {isOpen ? "Hide" : "Show"} the full exchange
                            <CaretDown
                              size={11}
                              weight="bold"
                              className={`transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                      <PersonInline id={t.person} size={28} />
                      <div className="flex gap-2">
                        <Button
                          icon={PhoneCall}
                          disabled={paused}
                          onClick={() =>
                            toast(`Calling ${p.name.split(" ")[0]} about this task.`)
                          }
                        >
                          Call now
                        </Button>
                        <Button
                          onClick={() => toast("Task marked complete and closed.")}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isOpen && thread ? <Thread lines={thread} /> : null}
                </li>
              );
            })}
          </ul>

          <div className="border-t border-line bg-paper-2 px-6 py-4">
            <p className="max-w-[88ch] text-[12px] leading-relaxed text-ink-2">
              Tasks are added the same way meetings are: send a WhatsApp note
              such as "Ask Kasim to resend the invoice to the client by Friday"
              and the row is written to the existing sheet. Your current columns
              are not changed, only added to. Replies in English, Hindi or
              Hinglish are read for the date, and "kal" or "Friday" both work.
            </p>
          </div>
        </Panel>
      </Reveal>
    </>
  );
}
