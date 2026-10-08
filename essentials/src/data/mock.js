/*
  Demonstration data for the Sparrow Assistant Console, essentials build.

  This build covers meeting coordination only: invites, reminders, attendance
  calls, escalation and the written record produced when a meeting ends. There
  is no task chasing, no mailbox reading and no assistant to chat to, so there
  is no task, email or thread data here.

  All of it is mock - invented but plausible. Internal people and roles follow the
  proposal (MD, EA, MIS, procurement, sites). Client and vendor firms are invented
  so nothing here asserts a real commercial relationship.

  The whole console is frozen at one moment so the story reads clearly:
      Thursday 8 October 2026, 14:06 IST
  At that moment the 14:00 vendor review is in progress, three of four required
  attendees are in the room, and the fourth has missed two calls.
*/

export const NOW = {
  label: "Thursday, 8 October 2026",
  short: "8 Oct 2026",
  clock: "14:06",
  zone: "IST",
};

export const ORG = {
  company: "Sparrow Shopfits",
  principal: "Bhaskar Arya",
  principalRole: "Managing Director",
};

/* ---------------------------------------------------------------- people --- */

export const people = {
  bhaskar: {
    id: "bhaskar",
    name: "Bhaskar Arya",
    role: "Managing Director",
    org: "Sparrow Shopfits",
    kind: "internal",
    phone: "+91 98201 44612",
    email: "bhaskar@sparrowshopfits.com",
    initials: "BA",
  },
  onkar: {
    id: "onkar",
    name: "Onkar",
    role: "Executive Assistant",
    org: "Sparrow Shopfits",
    kind: "internal",
    phone: "+91 98204 17736",
    email: "onkar.s@sparrowshopfits.com",
    initials: "O",
  },
  anurag: {
    id: "anurag",
    name: "Anurag Deshpande",
    role: "MIS Manager",
    org: "Sparrow Shopfits",
    kind: "internal",
    phone: "+91 99673 20518",
    email: "anurag.d@sparrowshopfits.com",
    initials: "AD",
  },
  prakash: {
    id: "prakash",
    name: "Prakash Iyer",
    role: "Projects Head",
    org: "Sparrow Shopfits",
    kind: "internal",
    phone: "+91 98925 61104",
    email: "prakash.i@sparrowshopfits.com",
    initials: "PI",
  },
  kasim: {
    id: "kasim",
    name: "Kasim Shaikh",
    role: "Procurement Executive",
    org: "Sparrow Shopfits",
    kind: "internal",
    phone: "+91 70458 83921",
    email: "kasim.s@sparrowshopfits.com",
    initials: "KS",
  },
  imran: {
    id: "imran",
    name: "Imran Qureshi",
    role: "Site Supervisor, Andheri",
    org: "Sparrow Shopfits",
    kind: "internal",
    phone: "+91 82916 47250",
    email: "imran.q@sparrowshopfits.com",
    initials: "IQ",
  },
  sneha: {
    id: "sneha",
    name: "Sneha Kulkarni",
    role: "Accounts Manager",
    org: "Sparrow Shopfits",
    kind: "internal",
    phone: "+91 98334 72619",
    email: "sneha.k@sparrowshopfits.com",
    initials: "SK",
  },
  rajat: {
    id: "rajat",
    name: "Rajat Bhandari",
    role: "Category Head",
    org: "Vermilion Retail",
    kind: "client",
    phone: "+91 99302 85517",
    email: "rajat.bhandari@vermilionretail.in",
    initials: "RB",
  },
  meenal: {
    id: "meenal",
    name: "Meenal Rao",
    role: "Store Projects Lead",
    org: "Vermilion Retail",
    kind: "client",
    phone: "+91 98677 10483",
    email: "meenal.rao@vermilionretail.in",
    initials: "MR",
  },
  suresh: {
    id: "suresh",
    name: "Suresh Patil",
    role: "Proprietor",
    org: "Sai Modular Fixtures",
    kind: "vendor",
    phone: "+91 90049 26371",
    email: "suresh@saimodular.co.in",
    initials: "SP",
  },
  deepak: {
    id: "deepak",
    name: "Deepak Rane",
    role: "Partner",
    org: "Deepak Timber & Ply",
    kind: "vendor",
    phone: "+91 98196 55204",
    email: "deepak.rane@deepaktimber.in",
    initials: "DR",
  },
  farida: {
    id: "farida",
    name: "Farida Merchant",
    role: "Principal Architect",
    org: "Kalyan Interiors",
    kind: "client",
    phone: "+91 98211 73390",
    email: "farida@kalyaninteriors.com",
    initials: "FM",
  },
  /* Added to the sheet at 07:34 today. Held until the EA releases the number. */
  nitin: {
    id: "nitin",
    name: "Nitin Gharat",
    role: "Proprietor",
    org: "Everest Glass & Aluminium",
    kind: "vendor",
    phone: "+91 97692 40158",
    email: "nitin@everestglass.co.in",
    initials: "NG",
  },
};

export const peopleList = Object.values(people);

/* -------------------------------------------------------------- meetings --- */

export const meetings = [
  {
    id: "m1",
    title: "Daily site review",
    time: "09:30",
    ends: "10:00",
    kind: "internal",
    recurring: "Repeats every weekday",
    state: "closed",
    summary: "All three attendees joined within four minutes of the start time.",
    attendees: [
      { id: "anurag", required: true, rsvp: "accepted", joined: "09:30" },
      { id: "prakash", required: true, rsvp: "accepted", joined: "09:31" },
      { id: "imran", required: true, rsvp: "accepted", joined: "09:34", calls: 1 },
    ],
  },
  {
    id: "m2",
    title: "Vermilion Retail - Thane store rollout",
    time: "11:00",
    ends: "12:00",
    kind: "client",
    recurring: null,
    state: "closed",
    summary:
      "Both client attendees joined on the first reminder. No calls were needed.",
    attendees: [
      { id: "rajat", required: true, rsvp: "accepted", joined: "11:00" },
      { id: "meenal", required: true, rsvp: "accepted", joined: "11:02" },
      { id: "prakash", required: true, rsvp: "accepted", joined: "10:58" },
      { id: "onkar", required: false, rsvp: "accepted", joined: "11:01" },
    ],
  },
  {
    id: "m3",
    title: "Vendor review: Sai Modular Fixtures",
    time: "14:00",
    ends: "15:00",
    kind: "vendor",
    recurring: null,
    state: "live",
    summary:
      "Suresh Patil has missed two calls and has been escalated to you. The other three joined within four minutes of the start.",
    attendees: [
      { id: "kasim", required: true, rsvp: "accepted", joined: "14:00" },
      { id: "prakash", required: true, rsvp: "accepted", joined: "14:01" },
      { id: "deepak", required: true, rsvp: "accepted", joined: "14:04", calls: 1 },
      { id: "suresh", required: true, rsvp: "accepted", joined: null, calls: 2 },
    ],
  },
  {
    id: "m4",
    title: "Site P&L walkthrough - Q3",
    time: "16:30",
    ends: "17:15",
    kind: "internal",
    recurring: null,
    state: "upcoming",
    summary:
      "Sneha Kulkarni has not responded to the invite. An RSVP call is queued for 15:30.",
    attendees: [
      { id: "anurag", required: true, rsvp: "accepted", joined: null },
      { id: "sneha", required: true, rsvp: "none", joined: null, queued: "15:30" },
      { id: "prakash", required: false, rsvp: "accepted", joined: null },
    ],
  },
  {
    id: "m5",
    title: "Kalyan Interiors - handover checklist",
    time: "18:00",
    ends: "18:45",
    kind: "client",
    recurring: null,
    state: "upcoming",
    summary:
      "Farida Merchant was tentative on the invite and confirmed attendance on a call at 12:42.",
    attendees: [
      {
        id: "farida",
        required: true,
        rsvp: "confirmed-on-call",
        joined: null,
        calls: 1,
      },
      { id: "prakash", required: true, rsvp: "accepted", joined: null },
    ],
  },
];

export const meetingKindLabel = {
  internal: "Internal",
  client: "Client",
  vendor: "Vendor",
};

/* --------------------------------------------------------------- ledger --- */
/* Every automated action, newest first. This is the visibility story. */

export const ledger = [
  {
    time: "14:11",
    channel: "escalation",
    title: "MD and EA notified: Suresh Patil unreachable",
    detail:
      "Two call attempts failed. WhatsApp sent to Bhaskar Arya and Onkar with each attendee's status.",
    meeting: "m3",
  },
  {
    time: "14:10",
    channel: "call",
    title: "Call to Suresh Patil",
    detail: "No answer. Attempt 2 of 2. Attempt limit reached.",
    outcome: "no-answer",
    meeting: "m3",
  },
  {
    time: "14:06",
    channel: "call",
    title: "Call to Bhaskar Arya: meeting is ready",
    detail:
      "Answered, 18 seconds. Told the MD that three of four attendees are in the room.",
    outcome: "answered",
    meeting: "m3",
  },
  {
    time: "14:04",
    channel: "join",
    title: "Deepak Rane joined Google Meet",
    detail: "Joined four minutes after the start time, following one call.",
    meeting: "m3",
  },
  {
    time: "14:03",
    channel: "call",
    title: "Call to Suresh Patil",
    detail: "No answer. Attempt 1 of 2.",
    outcome: "no-answer",
    meeting: "m3",
  },
  {
    time: "14:01",
    channel: "join",
    title: "Prakash Iyer joined Google Meet",
    detail: "Joined without a call.",
    meeting: "m3",
  },
  {
    time: "14:00",
    channel: "call",
    title: "Start time call wave placed",
    detail:
      "Two attendees had not joined at the start time. Calls placed to Deepak Rane and Suresh Patil.",
    meeting: "m3",
  },
  {
    time: "13:50",
    channel: "whatsapp",
    title: "Joining link sent to 4 attendees",
    detail: "All four delivered. Ten minute reminder before the vendor review.",
    meeting: "m3",
  },
  {
    time: "12:42",
    channel: "call",
    title: "Farida Merchant confirmed attendance",
    detail:
      "Answered, 41 seconds. Invite was tentative. Marked as attending for the 18:00 handover.",
    outcome: "answered",
    meeting: "m5",
  },
  {
    time: "11:58",
    channel: "meeting",
    title: "Vermilion Retail rollout meeting closed",
    detail: "Four of four attendees joined. No escalation was needed.",
    meeting: "m2",
  },
  {
    time: "09:28",
    channel: "whatsapp",
    title: "Daily agenda sent to MD and EA",
    detail: "Five meetings, eleven attendees, two awaiting a response at send time.",
  },
  {
    time: "07:34",
    channel: "sheet",
    title: "Contacts Directory synced",
    detail:
      "Two phone numbers updated from the sheet Onkar maintains. One contact added.",
  },
];

/* ---------------------------------------------------------------- calls --- */

export const calls = [
  {
    id: "c1",
    person: "suresh",
    purpose: "Meeting started, not joined",
    meeting: "Vendor review: Sai Modular Fixtures",
    at: "14:10",
    duration: null,
    outcome: "no-answer",
    attempt: "2 of 2",
    language: "Hindi",
  },
  {
    id: "c2",
    person: "bhaskar",
    purpose: "Meeting is ready",
    meeting: "Vendor review: Sai Modular Fixtures",
    at: "14:06",
    duration: "0:18",
    outcome: "answered",
    language: "English",
    recording: true,
    transcript: [
      {
        who: "assistant",
        text: "Good afternoon sir, this is the automated assistant. Three of your four attendees are now in the vendor review. Kasim, Prakash and Deepak have joined.",
      },
      { who: "other", text: "And Suresh?" },
      {
        who: "assistant",
        text: "Suresh Patil has not joined yet. I have called once and will try again in five minutes. I will send you a WhatsApp either way.",
      },
      { who: "other", text: "Fine, start karte hain." },
    ],
    notes: "No action was requested from the assistant on this call.",
  },
  {
    id: "c3",
    person: "deepak",
    purpose: "Meeting started, not joined",
    meeting: "Vendor review: Sai Modular Fixtures",
    at: "14:00",
    duration: "0:26",
    outcome: "answered",
    language: "Hinglish",
    recording: true,
    transcript: [
      {
        who: "assistant",
        text: "Namaskar, main Mr. Bhaskar Arya ke liye automated assistant bol raha hoon, Sparrow Shopfits se. Kya main Deepak Rane se baat kar raha hoon?",
      },
      { who: "other", text: "Haan boliye." },
      {
        who: "assistant",
        text: "Vendor review meeting start ho gayi hai. Aap join kar sakte hain? Link WhatsApp par bheja hua hai.",
      },
      { who: "other", text: "Do minute mein aa raha hoon, link mil gaya hai." },
      { who: "assistant", text: "Dhanyavaad. Main unhe bata deta hoon." },
    ],
    notes: "Attendee said two minutes. Joined at 14:04.",
  },
  {
    id: "c4",
    person: "suresh",
    purpose: "Meeting started, not joined",
    meeting: "Vendor review: Sai Modular Fixtures",
    at: "14:03",
    duration: null,
    outcome: "no-answer",
    attempt: "1 of 2",
    language: "Hindi",
  },
  {
    id: "c5",
    person: "farida",
    purpose: "Invite response check",
    meeting: "Kalyan Interiors - handover checklist",
    at: "12:40",
    duration: "0:41",
    outcome: "answered",
    language: "English",
    recording: true,
    transcript: [
      {
        who: "assistant",
        text: "Good afternoon, this is an automated assistant calling on behalf of Mr. Bhaskar Arya from Sparrow Shopfits. Am I speaking with Farida Merchant?",
      },
      { who: "other", text: "Yes, speaking." },
      {
        who: "assistant",
        text: "Thank you. Mr. Arya has a handover checklist review today at 6 PM on Google Meet. Your invite is marked tentative. Will you be able to join?",
      },
      { who: "other", text: "Six is fine, yes. Will Prakash be on the call?" },
      {
        who: "assistant",
        text: "Prakash Iyer has accepted the invite. I will mark you as attending and send the joining link on WhatsApp.",
      },
      { who: "other", text: "Perfect, thank you." },
    ],
    notes:
      "Attendance confirmed. No commitment on scope or pricing was requested or given.",
  },
  {
    id: "c6",
    person: "imran",
    purpose: "Meeting started, not joined",
    meeting: "Daily site review",
    at: "09:32",
    duration: "0:22",
    outcome: "answered",
    language: "Hinglish",
    recording: true,
    notes: "Attendee was on site. Joined at 09:34.",
  },
  {
    id: "c7",
    person: "suresh",
    purpose: "Pending GST certificate",
    meeting: null,
    at: "11:15",
    duration: "1:12",
    outcome: "answered",
    language: "Hindi",
    recording: true,
    scheduled: true,
    notes:
      "Scheduled call. Vendor committed to sharing the certificate by 10 October. Escalated to EA for tracking.",
  },
];

/* --------------------------------------------------- attendance history --- */

export const attendanceWeek = [
  { day: "Fri", pct: 78, meetings: 4 },
  { day: "Mon", pct: 85, meetings: 6 },
  { day: "Tue", pct: 91, meetings: 5 },
  { day: "Wed", pct: 88, meetings: 7 },
  { day: "Thu", pct: 94, meetings: 5 },
  { day: "Fri", pct: 83, meetings: 6 },
  { day: "Today", pct: 92, meetings: 5, current: true },
];

/* ----------------------------------------------------- scheduled calls --- */

export const scheduledCalls = [
  {
    id: "s1",
    person: "imran",
    topic: "Snag list status for the Andheri site",
    when: "Today, 16:00",
    state: "scheduled",
    attempts: 0,
  },
  {
    id: "s2",
    person: "deepak",
    topic: "Confirm ply delivery dates for the Andheri site",
    when: "9 Oct, 10:30",
    state: "scheduled",
    attempts: 0,
  },
  {
    id: "s3",
    person: "meenal",
    topic: "Collect the store opening date confirmation",
    when: "9 Oct, 15:00",
    state: "scheduled",
    attempts: 0,
  },
  {
    id: "s4",
    person: "suresh",
    topic: "Follow up on the pending GST certificate",
    when: "Today, 11:15",
    state: "completed",
    attempts: 1,
    duration: "1:12",
  },
];

/* ------------------------------------------------------- day at a glance --- */

export const todayKpis = [
  { label: "Messages sent", value: "14", sub: "all delivered" },
  { label: "Calls placed", value: "7", sub: "5 answered" },
  { label: "Attendance", value: "92%", sub: "required attendees" },
  { label: "Escalated to you", value: "1", sub: "awaiting a decision" },
  { label: "Coordination time saved", value: "2h 05m", sub: "estimated" },
];

/* --------------------------------------------------------------- agenda --- */

export const meetingAgenda = {
  m1: [
    "Manpower on site against plan",
    "Material received since yesterday",
    "Blockers needing a decision from the MD",
  ],
  m2: [
    "Thane and Vashi handover dates",
    "Snag list closure from the Andheri store",
    "Payment milestone against the October invoice",
  ],
  m3: [
    "Rate revision on modular carcass units",
    "Delivery slippage on the Andheri order",
    "Quality rejections from the September batch",
    "Commitment on the next four store fit-outs",
  ],
  m4: [
    "Site-level profit against budget for Q3",
    "Cost overruns above five percent",
    "Vendor payments pending approval",
  ],
  m5: [
    "Snag list sign-off",
    "Warranty and maintenance handover",
    "Final billing and retention release",
  ],
};

/* The WhatsApp trail for a meeting, used on the meeting detail screen. */
export const meetingMessages = {
  m3: [
    {
      at: "09:04",
      to: "4 attendees",
      kind: "Invite and joining link",
      state: "delivered",
    },
    { at: "13:50", to: "4 attendees", kind: "Ten minute reminder", state: "delivered" },
    {
      at: "14:11",
      to: "Bhaskar Arya, Onkar",
      kind: "Escalation: Suresh Patil unreachable",
      state: "read",
    },
  ],
  m4: [
    { at: "09:04", to: "3 attendees", kind: "Invite and joining link", state: "delivered" },
    {
      at: "11:30",
      to: "Sneha Kulkarni",
      kind: "Response still awaited",
      state: "delivered",
    },
  ],
  m5: [
    { at: "09:06", to: "2 attendees", kind: "Invite and joining link", state: "delivered" },
    {
      at: "12:43",
      to: "Farida Merchant",
      kind: "Attendance confirmed, link resent",
      state: "read",
    },
  ],
};

/*
  The written record for a meeting. It is produced once, when the meeting ends,
  from the calendar, the Google Meet joining data and the assistant's own log of
  what it sent and called. Meetings that have not finished have no record yet,
  which is why only the two closed meetings appear here.
*/
export const meetingRecords = {
  m1: {
    generatedAt: "10:00",
    headline:
      "All three required attendees joined. One call was needed and no escalation was raised.",
    attendance: [
      "Anurag Deshpande joined at 09:30, on the start time.",
      "Prakash Iyer joined at 09:31.",
      "Imran Qureshi joined at 09:34, after a call at 09:32 that he answered from the Andheri site.",
    ],
    coordination: [
      { label: "Reminders sent", value: "3" },
      { label: "Calls placed", value: "1" },
      { label: "Escalations", value: "None" },
      { label: "In within 5 minutes", value: "3 of 3" },
    ],
    carried: "None. The meeting ran its full agenda.",
  },
  m2: {
    generatedAt: "12:00",
    headline:
      "All four attendees joined on the first reminder. No calls were placed.",
    attendance: [
      "Prakash Iyer joined at 10:58, before the start time.",
      "Rajat Bhandari joined at 11:00, on the start time.",
      "Meenal Rao joined at 11:02.",
      "Onkar joined at 11:01 as an optional attendee.",
    ],
    coordination: [
      { label: "Reminders sent", value: "4" },
      { label: "Calls placed", value: "0" },
      { label: "Escalations", value: "None" },
      { label: "In within 5 minutes", value: "3 of 3" },
    ],
    carried:
      "The Thane and Vashi handover dates were left open. Prakash Iyer is to confirm them with the client.",
  },
};

/* ------------------------------------------------------- person history --- */

export const personHistory = {
  suresh: {
    reliability: 46,
    note: "Answers roughly half the time. Usually reachable in the morning.",
    rows: [
      { when: "Today 14:10", what: "Call, meeting started", outcome: "No answer" },
      { when: "Today 14:03", what: "Call, meeting started", outcome: "No answer" },
      { when: "Today 11:15", what: "Scheduled call, GST certificate", outcome: "Answered, 1:12" },
      { when: "2 Oct", what: "Call, meeting started", outcome: "Answered, 0:34" },
      { when: "28 Sep", what: "Call, invite response", outcome: "No answer" },
    ],
  },
  farida: {
    reliability: 94,
    note: "Reliable. Responds to messages without needing a call.",
    rows: [
      { when: "Today 12:40", what: "Call, invite response", outcome: "Answered, 0:41" },
      { when: "1 Oct", what: "Invite", outcome: "Accepted in Calendar" },
      { when: "24 Sep", what: "Invite", outcome: "Accepted in Calendar" },
    ],
  },
  imran: {
    reliability: 72,
    note: "On site most of the day. Answers calls, misses messages.",
    rows: [
      { when: "7 Oct", what: "Call, invite response", outcome: "Answered, 0:31" },
      { when: "Today 09:32", what: "Call, meeting started", outcome: "Answered, 0:22" },
      { when: "6 Oct", what: "Call, meeting started", outcome: "Answered, 0:19" },
    ],
  },
};

export const defaultHistory = {
  reliability: 88,
  note: "Responds to invites without needing a call.",
  rows: [
    { when: "Today 13:50", what: "Joining link", outcome: "Delivered" },
    { when: "Today 09:04", what: "Invite", outcome: "Accepted in Calendar" },
  ],
};

/* ---------------------------------------------------- integration status --- */

export const connections = [
  { name: "Google Calendar", detail: "Bhaskar Arya's calendar", state: "ok", meta: "Last read 14:06" },
  { name: "Google Meet", detail: "Join tracking for all meetings", state: "ok", meta: "Live" },
  { name: "WhatsApp Business API", detail: "Official Meta number", state: "ok", meta: "14 sent today" },
  { name: "Voice agent", detail: "Indian number, TRAI compliant", state: "ok", meta: "7 calls today" },
  { name: "Contacts Directory", detail: "Google Sheet kept by the EA", state: "ok", meta: "Synced 07:34" },
  { name: "Telegram alerts", detail: "Technical failures only", state: "idle", meta: "No alerts today" },
];
