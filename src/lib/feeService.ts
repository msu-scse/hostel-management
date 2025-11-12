import { Fee } from '@/types';
import { mockFees } from '@/lib/mockData';

const FEES_KEY = 'hms_fees';

const loadOrSeed = <T,>(key: string, seed: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
};

export const initFeesStorage = () => {
  loadOrSeed<Fee[]>(FEES_KEY, mockFees);
};

export const getFees = async (): Promise<Fee[]> => {
  initFeesStorage();
  const raw = localStorage.getItem(FEES_KEY)!;
  return JSON.parse(raw) as Fee[];
};

export const getFeeById = async (id: string): Promise<Fee | undefined> => {
  const fees = await getFees();
  return fees.find(f => f.id === id);
};

export const createFee = async (fee: Fee): Promise<Fee> => {
  const fees = await getFees();
  fees.push(fee);
  localStorage.setItem(FEES_KEY, JSON.stringify(fees));
  return fee;
};

export const updateFee = async (id: string, updates: Partial<Fee>): Promise<Fee | undefined> => {
  const fees = await getFees();
  const idx = fees.findIndex(f => f.id === id);
  if (idx === -1) return undefined;
  fees[idx] = { ...fees[idx], ...updates };
  localStorage.setItem(FEES_KEY, JSON.stringify(fees));
  return fees[idx];
};

export const deleteFee = async (id: string): Promise<boolean> => {
  let fees = await getFees();
  const exists = fees.some(f => f.id === id);
  if (!exists) return false;
  fees = fees.filter(f => f.id !== id);
  localStorage.setItem(FEES_KEY, JSON.stringify(fees));
  return true;
};

export const markFeePaid = async (id: string, paidDate?: string): Promise<Fee | undefined> => {
  const paidAt = paidDate ?? new Date().toISOString();
  return updateFee(id, { status: 'paid', paidDate: paidAt });
};

export default {
  initFeesStorage,
  getFees,
  getFeeById,
  createFee,
  updateFee,
  deleteFee,
  markFeePaid,
};
