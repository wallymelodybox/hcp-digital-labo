"use client";

import { useEffect, useState } from "react";
import { Inbox, MailWarning } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import type { FormationRegistration } from "@/lib/site-storage";
import type { AttendanceStatus, FormationAttendance } from "@/lib/formation-attendance";
import type { FormationSession } from "@/lib/formation-sessions";

const statusOptions: { label: string; value: AttendanceStatus }[] = [
  { label: "Présent", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Retard", value: "retard" },
  { label: "Excusé", value: "excuse" },
];

const statusStyles: Record<AttendanceStatus, string> = {
  present: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  absent: "border-red-400/25 bg-red-400/10 text-red-200",
  retard: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  excuse: "border-sky-400/25 bg-sky-400/10 text-sky-200",
};

export function AdminFormationAttendance() {
  const [sessions, setSessions] = useState<FormationSession[]>([]);
  const [registrations, setRegistrations] = useState<FormationRegistration[]>([]);
  const [attendance, setAttendance] = useState<FormationAttendance[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/hcp-bo-7x9k2m/formation-sessions", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : [])),
      fetch("/api/hcp-bo-7x9k2m/formation-registrations", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : [])),
      fetch("/api/hcp-bo-7x9k2m/formation-attendance", { credentials: "same-origin" }).then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([sessionsData, registrationsData, attendanceData]) => {
        if (Array.isArray(sessionsData)) {
          setSessions(sessionsData);
          if (sessionsData.length) setSelectedSessionId(sessionsData[0].id);
        }
        if (Array.isArray(registrationsData)) setRegistrations(registrationsData);
        if (Array.isArray(attendanceData)) setAttendance(attendanceData);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger la présence.");
        setLoading(false);
      });
  }, []);

  const participants = registrations.filter(
    (item) => item.sessionId === selectedSessionId && item.status !== "annulee",
  );

  function attendanceFor(registrationId: string) {
    return attendance.find((item) => item.registrationId === registrationId && item.sessionId === selectedSessionId);
  }

  async function markAttendance(registrationId: string, status: AttendanceStatus) {
    const response = await fetch("/api/hcp-bo-7x9k2m/formation-attendance", {
      method: "PATCH",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId, sessionId: selectedSessionId, status }),
    });

    if (response.ok) {
      setAttendance((current) => {
        const existing = current.find((item) => item.registrationId === registrationId && item.sessionId === selectedSessionId);
        if (existing) {
          return current.map((item) => (item.id === existing.id ? { ...item, status } : item));
        }
        return [...current, { id: `local-${registrationId}`, registrationId, sessionId: selectedSessionId, status, markedAt: new Date().toISOString() }];
      });
    }
  }

  if (loading) {
    return <PremiumCard className="p-8 text-sm text-white/50">Chargement...</PremiumCard>;
  }

  if (error) {
    return (
      <PremiumCard className="p-8">
        <div className="flex items-start gap-4 text-red-100">
          <MailWarning className="h-6 w-6 text-red-300" />
          <div>{error}</div>
        </div>
      </PremiumCard>
    );
  }

  if (!sessions.length) {
    return (
      <PremiumCard className="p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Aucune session pour le moment</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
              Créez d&apos;abord une session dans « Sessions Formation » pour pouvoir marquer la présence.
            </p>
          </div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-semibold uppercase tracking-widest text-white/40">Session</label>
        <select
          value={selectedSessionId}
          onChange={(event) => setSelectedSessionId(event.target.value)}
          className="mt-2 w-full max-w-md rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          {sessions.map((session) => (
            <option key={session.id} value={session.id}>
              {session.name} ({new Date(session.startDate).toLocaleDateString("fr-FR")})
            </option>
          ))}
        </select>
      </div>

      {!participants.length ? (
        <PremiumCard className="p-8 text-sm text-white/50">Aucun participant inscrit sur cette session.</PremiumCard>
      ) : (
        <div className="grid gap-4">
          {participants.map((participant) => {
            const current = attendanceFor(participant.id);
            return (
              <PremiumCard key={participant.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{participant.prenoms} {participant.nom}</div>
                    <div className="text-xs text-white/40">{participant.whatsapp}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => markAttendance(participant.id, option.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          current?.status === option.value
                            ? statusStyles[option.value]
                            : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </PremiumCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
