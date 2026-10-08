import { useState } from "react";
import {
  Table,
  ArrowsClockwise,
  ArrowUpRight,
  WarningCircle,
  MagnifyingGlass,
  CaretRight,
} from "@phosphor-icons/react";
import { peopleList } from "../data/mock";
import {
  Panel,
  PanelBar,
  PageHead,
  Badge,
  Button,
  Reveal,
  Avatar,
  Stat,
  Empty,
} from "../components/ui";
import { useApp } from "../state";

/*
  Per-contact calling status. Anything other than allowed is a gate the
  assistant respects before it dials.
*/
const STATUS = {
  /* Added this morning, not yet released by the EA, so never dialled. */
  nitin: { tone: "wait", label: "Held for approval" },
  /* Attends on the invite and the WhatsApp link, but is never called. */
  rajat: { tone: "mute", label: "Do not call" },
};

const KIND_LABEL = { internal: "Internal", client: "Client", vendor: "Vendor" };

const TABS = [
  { id: "all", label: "Everyone", test: () => true },
  { id: "internal", label: "Internal", test: (p) => p.kind === "internal" },
  { id: "external", label: "Client and vendor", test: (p) => p.kind !== "internal" },
  { id: "gated", label: "Gated", test: (p) => Boolean(STATUS[p.id]) },
];

export default function Contacts() {
  const { open, toast } = useApp();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const active = TABS.find((t) => t.id === tab);
  const rows = peopleList
    .filter(active.test)
    .filter((p) =>
      q.trim()
        ? `${p.name} ${p.role} ${p.org} ${p.phone}`
            .toLowerCase()
            .includes(q.trim().toLowerCase())
        : true,
    );

  const externals = peopleList.filter((p) => p.kind !== "internal").length;

  return (
    <>
      <PageHead
        title="Contacts"
        meta="The assistant reads names, emails and phone numbers from one Google Sheet that Onkar keeps. It never invents a number, and it never guesses between two people with the same name."
        action={
          <Button
            icon={ArrowUpRight}
            onClick={() => toast("Opening the Contacts Directory sheet.")}
          >
            Open the sheet
          </Button>
        }
      />

      <div className="space-y-6">
        <Reveal>
          <Panel className="py-5">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <dl className="grid flex-1 grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-line">
                <div className="sm:pr-6">
                  <Stat value={peopleList.length} label="Contacts" />
                </div>
                <div className="sm:px-6">
                  <Stat value={externals} label="Client and vendor" />
                </div>
                <div className="sm:px-6">
                  <Stat value="1" label="Held for approval" tone="accent" />
                </div>
                <div className="sm:pl-6">
                  <Stat value="07:34" label="Last synced" sub="2 numbers updated" />
                </div>
              </dl>
              <Button
                icon={ArrowsClockwise}
                onClick={() => toast("Contacts Directory synced. No changes found.")}
              >
                Sync now
              </Button>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.05}>
          <Panel flush>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-paper-2 px-6 py-3.5">
              <div className="flex flex-wrap gap-1">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`rounded-[6px] px-2.5 py-[5px] text-[12.5px] transition-colors duration-150 ${
                      tab === t.id
                        ? "bg-ink font-medium text-paper"
                        : "text-ink-3 hover:bg-paper-3 hover:text-ink"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex min-w-0 items-center gap-2 rounded-[6px] border border-line bg-surface px-2.5 py-[5px]">
                <MagnifyingGlass
                  size={13}
                  weight="bold"
                  className="shrink-0 text-ink-3"
                />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter by name or number"
                  aria-label="Filter contacts"
                  className="w-[180px] min-w-0 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-3"
                />
              </div>
            </div>

            {rows.length === 0 ? (
              <Empty
                icon={MagnifyingGlass}
                title="No contacts match"
                detail="Try a different name, number or filter."
                action={
                  <Button
                    onClick={() => {
                      setQ("");
                      setTab("all");
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="label px-6 py-2.5 text-left">Name</th>
                      <th className="label px-4 py-2.5 text-left">Role</th>
                      <th className="label px-4 py-2.5 text-left">Phone</th>
                      <th className="label px-4 py-2.5 text-left">Type</th>
                      <th className="label px-6 py-2.5 text-right">Calling</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {rows.map((p) => {
                      const st = STATUS[p.id];
                      return (
                        <tr
                          key={p.id}
                          onClick={() => open("contact", p.id)}
                          className="group cursor-pointer transition-colors duration-150 hover:bg-paper-2"
                        >
                          <td className="px-6 py-3">
                            <span className="flex items-center gap-2.5">
                              <Avatar person={p} size={28} />
                              <span className="min-w-0">
                                <span className="block truncate text-[13px] font-medium leading-tight text-ink">
                                  {p.name}
                                </span>
                                <span className="num block truncate text-[11px] leading-tight text-ink-3">
                                  {p.email}
                                </span>
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[12.5px] text-ink-2">
                            <span className="block leading-tight">{p.role}</span>
                            {p.kind !== "internal" ? (
                              <span className="block text-[11.5px] leading-tight text-ink-3">
                                {p.org}
                              </span>
                            ) : null}
                          </td>
                          <td className="num px-4 py-3 text-[12.5px] text-ink-2">
                            {p.phone}
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone="mute">{KIND_LABEL[p.kind]}</Badge>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <span className="inline-flex items-center gap-2">
                              {st ? (
                                <Badge tone={st.tone}>{st.label}</Badge>
                              ) : (
                                <span className="text-[12.5px] text-ink-3">
                                  Allowed
                                </span>
                              )}
                              <CaretRight
                                size={13}
                                weight="bold"
                                className="text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
                              />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-start gap-3 border-t border-line bg-paper-2 px-6 py-4">
              <WarningCircle
                size={15}
                weight="bold"
                className="mt-[2px] shrink-0 text-wait-ink"
              />
              <p className="max-w-[86ch] text-[12px] leading-relaxed text-ink-2">
                A new client or vendor number stays on hold until Onkar
                releases it, so the assistant never cold calls someone added to
                the sheet by mistake. If an attendee on an invite has no number
                at all, Onkar is told rather than the invite being skipped
                quietly.
              </p>
            </div>
          </Panel>
        </Reveal>
      </div>
    </>
  );
}
