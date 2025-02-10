import { Box, Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ChatSingleMediaWrapper = ({ isOwn, time, onOpen, children }) => {
  return (
    <>
      <Flex
        direction="column"
        alignItems={isOwn ? "flex-end" : "flex-start"}
        mb={2}
      >
        <Box
          maxWidth="60%"
          maxHeight={96}
          overflow="hidden"
          boxShadow="sm"
          onClick={onOpen}
          cursor="pointer"
          bg="white"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderBottomLeftRadius={isOwn ? "15px" : "5px"}
          borderBottomRightRadius={isOwn ? "5px" : "15px"}
          borderTopLeftRadius="15px"
          borderTopRightRadius="15px"
        >
          {children}
        </Box>
        {time && (
          <Text fontSize="xs" mt={1} opacity={0.7}>
            {time}
          </Text>
        )}
      </Flex>
    </>
  );
};

ChatSingleMediaWrapper.propTypes = {
  isOwn: PropTypes.bool.isRequired,
  time: PropTypes.string,
  onOpen: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default ChatSingleMediaWrapper;
