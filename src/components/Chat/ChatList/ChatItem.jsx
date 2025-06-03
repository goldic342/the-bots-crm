import {
  Box,
  Text,
  Flex,
  Avatar,
  Spacer,
  useColorModeValue,
  Icon,
  Tooltip,
  Badge,
  HStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import useColors from "../../../hooks/useColors";
import { ChatItem as ChatItemType } from "../../../utils/types/chatTypes";
import { transformDateTime } from "../../../utils/transformDateTime";
import { messageToString } from "../../../utils/messageToString";
import { Ban } from "lucide-react";

const ChatItem = ({ chat, isActive, onClick }) => {
  const colors = useColors();
  const activeBg = useColorModeValue("blue.100", "blue.700");
  const inactiveBg = useColorModeValue("white", "gray.800");
  const hoverBg = colors.text;
  const dateColor = useColorModeValue("gray.500", "gray.400");
  const messageColor = useColorModeValue("gray.600", "gray.300");

  const isDisabled = chat.status !== "active";
  const unreadCount = chat.updates?.length || 0;

  return (
    <Box
      as="a"
      py={3}
      px={3}
      bg={isActive ? activeBg : inactiveBg}
      transition="background .1s ease-in"
      _hover={{ bg: hoverBg }}
      cursor={"pointer"}
      onClick={onClick}
      position="relative"
    >
      <Flex align="center">
        <Avatar name={chat.lead.name} src={chat.lead.photo} size="md" mr={3} />

        <Box flex="1">
          <Flex align="center">
            <Text fontWeight="bold">{chat.lead.name}</Text>
            <Spacer />
            <HStack align="center" spacing={2}>
              {unreadCount > 0 && (
                <Badge
                  ml={2}
                  colorScheme="red"
                  borderRadius="full"
                  bg={"primary.500"}
                  color={"white"}
                  pr
                  px={2}
                  fontSize="xs"
                >
                  {unreadCount}
                </Badge>
              )}
              {isDisabled && (
                <Tooltip label={"Пользователь заблокирован"}>
                  <Icon as={Ban} color="red.500" boxSize={4} />
                </Tooltip>
              )}
              <Text fontSize="xs" color={dateColor}>
                {transformDateTime(chat.lastMessage.createdAt)}
              </Text>
            </HStack>
          </Flex>

          <Flex align="center">
            <Text fontSize="sm" color={messageColor} noOfLines={1}>
              {messageToString(chat.lastMessage) || "Нет сообщений"}
            </Text>
            <Spacer />
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
