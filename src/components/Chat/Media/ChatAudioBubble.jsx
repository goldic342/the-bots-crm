import { useEffect, useRef, useState, useCallback } from "react";
import {
  IconButton,
  chakra,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Text,
  Tooltip,
  Spinner,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { Pause, Play, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import ChatBubbleBase from "../ChatBubbleBase";
import useColors from "../../../hooks/useColors";
import useMediaLoad from "../../../hooks/useMediaLoad";
import { useAudio } from "../../../contexts/AudioContext";

const ChatAudioBubble = ({ message }) => {
  const { src, time, isOwn } = message;
  const [showTooltip, setShowTooltip] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const { loaded, error, mediaRef: audioRef } = useMediaLoad(src);

  const isSeekingRef = useRef(isSeeking);
  const { register, unregister, playAudio, pauseAudio, currentAudioId } =
    useAudio();
  const playing = currentAudioId === message.id;

  useEffect(() => {
    register(message.id, audioRef);
    return () => {
      unregister(message.id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id, register, unregister]);

  const primaryRaw = useColorModeValue(
    "var(--chakra-colors-primary-500)",
    "var(--chakra-colors-primary-400)",
  );
  const { primary } = useColors();
  const iconColor = isOwn ? primaryRaw : "white";
  const filledTrack = useColorModeValue("primary.600", "whiteAlpha.800");
  const subText = useColorModeValue("blackAlpha.900", "whiteAlpha.700");

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (playing) {
      pauseAudio(message.id);
    } else {
      playAudio(message.id);
    }
  };

  const updateProgress = useCallback(() => {
    if (!audioRef.current || isSeekingRef.current) return;

    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((currentTime / duration) * 100);
    setRemainingTime(duration - currentTime);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleUpdate = () => updateProgress();
    const handleEnded = () => {
      setProgress(0);
      setRemainingTime(audioRef.current?.duration || 0);
    };

    audio.addEventListener("timeupdate", handleUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [updateProgress]);

  const handleSeekCommit = (value) => {
    if (!audioRef.current) return;
    const newTime = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setRemainingTime(audioRef.current.duration - newTime);
    setIsSeeking(false);
  };

  return (
    <ChatBubbleBase time={time} isOwn={isOwn}>
      <chakra.audio src={src} ref={audioRef} display="none" />

      <Flex justify="space-between" gap={4}>
        <IconButton
          icon={
            playing ? <Pause color={iconColor} /> : <Play color={iconColor} />
          }
          aria-label="Play/Pause"
          bg={isOwn ? "white" : primary}
          _hover={{ opacity: "0.9" }}
          onClick={togglePlayPause}
          isDisabled={!loaded || error}
        />
        <Flex gap={1} direction="column">
          <Slider
            mt={2}
            value={progress}
            min={0}
            max={100}
            w={92}
            onChangeStart={() => setIsSeeking(true)}
            onChange={(v) => setProgress(v)}
            onChangeEnd={handleSeekCommit}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            isDisabled={!loaded || error}
          >
            <SliderTrack>
              <SliderFilledTrack bg={isOwn ? filledTrack : primary} />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg={isOwn ? "gray.600" : primary}
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={formatTime(
                (progress / 100) * (audioRef.current?.duration || 0),
              )}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>

          <Flex justify="space-between">
            <Text fontSize="xs" color={isOwn ? "whiteAlpha.700" : subText}>
              {formatTime(remainingTime)}
            </Text>
            {!loaded && !error && (
              <Spinner size="xs" color={isOwn ? "whiteAlpha.700" : primary} />
            )}
            {error && <Icon as={AlertCircle} color={"red.500"} size={16} />}
          </Flex>
        </Flex>
      </Flex>
    </ChatBubbleBase>
  );
};

ChatAudioBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    time: PropTypes.string,
    isOwn: PropTypes.bool,
  }).isRequired,
};

export default ChatAudioBubble;
