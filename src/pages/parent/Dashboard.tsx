import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { parents, students } from '@/data/mockData';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { currentUserId } = useApp();

  const parent = parents.find(p => p.id === currentUserId);
  const children = students.filter(s => parent?.childIds.includes(s.id));

  return (
    <Layout title={`Welcome, ${parent?.name || 'Parent'}`}>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>My Children</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map(child => (
                <Card
                  key={child.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/parent/child/${child.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {child.email}
                    </p>
                    <Button variant="outline" className="w-full">
                      View Progress →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ParentDashboard;
