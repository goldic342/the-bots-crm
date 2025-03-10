import { useEffect, useState, useRef } from "react";

const useLazyLoad = (options = { threshold: 0.1 }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [elementRef, shouldLoad];
};

export default useLazyLoad;
