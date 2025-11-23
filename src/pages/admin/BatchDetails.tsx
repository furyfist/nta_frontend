import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { batches, students, attendance, testResults, tests } = useApp();

  const batch = batches.find(b => b.id === id);
  const batchStudents = students.filter(s => s.batchIds.includes(id || ''));

  if (!batch) {
    return (
      <Layout title="Batch Not Found">
        <div className="text-center">
          <p className="text-lg mb-4">Batch not found</p>
          <Button onClick={() => navigate('/admin/batches')}>Back to Batches</Button>
        </div>
      </Layout>
    );
  }

  const getAttendancePercentage = (studentId: string) => {
    const studentAttendance = attendance.filter(
      a => a.studentId === studentId && a.batchId === id
    );
    if (studentAttendance.length === 0) return 0;
    const present = studentAttendance.filter(a => a.present).length;
    return Math.round((present / studentAttendance.length) * 100);
  };

  const getLatestScore = (studentId: string) => {
    const batchTests = tests.filter(t => t.batchId === id);
    const studentResults = testResults.filter(
      r => r.studentId === studentId && batchTests.some(t => t.id === r.testId)
    );
    
    if (studentResults.length === 0) return 'N/A';
    
    const latest = studentResults.sort((a, b) => {
      const testA = tests.find(t => t.id === a.testId);
      const testB = tests.find(t => t.id === b.testId);
      return new Date(testB?.date || 0).getTime() - new Date(testA?.date || 0).getTime();
    })[0];

    const test = tests.find(t => t.id === latest.testId);
    return test ? `${latest.marks}/${test.maxMarks}` : 'N/A';
  };

  return (
    <Layout title={batch.name}>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/admin/batches')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Batches
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-medium">Teacher:</span> {batch.teacherName}</p>
            <p><span className="font-medium">Schedule:</span> {batch.schedule}</p>
            <p><span className="font-medium">Total Students:</span> {batchStudents.length}</p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Students in this Batch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batchStudents.map((student) => (
              <Card
                key={student.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/admin/students/${student.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Attendance</span>
                    <span className="text-sm font-medium">{getAttendancePercentage(student.id)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Latest Score</span>
                    <span className="text-sm font-medium">{getLatestScore(student.id)}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View Profile →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BatchDetails;
