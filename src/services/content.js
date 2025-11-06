export const createCourse = (title, description, assignedClasses = []) => {
  return {
    id: Date.now(),
    title: title.trim(),
    description: description.trim(),
    assignedClasses,
  };
};

export const createClass = (name) => {
  return {
    id: Date.now(),
    name: name.trim(),
  };
};

export const createAnnouncement = (title, content, assignedClasses = []) => {
  return {
    id: Date.now(),
    title: title.trim(),
    content: content.trim(),
    assignedClasses,
    date: new Date().toISOString().split('T')[0],
  };
};

export const createModule = (courseId, moduleData = {}) => {
  return {
    id: Date.now(),
    courseId,
    title: moduleData.title || '',
    description: moduleData.description || '',
    lessons: moduleData.lessons || [],
    quiz: moduleData.quiz || { questions: [] },
    ...moduleData,
  };
};

export const createLesson = (title = '', points = 5, description = '', resources = []) => {
  return {
    id: Date.now(),
    title,
    points,
    description,
    resources,
  };
};

export const createResource = (type, content = '') => {
  return {
    id: Date.now(),
    type,
    content,
  };
};

export const createQuizQuestion = (text = '', options = ['', ''], correctAnswer = '', points = 10) => {
  return {
    id: Date.now(),
    text,
    options,
    correctAnswer,
    points,
  };
};

export const contentService = {
  createCourse,
  createClass,
  createAnnouncement,
  createModule,
  createLesson,
  createResource,
  createQuizQuestion,
};

