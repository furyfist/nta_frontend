import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { AttendanceRecord } from '@/types';

const AttendancePage = () => {
  const { batches, students, updateAttendance, attendance } = useApp();
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});

  const batchStudents = selectedBatch 
    ? students.filter(s => s.batchIds.includes(selectedBatch))
    : [];

  // Load existing attendance when batch or date changes
  const loadExistingAttendance = () => {
    if (!selectedBatch) return;
    
    const existing: Record<string, boolean> = {};
    batchStudents.forEach(student => {
      const record = attendance.find(
        a => a.studentId === student.id && a.batchId === selectedBatch && a.date === selectedDate
      );
      existing[student.id] = record?.present ?? true;
    });
    setAttendanceData(existing);
  };

  useState(() => {
    if (selectedBatch && selectedDate) {
      loadExistingAttendance();
    }
  });

  const handleToggle = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleMarkAllPresent = () => {
    const allPresent: Record<string, boolean> = {};
    batchStudents.forEach(student => {
      allPresent[student.id] = true;
    });
    setAttendanceData(allPresent);
  };

  const handleSubmit = () => {
    if (!selectedBatch) {
      toast.error('Please select a batch');
      return;
    }

    const records: AttendanceRecord[] = batchStudents.map(student => ({
      id: `att-${student.id}-${selectedBatch}-${selectedDate}`,
      studentId: student.id,
      batchId: selectedBatch,
      date: selectedDate,
      present: attendanceData[student.id] ?? true,
    }));

    updateAttendance(records);
    toast.success('Attendance marked successfully');
  };

  const presentCount = Object.values(attendanceData).filter(p => p).length;
  const totalCount = batchStudents.length;

  return (
    <Layout title="Mark Attendance">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Batch and Date</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Batch</Label>
                <Select value={selectedBatch} onValueChange={(val) => {
                  setSelectedBatch(val);
                  setAttendanceData({});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            {selectedBatch && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {presentCount} out of {totalCount} present
                </p>
                <Button onClick={handleMarkAllPresent} variant="outline">
                  Mark All Present
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedBatch && batchStudents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {batchStudents.map(student => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={attendanceData[student.id] ?? true}
                        onCheckedChange={() => handleToggle(student.id)}
                      />
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <span className={`text-sm ${attendanceData[student.id] ? 'text-success' : 'text-destructive'}`}>
                      {attendanceData[student.id] ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
              <Button onClick={handleSubmit} className="w-full mt-6">
                Save Attendance
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default AttendancePage;
