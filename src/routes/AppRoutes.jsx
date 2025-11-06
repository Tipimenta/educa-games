import { Navigate, Route, Routes } from 'react-router-dom';

import { ROLES } from '../constants';
import ManageInstructorsPage from '../pages/Admin/ManageInstructors';
import ManageAnnouncementsPage from '../pages/Instructor/ManageAnnouncements';
import ManageClassesPage from '../pages/Instructor/ManageClasses';
import ManageContentPage from '../pages/Instructor/ManageContent';
import ManageCoursesPage from '../pages/Instructor/ManageCourses';
import ModuleEditor from '../pages/Instructor/ModuleEditor';
import ReportsPage from '../pages/Instructor/Reports';
import StudentProfilePage from '../pages/Instructor/StudentProfile';
import ProfilePage from '../pages/Shared/Profile';
import TestConfirmation from '../pages/Shared/TestConfirmation';
import DashboardPage from '../pages/Student/Dashboard';
import StudentCoursesPage from '../pages/Student/StudentCourses';
import { ProtectedRoute } from './';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentCoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.INSTRUCTOR, ROLES.ADMIN]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/manage-classes"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ManageClassesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/manage-courses"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ManageCoursesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/manage-content"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ManageContentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/module-editor/:moduleId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ModuleEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/module-editor"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ModuleEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/manage-announcements"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ManageAnnouncementsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/reports"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/instructor/student/:studentId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <StudentProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Rota temporária para teste do ConfirmationDialog */}
      <Route
        path="/test-confirmation"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR, ROLES.STUDENT]}>
            <TestConfirmation />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/manage-instructors"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ManageInstructorsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
