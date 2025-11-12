import { useQuery } from '@tanstack/react-query';

import { classroomsService } from '../services';

export function useInstructorClassrooms(options = {}) {
  const { active, page = 0, size = 10, search = '', sortBy = 'name', sortDir = 'ASC', enabled = true } = options;

  return useQuery({
    queryKey: ['classrooms', 'instructor', { active, page, size, search, sortBy, sortDir }],
    queryFn: () => classroomsService.listByInstructor({ active, page, size, search, sortBy, sortDir }),
    enabled: active !== undefined && enabled,
    placeholderData: (previousData) => previousData,
  });
}