import { useState, useRef, useEffect } from "react";

const useMediaLoad = (src) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const mediaRef = useRef(null);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoad = () => setLoaded(true);
    const handleError = () => setError(true);

    media.addEventListener("loadeddata", handleLoad);
    media.addEventListener("error", handleError);

    return () => {
      media.removeEventListener("loadeddata", handleLoad);
      media.removeEventListener("error", handleError);
    };
  }, [src, mediaRef]);

  return { loaded, error, mediaRef };
};

export default useMediaLoad;
