import { AdminFormationAttendance } from "@/components/admin-formation-attendance";

export default function AdminFormationPresencePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Présence Formation</h2>
        <p className="mt-2 text-white/50">Marquez la présence des participants par session.</p>
      </div>

      <AdminFormationAttendance />
    </div>
  );
}
