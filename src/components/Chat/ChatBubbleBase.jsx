/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from "prop-types";
import {
  Flex,
  Box,
  Text,
  useColorModeValue,
  HStack,
  Spinner,
  Skeleton,
  Icon,
} from "@chakra-ui/react";
import useColors from "../../hooks/useColors";
import { ChatBaseMessageObject } from "../../utils/types/chatTypes";
import { transformDateTime } from "../../utils/transformDateTime";
import MessageRead from "../ui/MessageRead";
import { fetchMessage } from "../../api/chats";
import { useChats } from "../../contexts/ChatContext";
import useApiRequest from "../../hooks/useApiRequest";
import { useEffect, useRef, useState } from "react";
import { File } from "lucide-react";

const ChatBubbleBase = ({
  direction,
  isRead,
  createdAt,
  onReplyClick,
  onClick,
  replyMessageId,
  includePadding = true,
  children,
}) => {
  const { primary, text } = useColors();
  const { currentChat } = useChats();
  const bubbleRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [fetchReplyMessage, isLoading, error] = useApiRequest(async () => {
    if (!replyMessageId || !currentChat?.lead?.id || !currentChat?.botId)
      return null;
    return await fetchMessage(
      currentChat.lead.id,
      currentChat.botId,
      replyMessageId,
    );
  }, true);
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
    if (!replyMessageId || !isVisible || replyMessage) return;
    const fetchMsg = async () => {
      const replyMsg = await fetchReplyMessage();
      setReplyMessage(replyMsg);
    };
    fetchMsg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyMessageId, isVisible]);

  const isOwn = direction === "outgoing";
  const replyIdValid = replyMessageId && replyMessageId !== 0;
  const bubbleBg = isOwn ? primary : text;
  const textColor = isOwn
    ? "white"
    : useColorModeValue("black", "whiteAlpha.900");

  const handleReplyClick = (event) => {
    event.stopPropagation();
    if (onReplyClick && replyMessageId) {
      onReplyClick(replyMessageId);
    }
  };

  return (
    <Flex
      ref={bubbleRef}
      direction="column"
      alignItems={isOwn ? "flex-end" : "flex-start"}
      mb={2}
    >
      {replyMessageId != 0 && (
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
            <Skeleton w={"full"} />
          ) : (
            <HStack>
              {!isOwn && (
                <Box w={"2px"} bg={primary} borderRadius="full" h={"20px"} />
              )}
              {!isOwn && replyMessage.content?.url && (
                <Icon as={File} size={16} />
              )}
              <Text noOfLines={1} isTruncated fontSize={"sm"}>
                {replyMessage.text || (replyMessage.content?.url && "Медиа")}
              </Text>
              {isOwn && replyMessage.content?.url && (
                <Icon as={File} size={16} />
              )}
              {isOwn && (
                <Box w={"2px"} bg={textColor} borderRadius="full" h={"20px"} />
              )}
            </HStack>
          )}
        </Box>
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
        cursor={onClick ? "pointer" : "default"}
        onClick={onClick}
      >
        {children}
      </Box>

      <HStack spacing={1} justify={"center"} mt={1}>
        {!isOwn && <MessageRead isRead={isRead} />}
        <Text fontSize="xs" opacity={0.7}>
          {transformDateTime(createdAt)}
        </Text>
        {isOwn && <MessageRead isRead={isRead} />}
      </HStack>
    </Flex>
  );
};

ChatBubbleBase.propTypes = {
  ...PropTypes.shape(ChatBaseMessageObject).isRequired,
  onClick: PropTypes.func,
  includePadding: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ChatBubbleBase;
