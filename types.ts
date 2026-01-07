
export enum UserRole {
  RESIDENT = 'RESIDENT',
  OWNER = 'OWNER'
}

export interface Milestone {
  id: string;
  text: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  milestones: Milestone[];
}

export interface Shift {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  employer: string;
}

export interface WorkSchedule {
  shifts: Shift[];
}

export interface Attendance {
  id: string;
  date: string;
  type: string;
  location?: string;
  time?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  rentDueThisWeek: number;
  totalPaid: number;
  totalOwed: number;
  schedule: WorkSchedule;
  goals: Goal[];
  attendance?: Attendance[];
}

export interface RecoveryLink {
  title: string;
  url: string;
  type: 'meeting' | 'material';
  description?: string;
}
