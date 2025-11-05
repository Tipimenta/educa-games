export const studentService = {
  getStudentsByClass: (students, classes, className) => {
    if (!className) return students;

    const classItem = classes.find((c) => c.name === className);
    if (!classItem) return [];

    return students.filter((student) => student.classId === classItem.id);
  },

  getStudentsSortedByScore: (students) => {
    return [...students].sort((a, b) => b.score - a.score);
  },

  getStudentRanking: (students, classId) => {
    const classStudents = students.filter((s) => s.classId === classId);
    const sorted = [...classStudents].sort((a, b) => b.score - a.score);

    return sorted.map((student, index) => ({
      ...student,
      rank: index + 1,
      previousRank: classStudents.findIndex((s) => s.id === student.id) + 1,
    }));
  },

  getCoursesForStudent: (courses, studentClassId) => {
    return courses.filter(
      (course) => course.assignedClasses && course.assignedClasses.includes(studentClassId)
    );
  },

  getModulesForCourse: (modules, courseId) => {
    return modules.filter((m) => m.courseId === courseId).sort((a, b) => a.id - b.id);
  },

  calculateModuleProgress: (student, module) => {
    if (!module.lessons || module.lessons.length === 0) return 0;

    const completedLessons = module.lessons.filter((lesson) =>
      student.progress.completedLessons.has(lesson.id)
    );

    return (completedLessons.length / module.lessons.length) * 100;
  },

  isModuleCompleted: (student, module) => {
    const allLessonsDone = module.lessons.every((lesson) =>
      student.progress.completedLessons.has(lesson.id)
    );
    const quizDone =
      !module.quiz?.questions?.length > 0 || student.progress.finalizedQuizzes.has(module.id);

    return allLessonsDone && quizDone;
  },
};

