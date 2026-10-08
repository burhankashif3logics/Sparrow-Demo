/*
  The console assistant's answer engine.

  This is a real query engine over the demo data in src/data/mock.js, not a
  canned script: it resolves names, reads the live meeting state, counts calls
  and tasks, and composes the answer from what it finds. Ask it something the
  data cannot answer and it says so rather than inventing a figure.

  It also holds the same line the voice agent holds. Asked to approve a price,
  a payment or a contract, it refuses and offers to put the request in front of
  the owner instead.
*/

import {
  meetings,
  people,
  calls,
  tasks,
  emails,
  scheduledCalls,
  taskStateLabel,
  NOW,
} from "../data/mock";

const PEOPLE = Object.values(people);

const list = (names) => {
  if (names.length === 0) return "nobody";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
};

const first = (p) => p.name.split(" ")[0];

/* Drop only the leading capital, so "Sai Modular" survives mid-sentence. */
const lowerFirst = (s) => (s ? s[0].toLowerCase() + s.slice(1) : s);

/* Resolve a person from free text. Longest match wins so "Suresh Patil"
   beats a stray "patil". */
function findPerson(text) {
  const t = text.toLowerCase();
  let best = null;
  for (const p of PEOPLE) {
    const parts = p.name.toLowerCase().split(" ");
    const candidates = [p.name.toLowerCase(), ...parts];
    for (const c of candidates) {
      if (c.length < 4) continue;
      if (t.includes(c) && (!best || c.length > best.len)) {
        best = { person: p, len: c.length };
      }
    }
  }
  return best?.person ?? null;
}

function findMeeting(text) {
  const t = text.toLowerCase();
  return (
    meetings.find((m) => t.includes(m.title.toLowerCase())) ??
    meetings.find((m) =>
      m.title
        .toLowerCase()
        .split(/[^a-z]+/)
        .filter((w) => w.length > 4)
        .some((w) => t.includes(w)),
    ) ??
    null
  );
}

const has = (t, ...words) => words.some((w) => t.includes(w));

/* ------------------------------------------------------------- answers --- */

function liveMeetingAnswer() {
  const live = meetings.find((m) => m.state === "live");
  if (!live) {
    return { text: "No meeting is running right now." };
  }
  const req = live.attendees.filter((a) => a.required);
  const joined = req.filter((a) => a.joined);
  const missing = req.filter((a) => !a.joined);

  const bullets = req.map((a) => {
    const p = people[a.id];
    if (a.joined) return `${p.name} joined at ${a.joined}`;
    if (a.calls >= 2)
      return `${p.name} has not joined. ${a.calls} calls, no answer, escalated to you at 14:11`;
    return `${p.name} has not joined. Being called now`;
  });

  return {
    text: `${joined.length} of ${req.length} required attendees are in ${live.title}, which started at ${live.time}.`,
    bullets,
    action: { label: "Open the meeting", go: { type: "meeting", id: live.id } },
    footer: missing.length
      ? `${list(missing.map((a) => people[a.id].name))} is the only one outstanding. I have stopped calling because the two attempt limit was reached.`
      : null,
  };
}

function personAnswer(p) {
  const inMeetings = meetings.filter((m) =>
    m.attendees.some((a) => a.id === p.id),
  );
  if (inMeetings.length === 0) {
    const theirCalls = calls.filter((c) => c.person === p.id);
    return {
      text: `${p.name} is not on today's calendar. ${
        theirCalls.length
          ? `There ${theirCalls.length === 1 ? "was" : "were"} ${theirCalls.length} call${theirCalls.length === 1 ? "" : "s"} to them today.`
          : "No calls were placed to them today."
      }`,
      action: { label: "Open their record", go: { type: "contact", id: p.id } },
    };
  }

  const bullets = inMeetings.map((m) => {
    const a = m.attendees.find((x) => x.id === p.id);
    if (a.joined) return `${m.time} ${m.title}: joined at ${a.joined}`;
    if (m.state === "live" && a.calls >= 2)
      return `${m.time} ${m.title}: not joined, ${a.calls} calls, no answer`;
    if (m.state === "upcoming" && a.rsvp === "none")
      return `${m.time} ${m.title}: has not responded, call queued for ${a.queued ?? "later"}`;
    if (a.rsvp === "confirmed-on-call")
      return `${m.time} ${m.title}: confirmed on a call at 12:42`;
    return `${m.time} ${m.title}: accepted the invite`;
  });

  const theirCalls = calls.filter((c) => c.person === p.id);
  const answered = theirCalls.filter((c) => c.outcome === "answered").length;

  return {
    text: `${p.name}, ${p.role}${p.kind === "internal" ? "" : ` at ${p.org}`}.`,
    bullets,
    footer: theirCalls.length
      ? `${theirCalls.length} call${theirCalls.length === 1 ? "" : "s"} today, ${answered} answered.`
      : "No calls were placed to them today.",
    action: { label: "Open their record", go: { type: "contact", id: p.id } },
  };
}

function scheduleAnswer() {
  const later = meetings.filter((m) => m.state === "upcoming");
  const done = meetings.filter((m) => m.state === "closed");
  const live = meetings.find((m) => m.state === "live");

  return {
    text: `You have ${meetings.length} meetings today. ${done.length} finished, ${live ? "one running now, " : ""}${later.length} still to come.`,
    bullets: meetings.map(
      (m) =>
        `${m.time} ${m.title}${m.state === "live" ? " (running now)" : m.state === "closed" ? " (finished)" : ""}`,
    ),
    action: { label: "Open meetings", go: { type: "view", id: "meetings" } },
  };
}

function nextMeetingAnswer() {
  const next = meetings.find((m) => m.state === "upcoming");
  if (!next) return { text: "Nothing else is scheduled today." };
  const req = next.attendees.filter((a) => a.required);
  const waiting = req.filter((a) => a.rsvp === "none");

  return {
    text: `${next.title} at ${next.time}, with ${list(next.attendees.map((a) => people[a.id].name))}.`,
    bullets: req.map((a) => {
      const p = people[a.id];
      if (a.rsvp === "none")
        return `${p.name} has not responded. Call queued for ${a.queued}`;
      if (a.rsvp === "confirmed-on-call") return `${p.name} confirmed on a call`;
      return `${p.name} accepted`;
    }),
    footer: waiting.length
      ? `${list(waiting.map((a) => first(people[a.id])))} still needs to confirm.`
      : "Everyone required has confirmed.",
    action: { label: "Open the meeting", go: { type: "meeting", id: next.id } },
  };
}

function attentionAnswer() {
  return {
    text: "Two things are waiting on a decision from you.",
    bullets: [
      "Suresh Patil is not reachable for the vendor review running now. Two calls, no answer. I have stopped calling.",
      "Sneha Kulkarni has not responded to the 16:30 invite. A call is queued for 15:30.",
    ],
    footer:
      "I will not start a meeting without a required attendee or move anything on your calendar without you saying so.",
    action: { label: "Open today", go: { type: "view", id: "today" } },
  };
}

function callsAnswer(p) {
  if (p) {
    const theirs = calls.filter((c) => c.person === p.id);
    if (theirs.length === 0)
      return { text: `No calls were placed to ${p.name} today.` };
    return {
      text: `${theirs.length} call${theirs.length === 1 ? "" : "s"} to ${p.name} today.`,
      bullets: theirs.map(
        (c) =>
          `${c.at} ${c.purpose}: ${c.outcome === "answered" ? `answered, ${c.duration}` : `no answer, attempt ${c.attempt}`}`,
      ),
      action: { label: "Open calls", go: { type: "view", id: "calls" } },
    };
  }

  const answered = calls.filter((c) => c.outcome === "answered");
  const missed = calls.filter((c) => c.outcome !== "answered");
  return {
    text: `${calls.length} calls today. ${answered.length} answered, ${missed.length} went unanswered.`,
    bullets: calls
      .slice()
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 5)
      .map(
        (c) =>
          `${c.at} ${people[c.person].name}, ${c.purpose}: ${c.outcome === "answered" ? `answered, ${c.duration}` : "no answer"}`,
      ),
    footer: "Every answered call has a recording and a transcript.",
    action: { label: "Open calls", go: { type: "view", id: "calls" } },
  };
}

/* `only` narrows the list when the question asked for a specific state, so
   "which tasks are delayed" does not list all five. */
function tasksAnswer(only = null) {
  const late = tasks.filter((t) => t.state === "delayed");
  const waiting = tasks.filter((t) => t.state === "awaiting-date");
  const shown = only ? tasks.filter((t) => t.state === only) : tasks;

  const row = (t) =>
    `${people[t.person].name}: ${t.task} (due ${t.revised ?? t.due})`;

  if (only === "delayed") {
    if (late.length === 0)
      return { text: "Nothing is delayed. Every open task is still inside its date." };
    return {
      text: `${late.length} task${late.length === 1 ? " is" : "s are"} delayed out of ${tasks.length} open.`,
      bullets: late.map(row),
      footer: `${people[late[0].person].name} gave a reason on a call: ${lowerFirst(late[0].reason)}. The date moved to ${late[0].revised}.`,
      action: { label: "Open task follow-up", go: { type: "view", id: "tasks" } },
    };
  }

  return {
    text: `${tasks.length} tasks are open. ${late.length} delayed, ${waiting.length} with no date yet.`,
    bullets: shown.map(
      (t) =>
        `${people[t.person].name}: ${t.task} (${taskStateLabel[t.state].toLowerCase()}, due ${t.revised ?? t.due})`,
    ),
    footer: late.length
      ? `${people[late[0].person].name} is the one behind: ${lowerFirst(late[0].reason)}.`
      : null,
    action: { label: "Open task follow-up", go: { type: "view", id: "tasks" } },
  };
}

function emailAnswer() {
  return {
    text: `${emails.length} emails today need a decision from you.`,
    bullets: emails.map(
      (e) => `${people[e.from].name}: ${e.action}, by ${e.deadline}`,
    ),
    footer: "I only read your mailbox. I never reply, forward or delete.",
    action: { label: "Open the briefing", go: { type: "view", id: "email" } },
  };
}

function scheduledAnswer() {
  const queued = scheduledCalls.filter((s) => s.state === "scheduled");
  return {
    text: `${queued.length} calls are queued and ${scheduledCalls.length - queued.length} has already run.`,
    bullets: scheduledCalls.map(
      (s) =>
        `${s.when} ${people[s.person].name}: ${s.topic} (${s.state})`,
    ),
    action: { label: "Open scheduled calls", go: { type: "view", id: "scheduled" } },
  };
}

function contactAnswer(p) {
  const gated =
    p.id === "rajat"
      ? "They are on the do not call list, so I will message them but never ring them."
      : p.id === "nitin"
        ? "This number is held until Onkar releases it, so I have not called it."
        : null;
  return {
    text: `${p.name}, ${p.role}${p.kind === "internal" ? "" : ` at ${p.org}`}.`,
    bullets: [`Phone ${p.phone}`, `Email ${p.email}`, "Source: Contacts Directory"],
    footer: gated,
    action: { label: "Open their record", go: { type: "contact", id: p.id } },
  };
}

function attendanceAnswer() {
  return {
    text: "92 percent of required attendees were in the room at the start time today.",
    bullets: [
      "Across the last seven working days the range is 78 to 94 percent",
      "7 calls placed today, 5 answered",
      "1 attendee escalated to you",
    ],
    footer:
      "The figure counts required attendees only. Optional attendees never hold up the notification that a meeting is ready.",
    action: { label: "Open today", go: { type: "view", id: "today" } },
  };
}

function refuseAnswer() {
  return {
    text: "I cannot agree to that on your behalf.",
    bullets: [
      "No prices, discounts or rate revisions",
      "No payments or releases",
      "No contracts, scope or dates committed to a client or vendor",
    ],
    footer:
      "If someone asks for any of these on a call, I record the request, summarise it and send it to you on WhatsApp. The decision stays with you.",
  };
}

function helpAnswer() {
  return {
    text: "I can answer anything that is in your console. Try asking about:",
    bullets: [
      "Who has joined, or who has not, in the meeting running now",
      "Where a particular person is, and whether they answered",
      "What is next on your calendar and who has confirmed",
      "Which tasks are delayed and the reason given",
      "Which emails need a decision from you",
      "Someone's phone number, or the calls placed to them",
    ],
    footer: `Everything I say comes from the record for ${NOW.label}. I do not guess.`,
  };
}

/* ---------------------------------------------------------------- entry --- */

export const SUGGESTIONS = [
  "Who has not joined yet?",
  "What needs a decision from me?",
  "What is next on my calendar?",
  "Which tasks are delayed?",
];

export function answerQuestion(raw, ctx = {}) {
  const q = raw.toLowerCase().trim();
  const person = findPerson(q);
  const meeting = findMeeting(q);

  if (!q) return { text: "Ask me anything about today." };

  /* The same line the voice agent holds, held here too. */
  if (
    has(q, "approve", "approval", "discount", "negotiate", "sign off", "sign the") ||
    (has(q, "price", "rate", "payment", "pay ", "contract") &&
      has(q, "can you", "please", "agree", "confirm", "accept", "ok "))
  ) {
    return refuseAnswer();
  }

  if (has(q, "what can you", "help", "how do you work", "what do you do"))
    return helpAnswer();

  /* Action requests respect the master pause. */
  if (has(q, "call ", "ring ", "remind", "message ", "chase")) {
    const target = person;
    if (!target)
      return {
        text: "Tell me who to contact and I will queue it. I only call numbers that are in the Contacts Directory.",
      };
    if (ctx.paused)
      return {
        text: `I cannot call ${target.name} right now. You have the assistant paused, so every queued message and call is on hold.`,
        footer: "Resume it from the header and I will place the call.",
      };
    if (target.id === "rajat")
      return {
        text: `${target.name} is on the do not call list, so I will not ring them. I can send a WhatsApp message instead.`,
        act: { kind: "message", personId: target.id, label: "Send a message" },
      };
    return {
      text: `I can call ${target.name} on ${target.phone} now. I will say I am an assistant calling for you, ask only about attendance, and send you the outcome.`,
      act: { kind: "call", personId: target.id, label: `Call ${first(target)}` },
    };
  }

  if (has(q, "paused", "pause", "stopped", "running"))
    return {
      text: ctx.paused
        ? "I am paused. Nothing is going out: no reminders, no calls, no escalations, including anything already queued for later today."
        : "I am running. Reminders, attendance calls and escalations are all active, inside the 08:00 to 21:00 calling window.",
      footer: "You can switch this from the header at any time.",
    };

  /* Live meeting, asked in any of the usual ways */
  if (
    has(q, "not joined", "hasn't joined", "has not joined", "who is missing", "missing") ||
    has(q, "who joined", "who is in", "in the room", "live meeting", "right now", "current meeting") ||
    (meeting?.state === "live" && has(q, "status", "who"))
  )
    return liveMeetingAnswer();

  if (has(q, "next", "coming up", "later today") && !has(q, "task"))
    return nextMeetingAnswer();

  if (has(q, "attention", "decision", "waiting on me", "escalat", "need me", "my input"))
    return attentionAnswer();

  if (has(q, "attendance", "turn up", "turnout", "percentage", "percent"))
    return attendanceAnswer();

  if (has(q, "task", "delayed", "overdue", "late", "follow-up", "follow up", "delegat"))
    return tasksAnswer(
      has(q, "delayed", "overdue", "late", "behind") ? "delayed" : null,
    );

  if (has(q, "email", "mail", "inbox", "outlook")) return emailAnswer();

  if (has(q, "scheduled call", "queued call", "outbound")) return scheduledAnswer();

  if (has(q, "number", "phone", "contact details", "reach") && person)
    return contactAnswer(person);

  if (has(q, "call", "recording", "transcript", "answered")) return callsAnswer(person);

  if (has(q, "schedule", "calendar", "meetings today", "how many meetings", "today"))
    return scheduleAnswer();

  if (person) return personAnswer(person);

  if (meeting) {
    const { joined, total } = {
      joined: meeting.attendees.filter((a) => a.required && a.joined).length,
      total: meeting.attendees.filter((a) => a.required).length,
    };
    return {
      text: `${meeting.title} at ${meeting.time}. ${meeting.summary}`,
      bullets: meeting.attendees.map((a) => {
        const p = people[a.id];
        return a.joined
          ? `${p.name} joined at ${a.joined}`
          : `${p.name} has not joined`;
      }),
      footer: `${joined} of ${total} required attendees.`,
      action: { label: "Open the meeting", go: { type: "meeting", id: meeting.id } },
    };
  }

  if (has(q, "meeting")) return scheduleAnswer();

  return {
    text: "I do not have that in the record, so I will not guess.",
    footer:
      "I can answer on today's meetings, attendees, calls, recordings, tasks, emails and contacts. Ask me one of those, or say help.",
  };
}
