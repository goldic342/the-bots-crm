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
  useColorModeValue,
} from "@chakra-ui/react";
import { Pause, Play } from "lucide-react";
import PropTypes from "prop-types";
import ChatBubbleBase from "../ChatBubbleBase";
import useColors from "../../../hooks/useColors";

const ChatAudioBubble = ({ message }) => {
  const { src, time, isOwn } = message;
  const [playing, setPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const isSeekingRef = useRef(isSeeking);
  const audioRef = useRef(null);

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
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const updateProgress = useCallback(() => {
    if (!audioRef.current) return;
    if (isSeekingRef.current) return;

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
      setPlaying(false);
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
