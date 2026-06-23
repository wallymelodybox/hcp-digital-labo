import { AdminContactsList } from "@/components/admin-contacts-list";

export default function AdminContactsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Demandes contact</h2>
        <p className="mt-2 text-white/50">Messages reçus depuis les formulaires publics du site.</p>
      </div>

      <AdminContactsList />
    </div>
  );
}
