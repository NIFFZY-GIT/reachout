"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Globe,
  Heart,
  MessageSquare,
  Phone,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";

export default function CrisisHotlinesPage() {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  function copyToClipboard(text: string) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedNumber(text);
      setTimeout(() => setCopiedNumber(null), 2000);
    });
  }

  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-[#222E35] bg-[#111B21]/95 backdrop-blur">
        <div className="container-shell flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8696A0] transition hover:text-[#00A884]"
          >
            <ArrowLeft size={16} />
            <span>Back to ReachOut</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#00A884] animate-pulse" />
            <span className="text-xs text-[#8696A0]">Free & Confidential · 24/7</span>
          </div>
        </div>
      </header>

      <div className="container-shell max-w-3xl py-8 md:py-12 pb-24 md:pb-12">
        {/* Reassuring Hero Banner */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00A884]/30 bg-[#202C33] px-4 py-1.5 text-xs font-semibold text-[#00A884]">
            <Heart size={14} fill="currentColor" />
            <span>You don&apos;t have to carry this alone</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#E9EDEF] md:text-4xl">
            Crisis & Support Hotlines
          </h1>
          <p className="mt-2 text-sm text-[#8696A0] md:text-base max-w-xl mx-auto leading-relaxed">
            If you are in distress, overwhelmed, or having thoughts of giving up, please reach out right now. Trained people are waiting to listen and support you.
          </p>
        </div>

        {/* Immediate Emergency Notice (Clear & Unintimidating) */}
        <div className="mt-8 rounded-2xl border border-[#5C2329] bg-[#221517] p-4 sm:p-5 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#E53935]/20 text-[#FF8A8A]">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#FF8A8A] md:text-base">
                  Immediate Life-Threatening Danger?
                </h2>
                <p className="text-xs text-[#F15C6D]/90">
                  Please call your local emergency service immediately:
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
              <a
                href="tel:911"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E53935] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#D32F2F] active:scale-95"
              >
                <Phone size={13} />
                <span>911</span>
              </a>
              <a
                href="tel:999"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E53935] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#D32F2F] active:scale-95"
              >
                <Phone size={13} />
                <span>999</span>
              </a>
              <a
                href="tel:112"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E53935] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#D32F2F] active:scale-95"
              >
                <Phone size={13} />
                <span>112</span>
              </a>
              <a
                href="tel:000"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#E53935] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#D32F2F] active:scale-95"
              >
                <Phone size={13} />
                <span>000</span>
              </a>
            </div>
          </div>
        </div>

        {/* The 2 Primary Action Cards (Big, Friendly, Easy to Tap) */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Action 1: Call 988 */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-[#00A884]/40 bg-[#142327] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,168,132,0.12)] transition hover:border-[#00A884]/60">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#00A884] px-2.5 py-1 text-[11px] font-bold text-[#0B141A]">
                  Free · 24/7 · Phone
                </span>
                <span className="text-xl">🇺🇸 🇨🇦</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#E9EDEF]">
                Suicide & Crisis Lifeline
              </h3>
              <p className="mt-1 text-xs text-[#8696A0] leading-relaxed">
                Connect with compassionate counselors for emotional support, suicide prevention, and mental health crisis.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-mono text-3xl font-extrabold tracking-tight text-[#25D366]">
                  988
                </span>
                <button
                  onClick={() => copyToClipboard("988")}
                  className="rounded-lg p-1.5 text-[#8696A0] transition hover:bg-[#202C33] hover:text-[#E9EDEF]"
                  title="Copy 988"
                >
                  {copiedNumber === "988" ? (
                    <span className="flex items-center gap-1 text-xs text-[#00A884] font-medium">
                      <Check size={14} /> Copied
                    </span>
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <a
                href="tel:988"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A884] px-4 py-3 text-sm font-bold text-[#0B141A] shadow-[0_3px_12px_rgba(0,168,132,0.3)] transition hover:bg-[#02906f] active:scale-95 text-center"
              >
                <PhoneCall size={16} />
                <span>Call 988 Now</span>
              </a>
              <a
                href="sms:988"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#2A3942] bg-[#202C33] px-3.5 py-3 text-xs font-semibold text-[#E9EDEF] hover:bg-[#2A3942] active:scale-95 text-center"
              >
                <MessageSquare size={14} className="text-[#00A884]" />
                <span>Text 988</span>
              </a>
            </div>
          </div>

          {/* Action 2: Text 741741 */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-[#222E35] bg-[#111B21] p-5 sm:p-6 shadow-sm transition hover:border-[#00A884]/40">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#202C33] px-2.5 py-1 text-[11px] font-bold text-[#00A884]">
                  Free · 24/7 · Text
                </span>
                <span className="text-xl">💬</span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#E9EDEF]">
                Crisis Text Line
              </h3>
              <p className="mt-1 text-xs text-[#8696A0] leading-relaxed">
                Prefer to text? Message a trained crisis volunteer anytime for confidential support.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-mono text-2xl font-bold tracking-tight text-[#E9EDEF]">
                  Text <span className="text-[#00A884]">HOME</span> to <span className="text-[#25D366]">741741</span>
                </span>
                <button
                  onClick={() => copyToClipboard("741741")}
                  className="rounded-lg p-1.5 text-[#8696A0] transition hover:bg-[#202C33] hover:text-[#E9EDEF]"
                  title="Copy 741741"
                >
                  {copiedNumber === "741741" ? (
                    <span className="flex items-center gap-1 text-xs text-[#00A884] font-medium">
                      <Check size={14} /> Copied
                    </span>
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="sms:741741?body=HOME"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#202C33] border border-[#2A3942] px-4 py-3 text-sm font-bold text-[#E9EDEF] transition hover:border-[#00A884]/50 hover:bg-[#2A3942] active:scale-95 text-center"
              >
                <MessageSquare size={16} className="text-[#00A884]" />
                <span>Text HOME to 741741</span>
              </a>
            </div>
          </div>
        </div>

        {/* Other Global & Regional Helplines */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8696A0]">
            Additional Trusted International Services:
          </h2>

          {/* UK Samaritans */}
          <div className="rounded-2xl border border-[#222E35] bg-[#111B21] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:border-[#2A3942]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇬🇧</span>
                <span className="text-sm font-bold text-[#E9EDEF]">Samaritans (UK)</span>
                <span className="rounded bg-[#202C33] px-2 py-0.5 text-[10px] text-[#8696A0]">Free · 24/7</span>
              </div>
              <p className="text-xs text-[#8696A0]">
                Whatever you&apos;re going through, a Samaritan will listen without judgment.
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-[#222E35] pt-3 sm:pt-0">
              <span className="font-mono text-xl font-bold text-[#25D366]">116 123</span>
              <a
                href="tel:116123"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#00A884] px-4 py-2.5 text-xs font-bold text-[#0B141A] transition hover:bg-[#02906f] active:scale-95"
              >
                <PhoneCall size={14} />
                <span>Call 116 123</span>
              </a>
            </div>
          </div>

          {/* Australia Lifeline */}
          <div className="rounded-2xl border border-[#222E35] bg-[#111B21] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:border-[#2A3942]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇦🇺</span>
                <span className="text-sm font-bold text-[#E9EDEF]">Lifeline (Australia)</span>
                <span className="rounded bg-[#202C33] px-2 py-0.5 text-[10px] text-[#8696A0]">Free · 24/7</span>
              </div>
              <p className="text-xs text-[#8696A0]">
                24-hour crisis support and suicide prevention services across Australia.
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-[#222E35] pt-3 sm:pt-0">
              <span className="font-mono text-xl font-bold text-[#25D366]">13 11 14</span>
              <a
                href="tel:131114"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#00A884] px-4 py-2.5 text-xs font-bold text-[#0B141A] transition hover:bg-[#02906f] active:scale-95"
              >
                <PhoneCall size={14} />
                <span>Call 13 11 14</span>
              </a>
            </div>
          </div>

          {/* Worldwide Directory Card */}
          <div className="rounded-2xl border border-[#222E35] bg-[#111B21] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition hover:border-[#00A884]/40">
            <div className="flex items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#00A884]/15 text-[#00A884]">
                <Globe size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#E9EDEF]">In another country?</h3>
                <p className="text-xs text-[#8696A0] leading-relaxed">
                  Find a free, confidential helpline in over 130 countries worldwide.
                </p>
              </div>
            </div>
            <a
              href="https://findahelpline.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#00A884]/40 bg-[#202C33] px-4 py-2.5 text-xs font-semibold text-[#00A884] transition hover:bg-[#00A884] hover:text-[#0B141A] shrink-0"
            >
              <span>Find Helpline in Your Country</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Calming Disclaimer */}
        <p className="mt-8 text-center text-xs leading-relaxed text-[#8696A0]">
          ReachOut is a private emotional listening platform and not an emergency service. In life-threatening emergencies, please call local emergency services or 911 / 112 / 999 immediately.
        </p>
      </div>

      {/* Mobile Sticky Quick Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[#222E35] bg-[#111B21]/95 p-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <a
            href="tel:988"
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl bg-[#00A884] py-2.5 text-xs font-bold text-[#0B141A] shadow-md active:scale-95 text-center"
          >
            <PhoneCall size={15} />
            <span>Call 988</span>
          </a>
          <a
            href="sms:741741?body=HOME"
            className="flex min-h-[46px] items-center justify-center gap-1.5 rounded-xl border border-[#2A3942] bg-[#202C33] py-2.5 text-xs font-bold text-[#E9EDEF] active:scale-95 text-center"
          >
            <MessageSquare size={15} className="text-[#00A884]" />
            <span>Text 741741</span>
          </a>
        </div>
      </div>
    </main>
  );
}
