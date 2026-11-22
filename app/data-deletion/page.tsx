import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function DataDeletionPage() {
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
            <Trash2 size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold md:text-4xl text-[#E9EDEF]">Data Deletion</h1>
            <p className="text-sm text-[#8696A0] mt-1">Transparency regarding your data lifecycle</p>
          </div>
        </div>
        <div className="space-y-6 rounded-2xl border border-[#222E35] bg-[#111B21] p-6 md:p-8 leading-7 text-[#8696A0] shadow-xl">
          <p>
            Signing out or session expiration automatically schedules all user-visible conversation records for deletion after a 10-minute grace period. The chat interface is cleared immediately upon sign out.
          </p>
          <p>
            After the grace period, our background deletion worker permanently removes user-facing message records and conversation references.
          </p>
          <p>
            Historical records needed by the support administrator—including conversations and private administrator notes—are securely retained for safety and accountability. Administrative retention is not cleared by user logout.
          </p>
          <p>
            To request full account deletion or legally required removal assistance, please contact our team directly at{" "}
            <a className="font-semibold text-[#00A884] underline underline-offset-4 hover:text-[#25D366]" href="mailto:info@zevarone.com">
              info@zevarone.com
            </a>.
          </p>
        </div>
      </article>
    </main>
  );
}
