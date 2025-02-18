/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from "prop-types";
import { Flex, Box, Text, useColorModeValue, Icon } from "@chakra-ui/react";
import useColors from "../../hooks/useColors";
import { baseMessage } from "../../utils/types";

const ChatBubbleBase = ({
  isOwn,
  time,
  onClick,
  includePadding = true,
  children,
  replyTo,
  onReplyClick,
}) => {
  const { primary, text } = useColors();
  const bubbleBg = isOwn ? primary : text;

  const textColor = isOwn
    ? "white"
    : useColorModeValue("black", "whiteAlpha.900");

  const handleReplyClick = (event) => {
    event.stopPropagation();
    if (onReplyClick && replyTo?.id) {
      onReplyClick(replyTo.id);
    }
  };

  return (
    <Flex
      direction="column"
      alignItems={isOwn ? "flex-end" : "flex-start"}
      mb={2}
    >
      {replyTo && (
        <Box
          mb={1}
          px={3}
          py={2}
          bg={useColorModeValue("gray.100", "gray.700")}
          borderRadius="md"
          cursor="pointer"
          onClick={handleReplyClick}
          maxW={{ base: 72, md: 80, lg: 96 }}
        >
          {replyTo.type === "media" ? (
            <Flex alignItems="center">
              <Text noOfLines={1} isTruncated>
                Media
              </Text>
            </Flex>
          ) : (
            <Text noOfLines={1} isTruncated>
              {replyTo.text}
            </Text>
          )}
        </Box>
      )}

      <Box
        maxWidth={{ base: 72, md: 80, lg: 96 }}
        boxShadow="sm"
        overflow="hidden" // For proper borders
        borderBottomLeftRadius={isOwn ? "15px" : "5px"}
        borderBottomRightRadius={isOwn ? "5px" : "15px"}
        borderTopLeftRadius="15px"
        borderTopRightRadius="15px"
        bg={bubbleBg}
        color={textColor}
        px={includePadding ? 4 : 0}
        py={includePadding ? 3 : 0}
        cursor={onClick ? "pointer" : "default"}
        onClick={onClick}
      >
        {children}
      </Box>

      {time && (
        <Text fontSize="xs" mt={1} opacity={0.7}>
          {time}
        </Text>
      )}
    </Flex>
  );
};

const newBaseMessage = baseMessage;
delete newBaseMessage.id;
ChatBubbleBase.propTypes = {
  ...newBaseMessage,
  onClick: PropTypes.func,
  includePadding: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ChatBubbleBase;
