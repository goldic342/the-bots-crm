import { Box, Text, Flex, Avatar, Spacer, Icon } from "@chakra-ui/react";
import { Check, CheckCheck } from "lucide-react";
import PropTypes from "prop-types";

const ChatItem = ({ chat, isActive, onClick }) => {
  return (
    <Box
      py={3}
      px={3}
      bg={isActive ? "blue.100" : "white"}
      transition={"background .1s ease-in"}
      _hover={{ bg: "gray.100" }}
      cursor="pointer"
      onClick={onClick}
    >
      <Flex align="center">
        <Avatar name={chat.name} size="md" mr={3} />

        <Box flex="1">
          <Flex align="center">
            <Text fontWeight="bold">{chat.name}</Text>
            <Spacer />
            <Text fontSize="xs" color="gray.500">
              {chat.lastMessageDate}
            </Text>
          </Flex>

          <Flex align="center">
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {chat.lastMessage || "Нет сообщений"}
            </Text>
            <Spacer />
            {chat.isRead ? (
              <Icon as={CheckCheck} color={"primary.400"} />
            ) : (
              <Icon as={Check} color={"gray.400"} />
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

ChatItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    lastMessage: PropTypes.string,
    lastMessageDate: PropTypes.string.isRequired,
    isRead: PropTypes.bool,
  }).isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default ChatItem;
