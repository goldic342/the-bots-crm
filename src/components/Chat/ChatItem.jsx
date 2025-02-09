import {
  Box,
  Text,
  Flex,
  Avatar,
  Spacer,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { Check, CheckCheck } from "lucide-react";
import PropTypes from "prop-types";

const ChatItem = ({ chat, isActive, onClick }) => {
  const activeBg = useColorModeValue("blue.100", "blue.700");
  const inactiveBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const dateColor = useColorModeValue("gray.500", "gray.400");
  const messageColor = useColorModeValue("gray.600", "gray.300");
  const unreadIconColor = useColorModeValue("gray.400", "gray.500");

  return (
    <Box
      py={3}
      px={3}
      bg={isActive ? activeBg : inactiveBg}
      transition="background .1s ease-in"
      _hover={{ bg: hoverBg }}
      cursor="pointer"
      onClick={onClick}
    >
      <Flex align="center">
        <Avatar name={chat.name} size="md" mr={3} />

        <Box flex="1">
          <Flex align="center">
            <Text fontWeight="bold">{chat.name}</Text>
            <Spacer />
            <Text fontSize="xs" color={dateColor}>
              {chat.lastMessageDate}
            </Text>
          </Flex>

          <Flex align="center">
            <Text fontSize="sm" color={messageColor} noOfLines={1}>
              {chat.lastMessage || "Нет сообщений"}
            </Text>
            <Spacer />
            {chat.isRead ? (
              <Icon as={CheckCheck} color="primary.400" />
            ) : (
              <Icon as={Check} color={unreadIconColor} />
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
