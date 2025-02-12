import { useEffect, useRef, useState } from "react";
import ChatBubbleBase from "../ChatBubbleBase";
import PropTypes from "prop-types";
import {
  IconButton,
  chakra,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Pause, Play } from "lucide-react";
import useColors from "../../../hooks/useColors";

const ChatAudioBubble = ({ message }) => {
  const { src, time, isOwn } = message;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const audioRef = useRef(null);

  const { primary } = useColors();
  const filledTrack = useColorModeValue("primary.600", "whiteAlpha.800");
  const subText = useColorModeValue("blackAlpha.900", "whiteAlpha.700");
  const primaryRaw = useColorModeValue(
    "var(--chakra-colors-primary-500)",
    "var(--chakra-colors-primary-400)",
  );

  const iconColor = isOwn ? primaryRaw : "white";

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

  const updateProgress = () => {
    if (audioRef.current && !isSeeking) {
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100,
      );
      setRemainingTime(
        audioRef.current.duration - audioRef.current.currentTime,
      );
    }
  };

  const handleSeekChange = (value) => {
    setIsSeeking(true);
    setProgress(value);
  };

  const handleSeekCommit = (value) => {
    if (!audioRef.current) return;
    const newTime = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setRemainingTime(audioRef.current.duration - newTime);
    setIsSeeking(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => setPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

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
        <Flex gap={1} direction={"column"}>
          <Slider
            mt={2}
            value={progress}
            min={0}
            max={100}
            w={92}
            onChange={handleSeekChange}
            onChangeEnd={handleSeekCommit}
          >
            <SliderTrack>
              <SliderFilledTrack bg={isOwn ? filledTrack : primary} />
            </SliderTrack>
            <SliderThumb />
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
