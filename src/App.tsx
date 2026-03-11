import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageToggle } from './components/LanguageToggle';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { ReferralPage } from './pages/ReferralPage';
import { SuperstarsPage } from './pages/SuperstarsPage';
import { LoginPage } from './pages/LoginPage';
import { CRMLoginPage } from './pages/CRMLoginPage';

import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminCourseForm } from './pages/admin/AdminCourseForm';
import { AdminWorkshops } from './pages/admin/AdminWorkshops';
import { AdminWorkshopForm } from './pages/admin/AdminWorkshopForm';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminReferrals } from './pages/admin/AdminReferrals';
import { AdminTeamManagement } from './pages/admin/AdminTeamManagement';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

import { CRMLayout } from './layouts/CRMLayout';
import { CRMDashboard } from './pages/crm/CRMDashboard';
import { CRMLeads } from './pages/crm/CRMLeads';
import { CRMLeaderboard } from './pages/crm/CRMLeaderboard';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/workshops" element={<WorkshopsPage />} />
            <Route path="/referral" element={<ReferralPage />} />
            <Route path="/our-superstars" element={<SuperstarsPage />} />

            {/* Login Routes */}
            <Route path="/loginprivate" element={<LoginPage />} />
            <Route path="/crm-login" element={<CRMLoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="courses/new" element={<AdminCourseForm />} />
              <Route path="courses/edit/:id" element={<AdminCourseForm />} />
              <Route path="workshops" element={<AdminWorkshops />} />
              <Route path="workshops/new" element={<AdminWorkshopForm />} />
              <Route path="workshops/edit/:id" element={<AdminWorkshopForm />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="offline-leads" element={<AdminLeads />} />
              <Route path="landing-page-leads" element={<AdminLeads />} />
              <Route path="referrals" element={<AdminReferrals />} />
              <Route path="centres" element={<AdminTeamManagement />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="webhooks" element={<AdminDashboard />} />
              <Route path="landing-pages" element={<AdminDashboard />} />
              <Route path="team-management" element={<AdminTeamManagement />} />
            </Route>

            {/* CRM Routes */}
            <Route
              path="/crm-private"
              element={
                <ProtectedRoute requireCRM>
                  <CRMLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<CRMDashboard />} />
              <Route path="my-leads" element={<CRMLeads />} />
              <Route path="external-leads" element={<CRMLeads />} />
              <Route path="team-workload" element={<CRMDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="leaderboard" element={<CRMLeaderboard />} />
            </Route>

            {/* Course Detail Routes */}
            <Route
              path="/course/:slug"
              element={
                <>
                  <div className="fixed top-4 right-4 z-50">
                    <LanguageToggle />
                  </div>
                  <CoursesPage />
                </>
              }
            />
            <Route
              path="/workshop/:slug"
              element={
                <>
                  <div className="fixed top-4 right-4 z-50">
                    <LanguageToggle />
                  </div>
                  <WorkshopsPage />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
