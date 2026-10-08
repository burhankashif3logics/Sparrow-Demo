import Shell from "./components/Shell";
import CommandPalette from "./components/CommandPalette";
import { Toasts } from "./components/ui";
import { AppState, useApp } from "./state";
import Login from "./screens/Login";
import Today from "./screens/Today";
import Meetings from "./screens/Meetings";
import MeetingDetail from "./screens/MeetingDetail";
import Calls from "./screens/Calls";
import Contacts from "./screens/Contacts";
import ContactDetail from "./screens/ContactDetail";
import Scheduled from "./screens/Scheduled";
import Controls from "./screens/Controls";

const SCREENS = {
  today: Today,
  meetings: Meetings,
  calls: Calls,
  contacts: Contacts,
  scheduled: Scheduled,
  controls: Controls,
};

function Routed() {
  const { view, detail } = useApp();

  if (detail?.type === "meeting") return <MeetingDetail id={detail.id} />;
  if (detail?.type === "contact") return <ContactDetail id={detail.id} />;

  const Screen = SCREENS[view] ?? Today;
  return <Screen />;
}

function Root() {
  const { account, toasts, dismissToast } = useApp();

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
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default function App() {
  return (
    <AppState>
      <Root />
    </AppState>
  );
}
