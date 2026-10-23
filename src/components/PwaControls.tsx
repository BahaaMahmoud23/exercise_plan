import { useEffect, useRef, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function PwaControls() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [registrationError, setRegistrationError] = useState(false);
  const reloading = useRef(false);

  useEffect(() => {
    const install = (event: Event) => { event.preventDefault(); setInstallEvent(event as InstallEvent); };
    const installed = () => setInstallEvent(null);
    const connection = () => setOnline(navigator.onLine);
    window.addEventListener("beforeinstallprompt", install);
    window.addEventListener("appinstalled", installed);
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    return () => {
      window.removeEventListener("beforeinstallprompt", install);
      window.removeEventListener("appinstalled", installed);
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    let disposed = false;
    let registration: ServiceWorkerRegistration | undefined;
    let installing: ServiceWorker | null = null;
    const stateChanged = () => {
      if (installing?.state === "installed" && registration?.waiting && navigator.serviceWorker.controller && !disposed) setWaiting(registration.waiting);
    };
    const updateFound = () => {
      installing?.removeEventListener("statechange", stateChanged);
      installing = registration?.installing ?? null;
      installing?.addEventListener("statechange", stateChanged);
    };
    const check = () => { if (navigator.onLine) registration?.update().catch(() => {}); };
    const controllerChanged = () => { if (reloading.current) window.location.reload(); };
    navigator.serviceWorker.addEventListener("controllerchange", controllerChanged);
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).then(reg => {
      if (disposed) return;
      registration = reg;
      if (reg.waiting) setWaiting(reg.waiting);
      reg.addEventListener("updatefound", updateFound);
      updateFound();
      check();
      navigator.serviceWorker.ready.then(() => { if (!disposed) setReady(true); });
    }).catch(() => { if (!disposed) setRegistrationError(true); });
    window.addEventListener("online", check);
    const interval = window.setInterval(check, 60 * 60 * 1000);
    return () => {
      disposed = true;
      window.clearInterval(interval);
      window.removeEventListener("online", check);
      navigator.serviceWorker.removeEventListener("controllerchange", controllerChanged);
      registration?.removeEventListener("updatefound", updateFound);
      installing?.removeEventListener("statechange", stateChanged);
    };
  }, []);

  return <aside className="pwa-controls" aria-label="App installation and offline status">
    <span role="status">{registrationError ? "Offline setup unavailable. Reopen online to retry." : !online ? (ready ? "Offline · workout logging available" : "Offline · app not cached yet") : ready ? "Ready for offline workouts" : ""}</span>
    {installEvent && <button type="button" className="back-button" onClick={async () => {
      const event = installEvent;
      setInstallEvent(null);
      try { await event.prompt(); await event.userChoice; } catch { /* The browser can withdraw a pending prompt. */ }
    }}>Install app</button>}
    {waiting && <><p>Update ready. Reload when your workout is at a safe stopping point.</p>
      <button type="button" className="back-button" onClick={() => { reloading.current = true; waiting.postMessage({ type: "ACTIVATE_UPDATE" }); }}>Reload to update</button>
    </>}
  </aside>;
}
