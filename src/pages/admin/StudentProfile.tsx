import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, batches, attendance, testResults, tests } = useApp();

  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <Layout title="Student Not Found">
        <div className="text-center">
          <p className="text-lg mb-4">Student not found</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  const studentBatches = batches.filter(b => student.batchIds.includes(b.id));
  const studentAttendance = attendance.filter(a => a.studentId === id);
  const presentDays = studentAttendance.filter(a => a.present).length;
  const totalDays = studentAttendance.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const studentResults = testResults.filter(r => r.studentId === id);
  const resultsWithTests = studentResults.map(result => {
    const test = tests.find(t => t.id === result.testId);
    const batch = batches.find(b => b.id === test?.batchId);
    return { ...result, test, batch };
  }).sort((a, b) => new Date(b.test?.date || 0).getTime() - new Date(a.test?.date || 0).getTime());

  const chartData = resultsWithTests.slice(0, 5).reverse().map(r => ({
    name: r.test?.name.substring(0, 15) + '...',
    score: r.test ? Math.round((r.marks / r.test.maxMarks) * 100) : 0,
  }));

  const overallRank = studentResults.length > 0 
    ? Math.round(studentResults.reduce((acc, r) => acc + r.overallRank, 0) / studentResults.length)
    : 0;
  const avgBatchRank = studentResults.length > 0
    ? Math.round(studentResults.reduce((acc, r) => acc + r.batchRank, 0) / studentResults.length)
    : 0;

  const attendanceCalendar = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return (
      <div className="grid grid-cols-10 gap-2">
        {last30Days.map(date => {
          const record = studentAttendance.find(a => a.date === date);
          const isPresent = record?.present;
          return (
            <div
              key={date}
              className={`w-8 h-8 rounded ${
                isPresent === undefined ? 'bg-muted' : isPresent ? 'bg-success' : 'bg-destructive'
              }`}
              title={date}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Layout title={student.name}>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.contact}</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Enrolled Batches:</p>
                <div className="flex flex-wrap gap-2">
                  {studentBatches.map(batch => (
                    <Badge key={batch.id} variant="secondary">{batch.name}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-3xl font-bold">{attendancePercentage}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Overall Rank</p>
                <p className="text-3xl font-bold">#{overallRank || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Batch Rank</p>
                <p className="text-3xl font-bold">#{avgBatchRank || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Calendar (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceCalendar()}
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success rounded" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive rounded" />
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted rounded" />
                <span>No Data</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Test Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Batch Rank</TableHead>
                  <TableHead>Overall Rank</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultsWithTests.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.test?.name}</TableCell>
                    <TableCell>{result.batch?.name}</TableCell>
                    <TableCell>{result.marks}/{result.test?.maxMarks}</TableCell>
                    <TableCell>#{result.batchRank}</TableCell>
                    <TableCell>#{result.overallRank}</TableCell>
                    <TableCell>{new Date(result.test?.date || '').toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentProfile;
