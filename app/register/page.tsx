"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  HeartHandshake,
  LoaderCircle,
  Lock,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Client-side validation checks
  const isUsernameValid = /^[a-zA-Z0-9_-]{3,30}$/.test(username.trim());
  const isPasswordValid = password.length >= 10;
  const canSubmit = isUsernameValid && isPasswordValid && !loading;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim() || undefined,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed. Please check your details.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Unable to reach the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF] lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Left Column: Brand Story & Trust Signals */}
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

        {/* Core Value Proposition */}
        <div className="max-w-lg space-y-7 my-auto py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00A884]/30 bg-[#202C33] px-3.5 py-1.5 text-xs font-semibold text-[#00A884]">
            <ShieldCheck size={15} />
            100% Anonymous & Zero Judgment
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#E9EDEF] xl:text-5xl">
            A safe, private place to share what&apos;s on your mind.
          </h1>

          <p className="text-base leading-relaxed text-[#8696A0]">
            Speak directly with a compassionate human support administrator. No bots, no clinical pressure, and no personal data exposure.
          </p>

          {/* Pillars List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#00A884]/20 text-[#00A884]">
                <HeartHandshake size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#E9EDEF]">Real Human Guidance</h2>
                <p className="text-xs leading-relaxed text-[#8696A0]">
                  You are never speaking to an AI or scripted bot.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#00A884]/20 text-[#00A884]">
                <Trash2 size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#E9EDEF]">Auto-Clearing Chat History</h2>
                <p className="text-xs leading-relaxed text-[#8696A0]">
                  User-visible records are cleared immediately when you sign out.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#00A884]/20 text-[#00A884]">
                <Lock size={19} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#E9EDEF]">Confidential & Encrypted</h2>
                <p className="text-xs leading-relaxed text-[#8696A0]">
                  No real names, phone numbers, or social accounts required.
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
              &ldquo;You don&apos;t have to carry life&apos;s heaviest moments alone. We&apos;re here to listen.&rdquo;
            </p>
          </div>
        </div>

        {/* Left Footer */}
        <p className="text-xs text-[#8696A0]">
          Developed by Zevarone · Your Vision, Engineered.
        </p>
      </div>

      {/* Right Column: Registration Form */}
      <div
        className="flex min-h-screen items-center justify-center px-4 py-8 sm:p-8 md:p-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(0,168,132,.08) 0%, transparent 60%)",
        }}
      >
        <div className="w-full max-w-md">
          {/* Mobile Top Back Link */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-[#E9EDEF]">
              <span className="grid size-9 place-items-center rounded-xl bg-[#00A884] text-[#0B141A]">
                <MessageCircle size={20} />
              </span>
              ReachOut
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-[36px] items-center gap-1 text-xs text-[#8696A0] hover:text-[#E9EDEF]"
            >
              <ArrowLeft size={13} /> Back
            </Link>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl sm:rounded-[28px] border border-[#222E35] bg-[#111B21] p-5 sm:p-7 md:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
            <h2 className="text-2xl font-bold text-[#E9EDEF] md:text-3xl">Create account</h2>
            <p className="mt-2 text-sm text-[#8696A0]">
              Start your confidential conversation in under 30 seconds.
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
              {/* Username Input */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#8696A0] uppercase tracking-wider">
                    Username
                  </label>
                  {username && (
                    <span
                      className={`text-[11px] font-medium ${
                        isUsernameValid ? "text-[#00A884]" : "text-[#8696A0]"
                      }`}
                    >
                      {isUsernameValid ? "Looks good" : "3-30 letters/numbers"}
                    </span>
                  )}
                </div>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8696A0]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={30}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. anonymous123"
                    className="w-full rounded-xl border border-[#2A3942] bg-[#202C33] py-3 pr-10 pl-10 text-sm text-[#E9EDEF] placeholder:text-[#8696A0] outline-none transition focus:border-[#00A884] focus:ring-2 focus:ring-[#00A884]/20"
                  />
                  {username && isUsernameValid && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#00A884]">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
              </div>

              {/* Email Input (Optional) */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#8696A0] uppercase tracking-wider">
                    Email
                  </label>
                  <span className="text-[11px] text-[#8696A0]">Optional</span>
                </div>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8696A0]">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com (for recovery only)"
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
                    minLength={10}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 10 characters"
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

                {/* Password Live Requirement Checklist */}
                <div className="mt-2.5 flex items-center gap-2 text-xs">
                  {isPasswordValid ? (
                    <Check size={14} className="text-[#00A884] shrink-0" />
                  ) : (
                    <Circle size={14} className="text-[#667781] shrink-0" />
                  )}
                  <span className={isPasswordValid ? "text-[#00A884]" : "text-[#8696A0]"}>
                    At least 10 characters long
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A884] py-3.5 font-semibold text-[#0B141A] shadow-[0_4px_16px_rgba(0,168,132,0.35)] transition hover:bg-[#02906f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Privacy Guarantee Pill */}
            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#222E35] bg-[#202C33]/60 px-3 py-2 text-xs text-[#8696A0]">
              <ShieldCheck size={14} className="text-[#00A884] shrink-0" />
              <span>100% Anonymous · No real name required</span>
            </div>

            {/* Sign in Link */}
            <p className="mt-6 border-t border-[#222E35] pt-5 text-center text-sm text-[#8696A0]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#00A884] underline-offset-4 transition hover:text-[#25D366] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Crisis Hotline Footer Note */}
          <p className="mt-5 text-center text-xs text-[#8696A0]">
            In immediate danger? Call local emergency services or see{" "}
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
