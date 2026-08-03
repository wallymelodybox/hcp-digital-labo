import { AdminFormationPaymentsList } from "@/components/admin-formation-payments-list";

export default function AdminFormationPaiementsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Paiements Formation</h2>
        <p className="mt-2 text-white/50">Vue consolidée de tous les paiements liés aux inscriptions Formation.</p>
      </div>

      <AdminFormationPaymentsList />
    </div>
  );
}
