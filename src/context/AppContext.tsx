import { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, Student, Batch, AttendanceRecord, Test, TestResult, Notification } from '@/types';
import { students as initialStudents, batches as initialBatches, attendanceRecords as initialAttendance, 
  tests as initialTests, testResults as initialTestResults, notifications as initialNotifications } from '@/data/mockData';

interface AppContextType {
  currentRole: UserRole | null;
  currentUserId: string | null;
  setCurrentRole: (role: UserRole | null) => void;
  setCurrentUserId: (id: string | null) => void;
  students: Student[];
  batches: Batch[];
  attendance: AttendanceRecord[];
  tests: Test[];
  testResults: TestResult[];
  notifications: Notification[];
  addBatch: (batch: Batch) => void;
  addStudent: (student: Student) => void;
  updateAttendance: (records: AttendanceRecord[]) => void;
  addTest: (test: Test) => void;
  addTestResults: (results: TestResult[]) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notification: Notification) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [testResults, setTestResults] = useState<TestResult[]>(initialTestResults);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addBatch = (batch: Batch) => {
    setBatches(prev => [...prev, batch]);
  };

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const updateAttendance = (records: AttendanceRecord[]) => {
    setAttendance(prev => {
      const newRecords = [...prev];
      records.forEach(record => {
        const index = newRecords.findIndex(
          r => r.studentId === record.studentId && r.batchId === record.batchId && r.date === record.date
        );
        if (index >= 0) {
          newRecords[index] = record;
        } else {
          newRecords.push(record);
        }
      });
      return newRecords;
    });
  };

  const addTest = (test: Test) => {
    setTests(prev => [...prev, test]);
  };

  const addTestResults = (results: TestResult[]) => {
    setTestResults(prev => [...prev, ...results]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUserId,
        setCurrentRole,
        setCurrentUserId,
        students,
        batches,
        attendance,
        tests,
        testResults,
        notifications,
        addBatch,
        addStudent,
        updateAttendance,
        addTest,
        addTestResults,
        markNotificationRead,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
