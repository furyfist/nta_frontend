import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, ClipboardCheck, TrendingUp, Calendar, Award } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { students, batches, attendance } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.present).length;
  const totalToday = todayAttendance.length;
  const attendancePercentage = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'text-blue-600',
      onClick: () => navigate('/admin/students'),
    },
    {
      title: 'Total Batches',
      value: batches.length,
      icon: BookOpen,
      color: 'text-green-600',
      onClick: () => navigate('/admin/batches'),
    },
    {
      title: "Today's Attendance",
      value: `${attendancePercentage}%`,
      icon: ClipboardCheck,
      color: 'text-orange-600',
      onClick: () => navigate('/admin/attendance'),
    },
    {
      title: 'Analytics',
      value: 'View',
      icon: TrendingUp,
      color: 'text-purple-600',
      onClick: () => navigate('/admin/analytics'),
    },
  ];

  const quickActions = [
    { label: 'Manage Batches', icon: BookOpen, path: '/admin/batches' },
    { label: 'Mark Attendance', icon: Calendar, path: '/admin/attendance' },
    { label: 'View Tests', icon: Award, path: '/admin/tests' },
    { label: 'Leaderboard', icon: TrendingUp, path: '/admin/leaderboard' },
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="cursor-pointer hover:shadow-lg transition-shadow"
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

        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg">
                <span className="font-semibold">{presentToday}</span> out of{' '}
                <span className="font-semibold">{totalToday}</span> students present today
              </p>
              <p className="text-sm text-muted-foreground">
                Overall attendance: {attendancePercentage}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
