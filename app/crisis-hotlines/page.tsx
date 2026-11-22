import Link from "next/link";
import { ArrowLeft, PhoneCall, AlertTriangle } from "lucide-react";

export default function CrisisHotlinesPage() {
  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF] py-16">
      <div className="container-shell max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#8696A0] transition hover:text-[#00A884] mb-8"
        >
          <ArrowLeft size={16} /> Back to ReachOut
        </Link>
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#00A884]/20 text-[#00A884]">
            <PhoneCall size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl text-[#E9EDEF]">Crisis Hotlines</h1>
            <p className="text-sm text-[#8696A0] mt-1">Free, confidential 24/7 support from trained professionals</p>
          </div>
        </div>

        <div className="mt-8 space-y-6 rounded-2xl border border-[#222E35] bg-[#111B21] p-6 shadow-xl">
          <section className="border-b border-[#222E35] pb-5">
            <h2 className="font-bold text-[#00A884]">Sri Lanka</h2>
            <p className="mt-2 leading-relaxed text-[#8696A0]">
              <strong className="text-[#E9EDEF]">1926</strong> – National Mental Health Helpline<br />
              <strong className="text-[#E9EDEF]">1333</strong> – Sumithrayo Crisis Helpline
            </p>
          </section>
          <section className="border-b border-[#222E35] pb-5">
            <h2 className="font-bold text-[#00A884]">United States & Canada</h2>
            <p className="mt-2 leading-relaxed text-[#8696A0]">
              <strong className="text-[#E9EDEF]">988</strong> – Suicide & Crisis Lifeline (Call or Text)
            </p>
          </section>
          <section className="border-b border-[#222E35] pb-5">
            <h2 className="font-bold text-[#00A884]">United Kingdom</h2>
            <p className="mt-2 leading-relaxed text-[#8696A0]">
              <strong className="text-[#E9EDEF]">999</strong> – Emergency Services<br />
              <strong className="text-[#E9EDEF]">111</strong> – NHS Non-Emergency Medical Advice<br />
              <strong className="text-[#E9EDEF]">116 123</strong> – Samaritans Helpline
            </p>
          </section>
          <section>
            <h2 className="font-bold text-[#00A884]">International</h2>
            <p className="mt-2 text-[#8696A0]">
              Worldwide confidential directories available at{" "}
              <a
                className="font-medium text-[#00A884] underline underline-offset-4 hover:text-[#25D366]"
                href="https://findahelpline.com"
                target="_blank"
                rel="noreferrer"
              >
                findahelpline.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#4A1E22] bg-[#221517] p-5 text-sm text-[#FF8A8A]">
          <AlertTriangle size={20} className="shrink-0 text-[#F15C6D] mt-0.5" />
          <p className="leading-relaxed">
            ReachOut provides supportive human guidance and is not an emergency service, medical provider, or substitute for professional psychiatric healthcare. If you or someone you know is in immediate physical danger, please contact your local emergency services or one of the crisis numbers above right away.
          </p>
        </div>
      </div>
    </main>
  );
}
