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
      const error =
        err.response?.data?.detail?.message ||
        err.message ||
        "Неизвестная ошибка";
      setError(error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return [fetchData, isLoading, error];
};

export default useApiRequest;
