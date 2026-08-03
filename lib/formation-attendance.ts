export type AttendanceStatus = "present" | "absent" | "retard" | "excuse";

export type FormationAttendance = {
  id: string;
  registrationId: string;
  sessionId: string;
  status: AttendanceStatus;
  markedAt: string;
};
