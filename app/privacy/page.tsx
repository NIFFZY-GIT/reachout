import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF] py-8 sm:py-16">
      <article className="container-shell max-w-3xl">
        <Link
          href="/"
          className="inline-flex min-h-[36px] items-center gap-2 text-sm font-medium text-[#8696A0] transition hover:text-[#00A884] mb-6 sm:mb-8"
        >
          <ArrowLeft size={16} /> Back to ReachOut
        </Link>
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="grid size-11 sm:size-12 shrink-0 place-items-center rounded-2xl bg-[#00A884]/20 text-[#00A884]">
            <Shield size={22} className="sm:size-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold md:text-4xl text-[#E9EDEF]">Privacy Policy</h1>
            <p className="text-xs sm:text-sm text-[#8696A0] mt-1">Our commitment to your security and confidentiality</p>
          </div>
        </div>
        <div className="space-y-5 sm:space-y-6 rounded-2xl border border-[#222E35] bg-[#111B21] p-4 sm:p-6 md:p-8 text-xs sm:text-sm leading-relaxed sm:leading-7 text-[#8696A0] shadow-xl">
          <p>
            ReachOut is designed for private human-to-human emotional support. We collect only the account details and conversation information necessary to operate the platform securely and provide caring support.
          </p>
          <p>
            Account sessions are managed securely in server-side database records. Passwords are cryptographically hashed and private chat pages are protected against browser persistence or public access.
          </p>
          <p>
            When a user signs out or their session expires, user-visible chat records are scheduled for deletion after a 10-minute grace period. The administrator retains historical records required for support, administration, and safety under applicable retention policies.
          </p>
          <p>
            Private conversations are not absolutely confidential. Safety, legal, regulatory, or emergency circumstances may require access or disclosure. ReachOut is not an emergency service and does not replace professional medical care.
          </p>
        </div>
      </article>
    </main>
  );
}
