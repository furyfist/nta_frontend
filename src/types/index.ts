export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface Student {
  id: string;
  name: string;
  contact: string;
  email: string;
  batchIds: string[];
  parentId?: string;
}

export interface Batch {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  schedule: string;
  studentIds: string[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  batchId: string;
  date: string;
  present: boolean;
}

export interface Test {
  id: string;
  name: string;
  batchId: string;
  date: string;
  maxMarks: number;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  marks: number;
  batchRank: number;
  overallRank: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  recipients: string[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  childIds: string[];
}
