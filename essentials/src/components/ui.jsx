import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowLeft, CheckCircle, WarningCircle, X } from "@phosphor-icons/react";

/*
  Shared primitives. Every border is 1px solid var(--color-line), every panel is
  10px, every control is 6px, and the only pills in the app are status badges.
*/

/* ------------------------------------------------------------- surfaces --- */

export function Panel({ children, className = "", flush = false }) {
  return (
    <section
      className={`overflow-hidden rounded-[10px] border border-line bg-surface ${
        flush ? "" : "p-6"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/* Tinted header strip. Gives a flush panel a defined top edge. */
export function PanelBar({ title, meta, action, className = "" }) {
  return (
    <header
      className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line bg-paper-2 px-6 py-4 ${className}`}
    >
      <div className="min-w-0">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {meta ? (
          <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">{meta}</p>
        ) : null}
      </div>
      {/* ml-auto keeps the action on the right even when the meta forces a wrap */}
      {action ? <div className="ml-auto shrink-0">{action}</div> : null}
    </header>
  );
}

/* Untinted head, for panels that are already padded. */
export function PanelHead({ title, meta, action, className = "" }) {
  return (
    <header
      className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 ${className}`}
    >
      <div className="min-w-0">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h2>
        {meta ? (
          <p className="mt-0.5 text-[12.5px] leading-snug text-ink-3">{meta}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function PageHead({ title, meta, action, eyebrow }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="label mb-2">{eyebrow}</p> : null}
        <h1 className="text-[27px] font-semibold leading-tight tracking-[-0.028em] text-ink">
          {title}
        </h1>
        {meta ? (
          <p className="mt-1.5 max-w-[66ch] text-[13.5px] leading-relaxed text-ink-2">
            {meta}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function BackLink({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-5 inline-flex items-center gap-1.5 rounded-[6px] border border-line bg-surface px-2.5 py-[6px] text-[12.5px] font-medium text-ink-2 transition-colors duration-150 hover:border-line-strong hover:text-ink"
    >
      <ArrowLeft size={13} weight="bold" />
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- badges --- */

const TONE = {
  ok: "bg-ok-soft text-ok-ink",
  wait: "bg-wait-soft text-wait-ink",
  stop: "bg-stop-soft text-stop-ink",
  accent: "bg-accent-soft text-accent-ink",
  mute: "bg-paper-3 text-ink-2",
  ink: "bg-ink text-paper",
};

export function Badge({ tone = "mute", children, className = "" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold uppercase tracking-[0.07em] ${TONE[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------- avatars --- */

export function Avatar({ person, size = 28 }) {
  const external = person.kind !== "internal";
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight ${
        external
          ? "border border-line-strong bg-paper-2 text-ink-2"
          : "bg-ink text-paper"
      }`}
    >
      {person.initials}
    </span>
  );
}

/* --------------------------------------------------------------- motion --- */

/*
  Entry animation, sequenced on mount rather than on scroll. Deliberately not
  whileInView: this console gets screenshotted, printed and scrolled fast in a
  meeting, and scroll-triggered reveals leave anything below the fold at
  opacity 0 in all three cases. Static under reduced motion.
*/
export function Reveal({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------- controls --- */

export function Button({
  children,
  variant = "ghost",
  icon: Icon,
  onClick,
  disabled = false,
  className = "",
  title,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-[6px] px-3 py-[7px] text-[12.5px] font-medium transition-[background-color,color,transform,border-color,box-shadow] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45";
  const variants = {
    /* Ink on paper. Contrast well past AA. */
    solid: "bg-ink text-paper hover:bg-[#2d2922]",
    ghost:
      "border border-line bg-surface text-ink-2 hover:border-line-strong hover:bg-paper-2 hover:text-ink",
    accent: "bg-accent text-white hover:bg-accent-ink",
    quiet: "text-ink-3 hover:bg-paper-2 hover:text-ink",
    danger:
      "border border-stop-soft bg-stop-soft text-stop-ink hover:border-stop-ink/30",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {Icon ? <Icon size={14} weight="bold" /> : null}
      {children}
    </button>
  );
}

export function Switch({ on, onChange, label, id }) {
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={on}
        aria-label={label ?? (on ? "On" : "Off")}
        onClick={() => onChange?.(!on)}
        className={`relative h-[20px] w-[34px] shrink-0 rounded-full transition-colors duration-200 ${
          on ? "bg-accent" : "bg-line-strong"
        }`}
      >
        <span
          className="absolute top-[3px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-[left] duration-200"
          style={{ left: on ? 17 : 3 }}
        />
      </button>
      {label ? <span className="text-[12.5px] text-ink-2">{label}</span> : null}
    </span>
  );
}

/* ---------------------------------------------------------------- lines --- */

export function Row({ label, value, children }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2.5">
      <dt className="text-[13px] text-ink-2">{label}</dt>
      <dd className="text-right text-[13px] font-medium text-ink">
        {children ?? value}
      </dd>
    </div>
  );
}

/* A number with its label. Used in divided stat rows, never as a lone tile. */
export function Stat({ value, label, tone = "ink", sub }) {
  return (
    <div>
      <p
        className={`num text-[22px] font-semibold leading-none tracking-[-0.03em] ${
          tone === "accent" ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[11.5px] leading-tight text-ink-3">{label}</p>
      {sub ? (
        <p className="mt-0.5 text-[11px] leading-tight text-ink-3">{sub}</p>
      ) : null}
    </div>
  );
}

export function Empty({ icon: Icon, title, detail, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon ? (
        <Icon size={22} weight="bold" className="mb-3 text-ink-3" />
      ) : null}
      <p className="text-[14px] font-medium text-ink">{title}</p>
      {detail ? (
        <p className="mt-1 max-w-[44ch] text-[12.5px] leading-relaxed text-ink-3">
          {detail}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* --------------------------------------------------------------- toasts --- */

export function Toasts({ toasts, onDismiss }) {
  const reduce = useReducedMotion();
  return (
    /* Bottom left: the assistant launcher and its panel own the bottom right. */
    <div className="pointer-events-none fixed bottom-5 left-5 z-50 flex w-[320px] max-w-[calc(100vw-40px)] flex-col gap-2">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-start gap-2.5 rounded-[10px] border border-rail-line bg-rail px-4 py-3 shadow-lg"
          >
            {t.tone === "warn" ? (
              <WarningCircle
                size={15}
                weight="bold"
                className="mt-[2px] shrink-0 text-wait-soft"
              />
            ) : (
              <CheckCircle
                size={15}
                weight="bold"
                className="mt-[2px] shrink-0 text-accent-lift"
              />
            )}
            <p className="flex-1 text-[12.5px] leading-snug text-rail-text-strong">
              {t.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss"
              className="-mr-1 mt-[1px] shrink-0 rounded p-0.5 text-rail-text transition-colors hover:text-rail-text-strong"
            >
              <X size={13} weight="bold" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
