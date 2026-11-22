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
  Scale,
  ShieldCheck,
  Sparkles,
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
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF] lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Left Column: Brand Story & Emotional Safety Pillars */}
      <div
        className="relative hidden flex-col justify-between border-r border-[#222E35] bg-[#111B21] p-12 lg:flex"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(0,168,132,.12) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(37,211,102,.05) 0%, transparent 60%)",
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-[#E9EDEF]">
            <span className="grid size-10 place-items-center rounded-xl bg-[#00A884] text-[#0B141A] shadow-[0_3px_12px_rgba(0,168,132,0.4)]">
              <MessageCircle size={22} />
            </span>
            ReachOut
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#222E35] bg-[#202C33] px-3 py-1.5 text-xs text-[#8696A0] transition hover:text-[#E9EDEF]"
          >
            <ArrowLeft size={13} /> Home
          </Link>
        </div>

        {/* Core Value Proposition for Returning Users */}
        <div className="max-w-lg space-y-7 my-auto py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00A884]/30 bg-[#202C33] px-3.5 py-1.5 text-xs font-semibold text-[#00A884]">
            <ShieldCheck size={15} />
            Confidential & 100% Judgment-Free
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#E9EDEF] xl:text-5xl">
            Your safe space is always waiting for you.
          </h1>

          <p className="text-base leading-relaxed text-[#8696A0]">
            Return to your private conversations with our compassionate human support team whenever you need someone trustworthy who will truly listen.
          </p>

          {/* Pillars List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#00A884]/20 text-[#00A884]">
                <HeartHandshake size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#E9EDEF]">Dedicated Human Listeners</h2>
                <p className="text-xs leading-relaxed text-[#8696A0]">
                  Real support administrators who offer care and genuine guidance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#00A884]/20 text-[#00A884]">
                <Lock size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#E9EDEF]">Session Auto-Clearing</h2>
                <p className="text-xs leading-relaxed text-[#8696A0]">
                  User chat history is automatically cleared from the interface upon sign out.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#00A884]/20 text-[#00A884]">
                <Scale size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#E9EDEF]">Zero Judgment or Stigma</h2>
                <p className="text-xs leading-relaxed text-[#8696A0]">
                  Share your struggles freely in an empathetic, safe atmosphere.
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Style Support Quote Bubble */}
          <div className="rounded-2xl border border-[#222E35] bg-[#202C33]/80 p-4 backdrop-blur shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00A884]">
              <Sparkles size={14} />
              Human emotional support
            </div>
            <p className="mt-2 text-xs italic leading-relaxed text-[#E9EDEF]">
              &ldquo;No burden is too small or too heavy. Take your time, we are here for you.&rdquo;
            </p>
          </div>
        </div>

        {/* Left Footer */}
        <p className="text-xs text-[#8696A0]">
          Developed by Zevarone · Your Vision, Engineered.
        </p>
      </div>

      {/* Right Column: Sign In Form */}
      <div
        className="flex min-h-screen items-center justify-center p-6 md:p-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(0,168,132,.08) 0%, transparent 60%)",
        }}
      >
        <div className="w-full max-w-md">
          {/* Mobile Top Header */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-[#E9EDEF]">
              <span className="grid size-9 place-items-center rounded-xl bg-[#00A884] text-[#0B141A]">
                <MessageCircle size={20} />
              </span>
              ReachOut
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-[#8696A0] hover:text-[#E9EDEF]"
            >
              <ArrowLeft size={13} /> Back
            </Link>
          </div>

          {/* Form Card */}
          <div className="rounded-[28px] border border-[#222E35] bg-[#111B21] p-7 md:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
            <h2 className="text-2xl font-bold text-[#E9EDEF] md:text-3xl">Welcome back</h2>
            <p className="mt-2 text-sm text-[#8696A0]">
              Sign in to resume your private, encrypted session.
            </p>

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

            <form onSubmit={submit} className="mt-6 space-y-4">
              {/* Identity Input */}
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

              {/* Password Input */}
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

              {/* Submit Button */}
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
      </div>
    </main>
  );
}
