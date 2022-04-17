import { useState, useEffect } from "react";

export default function useLocalStorage(storageKey, fallbackState) {
  const [value, setValue] = useState(fallbackState);

  useEffect(() => {
    const val = localStorage.getItem(storageKey);
    if (val) {
      setValue(val);
    }
  }, []);

  useEffect(() => {
    if (value && value !== undefined) {
      localStorage.setItem(storageKey, value);
    }
  }, [value]);
  return [value, setValue];
}
