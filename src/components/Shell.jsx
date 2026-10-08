import { motion, useReducedMotion } from "motion/react";
import {
  SquaresFour,
  CalendarDots,
  PhoneCall,
  AddressBook,
  ListChecks,
  EnvelopeSimple,
  ClockCountdown,
  SlidersHorizontal,
  Broadcast,
  MagnifyingGlass,
  SidebarSimple,
  SignOut,
  Pause,
  Play,
  WarningCircle,
} from "@phosphor-icons/react";
import { NOW, ORG } from "../data/mock";
import { useApp } from "../state";
import { Switch, Button } from "./ui";

export const NAV = [
  { id: "today", label: "Today", icon: SquaresFour, group: "main" },
  { id: "meetings", label: "Meetings", icon: CalendarDots, group: "main" },
  { id: "calls", label: "Calls and recordings", icon: PhoneCall, group: "main" },
  { id: "contacts", label: "Contacts", icon: AddressBook, group: "main" },
  { id: "tasks", label: "Task follow-up", icon: ListChecks, group: "followup" },
  { id: "email", label: "Email briefing", icon: EnvelopeSimple, group: "followup" },
  {
    id: "scheduled",
    label: "Scheduled calls",
    icon: ClockCountdown,
    group: "followup",
  },
  { id: "controls", label: "Controls", icon: SlidersHorizontal, group: "admin" },
];

const RAIL_OPEN = 240;
const RAIL_SHUT = 64;

function NavItem({ item, active, open, onClick }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-[6px] py-[8px] text-left text-[13px] transition-colors duration-150 ${
        open ? "px-2.5" : "justify-center px-0"
      } ${
        active
          ? "bg-rail-3 font-medium text-rail-text-strong"
          : "text-rail-text hover:bg-rail-2 hover:text-rail-text-strong"
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 h-[16px] w-[2px] -translate-y-1/2 rounded-full bg-accent-lift transition-opacity duration-150 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
      <Icon size={17} weight="bold" className="shrink-0" />
      {open ? <span className="flex-1 truncate">{item.label}</span> : null}

      {/* Tooltip, only needed once the rail is collapsed */}
      {!open ? (
        <span className="pointer-events-none absolute left-[calc(100%+8px)] z-50 hidden whitespace-nowrap rounded-[6px] border border-rail-line bg-rail px-2.5 py-1.5 text-[12px] text-rail-text-strong opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 lg:block">
          {item.label}
        </span>
      ) : null}
    </button>
  );
}

function Rail() {
  const { view, navigate, railOpen, setRailOpen, account, signOut } = useApp();
  const reduce = useReducedMotion();
  const open = railOpen;

  const main = NAV.filter((n) => n.group === "main");
  const followup = NAV.filter((n) => n.group === "followup");
  const controls = NAV.find((n) => n.id === "controls");

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? RAIL_OPEN : RAIL_SHUT }}
      transition={
        reduce ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
      }
      className="sticky top-0 hidden h-[100dvh] shrink-0 flex-col overflow-hidden bg-rail lg:flex"
    >
      <div
        className={`flex h-[60px] shrink-0 items-center border-b border-rail-line ${
          open ? "justify-between px-4" : "justify-center px-0"
        }`}
      >
        {open ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="truncate text-[13px] font-semibold uppercase tracking-[0.16em] text-rail-text-strong">
              Sparrow
            </span>
            <span className="h-3 w-px shrink-0 bg-rail-line" />
            <span className="truncate text-[12.5px] text-rail-text">
              Assistant
            </span>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setRailOpen(!open)}
          aria-label={open ? "Collapse the menu" : "Expand the menu"}
          aria-expanded={open}
          className="shrink-0 rounded-[6px] p-1.5 text-rail-text transition-colors duration-150 hover:bg-rail-2 hover:text-rail-text-strong"
        >
          <SidebarSimple size={17} weight="bold" />
        </button>
      </div>

      <nav className="rail-scroll flex-1 overflow-y-auto overflow-x-visible px-3 py-4">
        <div className="space-y-1">
          {main.map((n) => (
            <NavItem
              key={n.id}
              item={n}
              open={open}
              active={view === n.id}
              onClick={() => navigate(n.id)}
            />
          ))}
        </div>

        <div className="my-4 border-t border-rail-line" />
        {open ? (
          <p className="mb-2 px-2.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-rail-text/70">
            Follow-ups
          </p>
        ) : null}
        <div className="space-y-1">
          {followup.map((n) => (
            <NavItem
              key={n.id}
              item={n}
              open={open}
              active={view === n.id}
              onClick={() => navigate(n.id)}
            />
          ))}
        </div>

        <div className="my-4 border-t border-rail-line" />
        <NavItem
          item={controls}
          open={open}
          active={view === "controls"}
          onClick={() => navigate("controls")}
        />
      </nav>

      {/* Who the console is being used as */}
      <div className="shrink-0 border-t border-rail-line p-3">
        {open ? (
          <div className="flex items-center gap-2.5 rounded-[6px] px-1.5 py-1">
            <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-rail-3 text-[11px] font-semibold text-rail-text-strong">
              {account.label
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-medium leading-tight text-rail-text-strong">
                {account.label}
              </span>
              <span className="block truncate text-[11px] leading-tight text-rail-text">
                {account.role}
              </span>
            </span>
            <button
              type="button"
              onClick={signOut}
              aria-label="Sign out"
              title="Sign out"
              className="shrink-0 rounded-[6px] p-1.5 text-rail-text transition-colors duration-150 hover:bg-rail-2 hover:text-rail-text-strong"
            >
              <SignOut size={15} weight="bold" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            title="Sign out"
            className="flex w-full justify-center rounded-[6px] p-2 text-rail-text transition-colors duration-150 hover:bg-rail-2 hover:text-rail-text-strong"
          >
            <SignOut size={16} weight="bold" />
          </button>
        )}
      </div>
    </motion.aside>
  );
}

function TopBar() {
  const { view, navigate, setSearchOpen, paused, setPaused, toast } = useApp();

  const togglePause = (next) => {
    setPaused(!next);
    toast(
      next
        ? "Assistant resumed. Queued reminders and calls will run."
        : "Assistant paused. Every queued message and call is on hold.",
      next ? "ok" : "warn",
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center gap-3 border-b border-line bg-paper/92 px-4 backdrop-blur-sm sm:gap-4 sm:px-5 lg:px-8">
      <div className="flex shrink-0 items-center gap-2.5 lg:hidden">
        <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-ink">
          Sparrow
        </span>
      </div>

      <select
        value={view}
        onChange={(e) => navigate(e.target.value)}
        aria-label="Choose a screen"
        className="min-w-0 max-w-[150px] flex-1 truncate rounded-[6px] border border-line bg-surface px-2 py-[6px] text-[12.5px] text-ink sm:max-w-[200px] sm:px-2.5 lg:hidden"
      >
        {NAV.map((n) => (
          <option key={n.id} value={n.id}>
            {n.label}
          </option>
        ))}
      </select>

      {/* Search opens the palette. Also bound to the / key. */}
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="hidden min-w-0 items-center gap-2.5 rounded-[6px] border border-line bg-surface px-3 py-[7px] text-left transition-colors duration-150 hover:border-line-strong hover:bg-paper-2 lg:flex lg:w-[320px]"
      >
        <MagnifyingGlass size={15} weight="bold" className="shrink-0 text-ink-3" />
        <span className="flex-1 truncate text-[12.5px] text-ink-3">
          Search meetings, people, calls
        </span>
        <kbd className="num shrink-0 rounded-[4px] border border-line bg-paper-2 px-1.5 py-[1px] text-[10.5px] text-ink-3">
          /
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-3 lg:gap-4">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="rounded-[6px] border border-line bg-surface p-[7px] text-ink-3 transition-colors hover:text-ink lg:hidden"
        >
          <MagnifyingGlass size={15} weight="bold" />
        </button>

        <span className="hidden rounded-[4px] border border-line-strong px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3 sm:inline">
          Demo data
        </span>

        <span className="hidden items-baseline gap-2 text-[12.5px] text-ink-3 xl:flex">
          <span>{NOW.label}</span>
          <span className="num font-medium text-ink">{NOW.clock}</span>
          <span>{NOW.zone}</span>
        </span>

        <span
          className={`flex items-center gap-2 rounded-[6px] border px-2.5 py-[5px] transition-colors duration-200 ${
            paused
              ? "border-wait-ink/25 bg-wait-soft"
              : "border-line bg-surface"
          }`}
        >
          <Broadcast
            size={14}
            weight="bold"
            className={paused ? "text-wait-ink" : "text-accent"}
          />
          <span
            className={`hidden text-[12px] font-medium sm:inline ${
              paused ? "text-wait-ink" : "text-ink"
            }`}
          >
            {paused ? "Paused" : "Running"}
          </span>
          <Switch
            on={!paused}
            onChange={togglePause}
            label=""
            id="assistant-master"
          />
        </span>
      </div>
    </header>
  );
}

/* Shown under the header whenever the assistant is held. */
function PausedBanner() {
  const { paused, setPaused, toast } = useApp();
  const reduce = useReducedMotion();
  if (!paused) return null;
  return (
    <motion.div
      initial={reduce ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      className="overflow-hidden border-b border-wait-ink/20 bg-wait-soft"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 lg:px-8">
        <p className="flex items-center gap-2 text-[12.5px] text-wait-ink">
          <WarningCircle size={15} weight="bold" className="shrink-0" />
          <span>
            The assistant is paused. No reminders, calls or escalations will go
            out until you resume it.
          </span>
        </p>
        <Button
          icon={Play}
          onClick={() => {
            setPaused(false);
            toast("Assistant resumed. Queued reminders and calls will run.");
          }}
        >
          Resume
        </Button>
      </div>
    </motion.div>
  );
}

export default function Shell({ children }) {
  return (
    <div className="flex min-h-[100dvh]">
      <Rail />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <PausedBanner />
        <main className="flex-1 px-4 py-7 sm:px-5 lg:px-8 lg:py-9">
          <div className="mx-auto max-w-[1180px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
