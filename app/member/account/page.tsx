import { redirect } from "next/navigation";
import { SectionCard } from "@/components/shared/shell";
import { MemberAccountCard } from "@/components/member/member-account-card";
import { getMemberById } from "@/lib/data";
import { requireMemberSession } from "@/lib/route-auth";

export default async function MemberAccountPage() {
  try {
    const session = await requireMemberSession();
    const member = await getMemberById(session.id);

    if (!member) {
      redirect("/member/login");
    }

    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionCard>
          <MemberAccountCard member={member} />
        </SectionCard>
      </div>
    );
  } catch {
    redirect("/member/login");
  }
}
