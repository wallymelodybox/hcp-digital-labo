import { PremiumCard } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import { MailWarning, PlusCircle } from "lucide-react";

export default function AdminContactsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Demandes contact</h2>
        <p className="mt-2 text-white/50">Suivi des formulaires entrants et état de connexion du module.</p>
      </div>

      <PremiumCard className="p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
              <MailWarning className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Aucune source de demandes connectée</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
                Le formulaire public est présent, mais il n'enregistre pas encore les messages dans Supabase ou dans une boîte email transactionnelle. Cette page est prête pour afficher les demandes dès que la route serveur sera branchée.
              </p>
            </div>
          </div>
          <Button disabled className="gap-2 bg-white/10 text-white/40">
            <PlusCircle className="h-4 w-4" />
            Connexion à prévoir
          </Button>
        </div>
      </PremiumCard>
    </div>
  );
}
