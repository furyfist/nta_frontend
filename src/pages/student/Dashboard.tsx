import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { batches, currentUserId, students, attendance, testResults } = useApp();

  const student = students.find(s => s.id === currentUserId);
  const studentBatches = batches.filter(b => student?.batchIds.includes(b.id));

  const studentAttendance = attendance.filter(a => a.studentId === currentUserId);
  const presentDays = studentAttendance.filter(a => a.present).length;
  const totalDays = studentAttendance.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const studentTestResults = testResults.filter(r => r.studentId === currentUserId);
  const avgRank = studentTestResults.length > 0
    ? Math.round(studentTestResults.reduce((acc, r) => acc + r.overallRank, 0) / studentTestResults.length)
    : 0;

  return (
    <Layout title={`Welcome, ${student?.name || 'Student'}`}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">My Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{studentBatches.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{attendancePercentage}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Average Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">#{avgRank || 'N/A'}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentBatches.map(batch => (
                <div key={batch.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold">{batch.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Teacher: {batch.teacherName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Schedule: {batch.schedule}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => navigate(`/student/profile/${currentUserId}`)}
          >
            <Award className="h-8 w-8" />
            <span>View My Profile</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={() => navigate('/student/leaderboard')}
          >
            <TrendingUp className="h-8 w-8" />
            <span>Leaderboard</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
