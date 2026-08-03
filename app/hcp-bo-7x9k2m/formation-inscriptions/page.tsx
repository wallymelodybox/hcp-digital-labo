import { AdminFormationRegistrationsList } from "@/components/admin-formation-registrations-list";

export default function AdminFormationInscriptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Inscriptions Formation</h2>
        <p className="mt-2 text-white/50">Demandes reçues depuis la page Formation IA.</p>
      </div>

      <AdminFormationRegistrationsList />
    </div>
  );
}
