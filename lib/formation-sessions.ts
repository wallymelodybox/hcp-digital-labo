export type FormationSessionFormat = "en_ligne" | "presentiel" | "hybride";

export type FormationSessionStatus =
  | "prevue"
  | "ouverte"
  | "complete"
  | "en_cours"
  | "terminee"
  | "annulee";

export type FormationSession = {
  id: string;
  name: string;
  formuleId: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  format: FormationSessionFormat;
  location: string;
  capacity: number;
  formateur: string;
  status: FormationSessionStatus;
};

export const defaultFormationSessions: FormationSession[] = [];
