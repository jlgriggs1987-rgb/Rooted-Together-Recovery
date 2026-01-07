
import { User, UserRole, RecoveryLink } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'res-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    role: UserRole.RESIDENT,
    rentDueThisWeek: 150,
    totalPaid: 1200,
    totalOwed: 300,
    schedule: {
      shifts: [
        { id: 's1', day: 'Mon', startTime: '08:00', endTime: '16:00', employer: 'Main St. Cafe' },
        { id: 's2', day: 'Wed', startTime: '08:00', endTime: '16:00', employer: 'Main St. Cafe' }
      ]
    },
    goals: [
      {
        id: 'g1',
        title: '90 Days Sober',
        milestones: [
          { id: 'm1', text: '30 Days', completed: true },
          { id: 'm2', text: '60 Days', completed: false },
          { id: 'm3', text: '90 Days', completed: false }
        ]
      }
    ]
  },
  {
    id: 'res-2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    password: 'sarah123',
    role: UserRole.RESIDENT,
    rentDueThisWeek: 150,
    totalPaid: 2400,
    totalOwed: 0,
    schedule: {
      shifts: [
        { id: 's3', day: 'Mon', startTime: '09:00', endTime: '17:00', employer: 'Tech Solutions Inc' },
        { id: 's4', day: 'Tue', startTime: '09:00', endTime: '17:00', employer: 'Tech Solutions Inc' }
      ]
    },
    goals: [
      {
        id: 'g2',
        title: 'Save for Apartment',
        milestones: [
          { id: 'm4', text: 'Save $500', completed: true },
          { id: 'm5', text: 'Save $1000', completed: true },
          { id: 'm6', text: 'Credit Check', completed: false }
        ]
      }
    ]
  }
];

export const OWNER_USER: User = {
  id: 'owner-1',
  name: 'House Manager',
  email: 'owner@beacon.com',
  password: 'password123',
  role: UserRole.OWNER,
  rentDueThisWeek: 0,
  totalPaid: 0,
  totalOwed: 0,
  schedule: { shifts: [] },
  goals: []
};

export const RECOVERY_RESOURCES: RecoveryLink[] = [
  { title: 'AA Online Meetings', url: 'https://aa-intergroup.org/meetings/', type: 'meeting', description: 'Global directory of AA Zoom meetings' },
  { title: 'NA Virtual', url: 'https://virtual-na.org/', type: 'meeting', description: 'Narcotics Anonymous online presence' },
  { title: 'SMART Recovery', url: 'https://www.smartrecovery.org/community/', type: 'meeting', description: 'Science-based self-empowerment' },
  { title: 'The Fix', url: 'https://www.thefix.com/', type: 'material', description: 'Addiction and recovery news' },
  { title: 'Inspiration Daily', url: 'https://www.hazeldenbettyford.org/thought-for-the-day', type: 'material', description: 'Hazelden Betty Ford daily meditations' }
];

export const QUOTES = [
  "Recovery is not for people who need it, it's for people who want it.",
  "One day at a time.",
  "Your best days are ahead of you.",
  "It does not matter how slowly you go as long as you do not stop."
];
