import Link from "next/link";
import { ArrowRight, Brain, Compass, Ear, HeartHandshake, LockKeyhole, MessageCircle, ShieldCheck, Users, CloudSun, Scale } from "lucide-react";

const support = [
  ["Emotional Health", "Mental health and emotional well-being.", HeartHandshake],
  ["Depression", "Depression and low mood.", CloudSun],
  ["Anxiety Relief", "Anxiety, stress, and overwhelming thoughts.", Brain],
  ["Relationships", "Relationships and family challenges.", Users],
  ["Safe Listening", "Suicidal thoughts and heavy burdens.", Ear],
  ["Life Advice", "Personal struggles and guidance.", Compass],
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF]">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[#222E35] bg-[#111B21]/90 backdrop-blur">
        <div className="container-shell flex h-18 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[#E9EDEF]">
            <span className="grid size-9 place-items-center rounded-xl bg-[#00A884] text-[#0B141A] shadow-[0_2px_10px_rgba(0,168,132,0.35)]">
              <MessageCircle size={20} />
            </span>
            ReachOut
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#about" className="text-[#8696A0] transition hover:text-[#00A884]">About Us</a>
            <a href="#help" className="text-[#8696A0] transition hover:text-[#00A884]">How We Help</a>
            <a href="#works" className="text-[#8696A0] transition hover:text-[#00A884]">How It Works</a>
            <Link href="/crisis-hotlines" className="text-[#8696A0] transition hover:text-[#00A884]">Crisis Hotlines</Link>
            <Link href="/login" className="font-semibold text-[#00A884] transition hover:text-[#25D366]">Sign In</Link>
            <Link href="/register" className="rounded-xl bg-[#00A884] px-5 py-3 font-semibold text-[#0B141A] shadow-[0_4px_14px_rgba(0,168,132,0.3)] transition hover:bg-[#02906f]">
              Get Support
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111B21] via-[#0B141A] to-[#0B141A]">
        <div className="container-shell grid items-center gap-12 py-20 md:grid-cols-[1.15fr_.85fr] md:py-28">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00A884]/30 bg-[#202C33] px-4 py-2 text-sm font-semibold text-[#00A884]">
              <ShieldCheck size={16} />
              A safe place to be heard
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-[#E9EDEF] md:text-6xl">
              You don&apos;t have to carry life&apos;s heaviest moments alone.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#8696A0]">
              Whether you are wrestling with anxiety, personal heartbreak, depression, feeling overwhelmed, or simply need someone trustworthy who will truly listen, ReachOut provides a safe and confidential space to speak with our compassionate support team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-[#8696A0]">
              <span className="flex items-center gap-2 rounded-lg border border-[#222E35] bg-[#111B21] px-3.5 py-2">
                <LockKeyhole size={16} className="text-[#00A884]" />
                100% Confidential
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-[#222E35] bg-[#111B21] px-3.5 py-2">
                <Scale size={16} className="text-[#00A884]" />
                Zero Judgment
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-[#222E35] bg-[#111B21] px-3.5 py-2">
                <HeartHandshake size={16} className="text-[#00A884]" />
                Free Emotional Support
              </span>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-[#00A884] px-6 py-3.5 font-semibold text-[#0B141A] shadow-[0_4px_14px_rgba(0,168,132,0.3)] transition hover:bg-[#02906f]"
              >
                Get Support <ArrowRight className="ml-1 inline" size={18} />
              </Link>
              <Link
                href="/login"
                className="rounded-xl border border-[#2A3942] bg-[#111B21] px-6 py-3.5 font-semibold text-[#E9EDEF] transition hover:bg-[#202C33]"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Interactive Chat Card Preview */}
          <div className="relative mx-auto w-full max-w-md rounded-[28px] border border-[#222E35] bg-[#111B21] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 border-b border-[#222E35] pb-4">
              <div className="grid size-11 place-items-center rounded-full bg-[#00A884]/20 text-[#00A884]">
                <HeartHandshake size={22} />
              </div>
              <div>
                <b className="text-[#E9EDEF]">ReachOut Support Team</b>
                <p className="text-sm text-[#8696A0]">Private Session · Human verified</p>
              </div>
            </div>
            <div className="space-y-3 py-5">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-[#202C33] px-4 py-3 text-sm text-[#E9EDEF] shadow-sm">
                You deserve a safe place to share what&apos;s on your mind. Take your time.
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#005C4B] px-4 py-3 text-sm text-[#E9EDEF] shadow-sm">
                I&apos;m really glad I found this. Thank you.
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-[#2A3942] bg-[#202C33] px-4 py-2.5 text-xs text-[#8696A0]">
              <span className="size-2 rounded-full bg-[#00A884] animate-pulse" />
              Active encryption & auto-cleanup session protection
            </div>
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section id="help" className="border-t border-[#222E35] bg-[#0B141A] py-20">
        <div className="container-shell">
          <div className="mx-auto max-w-xl text-center">
            <p className="font-semibold text-[#00A884]">How we help</p>
            <h2 className="mt-3 text-3xl font-bold text-[#E9EDEF] md:text-4xl">Support for what you&apos;re carrying</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {support.map(([title, text, Icon]) => (
              <article
                key={title}
                className="group rounded-2xl border border-[#222E35] bg-[#111B21] p-6 shadow-sm transition hover:border-[#00A884]/40 hover:bg-[#162229]"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-[#00A884]/15 text-[#00A884] transition group-hover:scale-105">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#E9EDEF]">{title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-[#8696A0]">{text}</p>
                <Link href="/register" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#00A884] transition group-hover:text-[#25D366]">
                  Reach Out About This <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="border-y border-[#222E35] bg-[#111B21] py-20">
        <div className="container-shell grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-semibold text-[#00A884]">About ReachOut</p>
            <h2 className="mt-3 text-3xl font-bold text-[#E9EDEF] md:text-4xl">
              A safe, supportive space for emotional well-being and genuine human guidance.
            </h2>
          </div>
          <p className="text-lg leading-8 text-[#8696A0]">
            ReachOut was created by Zevarone to provide a private platform where people can share their struggles without fear of judgment. Your conversations connect you with a real support administrator—not an automated chatbot.
          </p>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="works" className="bg-[#0B141A] py-20">
        <div className="container-shell">
          <h2 className="text-center text-3xl font-bold text-[#E9EDEF]">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {["Create Your Account", "Share What's On Your Mind", "Receive Personal Guidance"].map((title, i) => (
              <div key={title} className="rounded-2xl border border-[#222E35] bg-[#111B21] p-6 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#00A884] font-bold text-[#0B141A] shadow-[0_2px_12px_rgba(0,168,132,0.3)]">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-bold text-[#E9EDEF]">{title}</h3>
                <p className="mt-2 text-sm text-[#8696A0]">
                  {i === 0 && "Sign up anonymously in seconds with zero personal tracking."}
                  {i === 1 && "Send messages securely whenever you need a listening ear."}
                  {i === 2 && "Connect with compassionate support administrators who care."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immediate Help / Crisis Hotline Banner */}
      <section className="border-y border-[#4A1E22] bg-[#221517] py-10">
        <div className="container-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-[#FF8A8A]">Need immediate emergency help?</h2>
            <p className="mt-1 text-sm text-[#F15C6D]/80">
              ReachOut is supportive guidance, not emergency services.
            </p>
          </div>
          <Link
            href="/crisis-hotlines"
            className="rounded-xl bg-[#E53935] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#D32F2F]"
          >
            View Crisis Hotlines
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222E35] bg-[#0B141A] py-10">
        <div className="container-shell flex flex-col gap-6 pt-2 md:flex-row md:justify-between">
          <div>
            <b className="text-lg text-[#E9EDEF]">ReachOut</b>
            <p className="mt-2 text-sm text-[#8696A0]">Developed by Zevarone · Your Vision, Engineered.</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-[#8696A0]">
            <Link href="/privacy" className="transition hover:text-[#00A884]">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-[#00A884]">Terms of Service</Link>
            <Link href="/data-deletion" className="transition hover:text-[#00A884]">Data Deletion</Link>
            <a href="mailto:contactus@zevarone.com" className="transition hover:text-[#00A884]">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
