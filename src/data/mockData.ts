import { Student, Batch, AttendanceRecord, Test, TestResult, Notification, Teacher, Parent } from '@/types';

export const teachers: Teacher[] = [
  { id: 't1', name: 'Dr. Sarah Johnson', email: 'sarah.j@institute.com' },
  { id: 't2', name: 'Prof. Michael Chen', email: 'michael.c@institute.com' },
  { id: 't3', name: 'Ms. Priya Sharma', email: 'priya.s@institute.com' },
];

export const batches: Batch[] = [
  {
    id: 'b1',
    name: 'Mathematics Advanced - Grade 12',
    teacherId: 't1',
    teacherName: 'Dr. Sarah Johnson',
    schedule: 'Mon, Wed, Fri - 10:00 AM to 12:00 PM',
    studentIds: Array.from({ length: 20 }, (_, i) => `s${i + 1}`),
  },
  {
    id: 'b2',
    name: 'Physics Foundation - Grade 11',
    teacherId: 't2',
    teacherName: 'Prof. Michael Chen',
    schedule: 'Tue, Thu, Sat - 2:00 PM to 4:00 PM',
    studentIds: Array.from({ length: 18 }, (_, i) => `s${i + 10}`),
  },
  {
    id: 'b3',
    name: 'Chemistry Crash Course',
    teacherId: 't3',
    teacherName: 'Ms. Priya Sharma',
    schedule: 'Mon, Wed, Fri - 4:00 PM to 6:00 PM',
    studentIds: Array.from({ length: 22 }, (_, i) => `s${i + 20}`),
  },
];

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Diya', 'Ananya', 'Isha', 'Sara', 'Riya', 
  'Rohan', 'Kabir', 'Ayaan', 'Krishna', 'Advait', 'Prisha', 'Myra', 'Anika', 'Navya', 'Kiara',
  'Aryan', 'Vihaan', 'Reyansh', 'Shaurya', 'Dhruv', 'Saanvi', 'Angel', 'Pari', 'Aaradhya', 'Shanaya',
  'Rudra', 'Ishaan', 'Atharv', 'Arnav', 'Aadhya', 'Anvi', 'Pihu', 'Aarohi', 'Nitya', 'Avni',
  'Ved', 'Laksh', 'Viraj', 'Yash', 'Inaya', 'Ahana', 'Tara', 'Mishka', 'Zara', 'Siya'];

const lastNames = ['Patel', 'Kumar', 'Singh', 'Sharma', 'Verma', 'Reddy', 'Shah', 'Gupta', 'Mehta', 'Desai'];

export const students: Student[] = Array.from({ length: 50 }, (_, i) => {
  const batchAssignments: string[] = [];
  const batchIndex = Math.floor(i / 17);
  
  if (batchIndex === 0 && i < 20) batchAssignments.push('b1');
  if (batchIndex <= 1 && i >= 10 && i < 28) batchAssignments.push('b2');
  if (batchIndex >= 1 && i >= 20) batchAssignments.push('b3');

  return {
    id: `s${i + 1}`,
    name: `${firstNames[i]} ${lastNames[i % 10]}`,
    contact: `+91 ${9000000000 + i * 111111}`,
    email: `${firstNames[i].toLowerCase()}.${lastNames[i % 10].toLowerCase()}@email.com`,
    batchIds: batchAssignments,
    parentId: `p${i + 1}`,
  };
});

export const parents: Parent[] = Array.from({ length: 50 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `Parent of ${students[i].name}`,
  email: `parent${i + 1}@email.com`,
  childIds: [`s${i + 1}`],
}));

// Generate attendance records for the last 30 days
const generateAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() - day);
    const dateStr = date.toISOString().split('T')[0];
    
    batches.forEach(batch => {
      batch.studentIds.forEach(studentId => {
        records.push({
          id: `att-${studentId}-${batch.id}-${dateStr}`,
          studentId,
          batchId: batch.id,
          date: dateStr,
          present: Math.random() > 0.15, // 85% attendance rate
        });
      });
    });
  }
  
  return records;
};

export const attendanceRecords = generateAttendance();

export const tests: Test[] = [
  { id: 'test1', name: 'Mid-Term Math Exam', batchId: 'b1', date: '2025-11-15', maxMarks: 100 },
  { id: 'test2', name: 'Unit Test 1 - Calculus', batchId: 'b1', date: '2025-11-08', maxMarks: 50 },
  { id: 'test3', name: 'Unit Test 2 - Algebra', batchId: 'b1', date: '2025-11-01', maxMarks: 50 },
  { id: 'test4', name: 'Physics Mechanics Test', batchId: 'b2', date: '2025-11-12', maxMarks: 100 },
  { id: 'test5', name: 'Thermodynamics Quiz', batchId: 'b2', date: '2025-11-05', maxMarks: 50 },
  { id: 'test6', name: 'Optics Assessment', batchId: 'b2', date: '2025-10-29', maxMarks: 75 },
  { id: 'test7', name: 'Organic Chemistry Test', batchId: 'b3', date: '2025-11-18', maxMarks: 100 },
  { id: 'test8', name: 'Inorganic Quiz', batchId: 'b3', date: '2025-11-11', maxMarks: 50 },
  { id: 'test9', name: 'Physical Chemistry', batchId: 'b3', date: '2025-11-04', maxMarks: 75 },
  { id: 'test10', name: 'Chemistry Final Mock', batchId: 'b3', date: '2025-10-28', maxMarks: 150 },
];

const generateTestResults = (): TestResult[] => {
  const results: TestResult[] = [];
  
  tests.forEach(test => {
    const batch = batches.find(b => b.id === test.batchId);
    if (!batch) return;
    
    const batchResults = batch.studentIds.map(studentId => {
      const percentage = 0.5 + Math.random() * 0.5; // 50-100% range
      const marks = Math.round(test.maxMarks * percentage);
      return {
        studentId,
        marks,
        testId: test.id,
      };
    }).sort((a, b) => b.marks - a.marks);
    
    batchResults.forEach((result, index) => {
      results.push({
        id: `result-${test.id}-${result.studentId}`,
        testId: test.id,
        studentId: result.studentId,
        marks: result.marks,
        batchRank: index + 1,
        overallRank: index + 1,
      });
    });
  });
  
  return results;
};

export const testResults = generateTestResults();

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'Mid-Term Results Published',
    message: 'Results for Mid-Term Math Exam are now available',
    date: '2025-11-20',
    read: false,
    recipients: ['all'],
  },
  {
    id: 'n2',
    title: 'Class Rescheduled',
    message: 'Mathematics Advanced class on Friday moved to 11:00 AM',
    date: '2025-11-19',
    read: false,
    recipients: ['b1'],
  },
  {
    id: 'n3',
    title: 'New Assignment Posted',
    message: 'Complete Chapter 5 exercises by next Monday',
    date: '2025-11-18',
    read: true,
    recipients: ['b2'],
  },
  {
    id: 'n4',
    title: 'Parent-Teacher Meeting',
    message: 'PTM scheduled for 25th Nov, 10 AM onwards',
    date: '2025-11-17',
    read: true,
    recipients: ['all'],
  },
  {
    id: 'n5',
    title: 'Chemistry Test Results',
    message: 'Organic Chemistry Test results uploaded',
    date: '2025-11-21',
    read: false,
    recipients: ['b3'],
  },
];
