import { useEffect, useRef, useState } from "react";

const useInfiniteScroll = (
  { isLoading, onLoadMore, useEffectDropCondition = false },
  options = { threshold: 0.1 },
) => {
  const observerRef = useRef(null);
  const lastElementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isObserving, setIsObserving] = useState(true); // Track observation state

  useEffect(() => {
    if (isLoading || !isObserving) return; // Stop setting up observer if disabled

    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current && lastElementRef.current) {
        observerRef.current.unobserve(lastElementRef.current);
      }
    };
  }, [isLoading, options, isObserving]);

  useEffect(() => {
    if (!isVisible || isLoading || !isObserving) return;
    if (useEffectDropCondition) return;

    if (observerRef.current && lastElementRef.current) {
      observerRef.current.unobserve(lastElementRef.current);
    }

    onLoadMore();

    if (observerRef.current && lastElementRef.current && isObserving) {
      observerRef.current.observe(lastElementRef.current);
    }
  }, [isVisible, isLoading, onLoadMore, useEffectDropCondition, isObserving]);

  const stopObserving = () => {
    if (observerRef.current && lastElementRef.current) {
      observerRef.current.unobserve(lastElementRef.current);
    }
    setIsObserving(false); // Prevent re-attaching observer
  };

  return { lastElementRef, stopObserving, isVisible, setIsVisible };
};

export default useInfiniteScroll;
