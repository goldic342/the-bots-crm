import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Flex,
  Box,
  Text,
  useColorModeValue,
  HStack,
  Skeleton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { File } from "lucide-react";
import DetermineChatBubble from "./DetermineChatBubble";
import useColors from "../../hooks/useColors";
import { ChatMessageObject } from "../../utils/types/chatTypes";
import { transformDateTime } from "../../utils/transformDateTime";
import { messageToString } from "../../utils/messageToString";
import MessageRead from "../ui/MessageRead";
import { fetchMessage } from "../../api/chats";
import { useChats } from "../../contexts/ChatContext";
import useApiRequest from "../../hooks/useApiRequest";
import { useParams } from "react-router-dom";
import { MAX_TRANSLATION, SWIPE_THRESHOLD } from "../../constants";

const ChatBubbleBase = ({
  direction,
  isRead,
  createdAt,
  replyMessageId,
  id,
  includePadding = true,
  children,
}) => {
  const { primary, text } = useColors();
  const { currentChat, setReplyToMessage, messages, handleMessageVisible } =
    useChats();
  const { botId } = useParams();

  const currentMessage = messages[currentChat.lead.id].find((m) => m.id === id);

  const bubbleRef = useRef(null);

  const [dateTime, setDateTime] = useState({
    formatted: transformDateTime(createdAt, true),
    isFull: false,
  });

  const toggleDateTime = () => {
    setDateTime((prev) => ({
      formatted: transformDateTime(createdAt, prev.isFull, !prev.isFull),
      isFull: !prev.isFull,
    }));
  };

  const isOwn = direction === "outgoing";
  const replyIdValid = !!replyMessageId && replyMessageId !== 0;

  const [isVisible, setIsVisible] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [fetchReplyMessage, isLoading] = useApiRequest(async () => {
    if (!replyMessageId || !currentChat?.lead?.id || !currentChat?.botId)
      return null;
    return await fetchMessage(
      currentChat.lead.id,
      currentChat.botId,
      replyMessageId,
    );
  }, true);

  const [hasSentVisibilityEvent, setHasSentVisibilityEvent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (bubbleRef.current) observer.observe(bubbleRef.current);

    return () => {
      if (bubbleRef.current) observer.unobserve(bubbleRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isOwn && isVisible && !isRead && !hasSentVisibilityEvent) {
      handleMessageVisible(currentChat.lead.id, botId, id);
      setHasSentVisibilityEvent(true);
    }
  }, [
    isVisible,
    isOwn,
    isRead,
    hasSentVisibilityEvent,
    handleMessageVisible,
    currentChat.lead.id,
    id,
    botId,
  ]);

  useEffect(() => {
    if (!replyMessageId || !isVisible || replyMessage) return;
    const fetchMsg = async () => {
      const replyMsg = await fetchReplyMessage();
      setReplyMessage(replyMsg);
    };
    fetchMsg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyMessageId, isVisible]);

  const bubbleBg = isOwn ? primary : text;
  const textColor = isOwn
    ? "white"
    : useColorModeValue("black", "whiteAlpha.900");

  const handleReplyClick = (event) => {
    event.stopPropagation();
    if (replyMessageId) {
      onOpen();
    }
  };

  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e) => {
    setIsSwiping(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setTranslateX(0);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const diffX = currentX - touchStartX;
    const diffY = currentY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (isOwn) {
        // For outgoing messages => move bubble right -> left (negative X)
        const clampedDiffX = Math.min(0, Math.max(diffX, -MAX_TRANSLATION));
        setTranslateX(clampedDiffX);
      } else {
        // For incoming messages => move bubble left -> right (positive X)
        const clampedDiffX = Math.max(0, Math.min(diffX, MAX_TRANSLATION));
        setTranslateX(clampedDiffX);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    if (isOwn) {
      if (translateX < -SWIPE_THRESHOLD) {
        setReplyToMessage(currentMessage);
      }
    } else {
      if (translateX > SWIPE_THRESHOLD) {
        setReplyToMessage(currentMessage);
      }
    }

    // Reset position
    setTranslateX(0);
    setTouchStartX(null);
    setTouchStartY(null);
  };

  return (
    <Flex
      ref={bubbleRef}
      direction="column"
      alignItems={isOwn ? "flex-end" : "flex-start"}
      mb={2}
      data_msgid={id}
    >
      {replyIdValid && (
        <Popover isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>
            <Box
              px={2}
              py={1}
              bg={bubbleBg}
              mb={1}
              borderBottomLeftRadius={isOwn ? "2xl" : "0"}
              borderBottomRightRadius={isOwn ? "0" : "2xl"}
              borderTopLeftRadius={isOwn ? "2xl" : "md"}
              borderTopRightRadius={isOwn ? "md" : "2xl"}
              transition={"opacity .2s ease-in"}
              _hover={{ opacity: 0.7 }}
              opacity={0.9}
              color={textColor}
              cursor="pointer"
              onClick={handleReplyClick}
              maxW={{ base: 72, md: 80, lg: 96 }}
            >
              {isLoading ? (
                <Skeleton w={"full"} h={2} />
              ) : (
                <HStack>
                  <HStack>
                    {!isOwn && (
                      <Box w="2px" h="20px" bg={primary} borderRadius="full" />
                    )}
                    {replyMessage?.content?.url && (
                      <Icon as={File} boxSize={4} />
                    )}
                    <Text maxW={40} fontSize="sm" isTruncated>
                      {messageToString(replyMessage) || "Сообщение"}
                    </Text>
                    {isOwn && (
                      <Box
                        w="2px"
                        h="20px"
                        bg={textColor}
                        borderRadius="full"
                      />
                    )}
                  </HStack>
                </HStack>
              )}
            </Box>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              {isLoading ? (
                <Skeleton w="full" h={4} isLoaded={false} />
              ) : (
                <DetermineChatBubble message={replyMessage} />
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}

      <Box
        maxWidth={{ base: 72, md: 80, lg: 96 }}
        boxShadow="sm"
        overflow="hidden"
        borderBottomLeftRadius={isOwn ? "2xl" : "md"}
        borderBottomRightRadius={isOwn ? "md" : "2xl"}
        borderTopLeftRadius={replyIdValid && !isOwn ? "0px" : "2xl"}
        borderTopRightRadius={replyIdValid && isOwn ? "0px" : "2xl"}
        bg={bubbleBg}
        color={textColor}
        px={includePadding ? 3 : 0}
        py={includePadding ? 2 : 0}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setReplyToMessage(currentMessage);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? "none" : "transform 0.2s ease-out",
        }}
      >
        {children}
      </Box>

      <HStack spacing={1} justify={"center"} mt={1}>
        {!isOwn && <MessageRead isRead={isRead} />}
        <Text
          fontSize="xs"
          opacity={0.7}
          cursor="pointer"
          onClick={toggleDateTime}
        >
          {dateTime.formatted}
        </Text>
        {isOwn && <MessageRead isRead={isRead} />}
      </HStack>
    </Flex>
  );
};

ChatBubbleBase.propTypes = {
  ...PropTypes.shape(ChatMessageObject).isRequired,
  includePadding: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ChatBubbleBase;
