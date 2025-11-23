import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { students, testResults, tests } = useApp();

  const studentScores = students.map(student => {
    const results = testResults.filter(r => r.studentId === student.id);
    
    if (results.length === 0) {
      return { student, averageScore: 0, testsCount: 0, averageRank: 0 };
    }

    const totalPercentage = results.reduce((acc, result) => {
      const test = tests.find(t => t.id === result.testId);
      if (!test) return acc;
      return acc + (result.marks / test.maxMarks) * 100;
    }, 0);

    const averageScore = Math.round(totalPercentage / results.length);
    const averageRank = Math.round(
      results.reduce((acc, r) => acc + r.overallRank, 0) / results.length
    );

    return {
      student,
      averageScore,
      testsCount: results.length,
      averageRank,
    };
  }).sort((a, b) => b.averageScore - a.averageScore);

  const top3 = studentScores.slice(0, 3);
  const rest = studentScores.slice(3);

  return (
    <Layout title="Leaderboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3.map((entry, index) => (
            <Card
              key={entry.student.id}
              className={`cursor-pointer hover:shadow-lg transition-shadow ${
                index === 0 ? 'border-yellow-500 border-2' : index === 1 ? 'border-gray-400 border-2' : 'border-orange-600 border-2'
              }`}
              onClick={() => navigate(`/admin/students/${entry.student.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{entry.student.name}</CardTitle>
                  <Badge variant={index === 0 ? 'default' : 'secondary'}>
                    #{index + 1}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <span className="text-lg font-bold">{entry.averageScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tests Taken</span>
                    <span className="text-sm font-medium">{entry.testsCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Tests Taken</TableHead>
                  <TableHead>Avg Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rest.map((entry, index) => (
                  <TableRow
                    key={entry.student.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/admin/students/${entry.student.id}`)}
                  >
                    <TableCell className="font-medium">#{index + 4}</TableCell>
                    <TableCell>{entry.student.name}</TableCell>
                    <TableCell>{entry.averageScore}%</TableCell>
                    <TableCell>{entry.testsCount}</TableCell>
                    <TableCell>#{entry.averageRank}</TableCell>
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

export default LeaderboardPage;
