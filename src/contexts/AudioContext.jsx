import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

const AudioContext = createContext(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const audioRefs = useRef({});
  const [currentAudioId, setCurrentAudioId] = useState(null);

  const register = useCallback((id, ref) => {
    setQueue((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    audioRefs.current[id] = ref;
  }, []);

  const unregister = useCallback((id) => {
    setQueue((prev) => prev.filter((item) => item !== id)); // Ensure removal
    delete audioRefs.current[id];
  }, []);

  const playAudio = useCallback(
    (id) => {
      if (currentAudioId !== null) {
        // Pause and reset the old audio
        const oldRef = audioRefs.current[currentAudioId]?.current;
        if (oldRef) {
          oldRef.pause();
          oldRef.currentTime = 0;
        }
        setCurrentAudioId(null);
      }

      const ref = audioRefs.current[id]?.current;
      if (ref) {
        ref.play();
      }

      setCurrentAudioId(id);
    },
    [currentAudioId],
  );

  const pauseAudio = useCallback((id) => {
    const ref = audioRefs.current[id]?.current;
    if (ref) {
      ref.pause();
    }
    setCurrentAudioId(null);
  }, []);
  return (
    <AudioContext.Provider
      value={{
        queue,
        register,
        unregister,
        playAudio,
        pauseAudio,
        currentAudioId,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
