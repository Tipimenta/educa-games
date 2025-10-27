import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ROLES } from '../constants';
import { AuthContext } from '../context';
import ManageAnnouncementsPage from '../pages/Admin/ManageAnnouncements';
import ManageClassesPage from '../pages/Admin/ManageClasses';
import ManageContentPage from '../pages/Admin/ManageContent';
import ManageCoursesPage from '../pages/Admin/ManageCourses';
import ModuleEditor from '../pages/Admin/ModuleEditor';
import ReportsPage from '../pages/Admin/Reports';
import StudentProfilePage from '../pages/Admin/StudentProfile';
import DashboardPage from '../pages/Dashboard';
import ProfilePage from '../pages/Profile';
import StudentCoursesPage from '../pages/StudentCourses';
import { ProtectedRoute } from './';

const AppRoutes = ({
  students,
  setStudents,
  courses,
  setCourses,
  modules,
  setModules,
  turmas,
  setTurmas,
  announcements,
  setAnnouncements,
}) => {
  const { user, setUser } = useContext(AuthContext);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const updateStudentProgress = (studentId, type, itemId, pointsToAdd) => {
    setStudents((prevStudents) => {
      const newStudents = [...prevStudents];
      const studentIndex = newStudents.findIndex((s) => s.id === studentId);

      if (studentIndex === -1) return prevStudents;

      const student = { ...newStudents[studentIndex] };
      const progressSet = student.progress[type];
      const todayDateString = getTodayDateString();

      let bonusPoints = 0;

      if (type === 'completedLessons' && student.progress.dailyBonusDay !== todayDateString) {
        bonusPoints = 25;
        student.progress.dailyBonusDay = todayDateString;
      }

      if (!progressSet.has(itemId)) {
        student.score += pointsToAdd + bonusPoints;
        progressSet.add(itemId);

        if (type === 'finalizedQuizzes') {
          const moduleId = itemId;
          const module = modules.find((m) => m.id === moduleId);

          const courseModules = modules
            .filter((m) => m.courseId === module.courseId)
            .sort((a, b) => a.id - b.id);

          const currentModuleIndex = courseModules.findIndex((m) => m.id === moduleId);

          const allLessonsInModule = module.lessons.every((lesson) =>
            student.progress.completedLessons.has(lesson.id)
          );

          if (
            allLessonsInModule &&
            student.currentModuleId === moduleId &&
            currentModuleIndex < courseModules.length - 1
          ) {
            student.currentModuleId = courseModules[currentModuleIndex + 1].id;
          }
        }

        if (user && user.id === studentId) {
          setUser((prevUser) => ({ ...prevUser, ...student }));
        }
      }

      newStudents[studentIndex] = student;

      return newStudents;
    });
  };

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <DashboardPage
              students={students}
              courses={courses}
              modules={modules}
              announcements={announcements}
              turmas={turmas}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/courses"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentCoursesPage
              courses={courses}
              modules={modules}
              students={students}
              updateStudentProgress={updateStudentProgress}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.INSTRUCTOR]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-classes"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ManageClassesPage turmas={turmas} setTurmas={setTurmas} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-courses"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ManageCoursesPage
              courses={courses}
              setCourses={setCourses}
              turmas={turmas}
              modules={modules}
              setModules={setModules}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-content"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ManageContentPage courses={courses} modules={modules} setModules={setModules} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/module-editor/:moduleId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ModuleEditor modules={modules} setModules={setModules} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-announcements"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ManageAnnouncementsPage
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              turmas={turmas}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <ReportsPage students={students} courses={courses} modules={modules} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/student/:studentId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INSTRUCTOR]}>
            <StudentProfilePage
              students={students}
              setStudents={setStudents}
              courses={courses}
              modules={modules}
              turmas={turmas}
            />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
