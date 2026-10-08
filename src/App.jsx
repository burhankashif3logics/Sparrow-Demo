import { useEffect } from "react";
import Shell from "./components/Shell";
import CommandPalette from "./components/CommandPalette";
import Assistant from "./components/Assistant";
import { Toasts } from "./components/ui";
import { AppState, useApp } from "./state";
import Login from "./screens/Login";
import Today from "./screens/Today";
import Meetings from "./screens/Meetings";
import MeetingDetail from "./screens/MeetingDetail";
import Calls from "./screens/Calls";
import Contacts from "./screens/Contacts";
import ContactDetail from "./screens/ContactDetail";
import Tasks from "./screens/Tasks";
import Email from "./screens/Email";
import Scheduled from "./screens/Scheduled";
import Controls from "./screens/Controls";

const SCREENS = {
  today: Today,
  meetings: Meetings,
  calls: Calls,
  contacts: Contacts,
  tasks: Tasks,
  email: Email,
  scheduled: Scheduled,
  controls: Controls,
};

/* The assistant opened in its own window renders on its own. */
const isAssistantWindow = () =>
  new URLSearchParams(window.location.search).has("assistant");

function Routed() {
  const { view, detail } = useApp();

  if (detail?.type === "meeting") return <MeetingDetail id={detail.id} />;
  if (detail?.type === "contact") return <ContactDetail id={detail.id} />;

  const Screen = SCREENS[view] ?? Today;
  return <Screen />;
}

function Root() {
  const { account, toasts, dismissToast, navigate, open } = useApp();

  /* A popped-out assistant can drive this window. */
  useEffect(() => {
    const onMessage = (e) => {
      if (e.origin !== window.location.origin) return;
      const go = e.data?.source === "sparrow-assistant" ? e.data.go : null;
      if (!go) return;
      if (go.type === "view") navigate(go.id);
      else open(go.type, go.id);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate, open]);

  if (!account) {
    return (
      <>
        <Login />
        <Toasts toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <>
      <Shell>
        <Routed />
      </Shell>
      <CommandPalette />
      <Assistant />
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

function AssistantWindow() {
  const { toasts, dismissToast } = useApp();
  return (
    <>
      <Assistant standalone />
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default function App() {
  const standalone = isAssistantWindow();
  return (
    <AppState>{standalone ? <AssistantWindow /> : <Root />}</AppState>
  );
}
