import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Test } from '@/types';

const TestsPage = () => {
  const navigate = useNavigate();
  const { tests, batches, addTest, testResults, students } = useApp();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    maxMarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: Test = {
      id: `test${Date.now()}`,
      name: formData.name,
      batchId: formData.batchId,
      date: formData.date,
      maxMarks: parseInt(formData.maxMarks),
    };
    addTest(newTest);
    setFormData({ name: '', batchId: '', date: new Date().toISOString().split('T')[0], maxMarks: '' });
    setOpen(false);
    toast.success('Test created successfully');
  };

  const getTestStats = (testId: string) => {
    const results = testResults.filter(r => r.testId === testId);
    const test = tests.find(t => t.id === testId);
    if (results.length === 0 || !test) return { avgScore: 0, participation: 0 };

    const totalMarks = results.reduce((acc, r) => acc + r.marks, 0);
    const avgScore = Math.round((totalMarks / results.length / test.maxMarks) * 100);
    
    const batch = batches.find(b => b.id === test.batchId);
    const batchStudents = students.filter(s => s.batchIds.includes(test.batchId));
    const participation = Math.round((results.length / batchStudents.length) * 100);

    return { avgScore, participation };
  };

  return (
    <Layout title="Tests Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">All Tests</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Test</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Test Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mid-Term Math Exam"
                    required
                  />
                </div>
                <div>
                  <Label>Batch</Label>
                  <Select value={formData.batchId} onValueChange={(val) => setFormData({ ...formData, batchId: val })}>
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
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Maximum Marks</Label>
                  <Input
                    type="number"
                    value={formData.maxMarks}
                    onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                    placeholder="e.g., 100"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Create Test</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Max Marks</TableHead>
                  <TableHead>Avg Score</TableHead>
                  <TableHead>Participation</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => {
                  const batch = batches.find(b => b.id === test.batchId);
                  const stats = getTestStats(test.id);
                  return (
                    <TableRow key={test.id}>
                      <TableCell className="font-medium">{test.name}</TableCell>
                      <TableCell>{batch?.name}</TableCell>
                      <TableCell>{new Date(test.date).toLocaleDateString()}</TableCell>
                      <TableCell>{test.maxMarks}</TableCell>
                      <TableCell>{stats.avgScore}%</TableCell>
                      <TableCell>{stats.participation}%</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/tests/${test.id}`)}
                        >
                          View Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TestsPage;
