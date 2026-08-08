import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequireRole } from "@/components/admin/RequireRole";
import { getVisaRequest } from "@/lib/server/visas";
import { VisaDetailClient } from "./VisaDetailClient";

export default async function VisaDetailPage({ params }: { params: { id: string } }) {
  const visa = await getVisaRequest(params.id);

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      {visa ? (
        <VisaDetailClient visa={visa} />
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">Demande de visa introuvable.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/admin/visas"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
          </Button>
        </div>
      )}
    </RequireRole>
  );
}
