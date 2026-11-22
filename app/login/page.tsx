"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  LoaderCircle,
  Lock,
  MessageCircle,
  ShieldCheck,
  User,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identity.trim() || !password) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity: identity.trim(),
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Sign in failed. Please check your credentials.");
      } else {
        router.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
      }
    } catch {
      setError("Unable to reach the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-[#0B141A] px-4 py-12 text-[#E9EDEF]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(0,168,132,.1) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(0,168,132,.04) 0%, transparent 50%)",
      }}
    >
      {/* Top back navigation */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-[#222E35] bg-[#111B21]/80 px-3.5 py-2 text-xs font-medium text-[#8696A0] backdrop-blur transition hover:border-[#00A884]/40 hover:text-[#E9EDEF]"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-[28px] border border-[#222E35] bg-[#111B21] p-7 md:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur">
          {/* Logo & Header */}
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-[#00A884] text-[#0B141A] shadow-[0_4px_14px_rgba(0,168,132,0.35)]">
              <MessageCircle size={22} />
            </span>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#E9EDEF]">ReachOut</span>
              <p className="text-xs text-[#8696A0]">Confidential emotional support</p>
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-2xl font-bold text-[#E9EDEF] md:text-3xl">Welcome back</h1>
            <p className="mt-2 text-sm text-[#8696A0]">
              Sign in to your private, encrypted session.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#5C2329] bg-[#221517] p-3.5 text-xs text-[#FF8A8A] leading-relaxed"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#F15C6D]" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8696A0] uppercase tracking-wider">
                Username or Email
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8696A0]">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="e.g. anonymous123 or email"
                  className="w-full rounded-xl border border-[#2A3942] bg-[#202C33] py-3 pr-4 pl-10 text-sm text-[#E9EDEF] placeholder:text-[#8696A0] outline-none transition focus:border-[#00A884] focus:ring-2 focus:ring-[#00A884]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8696A0] uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8696A0]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#2A3942] bg-[#202C33] py-3 pr-11 pl-10 text-sm text-[#E9EDEF] placeholder:text-[#8696A0] outline-none transition focus:border-[#00A884] focus:ring-2 focus:ring-[#00A884]/20"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8696A0] transition hover:text-[#E9EDEF]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !identity.trim() || !password}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A884] py-3.5 font-semibold text-[#0B141A] shadow-[0_4px_16px_rgba(0,168,132,0.35)] transition hover:bg-[#02906f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Privacy Guarantee Pill */}
          <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#222E35] bg-[#202C33]/60 px-3 py-2 text-xs text-[#8696A0]">
            <ShieldCheck size={14} className="text-[#00A884] shrink-0" />
            <span>Encrypted · Auto-cleanup session protection</span>
          </div>

          {/* Register Link */}
          <p className="mt-6 border-t border-[#222E35] pt-5 text-center text-sm text-[#8696A0]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#00A884] underline-offset-4 transition hover:text-[#25D366] hover:underline"
            >
              Create one for free
            </Link>
          </p>
        </div>

        {/* Crisis Hotline Footer Note */}
        <p className="mt-5 text-center text-xs text-[#8696A0]">
          In an urgent crisis? Call local emergency services or visit our{" "}
          <Link
            href="/crisis-hotlines"
            className="text-[#00A884] underline underline-offset-2 hover:text-[#25D366]"
          >
            Crisis Hotlines
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
