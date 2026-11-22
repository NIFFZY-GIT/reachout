import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0B141A] text-[#E9EDEF] py-16">
      <article className="container-shell max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#8696A0] transition hover:text-[#00A884] mb-8"
        >
          <ArrowLeft size={16} /> Back to ReachOut
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#00A884]/20 text-[#00A884]">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl text-[#E9EDEF]">Terms of Service</h1>
            <p className="text-sm text-[#8696A0] mt-1">Platform guidelines and community boundaries</p>
          </div>
        </div>
        <div className="space-y-6 rounded-2xl border border-[#222E35] bg-[#111B21] p-6 md:p-8 leading-7 text-[#8696A0] shadow-xl">
          <p>
            ReachOut provides supportive human guidance. It is not medical care, psychiatric therapy, clinical diagnosis, or emergency dispatch services.
          </p>
          <p>
            Use the platform lawfully and respectfully. You must not impersonate an administrator or attempt to access another user&apos;s conversation or data.
          </p>
          <p>
            Administrators may retain conversation history for support operations and safety. User-visible history is deleted after logout, while administrative records remain subject to the platform&apos;s retention policies.
          </p>
          <p>
            If you or someone around you is facing immediate danger or bodily harm, immediately contact your local emergency services or a crisis hotline.
          </p>
        </div>
      </article>
    </main>
  );
}
