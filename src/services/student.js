import { axiosInstance } from './api';

const STUDENT_PATH = '/v1/student';

const extractData = (response) => response?.data || response;

export const studentService = {
  getDashboard: async () => {
    const response = await axiosInstance.get(`${STUDENT_PATH}/dashboard`);
    return extractData(response);
  },

  getRanking: async () => {
    const response = await axiosInstance.get(`${STUDENT_PATH}/ranking`);
    return extractData(response);
  },

  getCourses: async () => {
    const response = await axiosInstance.get(`${STUDENT_PATH}/courses`);
    return extractData(response);
  },

  getCourseModules: async (courseId) => {
    const response = await axiosInstance.get(`${STUDENT_PATH}/courses/${courseId}/modules`);
    return extractData(response);
  },

  getModuleDetails: async (moduleId) => {
    const response = await axiosInstance.get(`${STUDENT_PATH}/modules/${moduleId}`);
    return extractData(response);
  },

  completeLesson: async (lessonId) => {
    await axiosInstance.post(`${STUDENT_PATH}/lessons/${lessonId}/complete`);
  },

  completeQuiz: async (quizId, answers) => {
    const answersArray = Array.isArray(answers) ? answers : [];
    const response = await axiosInstance.post(`${STUDENT_PATH}/quizzes/${quizId}/complete`, {
      answers: answersArray,
    });
    const result = extractData(response);
    return result?.data ?? result ?? 0;
  },

  calculateQuizScore: async (quizId, answers) => {
    const answersArray = Array.isArray(answers) ? answers : [];
    const response = await axiosInstance.post(`${STUDENT_PATH}/quizzes/${quizId}/calculate-score`, {
      answers: answersArray,
    });
    const result = extractData(response);
    return result?.data ?? result ?? 0;
  },

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
