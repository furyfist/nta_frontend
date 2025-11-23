import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import RoleSelection from "./pages/RoleSelection";
import AdminDashboard from "./pages/admin/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import ParentDashboard from "./pages/parent/Dashboard";
import BatchesPage from "./pages/admin/Batches";
import BatchDetails from "./pages/admin/BatchDetails";
import StudentProfile from "./pages/admin/StudentProfile";
import AttendancePage from "./pages/admin/Attendance";
import LeaderboardPage from "./pages/admin/Leaderboard";
import AnalyticsPage from "./pages/admin/Analytics";
import TestsPage from "./pages/admin/Tests";
import NotificationsPage from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/batches" element={<BatchesPage />} />
            <Route path="/admin/batches/:id" element={<BatchDetails />} />
            <Route path="/admin/students/:id" element={<StudentProfile />} />
            <Route path="/admin/attendance" element={<AttendancePage />} />
            <Route path="/admin/leaderboard" element={<LeaderboardPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="/admin/tests" element={<TestsPage />} />
            <Route path="/admin/notifications" element={<NotificationsPage />} />
            
            {/* Teacher Routes - reusing admin components */}
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/batches" element={<BatchesPage />} />
            <Route path="/teacher/batches/:id" element={<BatchDetails />} />
            <Route path="/teacher/students/:id" element={<StudentProfile />} />
            <Route path="/teacher/attendance" element={<AttendancePage />} />
            <Route path="/teacher/leaderboard" element={<LeaderboardPage />} />
            <Route path="/teacher/analytics" element={<AnalyticsPage />} />
            <Route path="/teacher/tests" element={<TestsPage />} />
            <Route path="/teacher/notifications" element={<NotificationsPage />} />
            
            {/* Student Routes */}
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/profile/:id" element={<StudentProfile />} />
            <Route path="/student/leaderboard" element={<LeaderboardPage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            
            {/* Parent Routes */}
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/parent/child/:id" element={<StudentProfile />} />
            <Route path="/parent/notifications" element={<NotificationsPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
