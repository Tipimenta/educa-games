import {
  AnnouncementsProvider,
  AuthProvider,
  ClassesProvider,
  ConfirmProvider,
  CoursesProvider,
  ModulesProvider,
  StudentsProvider,
  ToastProvider,
} from '../context';

const providers = [
  ToastProvider,
  AuthProvider,
  ConfirmProvider,
  StudentsProvider,
  CoursesProvider,
  ModulesProvider,
  ClassesProvider,
  AnnouncementsProvider,
];

export function AppProviders({ children }) {
  return providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, children);
}
