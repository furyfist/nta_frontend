import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Batch } from '@/types';

const BatchesPage = () => {
  const navigate = useNavigate();
  const { batches, addBatch, students } = useApp();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    teacherName: '',
    schedule: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: Batch = {
      id: `b${Date.now()}`,
      name: formData.name,
      teacherId: `t${Date.now()}`,
      teacherName: formData.teacherName,
      schedule: formData.schedule,
      studentIds: [],
    };
    addBatch(newBatch);
    setFormData({ name: '', teacherName: '', schedule: '' });
    setOpen(false);
  };

  const getStudentCount = (batchId: string) => {
    return students.filter(s => s.batchIds.includes(batchId)).length;
  };

  return (
    <Layout title="Batches Management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">All Batches</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Batch</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Batch Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Mathematics Advanced - Grade 12"
                    required
                  />
                </div>
                <div>
                  <Label>Teacher Name</Label>
                  <Input
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    placeholder="e.g., Dr. John Smith"
                    required
                  />
                </div>
                <div>
                  <Label>Schedule</Label>
                  <Input
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="e.g., Mon, Wed, Fri - 10:00 AM to 12:00 PM"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Create Batch</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Card
              key={batch.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/admin/batches/${batch.id}`)}
            >
              <CardHeader>
                <CardTitle>{batch.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Teacher:</span> {batch.teacherName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Schedule:</span> {batch.schedule}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Students:</span> {getStudentCount(batch.id)}
                </p>
                <Button variant="outline" className="w-full mt-4" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/batches/${batch.id}`);
                }}>
                  View Details →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BatchesPage;
