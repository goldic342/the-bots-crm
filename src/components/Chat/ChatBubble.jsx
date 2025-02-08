import { Text, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ChatBubble = ({ message }) => {
  const { isOwn, text, time } = message;

  const bgColor = isOwn ? "primary.500" : "gray.100";
  const textColor = isOwn ? "white" : "black";

  return (
    <Flex justify={isOwn ? "flex-end" : "flex-start"} mb={2}>
      <Flex
        bg={bgColor}
        color={textColor}
        px={4}
        py={3}
        maxWidth="80%"
        boxShadow="sm"
        flexDirection="column"
        borderTopLeftRadius={isOwn ? "20px" : "5px"}
        borderTopRightRadius={isOwn ? "5px" : "20px"}
        borderBottomLeftRadius="20px"
        borderBottomRightRadius="20px"
      >
        <Text whiteSpace="pre-wrap" wordBreak="break-word" color={"inherit"}>
          {text}
        </Text>
        {time && (
          <Text
            fontSize="xs"
            mt={1}
            alignSelf="flex-end"
            opacity={0.7}
            color={"inherit"}
          >
            {time}
          </Text>
        )}
      </Flex>
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
