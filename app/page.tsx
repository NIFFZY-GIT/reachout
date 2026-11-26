"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Compass,
  Heart,
  HeartHandshake,
  LifeBuoy,
  LockKeyhole,
  Menu,
  MessageCircle,
  Phone,
  PhoneCall,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const crisisCategories = [
  {
    title: "Suicide Prevention",
    desc: "When you feel like giving up, having thoughts of self-harm, or can't see a way forward. Let someone sit with you.",
    icon: LifeBuoy,
  },
  {
    title: "Acute Mental Stress & Overwhelm",
    desc: "When crushing pressure from work, family, or trauma feels suffocating and you can no longer cope alone.",
    icon: Brain,
  },
  {
    title: "Severe Anxiety & Panic",
    desc: "Grounding, steady human presence when your heart is racing, thoughts spiral out of control, or panic takes over.",
    icon: Sparkles,
  },
  {
    title: "Deep Depression & Loneliness",
    desc: "A safe, patient, zero-pressure space for the days when simply getting out of bed feels like an impossible mountain.",
    icon: Heart,
  },
  {
    title: "Grief, Heartbreak & Loss",
    desc: "Compassionate listening through profound grief, relationship breakdowns, and painful life crises.",
    icon: Users,
  },
  {
    title: "100% Anonymous & Confidential",
    desc: "No real names, no tracking, and conversation records auto-clear on logout for complete privacy.",
    icon: LockKeyhole,
  },
] as const;

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF] pb-24 md:pb-0">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[#222E35] bg-[#111B21]/95 backdrop-blur">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-[#E9EDEF]">
            <span className="grid size-9 place-items-center rounded-xl bg-[#00A884] text-[#0B141A] shadow-[0_2px_10px_rgba(0,168,132,0.35)]">
              <MessageCircle size={20} />
            </span>
            <span className="tracking-tight">ReachOut</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#support" className="text-[#8696A0] transition hover:text-[#00A884]">Crisis Support</a>
            <a href="#how-it-works" className="text-[#8696A0] transition hover:text-[#00A884]">How It Works</a>
            <a href="#confidentiality" className="text-[#8696A0] transition hover:text-[#00A884]">Confidentiality</a>
            <Link
              href="/crisis-hotlines"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF8A8A] transition hover:text-[#FF5252]"
            >
              <Phone size={14} />
              <span>Hotlines (24/7)</span>
            </Link>
            <Link href="/login" className="font-semibold text-[#00A884] transition hover:text-[#25D366]">
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#00A884] px-5 py-2.5 font-semibold text-[#0B141A] shadow-[0_3px_12px_rgba(0,168,132,0.3)] transition hover:bg-[#02906f]"
            >
              Talk to Someone
            </Link>
          </div>

          {/* Mobile Actions: Hotlines button + Hamburger toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/crisis-hotlines"
              className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-[#5C2329] bg-[#221517] px-3 py-1.5 text-xs font-bold text-[#FF8A8A] active:scale-95"
            >
              <Phone size={13} />
              <span>Hotlines</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="grid size-10 place-items-center rounded-xl border border-[#222E35] bg-[#202C33] text-[#E9EDEF] transition active:scale-95 hover:bg-[#2A3942]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Sheet */}
        {mobileMenuOpen && (
          <div className="border-b border-[#222E35] bg-[#111B21] px-4 py-5 shadow-2xl md:hidden animate-[fadeIn_.15s_ease-out]">
            <div className="container-shell space-y-4">
              <div className="rounded-xl border border-[#5C2329] bg-[#221517] p-3 text-xs text-[#FF8A8A]">
                <div className="flex items-center gap-2 font-bold">
                  <ShieldAlert size={14} className="shrink-0 text-[#F15C6D]" />
                  <span>Immediate Crisis Lifeline</span>
                </div>
                <p className="mt-1 text-[11px] text-[#F15C6D]/90 leading-relaxed">
                  Free, confidential 24/7 suicide & crisis lines available worldwide.
                </p>
                <Link
                  href="/crisis-hotlines"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-[#E53935] py-2 text-xs font-bold text-white shadow-sm"
                >
                  <Phone size={13} />
                  <span>Open Crisis Directory (988, 741741, 112)</span>
                </Link>
              </div>

              <div className="space-y-1 pt-1">
                <a
                  href="#support"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-[#E9EDEF] hover:bg-[#202C33]"
                >
                  <span>Crisis & Mental Care Support</span>
                  <ArrowRight size={14} className="text-[#8696A0]" />
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-[#E9EDEF] hover:bg-[#202C33]"
                >
                  <span>How ReachOut Works</span>
                  <ArrowRight size={14} className="text-[#8696A0]" />
                </a>
                <a
                  href="#confidentiality"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl p-3 text-sm font-medium text-[#E9EDEF] hover:bg-[#202C33]"
                >
                  <span>Confidentiality & Privacy</span>
                  <ArrowRight size={14} className="text-[#8696A0]" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-[#222E35] pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded-xl border border-[#2A3942] bg-[#202C33] text-xs font-bold text-[#00A884] active:scale-95"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center justify-center rounded-xl bg-[#00A884] text-xs font-bold text-[#0B141A] shadow-md active:scale-95"
                >
                  Talk to Someone
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Emergency Quick Help Alert Bar */}
      <div className="border-b border-[#5C2329] bg-[#221517] px-3.5 py-2.5 text-center text-xs">
        <div className="container-shell flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-[#FF8A8A]">
          <span className="flex items-center gap-1.5 font-semibold text-left sm:text-center">
            <ShieldAlert size={15} className="shrink-0 text-[#F15C6D]" />
            Immediate life-threatening crisis?
          </span>
          <span className="text-[#F15C6D]/90 text-left sm:text-center text-[11px] sm:text-xs">
            Call emergency services immediately: <strong>911 / 999 / 112</strong> or visit our{" "}
            <Link href="/crisis-hotlines" className="underline font-bold text-white hover:text-[#FF8A8A]">
              24/7 Crisis Hotlines
            </Link>
            .
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111B21] via-[#0B141A] to-[#0B141A] px-3.5 py-10 sm:px-4 sm:py-16 md:py-24">
        <div className="container-shell grid items-center gap-8 md:grid-cols-[1.15fr_.85fr] md:gap-12">
          <div>
            {/* Crisis Prevention Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00A884]/30 bg-[#202C33] px-3.5 py-1.5 text-xs font-semibold text-[#00A884]">
              <span className="size-2 rounded-full bg-[#00A884] animate-pulse" />
              <span>Confidential Crisis & Suicide Prevention Support</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-extrabold leading-[1.18] tracking-tight text-[#E9EDEF] sm:text-4xl md:text-5xl lg:text-6xl">
              When life feels too heavy to carry alone.
            </h1>

            {/* Empathetic Subtitle */}
            <p className="mt-4 text-sm leading-relaxed text-[#8696A0] sm:text-base md:text-lg sm:leading-8">
              If you are struggling with overwhelming mental stress, panic, deep despair, or contemplating ending your life, please speak with us first. ReachOut connects you directly with a compassionate human listener in a safe, 100% anonymous environment.
            </p>

            {/* Core Trust Pillars */}
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 text-xs text-[#8696A0]">
              <span className="flex items-center gap-1.5 rounded-xl border border-[#222E35] bg-[#111B21] px-3 py-2">
                <LockKeyhole size={14} className="text-[#00A884]" />
                100% Anonymous
              </span>
              <span className="flex items-center gap-1.5 rounded-xl border border-[#222E35] bg-[#111B21] px-3 py-2">
                <HeartHandshake size={14} className="text-[#00A884]" />
                Real Humans · Never AI
              </span>
              <span className="flex items-center gap-1.5 rounded-xl border border-[#222E35] bg-[#111B21] px-3 py-2">
                <Scale size={14} className="text-[#00A884]" />
                Zero Judgment
              </span>
            </div>

            {/* Primary Action Buttons (Mobile-First Full Width) */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-[#00A884] px-7 py-3.5 sm:py-4 text-base font-bold text-[#0B141A] shadow-[0_4px_16px_rgba(0,168,132,0.35)] transition hover:bg-[#02906f] active:scale-[0.98] text-center"
              >
                <span>Talk to Someone Now</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/crisis-hotlines"
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-[#2A3942] bg-[#202C33] px-6 py-3.5 sm:py-4 text-sm font-semibold text-[#E9EDEF] transition hover:border-[#00A884]/40 hover:bg-[#25333B] active:scale-[0.98] text-center"
              >
                <PhoneCall size={16} className="text-[#FF8A8A]" />
                <span>24/7 Crisis Hotlines</span>
              </Link>
            </div>
          </div>

          {/* Real Emotional Crisis Chat Preview */}
          <div className="relative mx-auto w-full max-w-md rounded-2xl sm:rounded-[28px] border border-[#222E35] bg-[#111B21] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 border-b border-[#222E35] pb-3.5">
              <div className="grid size-10 sm:size-11 shrink-0 place-items-center rounded-full bg-[#00A884]/20 text-[#00A884]">
                <HeartHandshake size={20} className="sm:size-[22px]" />
              </div>
              <div>
                <b className="text-sm text-[#E9EDEF]">ReachOut Support Administrator</b>
                <p className="text-xs text-[#8696A0]">Private Crisis Session · Human Verified</p>
              </div>
            </div>

            {/* Chat Bubble Flow */}
            <div className="space-y-3 py-4 sm:py-5">
              <div className="max-w-[88%] sm:max-w-[85%] rounded-2xl rounded-tl-sm bg-[#202C33] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-[#E9EDEF] leading-relaxed shadow-sm">
                I&apos;m here with you. Take all the time you need. What feels the heaviest right now?
              </div>
              <div className="ml-auto max-w-[88%] sm:max-w-[85%] rounded-2xl rounded-tr-sm bg-[#005C4B] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-[#E9EDEF] leading-relaxed shadow-sm">
                I feel like I&apos;m falling apart and I didn&apos;t know who to tell without burdening anyone.
              </div>
              <div className="max-w-[88%] sm:max-w-[85%] rounded-2xl rounded-tl-sm bg-[#202C33] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-[#E9EDEF] leading-relaxed shadow-sm">
                You are not a burden. You are safe here, and we will take this one breath and one moment at a time.
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#2A3942] bg-[#202C33] px-3 py-2 text-[11px] text-[#8696A0]">
              <span className="size-2 rounded-full bg-[#00A884] animate-pulse" />
              <span>Private session · History auto-clears on sign out</span>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories Section */}
      <section id="support" className="border-t border-[#222E35] bg-[#0B141A] py-12 sm:py-20 px-3.5 sm:px-4">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A884]">
              Crisis & Mental Stress Care
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#E9EDEF] sm:text-3xl md:text-4xl">
              Support for life&apos;s darkest and hardest moments
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#8696A0] leading-relaxed">
              Whatever you are battling, you don&apos;t have to battle it in silence. We provide caring human listening for any emotional emergency.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid gap-3.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {crisisCategories.map(({ title, desc, icon: Icon }) => (
              <article
                key={title}
                className="group rounded-2xl border border-[#222E35] bg-[#111B21] p-4 sm:p-6 shadow-sm transition hover:border-[#00A884]/40 hover:bg-[#152026]"
              >
                <div className="grid size-10 sm:size-11 place-items-center rounded-xl bg-[#00A884]/15 text-[#00A884] transition group-hover:scale-105">
                  <Icon size={20} className="sm:size-[22px]" />
                </div>
                <h3 className="mt-3.5 sm:mt-4 text-base font-bold text-[#E9EDEF] sm:text-lg">{title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-[#8696A0] sm:text-sm">{desc}</p>
                <Link
                  href="/register"
                  className="mt-3.5 sm:mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A884] transition group-hover:text-[#25D366]"
                >
                  <span>Connect about this</span>
                  <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Simple & Intimidating-Free) */}
      <section id="how-it-works" className="border-y border-[#222E35] bg-[#111B21] py-12 sm:py-20 px-3.5 sm:px-4">
        <div className="container-shell">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-[#E9EDEF] sm:text-3xl">
              How ReachOut Works
            </h2>
            <p className="mt-2 text-xs text-[#8696A0] sm:text-sm">
              Zero friction. Get connected to human support in under 30 seconds.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create an Anonymous Account",
                desc: "No real name, phone number, or social profile required. Sign up anonymously in seconds.",
              },
              {
                step: "2",
                title: "Share What You're Carrying",
                desc: "Send a message about whatever is hurting or overwhelming you. No filters or pretense needed.",
              },
              {
                step: "3",
                title: "Get Compassionate Guidance",
                desc: "Speak with a dedicated support administrator who listens without judgment and helps you breathe.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="rounded-2xl border border-[#222E35] bg-[#202C33] p-4 sm:p-6 text-center"
              >
                <div className="mx-auto grid size-10 sm:size-11 place-items-center rounded-full bg-[#00A884] text-sm font-bold text-[#0B141A] shadow-[0_2px_10px_rgba(0,168,132,0.3)]">
                  {step}
                </div>
                <h3 className="mt-3.5 sm:mt-4 text-base font-bold text-[#E9EDEF]">{title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs leading-relaxed text-[#8696A0]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl bg-[#00A884] px-7 py-3 text-sm font-bold text-[#0B141A] shadow-[0_3px_14px_rgba(0,168,132,0.35)] transition hover:bg-[#02906f] active:scale-95"
            >
              <span>Start Your Confidential Session</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Confidentiality Commitment */}
      <section id="confidentiality" className="border-b border-[#222E35] bg-[#0B141A] py-12 sm:py-20 px-3.5 sm:px-4">
        <div className="container-shell max-w-3xl text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#00A884]/15 text-[#00A884]">
            <ShieldCheck size={26} />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#E9EDEF] sm:text-3xl">
            Our Confidentiality Commitment
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#8696A0] leading-relaxed">
            ReachOut is strictly designed as an emotionally safe haven. We do not demand identity verification, we do not monetize your vulnerabilities, and user chats are automatically wiped from your screen whenever you sign out.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-[#00A884]">
            <span className="rounded-lg bg-[#202C33] px-3 py-1.5 border border-[#2A3942]">No Social Tracking</span>
            <span className="rounded-lg bg-[#202C33] px-3 py-1.5 border border-[#2A3942]">Auto-Clearing UI</span>
            <span className="rounded-lg bg-[#202C33] px-3 py-1.5 border border-[#2A3942]">Encrypted Transit</span>
          </div>
        </div>
      </section>

      {/* Immediate Helpline Banner */}
      <section className="bg-[#221517] border-b border-[#5C2329] py-8 sm:py-10 px-3.5 sm:px-4">
        <div className="container-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#FF8A8A] sm:text-lg">
              Need immediate free crisis calling?
            </h2>
            <p className="text-xs text-[#F15C6D]/90 sm:text-sm">
              Speak directly with worldwide emergency and crisis lifelines right now.
            </p>
          </div>
          <Link
            href="/crisis-hotlines"
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#E53935] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#D32F2F] active:scale-95 text-center shrink-0"
          >
            <Phone size={15} />
            <span>Open Crisis Directory (24/7)</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222E35] bg-[#0B141A] py-10 px-3.5 sm:px-4">
        <div className="container-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-xs text-[#8696A0]">
          <div>
            <b className="text-sm text-[#E9EDEF]">ReachOut</b>
            <p className="mt-1">Crisis Intervention & Emotional Support · Engineered by Zevarone.</p>
          </div>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="/privacy" className="transition hover:text-[#00A884]">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-[#00A884]">Terms of Service</Link>
            <Link href="/data-deletion" className="transition hover:text-[#00A884]">Data Deletion</Link>
            <Link href="/crisis-hotlines" className="transition hover:text-[#00A884]">Hotlines</Link>
            <a href="mailto:contactus@zevarone.com" className="transition hover:text-[#00A884]">Contact</a>
          </div>
        </div>
      </footer>

      {/* Mobile-Only Sticky Floating Bottom Bar for Quick Help */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[#222E35] bg-[#111B21]/95 p-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/crisis-hotlines"
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border border-[#5C2329] bg-[#221517] py-2.5 text-xs font-bold text-[#FF8A8A] active:scale-95 text-center"
          >
            <Phone size={14} />
            <span>Crisis Hotlines</span>
          </Link>
          <Link
            href="/register"
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-[#00A884] py-2.5 text-xs font-bold text-[#0B141A] shadow-[0_2px_10px_rgba(0,168,132,0.3)] active:scale-95 text-center"
          >
            <span>Talk to Us</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
