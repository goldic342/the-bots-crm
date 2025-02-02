import { useState } from "react";

const useApiRequest = (apiCall) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall(...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return [fetchData, isLoading, error];
};

export default useApiRequest;
