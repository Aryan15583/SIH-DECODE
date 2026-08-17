import { useState, useEffect, useCallback } from "react";

export function useApi<T>(apiFunc: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFunc();
      setData(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unable to connect to security backend"));
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    execute();
  }, [execute]);

  return { data, loading, error, retry: execute };
}
