"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, Clock3, ArrowRight, Lock } from "lucide-react";
import { useSignOutOnPageExit } from "@/lib/use-sign-out-on-page-exit";

function formatCountdown(value: number | null) {
  if (value === null) return "--:--";
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = (value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function DashboardPage() {
  useSignOutOnPageExit();

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState<number | null>(null);
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    const syncSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (response.status === 401) {
          await fetch("/api/auth/logout", { method: "POST" });
          location.href = "/login";
          return;
        }
        if (!response.ok) return;
        const data = await response.json();
        if (!active) return;
        const timeoutEnabled = data.sessionTimeoutEnabled === true;
        setUser(data.user);
        setSessionTimeoutEnabled(timeoutEnabled);
        const expiry = timeoutEnabled ? new Date(data.expiresAt).getTime() : NaN;
        if (Number.isFinite(expiry)) {
          setSessionExpiresAt(expiry);
        } else {
          setSessionExpiresAt(null);
          setSessionSeconds(null);
        }
      } catch (error) {
        console.error("Could not refresh the user session", error);
      }
    };
    void syncSession();
    const timer = window.setInterval(syncSession, 10000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (sessionExpiresAt === null) return;
    let logoutStarted = false;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((sessionExpiresAt - Date.now()) / 1000));
      setSessionSeconds(remaining);
      if (remaining === 0 && !logoutStarted) {
        logoutStarted = true;
        void fetch("/api/auth/logout", { method: "POST" })
          .catch((error) => console.error("Could not close the expired session", error))
          .finally(() => {
            location.href = "/login";
          });
      }
    };
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [sessionExpiresAt]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF]">
      {/* Top Navigation */}
      <nav className="border-b border-[#222E35] bg-[#111B21]">
        <div className="container-shell flex h-16 items-center justify-between gap-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-[#E9EDEF]">
            <span className="grid size-8 place-items-center rounded-lg bg-[#00A884] text-[#0B141A]">
              <MessageCircle size={18} />
            </span>
            ReachOut
          </Link>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
            {user && (
              <span className="hidden max-w-36 truncate text-xs text-[#8696A0] sm:inline">
                Signed in as <b className="text-[#E9EDEF]">@{user.username}</b>
              </span>
            )}
            <span
              aria-label={
                sessionTimeoutEnabled
                  ? `Automatic sign-out in ${formatCountdown(sessionSeconds)}`
                  : "Automatic sign-out timer off"
              }
              className="rounded-full bg-[#202C33] px-2.5 py-1.5 font-mono text-xs font-semibold text-[#FFD279]"
            >
              {sessionTimeoutEnabled ? formatCountdown(sessionSeconds) : "Timer off"}
            </span>
            <button
              onClick={logout}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#8696A0] transition hover:bg-[#202C33] hover:text-[#E9EDEF]"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Space */}
      <div className="container-shell py-8 sm:py-12">
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#00A884]/30 bg-[#202C33] px-3.5 py-1 text-xs font-semibold text-[#00A884]">
            <Lock size={12} />
            Private support space
          </div>
          <h1 className="mt-2 text-3xl font-bold text-[#E9EDEF] md:text-4xl">
            Welcome back{user ? `, ${user.username}` : ""}.
          </h1>
          <p className="text-sm text-[#8696A0]">
            Our support administrators are ready to listen whenever you want to talk.
          </p>
        </div>

        {/* Status Cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#222E35] bg-[#111B21] p-6 shadow-sm">
            <div className="grid size-10 place-items-center rounded-xl bg-[#00A884]/15 text-[#00A884]">
              <ShieldCheck size={20} />
            </div>
            <h2 className="mt-4 text-base font-bold text-[#E9EDEF]">Support Status</h2>
            <p className="mt-1 text-sm text-[#8696A0]">Active & ready for private conversation</p>
          </div>

          <div className="rounded-2xl border border-[#222E35] bg-[#111B21] p-6 shadow-sm">
            <div className="grid size-10 place-items-center rounded-xl bg-[#00A884]/15 text-[#00A884]">
              <Clock3 size={20} />
            </div>
            <h2 className="mt-4 text-base font-bold text-[#E9EDEF]">Session Protection</h2>
            <p className="mt-1 text-sm text-[#8696A0]">Auto cleanup on logout enabled</p>
          </div>

          <div className="rounded-2xl border border-[#00A884]/40 bg-[#005C4B] p-6 text-[#E9EDEF] shadow-[0_8px_24px_rgba(0,168,132,0.2)]">
            <div className="grid size-10 place-items-center rounded-xl bg-[#25D366]/20 text-[#25D366]">
              <MessageCircle size={20} />
            </div>
            <h2 className="mt-4 text-base font-bold text-[#E9EDEF]">Support Chat</h2>
            <p className="mt-1 text-sm text-[#E9EDEF]/80">Connect directly with administrator</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <Link
            href="/chat"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#00A884] px-5 py-4 text-base font-semibold text-[#0B141A] shadow-[0_4px_18px_rgba(0,168,132,0.35)] transition hover:bg-[#02906f] sm:w-auto sm:px-7"
          >
            <MessageCircle size={20} />
            <span>Open Support Chat</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        <p className="mt-10 max-w-xl text-xs leading-5 text-[#8696A0] border-t border-[#222E35] pt-6">
          ReachOut is supportive human guidance, not emergency services. If you are in immediate personal or medical danger, please call local emergency services or visit our{" "}
          <Link href="/crisis-hotlines" className="text-[#00A884] underline underline-offset-2 hover:text-[#25D366]">
            Crisis Hotlines
          </Link>{" "}
          page.
        </p>
      </div>
    </main>
  );
}
