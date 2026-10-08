import { useState } from "react";
import { Lock, CaretRight, EnvelopeSimple, Check } from "@phosphor-icons/react";
import { emails, people } from "../data/mock";
import {
  Panel,
  PanelBar,
  PanelHead,
  PageHead,
  Badge,
  Button,
  Reveal,
  Avatar,
  Stat,
  Empty,
} from "../components/ui";
import { useApp } from "../state";

export default function Email() {
  const { toast } = useApp();
  const [cleared, setCleared] = useState({});
  const openList = emails.filter((e) => !cleared[e.id]);

  return (
    <>
      <PageHead
        title="Email briefing"
        meta="Only the mail that needs a decision from you, summarised on WhatsApp within five minutes of arriving. Newsletters, promotions and system mail are left alone."
      />

      <Reveal>
        <Panel className="mb-6 py-5">
          <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-line">
            <div className="sm:pr-6">
              <Stat value="138" label="Mail received today" />
            </div>
            <div className="sm:px-6">
              <Stat value={emails.length} label="Needed your attention" tone="accent" />
            </div>
            <div className="sm:px-6">
              <Stat value={openList.length} label="Still open" />
            </div>
            <div className="sm:pl-6">
              <Stat value="4m" label="Average time to brief" sub="after it arrives" />
            </div>
          </dl>
        </Panel>
      </Reveal>

      {openList.length === 0 ? (
        <Panel>
          <Empty
            icon={EnvelopeSimple}
            title="Nothing left to decide"
            detail="Every briefed email has been cleared. New mail will appear here within five minutes of arriving."
            action={<Button onClick={() => setCleared({})}>Restore the list</Button>}
          />
        </Panel>
      ) : (
        <div className="space-y-4">
          {openList.map((e, i) => {
            const p = people[e.from];
            return (
              <Reveal key={e.id} delay={i * 0.04}>
                <Panel flush>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-paper-2 px-6 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar person={p} size={28} />
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold leading-tight text-ink">
                          {p.name}
                        </p>
                        <p className="truncate text-[11.5px] leading-tight text-ink-3">
                          {p.org}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <Badge tone="mute">{e.reason}</Badge>
                      <span className="num text-[11.5px] text-ink-3">{e.at}</span>
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <h2 className="max-w-[62ch] text-[17px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                      {e.subject}
                    </h2>
                    <p className="mt-2 max-w-[76ch] text-[13px] leading-relaxed text-ink-2">
                      {e.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[6px] border border-line bg-paper px-4 py-3">
                      <div className="min-w-0">
                        <p className="label">What it needs from you</p>
                        <p className="mt-1 text-[13px] font-semibold text-ink">
                          {e.action}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="num rounded-full bg-wait-soft px-2.5 py-[3px] text-[11.5px] font-semibold text-wait-ink">
                          by {e.deadline}
                        </span>
                        <Button
                          icon={Check}
                          onClick={() => {
                            setCleared((c) => ({ ...c, [e.id]: true }));
                            toast("Marked as handled and cleared from the briefing.");
                          }}
                        >
                          Handled
                        </Button>
                        <Button
                          variant="solid"
                          icon={CaretRight}
                          onClick={() => toast("Opening the thread in Outlook.")}
                        >
                          Open in Outlook
                        </Button>
                      </div>
                    </div>
                  </div>
                </Panel>
              </Reveal>
            );
          })}
        </div>
      )}

      <Reveal delay={0.1}>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel>
            <PanelHead
              title="How mail gets picked"
              meta="Any one of these is enough to brief you"
            />
            <ol className="mt-4 space-y-3">
              {[
                "The sender is on the VIP list Onkar keeps",
                "Outlook itself marks the mail as high importance",
                "The text contains an action or a deadline aimed at you",
              ].map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="num mt-[1px] shrink-0 text-[11.5px] text-ink-3">
                    {i + 1}
                  </span>
                  <span className="text-[13px] leading-relaxed text-ink-2">{r}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel className="bg-paper-2">
            <div className="flex items-start gap-3">
              <Lock size={17} weight="bold" className="mt-[2px] shrink-0 text-ink-2" />
              <div>
                <h2 className="text-[13.5px] font-semibold text-ink">
                  What it will not touch
                </h2>
                <ul className="mt-2.5 space-y-1.5">
                  {[
                    "No replies, no forwards, no drafts",
                    "Nothing moved, archived or deleted",
                    "Newsletters, promotions and system mail ignored",
                    "Read access only, and your MIS team can withdraw it",
                  ].map((t) => (
                    <li
                      key={t}
                      className="flex gap-2 text-[12.5px] leading-relaxed text-ink-2"
                    >
                      <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-line-strong" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>
        </div>
      </Reveal>
    </>
  );
}
