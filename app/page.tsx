import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Compass,
  Heart,
  HeartHandshake,
  LifeBuoy,
  LockKeyhole,
  MessageCircle,
  Phone,
  PhoneCall,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
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
  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF] pb-24 md:pb-0">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[#222E35] bg-[#111B21]/95 backdrop-blur">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-[#E9EDEF]">
            <span className="grid size-9 place-items-center rounded-xl bg-[#00A884] text-[#0B141A] shadow-[0_2px_10px_rgba(0,168,132,0.35)]">
              <MessageCircle size={20} />
            </span>
            <span>ReachOut</span>
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

          {/* Mobile Quick Action Nav */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/crisis-hotlines"
              className="inline-flex items-center gap-1 rounded-xl border border-[#5C2329] bg-[#221517] px-2.5 py-1.5 text-xs font-bold text-[#FF8A8A]"
            >
              <Phone size={12} />
              <span>Hotlines</span>
            </Link>
            <Link
              href="/login"
              className="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#00A884]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Emergency Quick Help Alert Bar */}
      <div className="border-b border-[#5C2329] bg-[#221517] px-4 py-2.5 text-center text-xs">
        <div className="container-shell flex flex-col sm:flex-row items-center justify-center gap-2 text-[#FF8A8A]">
          <span className="flex items-center gap-1.5 font-semibold">
            <ShieldAlert size={15} className="shrink-0 text-[#F15C6D]" />
            Immediate life-threatening crisis?
          </span>
          <span className="text-[#F15C6D]/90">
            Call emergency services immediately: <strong>911 / 999 / 112</strong> or visit our{" "}
            <Link href="/crisis-hotlines" className="underline font-bold text-white hover:text-[#FF8A8A]">
              24/7 Crisis Hotlines
            </Link>
            .
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111B21] via-[#0B141A] to-[#0B141A] px-4 py-12 sm:py-16 md:py-24">
        <div className="container-shell grid items-center gap-10 md:grid-cols-[1.15fr_.85fr] md:gap-12">
          <div>
            {/* Crisis Prevention Badge */}
            <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-[#00A884]/30 bg-[#202C33] px-3.5 py-1.5 text-xs font-semibold text-[#00A884]">
              <span className="size-2 rounded-full bg-[#00A884] animate-pulse" />
              <span>Confidential Crisis & Suicide Prevention Support</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-[#E9EDEF] sm:text-4xl md:text-5xl lg:text-6xl">
              When life feels too heavy to carry alone.
            </h1>

            {/* Empathetic Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm leading-relaxed text-[#8696A0] sm:text-base md:text-lg sm:leading-8">
              If you are struggling with overwhelming mental stress, panic, deep despair, or contemplating ending your life, please speak with us first. ReachOut connects you directly with a compassionate human listener in a safe, 100% anonymous environment.
            </p>

            {/* Core Trust Pillars */}
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-2.5 text-xs text-[#8696A0]">
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
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#00A884] px-7 py-4 text-base font-bold text-[#0B141A] shadow-[0_4px_16px_rgba(0,168,132,0.35)] transition hover:bg-[#02906f] active:scale-[0.98] text-center"
              >
                <span>Talk to Someone Now</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/crisis-hotlines"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#2A3942] bg-[#202C33] px-6 py-4 text-sm font-semibold text-[#E9EDEF] transition hover:border-[#00A884]/40 hover:bg-[#25333B] active:scale-[0.98] text-center"
              >
                <PhoneCall size={16} className="text-[#FF8A8A]" />
                <span>24/7 Crisis Hotlines</span>
              </Link>
            </div>
          </div>

          {/* Real Emotional Crisis Chat Preview */}
          <div className="relative mx-auto w-full max-w-md rounded-[28px] border border-[#222E35] bg-[#111B21] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 border-b border-[#222E35] pb-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#00A884]/20 text-[#00A884]">
                <HeartHandshake size={22} />
              </div>
              <div>
                <b className="text-sm text-[#E9EDEF]">ReachOut Support Administrator</b>
                <p className="text-xs text-[#8696A0]">Private Crisis Session · Human Verified</p>
              </div>
            </div>

            {/* Chat Bubble Flow */}
            <div className="space-y-3 py-5">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#202C33] px-4 py-3 text-xs sm:text-sm text-[#E9EDEF] leading-relaxed shadow-sm">
                I&apos;m here with you. Take all the time you need. What feels the heaviest right now?
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#005C4B] px-4 py-3 text-xs sm:text-sm text-[#E9EDEF] leading-relaxed shadow-sm">
                I feel like I&apos;m falling apart and I didn&apos;t know who to tell without burdening anyone.
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#202C33] px-4 py-3 text-xs sm:text-sm text-[#E9EDEF] leading-relaxed shadow-sm">
                You are not a burden. You are safe here, and we will take this one breath and one moment at a time.
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#2A3942] bg-[#202C33] px-3.5 py-2 text-[11px] text-[#8696A0]">
              <span className="size-2 rounded-full bg-[#00A884] animate-pulse" />
              <span>Private session · History auto-clears on sign out</span>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories Section */}
      <section id="support" className="border-t border-[#222E35] bg-[#0B141A] py-14 sm:py-20 px-4">
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00A884]">
              Crisis & Mental Stress Care
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#E9EDEF] sm:text-3xl md:text-4xl">
              Support for life&apos;s darkest and hardest moments
            </h2>
            <p className="mt-3 text-sm text-[#8696A0] leading-relaxed">
              Whatever you are battling, you don&apos;t have to battle it in silence. We provide caring human listening for any emotional emergency.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {crisisCategories.map(({ title, desc, icon: Icon }) => (
              <article
                key={title}
                className="group rounded-2xl border border-[#222E35] bg-[#111B21] p-5 sm:p-6 shadow-sm transition hover:border-[#00A884]/40 hover:bg-[#152026]"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-[#00A884]/15 text-[#00A884] transition group-hover:scale-105">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#E9EDEF] sm:text-lg">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#8696A0] sm:text-sm">{desc}</p>
                <Link
                  href="/register"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00A884] transition group-hover:text-[#25D366]"
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
      <section id="how-it-works" className="border-y border-[#222E35] bg-[#111B21] py-14 sm:py-20 px-4">
        <div className="container-shell">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-[#E9EDEF] sm:text-3xl">
              How ReachOut Works
            </h2>
            <p className="mt-2 text-xs text-[#8696A0] sm:text-sm">
              Zero friction. Get connected to human support in under 30 seconds.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
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
                className="rounded-2xl border border-[#222E35] bg-[#202C33] p-5 sm:p-6 text-center"
              >
                <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#00A884] text-sm font-bold text-[#0B141A] shadow-[0_2px_10px_rgba(0,168,132,0.3)]">
                  {step}
                </div>
                <h3 className="mt-4 text-base font-bold text-[#E9EDEF]">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#8696A0]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#00A884] px-7 py-3.5 text-sm font-bold text-[#0B141A] shadow-[0_3px_14px_rgba(0,168,132,0.35)] transition hover:bg-[#02906f]"
            >
              <span>Start Your Confidential Session</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Immediate Helpline Banner */}
      <section className="bg-[#221517] border-b border-[#5C2329] py-10 px-4">
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E53935] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-[#D32F2F] active:scale-95 text-center shrink-0"
          >
            <Phone size={15} />
            <span>Open Crisis Directory (24/7)</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222E35] bg-[#0B141A] py-10 px-4">
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
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[#222E35] bg-[#111B21]/95 p-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/crisis-hotlines"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#5C2329] bg-[#221517] py-3 text-xs font-bold text-[#FF8A8A] active:scale-95 text-center"
          >
            <Phone size={14} />
            <span>Crisis Hotlines</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#00A884] py-3 text-xs font-bold text-[#0B141A] shadow-[0_2px_10px_rgba(0,168,132,0.3)] active:scale-95 text-center"
          >
            <span>Talk to Us</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
