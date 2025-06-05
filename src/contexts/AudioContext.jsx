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
  const [queue, setQueue] = useState([]); // Stores { id, time }
  const audioRefs = useRef({});
  const [currentAudioId, setCurrentAudioId] = useState(null);

  const register = useCallback((id, ref, time) => {
    setQueue(prev => {
      if (prev.some(item => item.id === id)) return prev;
      return [...prev, { id, time }].sort((a, b) => a.time - b.time);
    });
    audioRefs.current[id] = ref;
  }, []);

  const unregister = useCallback(id => {
    setQueue(prev => prev.filter(item => item.id !== id));
    delete audioRefs.current[id];
  }, []);

  const playAudio = useCallback(
    id => {
      if (currentAudioId !== null) {
        // Pause and reset old audio ref
        const oldRef = audioRefs.current[currentAudioId]?.current;
        if (oldRef) {
          oldRef.pause();
          oldRef.currentTime = 0;
        }
      }

      const ref = audioRefs.current[id]?.current;
      if (ref) {
        ref.play();
        setCurrentAudioId(id);
      }
    },
    [currentAudioId]
  );

  const pauseAudio = useCallback(id => {
    const ref = audioRefs.current[id]?.current;
    if (ref) {
      ref.pause();
    }
    setCurrentAudioId(null);
  }, []);

  const playNext = useCallback(() => {
    if (!queue.length) return;

    const currentIndex = queue.findIndex(item => item.id === currentAudioId);
    setCurrentAudioId(null);
    if (currentIndex === -1 || currentIndex === queue.length - 1) return;

    const nextId = queue[currentIndex + 1]?.id;
    if (!nextId) return;

    const nextRef = audioRefs.current[nextId]?.current;
    if (!nextRef) return;

    nextRef.scrollIntoView({ behavior: "smooth" });
    nextRef.play();
    setCurrentAudioId(nextId);
  }, [queue, currentAudioId]);

  return (
    <AudioContext.Provider
      value={{
        queue,
        register,
        unregister,
        playAudio,
        pauseAudio,
        currentAudioId,
        playNext,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
