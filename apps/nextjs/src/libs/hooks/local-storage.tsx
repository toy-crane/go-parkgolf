import React, { useEffect, useState } from "react";

const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const isClient = typeof window === "object";
  // localStorage에서 값을 가져오는 함수
  const readValue = (): T => {
    if (!isClient) {
      return initialValue;
    }
    // localStorage에서 값을 가져옴
    const item = window.localStorage.getItem(key);
    // 값이 있으면 파싱하여 반환, 없으면 초기값 반환
    return item ? JSON.parse(item) : initialValue;
  };

  // useState를 이용하여 상태 관리
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 상태가 변경될 때 localStorage를 업데이트
  useEffect(() => {
    if (isClient) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error writing to localStorage key “${key}”:`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};

export default useLocalStorage;
