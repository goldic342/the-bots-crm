import {
  Box,
  Text,
  Flex,
  Avatar,
  Spacer,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import useColors from "../../hooks/useColors";
import { ChatItem as ChatItemType } from "../../utils/types/chatTypes";
import { transformDateTime } from "../../utils/transformDateTime";
import MessageRead from "../ui/MessageRead";
import { messageToString } from "../../utils/messageToString";
import { Ban } from "lucide-react";

const ChatItem = ({ chat, isActive, onClick }) => {
  const colors = useColors();
  const activeBg = useColorModeValue("blue.100", "blue.700");
  const inactiveBg = useColorModeValue("white", "gray.800");
  const hoverBg = colors.text;
  const dateColor = useColorModeValue("gray.500", "gray.400");
  const messageColor = useColorModeValue("gray.600", "gray.300");

  const isDisabled = chat.status !== "active";

  return (
    <Box
      py={3}
      px={3}
      bg={isActive ? activeBg : inactiveBg}
      transition="background .1s ease-in"
      _hover={isDisabled ? {} : { bg: hoverBg }}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      opacity={isDisabled ? 0.6 : 1}
      onClick={isDisabled ? undefined : onClick}
    >
      <Flex align="center">
        <Avatar name={chat.lead.name} src={chat.lead.photo} size="md" mr={3} />

        <Box flex="1">
          <Flex align="center">
            <Text fontWeight="bold">{chat.lead.name}</Text>
            <Spacer />
            <Flex align="center">
              {isDisabled && (
                <Icon as={Ban} color="red.500" boxSize={4} mr={2} />
              )}
              <Text fontSize="xs" color={dateColor}>
                {transformDateTime(chat.lastMessage.createdAt)}
              </Text>
            </Flex>
          </Flex>

          <Flex align="center">
            <Text fontSize="sm" color={messageColor} noOfLines={1}>
              {messageToString(chat.lastMessage) || "Нет сообщений"}
            </Text>
            <Spacer />
            <MessageRead isRead={chat.isRead} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

ChatItem.propTypes = {
  chat: ChatItemType.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default ChatItem;
