import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, MessageSquare, PhoneCall } from "lucide-react";

type HotlineItem = {
  name: string;
  number: string;
  callUrl: string;
  badge: string;
  desc: string;
  isEmergency?: boolean;
  isLink?: boolean;
};

type HotlineSection = {
  region: string;
  flag: string;
  services: HotlineItem[];
};

const GLOBAL_HOTLINES: HotlineSection[] = [
  {
    region: "Worldwide Helpline Finder",
    flag: "🌍",
    services: [
      {
        name: "Find A Helpline (Global)",
        number: "findahelpline.com",
        callUrl: "https://findahelpline.com",
        badge: "130+ Countries · Free & 24/7",
        desc: "Find free, confidential local crisis lines anywhere in the world.",
        isLink: true,
      },
      {
        name: "Befrienders Worldwide",
        number: "befrienders.org",
        callUrl: "https://www.befrienders.org",
        badge: "Global Support Network",
        desc: "Confidential emotional support centers in 32 countries.",
        isLink: true,
      },
    ],
  },
  {
    region: "North America (US & Canada)",
    flag: "🇺🇸 🇨🇦",
    services: [
      {
        name: "Suicide & Crisis Lifeline",
        number: "988",
        callUrl: "tel:988",
        badge: "Free · Call or Text 24/7",
        desc: "Immediate, confidential crisis counseling across the US and Canada.",
      },
      {
        name: "Crisis Text Line",
        number: "Text HOME to 741741",
        callUrl: "sms:741741?body=HOME",
        badge: "Free · 24/7 SMS",
        desc: "Connect with a volunteer crisis counselor via text.",
      },
      {
        name: "Emergency Services",
        number: "911",
        callUrl: "tel:911",
        badge: "Emergency",
        desc: "Police, Medical, Fire",
        isEmergency: true,
      },
    ],
  },
  {
    region: "United Kingdom & Europe",
    flag: "🇬🇧 🇪🇺",
    services: [
      {
        name: "Samaritans Helpline",
        number: "116 123",
        callUrl: "tel:116123",
        badge: "Free · 24/7",
        desc: "Confidential listening for anyone facing distress.",
      },
      {
        name: "Shout Crisis Text Line",
        number: "Text SHOUT to 85258",
        callUrl: "sms:85258?body=SHOUT",
        badge: "Free · 24/7 SMS",
        desc: "Free, confidential text support across the UK.",
      },
      {
        name: "European Emergency Number",
        number: "112",
        callUrl: "tel:112",
        badge: "Emergency",
        desc: "Standard emergency dispatch in Europe and 80+ countries.",
        isEmergency: true,
      },
    ],
  },
  {
    region: "Australia",
    flag: "🇦🇺",
    services: [
      {
        name: "Lifeline Crisis Support",
        number: "13 11 14",
        callUrl: "tel:131114",
        badge: "Free · 24/7",
        desc: "24-hour crisis support and suicide prevention services.",
      },
      {
        name: "Emergency Services",
        number: "000",
        callUrl: "tel:000",
        badge: "Emergency",
        desc: "Immediate emergency assistance in Australia.",
        isEmergency: true,
      },
    ],
  },
];

export default function CrisisHotlinesPage() {
  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[#222E35] bg-[#111B21]/90 backdrop-blur">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8696A0] transition hover:text-[#00A884]"
          >
            <ArrowLeft size={16} />
            <span>Back to ReachOut</span>
          </Link>
          <span className="text-xs text-[#8696A0]">Global Crisis Directory</span>
        </div>
      </header>

      <div className="container-shell max-w-2xl py-8 md:py-12">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E9EDEF] md:text-3xl">
            Crisis & Support Hotlines
          </h1>
          <p className="mt-2 text-sm text-[#8696A0]">
            Free, confidential, and available 24/7 worldwide. If you are experiencing distress, reach out to one of these services right now.
          </p>
        </div>

        {/* Global Hotlines List */}
        <div className="mt-8 space-y-6">
          {GLOBAL_HOTLINES.map((section) => (
            <section
              key={section.region}
              className="rounded-2xl border border-[#222E35] bg-[#111B21] p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-[#222E35]">
                <span className="text-xl">{section.flag}</span>
                <h2 className="text-sm font-bold text-[#E9EDEF]">{section.region}</h2>
              </div>

              <div className="divide-y divide-[#222E35]/60">
                {section.services.map((s) => (
                  <div
                    key={s.name}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3.5 first:pt-3 last:pb-0"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#E9EDEF]">{s.name}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            s.isEmergency
                              ? "bg-[#E53935]/20 text-[#FF8A8A]"
                              : "bg-[#00A884]/20 text-[#00A884]"
                          }`}
                        >
                          {s.badge}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#8696A0]">{s.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <span
                        className={`font-mono text-lg sm:text-xl font-bold ${
                          s.isEmergency
                            ? "text-[#FF8A8A]"
                            : s.isLink
                            ? "text-[#00A884]"
                            : "text-[#25D366]"
                        }`}
                      >
                        {s.number}
                      </span>
                      {s.isLink ? (
                        <a
                          href={s.callUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#00A884]/40 bg-[#202C33] px-3.5 py-2 text-xs font-semibold text-[#00A884] transition hover:bg-[#00A884] hover:text-[#0B141A]"
                        >
                          <span>Visit</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <a
                          href={s.callUrl}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition active:scale-95 ${
                            s.isEmergency
                              ? "bg-[#E53935] text-white hover:bg-[#D32F2F]"
                              : "bg-[#00A884] text-[#0B141A] hover:bg-[#02906f]"
                          }`}
                        >
                          {s.callUrl.startsWith("sms:") ? (
                            <>
                              <MessageSquare size={14} />
                              <span>Text</span>
                            </>
                          ) : (
                            <>
                              <PhoneCall size={14} />
                              <span>Call</span>
                            </>
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Global Notice */}
        <p className="mt-8 text-center text-xs text-[#8696A0]">
          ReachOut provides confidential emotional support and human guidance. In life-threatening emergencies, please call your local emergency service or 112 / 911 immediately.
        </p>
      </div>
    </main>
  );
}
