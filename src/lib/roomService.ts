import { Room, Student } from '@/types';
import { mockRooms, mockStudents } from '@/lib/mockData';

const ROOMS_KEY = 'hms_rooms';
const STUDENTS_KEY = 'hms_students';

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

export const initStorage = () => {
  loadOrSeed<Room[]>(ROOMS_KEY, mockRooms);
  loadOrSeed<Student[]>(STUDENTS_KEY, mockStudents);
};

export const getRooms = async (): Promise<Room[]> => {
  initStorage();
  const raw = localStorage.getItem(ROOMS_KEY)!;
  return JSON.parse(raw) as Room[];
};

export const getRoomById = async (id: string): Promise<Room | undefined> => {
  const rooms = await getRooms();
  return rooms.find(r => r.id === id);
};

export const createRoom = async (room: Room): Promise<Room> => {
  const rooms = await getRooms();
  rooms.push(room);
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  return room;
};

export const updateRoom = async (id: string, updates: Partial<Room>): Promise<Room | undefined> => {
  const rooms = await getRooms();
  const idx = rooms.findIndex(r => r.id === id);
  if (idx === -1) return undefined;
  rooms[idx] = { ...rooms[idx], ...updates };
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  return rooms[idx];
};

export const deleteRoom = async (id: string): Promise<boolean> => {
  let rooms = await getRooms();
  const exists = rooms.some(r => r.id === id);
  if (!exists) return false;
  rooms = rooms.filter(r => r.id !== id);
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  return true;
};

export const getStudents = async (): Promise<Student[]> => {
  initStorage();
  const raw = localStorage.getItem(STUDENTS_KEY)!;
  return JSON.parse(raw) as Student[];
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student | undefined> => {
  const students = await getStudents();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return undefined;
  students[idx] = { ...students[idx], ...updates };
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return students[idx];
};

export const assignStudentToRoom = async (roomId: string, studentId: string): Promise<{room?: Room; student?: Student}> => {
  const rooms = await getRooms();
  const students = await getStudents();
  const roomIdx = rooms.findIndex(r => r.id === roomId);
  const studentIdx = students.findIndex(s => s.id === studentId);
  if (roomIdx === -1 || studentIdx === -1) return {};

  const room = rooms[roomIdx];
  const student = students[studentIdx];

  // Prevent duplicates and capacity overflow
  if ((room.students || []).some(s => s.id === student.id)) return { room, student };
  if (room.occupied >= room.capacity) return { room, student };

  // assign
  room.students = [...(room.students || []), student];
  room.occupied = (room.occupied || 0) + 1;
  students[studentIdx] = { ...student, roomNumber: room.number };

  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));

  return { room, student: students[studentIdx] };
};

export const removeStudentFromRoom = async (roomId: string, studentId: string): Promise<{room?: Room; student?: Student}> => {
  const rooms = await getRooms();
  const students = await getStudents();
  const roomIdx = rooms.findIndex(r => r.id === roomId);
  const studentIdx = students.findIndex(s => s.id === studentId);
  if (roomIdx === -1 || studentIdx === -1) return {};

  const room = rooms[roomIdx];
  const student = students[studentIdx];

  room.students = (room.students || []).filter(s => s.id !== studentId);
  room.occupied = Math.max(0, (room.occupied || 0) - 1);
  students[studentIdx] = { ...student, roomNumber: undefined };

  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));

  return { room, student: students[studentIdx] };
};

export default {
  initStorage,
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getStudents,
  updateStudent,
  assignStudentToRoom,
  removeStudentFromRoom,
};
