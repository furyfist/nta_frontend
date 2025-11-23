import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, UserCog, BookOpen, Users } from 'lucide-react';

const roles: { role: UserRole; title: string; description: string; icon: typeof GraduationCap }[] = [
  {
    role: 'admin',
    title: 'Admin',
    description: 'Full access to manage batches, students, tests, and analytics',
    icon: UserCog,
  },
  {
    role: 'teacher',
    title: 'Teacher',
    description: 'Manage batches, mark attendance, create tests, and view analytics',
    icon: GraduationCap,
  },
  {
    role: 'student',
    title: 'Student',
    description: 'View batches, attendance, test scores, and rankings',
    icon: BookOpen,
  },
  {
    role: 'parent',
    title: 'Parent',
    description: 'Monitor child academic progress and receive notifications',
    icon: Users,
  },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setCurrentRole, setCurrentUserId } = useApp();

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    
    // Set demo user IDs
    if (role === 'student') {
      setCurrentUserId('s1');
    } else if (role === 'teacher') {
      setCurrentUserId('t1');
    } else if (role === 'parent') {
      setCurrentUserId('p1');
    } else {
      setCurrentUserId('admin');
    }
    
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">New Toppers Academy</h1>
          <p className="text-xl text-muted-foreground">Select your role to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map(({ role, title, description, icon: Icon }) => (
            <Card
              key={role}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleRoleSelect(role)}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-primary font-medium">Click to access →</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
