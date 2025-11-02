import { useState } from 'react';

/**
 * Hook para gerenciar estado no localStorage
 * @param {string} key - Chave do localStorage
 * @param {any} initialValue - Valor inicial se a chave não existir
 * @returns {[any, function]} - Valor atual e função para atualizar
 */
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

/**
 * Hook para gerenciar estado booleano no localStorage
 * @param {string} key - Chave do localStorage
 * @param {boolean} initialValue - Valor inicial se a chave não existir
 * @returns {[boolean, function]} - Valor atual e função para atualizar
 */
export const useLocalStorageBoolean = (key, initialValue = false) => {
  const [value, setValue] = useLocalStorage(key, initialValue);

  const setBooleanValue = (newValue) => {
    const boolValue = typeof newValue === 'function' ? newValue(value) : newValue;
    setValue(boolValue);
  };

  return [value, setBooleanValue];
};
