import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  MagnifyingGlass,
  CalendarDots,
  PhoneCall,
  AddressBook,
  ArrowRight,
} from "@phosphor-icons/react";
import { meetings, peopleList, calls, people } from "../data/mock";
import { useApp } from "../state";

/* Flattens the demo data into one searchable list. */
function useIndex() {
  return useMemo(() => {
    const rows = [];
    meetings.forEach((m) =>
      rows.push({
        kind: "Meeting",
        icon: CalendarDots,
        title: m.title,
        sub: `${m.time} · ${m.attendees.length} attendees`,
        go: { type: "meeting", id: m.id },
        hay: `${m.title} ${m.time} ${m.kind}`,
      }),
    );
    peopleList.forEach((p) =>
      rows.push({
        kind: "Contact",
        icon: AddressBook,
        title: p.name,
        sub: p.kind === "internal" ? p.role : `${p.role}, ${p.org}`,
        go: { type: "contact", id: p.id },
        hay: `${p.name} ${p.role} ${p.org} ${p.email} ${p.phone}`,
      }),
    );
    calls.forEach((c) =>
      rows.push({
        kind: "Call",
        icon: PhoneCall,
        title: `${people[c.person].name} · ${c.purpose}`,
        sub: `${c.at} · ${c.duration ?? "no answer"}`,
        go: { type: "call", id: c.id },
        hay: `${people[c.person].name} ${c.purpose} ${c.at} ${c.meeting ?? ""}`,
      }),
    );
    return rows;
  }, []);
}

export default function CommandPalette() {
  const { searchOpen, setSearchOpen, open, navigate } = useApp();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const reduce = useReducedMotion();
  const index = useIndex();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return index.slice(0, 7);
    return index
      .filter((r) => r.hay.toLowerCase().includes(needle))
      .slice(0, 8);
  }, [q, index]);

  /* "/" opens the palette from anywhere that is not a text field. */
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target.tagName;
      const typing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable;
      if (e.key === "/" && !typing && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && searchOpen) setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setQ("");
      setCursor(0);
      // Focus after the entry transition so the caret does not jump
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const choose = (r) => {
    setSearchOpen(false);
    if (r.go.type === "call") {
      navigate("calls");
    } else {
      open(r.go.type, r.go.id);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      e.preventDefault();
      choose(results[cursor]);
    }
  };

  return (
    <AnimatePresence>
      {searchOpen ? (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-[2px]"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] overflow-hidden rounded-[10px] border border-line bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <MagnifyingGlass size={16} weight="bold" className="shrink-0 text-ink-3" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Search meetings, people and calls"
                className="w-full bg-transparent py-3.5 text-[14px] text-ink outline-none placeholder:text-ink-3"
              />
              <kbd className="num shrink-0 rounded-[4px] border border-line bg-paper-2 px-1.5 py-[1px] text-[10.5px] text-ink-3">
                esc
              </kbd>
            </div>

            {results.length === 0 ? (
              <p className="px-4 py-8 text-center text-[13px] text-ink-3">
                Nothing matches "{q}".
              </p>
            ) : (
              <ul className="max-h-[340px] overflow-y-auto py-1.5">
                {results.map((r, i) => {
                  const Icon = r.icon;
                  const active = i === cursor;
                  return (
                    <li key={`${r.kind}-${r.title}-${i}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setCursor(i)}
                        onClick={() => choose(r)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                          active ? "bg-paper-2" : ""
                        }`}
                      >
                        <Icon
                          size={15}
                          weight="bold"
                          className="shrink-0 text-ink-3"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium leading-tight text-ink">
                            {r.title}
                          </span>
                          <span className="block truncate text-[11.5px] leading-tight text-ink-3">
                            {r.kind} · {r.sub}
                          </span>
                        </span>
                        {active ? (
                          <ArrowRight
                            size={14}
                            weight="bold"
                            className="shrink-0 text-ink-3"
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex items-center gap-4 border-t border-line bg-paper-2 px-4 py-2.5 text-[11px] text-ink-3">
              <span className="num">up and down to move</span>
              <span className="num">enter to open</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
