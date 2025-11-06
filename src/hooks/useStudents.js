import { useQuery } from '@tanstack/react-query';

import { studentsService } from '../services';

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: studentsService.list,
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ['students', id],
    queryFn: () => studentsService.getById(id),
    enabled: !!id,
  });
}

export function useStudentsByClass(classId) {
  return useQuery({
    queryKey: ['students', 'class', classId],
    queryFn: () => studentsService.getByClass(classId),
    enabled: !!classId,
  });
}
