import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const PAUSE_KEY = "sparrow.paused";

/*
  One store for everything the console can actually do. Keeping it here is why
  pausing the assistant changes the rail, the header and every action button at
  once, instead of each screen pretending on its own.
*/

const Ctx = createContext(null);

export const ACCOUNTS = {
  md: {
    id: "bhaskar",
    role: "Managing Director",
    label: "Bhaskar Arya",
    email: "bhaskar@sparrowshopfits.com",
    can: ["schedule", "cancel", "override", "pause", "release"],
  },
  ea: {
    id: "onkar",
    role: "Executive Assistant",
    label: "Onkar",
    email: "onkar.s@sparrowshopfits.com",
    can: ["schedule", "cancel", "release"],
  },
};

export function AppState({ children }) {
  const [account, setAccount] = useState(null);
  const [view, setView] = useState("today");
  const [detail, setDetail] = useState(null); // { type, id }
  const [railOpen, setRailOpen] = useState(true);
  const [paused, setPausedRaw] = useState(() => {
    try {
      return window.localStorage.getItem(PAUSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  /*
    Pause is mirrored through localStorage so the console and a popped-out
    assistant window agree on whether the assistant is allowed to act.
  */
  const setPaused = useCallback((next) => {
    setPausedRaw(next);
    try {
      window.localStorage.setItem(PAUSE_KEY, next ? "1" : "0");
    } catch {
      /* private mode or blocked storage: the window just keeps its own state */
    }
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === PAUSE_KEY) setPausedRaw(e.newValue === "1");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, tone = "ok") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const top = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const navigate = useCallback(
    (next) => {
      setDetail(null);
      setView(next);
      top();
    },
    [top],
  );

  const open = useCallback(
    (type, id) => {
      setDetail({ type, id });
      top();
    },
    [top],
  );

  const back = useCallback(() => {
    setDetail(null);
    top();
  }, [top]);

  const signIn = useCallback((kind) => {
    setAccount(ACCOUNTS[kind]);
    setView("today");
    setDetail(null);
  }, []);

  const signOut = useCallback(() => {
    setAccount(null);
    setView("today");
    setDetail(null);
    setPaused(false);
  }, [setPaused]);

  const value = useMemo(
    () => ({
      account,
      signIn,
      signOut,
      view,
      navigate,
      detail,
      open,
      back,
      railOpen,
      setRailOpen,
      paused,
      setPaused,
      searchOpen,
      setSearchOpen,
      toasts,
      toast,
      dismissToast,
    }),
    [
      account,
      signIn,
      signOut,
      view,
      navigate,
      detail,
      open,
      back,
      railOpen,
      paused,
      searchOpen,
      toasts,
      toast,
      dismissToast,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppState");
  return ctx;
}
