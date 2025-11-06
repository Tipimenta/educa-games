import { useMemo, useState } from 'react';

export const useStudentCourseNavigation = ({ courses, modules, user }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSelection, setActiveSelection] = useState(0);

  const availableCourses = useMemo(() => {
    return courses.filter(
      (course) => course.assignedClasses && course.assignedClasses.includes(user?.classId)
    );
  }, [courses, user?.classId]);

  const modulesForCourse = useMemo(() => {
    if (!selectedCourse) return [];
    return modules.filter((m) => m.courseId === selectedCourse.id).sort((a, b) => a.id - b.id);
  }, [selectedCourse, modules]);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedModule(null);
  };

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    setActiveSelection(0);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedModule(null);
  };

  const handleBackToModules = () => {
    setSelectedModule(null);
  };

  return {
    selectedCourse,
    selectedModule,
    activeSelection,
    setActiveSelection,
    availableCourses,
    modulesForCourse,
    handleSelectCourse,
    handleSelectModule,
    handleBackToCourses,
    handleBackToModules,
  };
};

