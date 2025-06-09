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
  HStack,
} from "@chakra-ui/react";
import { Pause, Play, AlertCircle, Music, Download } from "lucide-react";
import ChatBubbleBase from "../ChatBubbleBase";
import useColors from "../../../hooks/useColors";
import useMediaLoad from "../../../hooks/useMediaLoad";
import { useAudio } from "../../../contexts/AudioContext";
import { ChatMessage } from "../../../utils/types/chatTypes";

const ChatAudioBubble = ({ message }) => {
  const { content, createdAt, direction } = message;
  const isOwn = direction === "outgoing";
  const [showTooltip, setShowTooltip] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const { loaded, error, mediaRef: audioRef } = useMediaLoad(content.url);

  const isSeekingRef = useRef(isSeeking);
  const {
    register,
    unregister,
    playAudio,
    pauseAudio,
    currentAudioId,
    playNext,
  } = useAudio();
  const playing = currentAudioId === message.id;

  useEffect(() => {
    register(message.id, audioRef, createdAt);
    return () => {
      unregister(message.id);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id, register, unregister, createdAt]);

  useEffect(() => {
    if (error) unregister(message.id);
  }, [unregister, error, message.id]);

  const primaryRaw = useColorModeValue(
    "var(--chakra-colors-primary-500)",
    "var(--chakra-colors-primary-400)"
  );
  const { primary } = useColors();
  const iconColor = isOwn ? primaryRaw : "white";
  const filledTrack = useColorModeValue("primary.600", "whiteAlpha.800");
  const subText = useColorModeValue("blackAlpha.900", "whiteAlpha.700");
  const textColor = isOwn
    ? "white"
    : useColorModeValue("blackAlpha.700", "whiteAlpha.900");

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  const formatTime = time => {
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
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleUpdate = () => updateProgress();
    const handleEnded = () => {
      setProgress(0);
      setRemainingTime(audioRef.current?.duration || 0);
      playNext(message.id);
    };

    audio.addEventListener("timeupdate", handleUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [updateProgress, message.id, audioRef, playNext]);

  const handleSeekCommit = value => {
    if (!audioRef.current) return;
    const newTime = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setRemainingTime(audioRef.current.duration - newTime);
    setIsSeeking(false);
  };
  const handleDownload = () => {
    if (content.url) {
      const link = document.createElement("a");
      link.href = content.url;
      link.download = content.url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <ChatBubbleBase {...message}>
      <chakra.audio src={content.url} ref={audioRef} display="none" />

      {message.text && (
        <Text
          fontSize="sm"
          color={isOwn ? "whiteAlpha.900" : textColor}
          mb={2}
          wordBreak="break-word"
        >
          {message.text}
        </Text>
      )}
      <Flex justify="space-between" gap={4} w={"min-content"}>
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
            onChange={v => setProgress(v)}
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
                (progress / 100) * (audioRef.current?.duration || 0)
              )}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>

          <Flex justify="space-between">
            <HStack>
              {content.type === "audio" && (
                <Icon as={Music} opacity={0.6} size={10} />
              )}

              <Icon
                as={Download}
                opacity={0.6}
                size={10}
                cursor={"pointer"}
                onClick={handleDownload}
              />
              <Text fontSize="xs" color={isOwn ? "whiteAlpha.700" : subText}>
                {formatTime(remainingTime)}
              </Text>
            </HStack>
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

ChatAudioBubble.propTypes = { message: ChatMessage };

export default ChatAudioBubble;
