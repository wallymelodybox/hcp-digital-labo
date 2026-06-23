import { PremiumCard } from "@/components/ui/premium-card";
import { siteContact } from "@/lib/site-data";
import { KeyRound, Mail, MapPin, Phone } from "lucide-react";

const settings = [
  { label: "Email", value: siteContact.email, icon: Mail },
  { label: "Téléphone", value: siteContact.phone, icon: Phone },
  { label: "Localisation", value: siteContact.location, icon: MapPin },
  { label: "Protection admin", value: "Variables ADMIN_USER / ADMIN_PASSWORD", icon: KeyRound },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Paramètres</h2>
        <p className="mt-2 text-white/50">Coordonnées globales et état des réglages système.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((setting) => {
          const Icon = setting.icon;
          return (
            <PremiumCard key={setting.label} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/35">{setting.label}</div>
                  <div className="mt-2 text-sm font-semibold text-white">{setting.value}</div>
                </div>
              </div>
            </PremiumCard>
          );
        })}
      </div>
    </div>
  );
}
