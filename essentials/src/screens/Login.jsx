import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Microphone,
  Lock,
  CheckCircle,
} from "@phosphor-icons/react";
import { useApp, ACCOUNTS } from "../state";
import { ORG, NOW } from "../data/mock";

const GUARANTEES = [
  {
    icon: Microphone,
    title: "Every call recorded and written down",
    body: "Recordings and full transcripts for 90 days, readable here and exportable.",
  },
  {
    icon: ShieldCheck,
    title: "It agrees to nothing on your behalf",
    body: "No price, no payment, no contract. Anything beyond attendance comes back to you.",
  },
  {
    icon: Lock,
    title: "One switch stops all of it",
    body: "Pause from the header and every queued message and call halts at once.",
  },
];

function RoleCard({ kind, picked, onPick }) {
  const a = ACCOUNTS[kind];
  const active = picked === kind;
  return (
    <button
      type="button"
      onClick={() => onPick(kind)}
      aria-pressed={active}
      className={`flex w-full items-center gap-3 rounded-[6px] border px-3.5 py-3 text-left transition-colors duration-150 ${
        active
          ? "border-accent bg-accent-soft"
          : "border-line bg-surface hover:border-line-strong hover:bg-paper-2"
      }`}
    >
      <span
        className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
          active ? "bg-accent text-white" : "bg-ink text-paper"
        }`}
      >
        {a.label
          .split(" ")
          .map((w) => w[0])
          .join("")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium leading-tight text-ink">
          {a.label}
        </span>
        <span className="block truncate text-[11.5px] leading-tight text-ink-3">
          {a.role}
        </span>
      </span>
      {active ? (
        <CheckCircle size={16} weight="fill" className="shrink-0 text-accent" />
      ) : null}
    </button>
  );
}

export default function Login() {
  const { signIn } = useApp();
  const [kind, setKind] = useState("md");
  const [busy, setBusy] = useState(false);
  const reduce = useReducedMotion();
  const account = ACCOUNTS[kind];

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    // Short delay so the signing-in state is visible in a live demo
    setTimeout(() => signIn(kind), 480);
  };

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1.05fr_1fr]">
      {/* Inverted panel. Same palette, chrome flipped. */}
      <div className="relative flex flex-col justify-between bg-rail px-7 py-9 lg:px-14 lg:py-12">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-rail-text-strong">
            Sparrow
          </span>
          <span className="h-3 w-px bg-rail-line" />
          <span className="text-[12.5px] text-rail-text">Assistant</span>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[46ch] py-12"
        >
          <h1 className="text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-rail-text-strong lg:text-[38px]">
            The meeting coordination your EA does by hand, run for you.
          </h1>
          <p className="mt-5 text-[14px] leading-relaxed text-rail-text">
            Invites, reminders, attendance calls and the escalation when someone
            does not turn up. You see every action it took and you can stop it at
            any point.
          </p>

          <ul className="mt-10 space-y-6">
            {GUARANTEES.map((g, i) => {
              const Icon = g.icon;
              return (
                <motion.li
                  key={g.title}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.12 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex gap-3.5"
                >
                  <span className="mt-[2px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-rail-line bg-rail-2 text-accent-lift">
                    <Icon size={13} weight="bold" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-medium leading-snug text-rail-text-strong">
                      {g.title}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-rail-text">
                      {g.body}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        <p className="text-[11.5px] leading-relaxed text-rail-text">
          Prepared for {ORG.company}. All timings run on Indian Standard Time.
        </p>
      </div>

      {/* Sign-in side */}
      <div className="flex items-center justify-center bg-paper px-6 py-12 lg:px-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[380px]"
        >
          <h2 className="text-[22px] font-semibold tracking-[-0.025em] text-ink">
            Sign in
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
            This is a demonstration. Pick an account to see the console as that
            person sees it.
          </p>

          <form onSubmit={submit} className="mt-7">
            <fieldset>
              <legend className="label mb-2.5">Account</legend>
              <div className="space-y-2">
                <RoleCard kind="md" picked={kind} onPick={setKind} />
                <RoleCard kind="ea" picked={kind} onPick={setKind} />
              </div>
            </fieldset>

            <div className="mt-5">
              <label
                htmlFor="email"
                className="mb-1.5 block text-[12.5px] font-medium text-ink"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                readOnly
                value={account.email}
                className="num w-full rounded-[6px] border border-line bg-paper-2 px-3 py-[9px] text-[12.5px] text-ink-2"
              />
              <p className="mt-1.5 text-[11.5px] text-ink-3">
                Filled from the account above.
              </p>
            </div>

            <div className="mt-4">
              <label
                htmlFor="password"
                className="mb-1.5 block text-[12.5px] font-medium text-ink"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                defaultValue="demo-access"
                className="w-full rounded-[6px] border border-line bg-surface px-3 py-[9px] text-[13px] text-ink placeholder:text-ink-3"
                placeholder="Enter your password"
              />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-[12.5px] text-ink-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-[14px] w-[14px] rounded-[3px] accent-accent"
                />
                Keep me signed in
              </label>
              <button
                type="button"
                className="text-[12.5px] text-ink-3 underline-offset-2 transition-colors hover:text-ink hover:underline"
              >
                Need help?
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-[6px] bg-ink px-4 py-[11px] text-[13px] font-medium text-paper transition-[background-color,transform] duration-150 hover:bg-[#2d2922] active:scale-[0.99] disabled:opacity-60"
            >
              {busy ? "Signing in" : `Continue as ${account.label.split(" ")[0]}`}
              {busy ? null : <ArrowRight size={14} weight="bold" />}
            </button>
          </form>

          <p className="mt-6 border-t border-line pt-5 text-[11.5px] leading-relaxed text-ink-3">
            Demonstration build showing {NOW.label}. No live calendar or phone
            line is connected.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
