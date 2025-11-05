import { useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useLocalStorageBoolean = (key, initialValue = false) => {
  const [value, setValue] = useLocalStorage(key, initialValue);

  const setBooleanValue = (newValue) => {
    const boolValue = typeof newValue === 'function' ? newValue(value) : newValue;
    setValue(boolValue);
  };

  return [value, setBooleanValue];
};
