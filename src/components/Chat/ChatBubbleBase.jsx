/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from "prop-types";
import { Flex, Box, Text, useColorModeValue } from "@chakra-ui/react";
import useColors from "../../hooks/useColors";
const ChatBubbleBase = ({
  isOwn,
  time,
  onClick,
  includePadding = true,
  children,
}) => {
  const { primary, text } = useColors();
  const bubbleBg = isOwn ? primary : text;

  const textColor = isOwn
    ? "white"
    : useColorModeValue("black", "whiteAlpha.900");

  return (
    <Flex
      direction="column"
      alignItems={isOwn ? "flex-end" : "flex-start"}
      mb={2}
    >
      <Box
        maxWidth={{ base: 72, md: 80, lg: 96 }}
        boxShadow="sm"
        overflow={"hidden"} // For proper borders
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

ChatBubbleBase.propTypes = {
  isOwn: PropTypes.bool,
  time: PropTypes.string,
  onClick: PropTypes.func,
  includePadding: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ChatBubbleBase;
