import { createContext, useContext, useState } from 'react';

import { initialAnnouncements } from '../mocks/data';

export const AnnouncementsContext = createContext({
  announcements: [],
  setAnnouncements: () => {},
});

export function AnnouncementsProvider({ children, initialData = initialAnnouncements }) {
  const [announcements, setAnnouncements] = useState(initialData);

  return (
    <AnnouncementsContext.Provider value={{ announcements, setAnnouncements }}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export const useAnnouncements = () => {
  const context = useContext(AnnouncementsContext);
  if (!context) {
    throw new Error('useAnnouncements deve ser usado dentro de um AnnouncementsProvider');
  }
  return context;
};
