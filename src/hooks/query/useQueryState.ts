
import { useState, useRef } from 'react';

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useQueryState<T>(): {
  queryState: QueryState<T>;
  setQueryState: {
    setData: (data: T | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
    resetState: () => void;
  };
} {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const resetState = () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
  };

  const setErrorState = (err: Error | null) => {
    if (err) {
      setIsError(true);
      setError(err);
    } else {
      setIsError(false);
      setError(null);
    }
  };

  return {
    queryState: { data, isLoading, isError, error },
    setQueryState: {
      setData,
      setLoading: setIsLoading,
      setError: setErrorState,
      resetState,
    }
  };
}
