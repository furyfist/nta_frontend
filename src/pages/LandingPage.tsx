import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // Reuse existing components!

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">New Toppers Academy</h1>
        <div className="gap-4 flex">
           {/* This Login button effectively replaces your old RoleSelection entry point */}
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto py-20 text-center">
        <h2 className="text-5xl font-extrabold mb-6">Master Your Exams</h2>
        <p className="text-muted-foreground text-xl mb-8">
          The best platform for students to track progress and ace tests.
        </p>
      </main>
    </div>
  );
};

export default LandingPage;