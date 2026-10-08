import { useState } from "react";
import { Plus, Play, ArrowUpRight, X } from "@phosphor-icons/react";
import { scheduledCalls, people } from "../data/mock";
import {
  Panel,
  PanelBar,
  PageHead,
  Badge,
  Button,
  Reveal,
  Avatar,
  Stat,
} from "../components/ui";
import { useApp } from "../state";

export default function Scheduled() {
  const { open, toast, paused } = useApp();
  const [cancelled, setCancelled] = useState({});

  const rows = scheduledCalls.map((s) =>
    cancelled[s.id] ? { ...s, state: "cancelled" } : s,
  );
  const queued = rows.filter((r) => r.state === "scheduled").length;

  return (
    <>
      <PageHead
        title="Scheduled calls"
        meta="Write a row with a name, a time and what to discuss, and the assistant places that call and brings back a summary. It is the only way an outbound call can be started on your behalf."
        action={
          <Button
            icon={ArrowUpRight}
            onClick={() => toast("Opening the scheduled calls sheet.")}
          >
            Open the sheet
          </Button>
        }
      />

      <Reveal>
        <Panel className="mb-6 py-5">
          <dl className="grid grid-cols-3 gap-y-5 sm:divide-x sm:divide-line">
            <div className="sm:pr-6">
              <Stat value={queued} label="Queued" tone="accent" />
            </div>
            <div className="sm:px-6">
              <Stat
                value={rows.filter((r) => r.state === "completed").length}
                label="Completed today"
              />
            </div>
            <div className="sm:pl-6">
              <Stat value="2" label="Retries allowed" sub="15 minutes apart" />
            </div>
          </dl>
        </Panel>
      </Reveal>

      <Reveal delay={0.05}>
        <Panel flush>
          <PanelBar
            title="Queue"
            meta="Two retries at 15 minute gaps, then the EA is told"
            action={
              <Button
                icon={Plus}
                variant="solid"
                onClick={() => toast("Add a row to the sheet to schedule a call.")}
              >
                Add a call
              </Button>
            }
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="border-b border-line">
                  <th className="label px-6 py-2.5 text-left">When</th>
                  <th className="label px-4 py-2.5 text-left">Who</th>
                  <th className="label px-4 py-2.5 text-left">What to discuss</th>
                  <th className="label px-4 py-2.5 text-left">Status</th>
                  <th className="label px-6 py-2.5 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((s) => {
                  const p = people[s.person];
                  const done = s.state === "completed";
                  const off = s.state === "cancelled";
                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors duration-150 hover:bg-paper-2 ${
                        off ? "opacity-55" : ""
                      }`}
                    >
                      <td className="num px-6 py-3.5 text-[12.5px] text-ink">
                        {s.when}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => open("contact", s.person)}
                          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-70"
                        >
                          <Avatar person={p} size={26} />
                          <span className="min-w-0">
                            <span className="block truncate text-[12.5px] font-medium leading-tight text-ink">
                              {p.name}
                            </span>
                            <span className="block truncate text-[11.5px] leading-tight text-ink-3">
                              {p.org}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td className="max-w-[280px] px-4 py-3.5 text-[12.5px] leading-snug text-ink-2">
                        {s.topic}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone={done ? "ok" : off ? "stop" : "mute"}>
                          {done ? "Completed" : off ? "Cancelled" : "Scheduled"}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {done ? (
                          <span className="inline-flex items-center gap-2.5">
                            <span className="num text-[12px] text-ink-2">
                              {s.duration}
                            </span>
                            <Button
                              icon={Play}
                              onClick={() => toast("Playing the call recording.")}
                            >
                              Play
                            </Button>
                          </span>
                        ) : off ? (
                          <span className="text-[12.5px] text-ink-3">
                            Will not be placed
                          </span>
                        ) : (
                          <Button
                            icon={X}
                            disabled={paused}
                            onClick={() => {
                              setCancelled((c) => ({ ...c, [s.id]: true }));
                              toast(
                                `Call to ${p.name.split(" ")[0]} cancelled.`,
                                "warn",
                              );
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-line bg-paper-2 px-6 py-4">
            <p className="max-w-[88ch] text-[12px] leading-relaxed text-ink-2">
              The same limits apply as everywhere else. The assistant says who it
              is, says the call is recorded, discusses only the topic on the row,
              and agrees to nothing. Whatever the other side commits to is
              written back here with a transcript and a summary.
            </p>
          </div>
        </Panel>
      </Reveal>
    </>
  );
}
