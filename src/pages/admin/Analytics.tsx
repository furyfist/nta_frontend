import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsPage = () => {
  const { students, batches, attendance, testResults, tests } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.present).length;
  const totalToday = todayAttendance.length;
  const todayPercentage = totalToday > 0 ? Math.round((presentToday / totalToday) * 100) : 0;

  // Batch performance comparison
  const batchPerformance = batches.map(batch => {
    const batchTests = tests.filter(t => t.batchId === batch.id);
    const batchResults = testResults.filter(r =>
      batchTests.some(t => t.id === r.testId)
    );

    if (batchResults.length === 0) return { name: batch.name.substring(0, 20), avgScore: 0 };

    const totalPercentage = batchResults.reduce((acc, result) => {
      const test = tests.find(t => t.id === result.testId);
      if (!test) return acc;
      return acc + (result.marks / test.maxMarks) * 100;
    }, 0);

    return {
      name: batch.name.substring(0, 20),
      avgScore: Math.round(totalPercentage / batchResults.length),
    };
  });

  // Overall progress over time
  const last5Tests = tests.slice(0, 5).reverse();
  const progressData = last5Tests.map(test => {
    const testResults_filtered = testResults.filter(r => r.testId === test.id);
    const avgScore = testResults_filtered.reduce((acc, r) => acc + r.marks, 0) / testResults_filtered.length;
    const percentage = (avgScore / test.maxMarks) * 100;
    
    return {
      name: test.name.substring(0, 15),
      avgScore: Math.round(percentage),
    };
  });

  return (
    <Layout title="Analytics">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{students.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{batches.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{todayPercentage}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {presentToday}/{totalToday} present
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{tests.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Batch Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={batchPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="avgScore" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="avgScore" stroke="hsl(var(--success))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
