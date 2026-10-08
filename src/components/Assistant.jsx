import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ChatCircleDots,
  X,
  PaperPlaneTilt,
  ArrowRight,
  PhoneCall,
  WhatsappLogo,
  ArrowsOut,
  ArrowSquareOut,
  ArrowsIn,
} from "@phosphor-icons/react";
import { answerQuestion, SUGGESTIONS } from "../lib/assistant";
import { meetings, people } from "../data/mock";
import { useApp } from "../state";

/* How many things are waiting on the owner right now, read from the data. */
function waitingCount() {
  const live = meetings.find((m) => m.state === "live");
  const stuck = live
    ? live.attendees.filter((a) => a.required && !a.joined && a.calls >= 2).length
    : 0;
  const noReply = meetings
    .filter((m) => m.state === "upcoming")
    .reduce(
      (n, m) => n + m.attendees.filter((a) => a.required && a.rsvp === "none").length,
      0,
    );
  return stuck + noReply;
}

function Dots() {
  const reduce = useReducedMotion();
  if (reduce) return <span className="text-[12px] text-ink-3">Thinking</span>;
  return (
    <span className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-[5px] w-[5px] rounded-full bg-ink-3"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </span>
  );
}

function Message({ m, onGo, onAct, wide = false }) {
  if (m.role === "user") {
    return (
      <li className="flex justify-end">
        <p
          className={`rounded-[10px] bg-ink px-3.5 py-2.5 text-[13px] leading-relaxed text-paper ${
            wide ? "max-w-[76%]" : "max-w-[85%]"
          }`}
        >
          {m.text}
        </p>
      </li>
    );
  }

  const a = m.answer;
  return (
    <li className="flex justify-start">
      <div
        className={`rounded-[10px] border border-line bg-surface px-3.5 py-3 ${
          wide ? "max-w-[88%]" : "max-w-[92%]"
        }`}
      >
        <p className="text-[13px] leading-relaxed text-ink">{a.text}</p>

        {a.bullets?.length ? (
          <ul className="mt-2.5 space-y-1.5">
            {a.bullets.map((b, i) => (
              <li
                key={i}
                className="flex gap-2 text-[12.5px] leading-relaxed text-ink-2"
              >
                <span className="mt-[7px] h-[3px] w-[3px] shrink-0 rounded-full bg-line-strong" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {a.footer ? (
          <p className="mt-2.5 border-t border-line pt-2.5 text-[12px] leading-relaxed text-ink-3">
            {a.footer}
          </p>
        ) : null}

        {a.action ? (
          <button
            type="button"
            onClick={() => onGo(a.action.go)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-[6px] border border-line bg-paper-2 px-2.5 py-[6px] text-[12px] font-medium text-ink transition-colors duration-150 hover:border-line-strong"
          >
            {a.action.label}
            <ArrowRight size={12} weight="bold" />
          </button>
        ) : null}

        {a.act ? (
          <button
            type="button"
            onClick={() => onAct(a.act)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-[6px] bg-ink px-2.5 py-[6px] text-[12px] font-medium text-paper transition-colors duration-150 hover:bg-[#2d2922]"
          >
            {a.act.kind === "call" ? (
              <PhoneCall size={12} weight="bold" />
            ) : (
              <WhatsappLogo size={12} weight="bold" />
            )}
            {a.act.label}
          </button>
        ) : null}
      </div>
    </li>
  );
}

/*
  `standalone` renders the assistant as a whole page, for the popped-out window.
  In that mode there is no launcher and no floating frame, and any "open the
  meeting" action is sent back to the console window that opened it.
*/
export default function Assistant({ standalone = false }) {
  const { open, navigate, toast, paused } = useApp();
  const [isOpen, setIsOpen] = useState(standalone);
  const [big, setBig] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState([
    {
      role: "bot",
      answer: {
        text: `Good afternoon. I have today's meetings, calls, recordings, tasks and contacts in front of me. Ask me anything about them.`,
        footer:
          "Everything I say comes from the record. If it is not there, I will tell you rather than guess.",
      },
    },
  ]);

  const scroller = useRef(null);
  const inputRef = useRef(null);
  const reduce = useReducedMotion();
  const waiting = waitingCount();

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    }
  }, [log, busy, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const ask = (text) => {
    const q = text.trim();
    if (!q || busy) return;
    setLog((l) => [...l, { role: "user", text: q }]);
    setDraft("");
    setBusy(true);
    // Brief pause so the answer does not snap in before the question is read
    setTimeout(() => {
      const answer = answerQuestion(q, { paused });
      setLog((l) => [...l, { role: "bot", answer }]);
      setBusy(false);
    }, 420);
  };

  const go = (target) => {
    /* From the popped-out window, drive the console window that opened this. */
    if (standalone) {
      try {
        window.opener?.postMessage({ source: "sparrow-assistant", go: target }, "*");
        window.opener?.focus();
      } catch {
        /* opener gone or cross origin: nothing to drive */
      }
      return;
    }
    setIsOpen(false);
    if (target.type === "view") navigate(target.id);
    else open(target.type, target.id);
  };

  const popOut = () => {
    const w = window.open(
      `${window.location.pathname}?assistant=1`,
      "sparrow-assistant",
      "width=520,height=760,menubar=no,toolbar=no,location=no,status=no",
    );
    if (w) {
      setIsOpen(false);
      w.focus();
    } else {
      toast("Your browser blocked the pop-up. Allow pop-ups to open it.", "warn");
    }
  };

  const act = (a) => {
    const p = people[a.personId];
    toast(
      a.kind === "call"
        ? `Calling ${p.name.split(" ")[0]} now. You will get the outcome on WhatsApp.`
        : `Message queued to ${p.name.split(" ")[0]}.`,
    );
    setLog((l) => [
      ...l,
      {
        role: "bot",
        answer: {
          text:
            a.kind === "call"
              ? `Calling ${p.name} now. I will tell you how it goes.`
              : `Message sent to ${p.name}.`,
        },
      },
    ]);
  };

  const header = (
    <header className="flex shrink-0 items-center justify-between gap-3 bg-rail px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-rail-text-strong">
          Ask the assistant
        </p>
        <p className="text-[11.5px] text-rail-text">
          {paused
            ? "Paused. It can answer, but not act."
            : "Answers from today's record"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        {standalone ? null : (
          <>
            <button
              type="button"
              onClick={() => setBig((b) => !b)}
              aria-label={big ? "Make the panel smaller" : "Make the panel bigger"}
              title={big ? "Smaller" : "Bigger"}
              className="hidden rounded-[6px] p-1.5 text-rail-text transition-colors hover:bg-rail-2 hover:text-rail-text-strong sm:block"
            >
              {big ? (
                <ArrowsIn size={15} weight="bold" />
              ) : (
                <ArrowsOut size={15} weight="bold" />
              )}
            </button>
            <button
              type="button"
              onClick={popOut}
              aria-label="Open in a separate window"
              title="Open in a separate window"
              className="hidden rounded-[6px] p-1.5 text-rail-text transition-colors hover:bg-rail-2 hover:text-rail-text-strong sm:block"
            >
              <ArrowSquareOut size={15} weight="bold" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="rounded-[6px] p-1.5 text-rail-text transition-colors hover:bg-rail-2 hover:text-rail-text-strong"
            >
              <X size={16} weight="bold" />
            </button>
          </>
        )}
      </div>
    </header>
  );

  const body = (
    <>
      {header}

      <div ref={scroller} className="flex-1 overflow-y-auto px-4 py-4">
        <ul className={`mx-auto space-y-3 ${standalone || big ? "max-w-[640px]" : ""}`}>
          {log.map((m, i) => (
            <Message key={i} m={m} onGo={go} onAct={act} wide={standalone || big} />
          ))}
          {busy ? (
            <li className="flex justify-start">
              <div className="rounded-[10px] border border-line bg-surface px-3.5 py-2.5">
                <Dots />
              </div>
            </li>
          ) : null}
        </ul>
      </div>

      {log.length <= 2 ? (
        <div className="shrink-0 border-t border-line bg-paper-2 px-4 py-3">
          <div className={`mx-auto ${standalone || big ? "max-w-[640px]" : ""}`}>
            <p className="label mb-2">Try asking</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="rounded-[6px] border border-line bg-surface px-2.5 py-[5px] text-[11.5px] text-ink-2 transition-colors duration-150 hover:border-line-strong hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(draft);
        }}
        className="shrink-0 border-t border-line bg-surface px-3 py-2.5"
      >
        <div
          className={`mx-auto flex items-center gap-2 ${
            standalone || big ? "max-w-[640px]" : ""
          }`}
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask about today"
            aria-label="Ask the assistant"
            className="min-w-0 flex-1 rounded-[6px] border border-line bg-paper px-2.5 py-[7px] text-[13px] text-ink transition-[border-color,box-shadow] placeholder:text-ink-3 focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] focus:outline-none focus-visible:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim() || busy}
            aria-label="Send"
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[6px] bg-ink text-paper transition-[background-color,opacity] duration-150 hover:bg-[#2d2922] disabled:opacity-35"
          >
            <PaperPlaneTilt size={15} weight="bold" />
          </button>
        </div>
      </form>
    </>
  );

  /* Popped-out window: the assistant is the whole page. */
  if (standalone) {
    return <div className="flex h-[100dvh] flex-col bg-paper">{body}</div>;
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Ask the assistant"
            className="fixed bottom-5 right-5 z-40 flex h-[52px] items-center gap-2.5 rounded-full bg-rail pl-4 pr-5 text-rail-text-strong shadow-lg transition-colors duration-150 hover:bg-rail-2"
          >
            <ChatCircleDots size={20} weight="bold" />
            <span className="text-[13px] font-medium">Ask</span>
            {waiting > 0 ? (
              <span className="num flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10.5px] font-semibold text-white">
                {waiting}
              </span>
            ) : null}
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Assistant"
            className={`fixed inset-x-3 bottom-3 top-[76px] z-40 flex flex-col overflow-hidden rounded-[10px] border border-line bg-paper shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:top-auto ${
              big
                ? "sm:h-[calc(100dvh-40px)] sm:w-[min(760px,calc(100vw-40px))]"
                : "sm:h-[660px] sm:max-h-[calc(100dvh-40px)] sm:w-[460px]"
            }`}
          >
            {body}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
