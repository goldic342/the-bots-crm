// Idk wht eslint thinks this is not react component
/* eslint-disable react-hooks/rules-of-hooks */
import { Text, Flex, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ChatBubble = ({ message }) => {
  const { isOwn, text, time } = message;

  const bgColor = isOwn
    ? useColorModeValue("primary.500", "primary.400")
    : useColorModeValue("gray.100", "gray.700");
  const textColor = isOwn
    ? "white"
    : useColorModeValue("black", "whiteAlpha.900");

  return (
    <Flex
      direction="column"
      alignItems={isOwn ? "flex-end" : "flex-start"}
      mb={2}
    >
      <Flex
        bg={bgColor}
        color={textColor}
        px={4}
        py={3}
        maxWidth="80%"
        boxShadow="sm"
        flexDirection="column"
        borderBottomLeftRadius={isOwn ? "15px" : "5px"}
        borderBottomRightRadius={isOwn ? "5px" : "15px"}
        borderTopLeftRadius="15px"
        borderTopRightRadius="15px"
      >
        <Text whiteSpace="pre-wrap" wordBreak="break-word" color="inherit">
          {text}
        </Text>
      </Flex>
      {time && (
        <Text fontSize="xs" mt={1} opacity={0.7}>
          {time}
        </Text>
      )}
    </Flex>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string,
    isOwn: PropTypes.bool,
  }).isRequired,
};

export default ChatBubble;
