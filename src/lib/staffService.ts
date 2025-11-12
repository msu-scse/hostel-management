import { Staff } from '@/types';

const STORAGE_KEY = 'hms_staff';

const seedStaff: Staff[] = [
  {
    id: 'st1',
    name: 'Warden Singh',
    email: 'warden@medhavi.edu',
    phone: '+91 9876500001',
    role: 'warden',
    position: 'Hostel Warden',
    hostel: 'Block A',
  },
  {
    id: 'st2',
    name: 'Mess Warden',
    email: 'mess.warden@medhavi.edu',
    phone: '+91 9876500002',
    role: 'other',
    position: 'Mess Warden',
  },
];

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStaff));
  }
}

const getStaff = async (): Promise<Staff[]> => {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Staff[];
};

const getStaffById = async (id: string): Promise<Staff | undefined> => {
  const list = await getStaff();
  return list.find((s) => s.id === id);
};

const createStaff = async (staff: Staff): Promise<void> => {
  const list = await getStaff();
  list.push(staff);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const updateStaff = async (id: string, updates: Partial<Staff>): Promise<Staff | undefined> => {
  const list = await getStaff();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  const updated = { ...list[idx], ...updates };
  list[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return updated;
};

const deleteStaff = async (id: string): Promise<boolean> => {
  const list = await getStaff();
  const filtered = list.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length !== list.length;
};

export default {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
