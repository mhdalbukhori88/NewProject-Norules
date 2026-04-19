import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SectionCard } from "@/components/shared/shell";
import { MemberLoginForm } from "@/components/member/member-login-form";
import { memberSessionCookieName } from "@/lib/session";

export default function MemberLoginPage() {
  const token = cookies().get(memberSessionCookieName)?.value;
  if (token) {
    redirect("/member/account");
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <SectionCard className="w-full">
        <h1 className="text-center font-orbitron text-4xl text-gold-300">
          Login Member NORULES
        </h1>
        <p className="mt-3 text-center text-white/60">
          Masuk memakai nickname dan password member Anda.
        </p>
        <div className="mt-8">
          <MemberLoginForm />
        </div>
      </SectionCard>
    </div>
  );
}
