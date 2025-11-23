import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, ClipboardCheck, TrendingUp, Calendar, Award } from 'lucide-react';
import { teachers } from '@/data/mockData';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { students, batches, attendance, currentUserId } = useApp();

  const teacher = teachers.find(t => t.id === currentUserId);
  const teacherBatches = batches.filter(b => b.teacherId === currentUserId);
  
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.present).length;
  const totalToday = todayAttendance.length;
  const attendancePercentage = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;

  const stats = [
    {
      title: 'My Batches',
      value: teacherBatches.length,
      icon: BookOpen,
      color: 'text-blue-600',
      onClick: () => navigate('/teacher/batches'),
    },
    {
      title: "Today's Attendance",
      value: `${attendancePercentage}%`,
      icon: ClipboardCheck,
      color: 'text-orange-600',
      onClick: () => navigate('/teacher/attendance'),
    },
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'text-green-600',
    },
  ];

  const quickActions = [
    { label: 'My Batches', icon: BookOpen, path: '/teacher/batches' },
    { label: 'Mark Attendance', icon: Calendar, path: '/teacher/attendance' },
    { label: 'View Tests', icon: Award, path: '/teacher/tests' },
    { label: 'Leaderboard', icon: TrendingUp, path: '/teacher/leaderboard' },
  ];

  return (
    <Layout title={`Welcome, ${teacher?.name || 'Teacher'}`}>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className={stat.onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
                onClick={stat.onClick}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="h-20 flex flex-col gap-2"
                    onClick={() => navigate(action.path)}
                  >
                    <Icon className="h-6 w-6" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
