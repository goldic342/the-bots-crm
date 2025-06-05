import { useEffect, useRef } from "react";

export const useRefBridge = state => {
  const ref = useRef(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref;
};
