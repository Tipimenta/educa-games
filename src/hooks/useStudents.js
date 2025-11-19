import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { studentService, studentsService } from '../services';

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: studentService.getDashboard,
  });
}

export function useStudentRanking() {
  return useQuery({
    queryKey: ['student', 'ranking'],
    queryFn: studentService.getRanking,
  });
}

export function useStudentCourses() {
  return useQuery({
    queryKey: ['student', 'courses'],
    queryFn: studentService.getCourses,
  });
}

export function useStudentCourseModules(courseId) {
  return useQuery({
    queryKey: ['student', 'courses', courseId, 'modules'],
    queryFn: () => studentService.getCourseModules(courseId),
    enabled: !!courseId,
  });
}

export function useStudentModuleDetails(moduleId) {
  return useQuery({
    queryKey: ['student', 'modules', moduleId],
    queryFn: () => studentService.getModuleDetails(moduleId),
    enabled: !!moduleId,
  });
}

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: studentsService.list,
  });
}

export function useStudent(id, classroomId) {
  return useQuery({
    queryKey: ['students', id, classroomId],
    queryFn: () => {
      if (classroomId) {
        return studentsService.getByClassroomAndId(classroomId, id);
      }
      return studentsService.getById(id);
    },
    enabled: !!id,
  });
}

export function useClassroomStudents(options = {}) {
  const {
    classroomId,
    active,
    page = 0,
    size = 10,
    search = '',
    sortBy = 'name',
    sortDir = 'ASC',
    enabled = true,
  } = options;

  return useQuery({
    queryKey: ['students', 'classroom', { classroomId, active, page, size, search, sortBy, sortDir }],
    queryFn: () => studentsService.getByClassroom({ classroomId, active, page, size, search, sortBy, sortDir }),
    enabled: !!classroomId && typeof active === 'boolean' && enabled,
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateClassroomStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, id, active }) => studentsService.updateClassroomStatus({ classroomId, id, active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', 'classroom'] });
    },
  });
}

export function useRemoveClassroomStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, id }) => studentsService.removeFromClassroom({ classroomId, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', 'classroom'] });
    },
  });
}
