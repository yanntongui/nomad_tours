import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-admin-bg px-4 dark:bg-stone-950">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-12 w-12 overflow-hidden rounded-xl bg-white shadow-sm">
            <Image src="/nomad-logo.jpg" alt="Nomad Tours" width={48} height={48} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-800 dark:text-stone-100">Nomad Tours Admin</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">Espace réservé au personnel</p>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
          {children}
        </div>
      </div>
    </div>
  );
}
