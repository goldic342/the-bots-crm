import {
  Flex,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
  useColorModeValue,
  Avatar,
  VStack,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import PropTypes from "prop-types";
import ChatInfoModal from "./Modals/ChatInfoModal";
import { useChats } from "../../contexts/ChatsContext";
import { useWS } from "../../contexts/WSContext";

const ChatHeader = ({ onBack }) => {
  const { currentChat: chat } = useChats();
  const { isConnected } = useWS();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const headerBg = useColorModeValue("gray.100", "gray.800");
  const iconColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex
      justify="space-between"
      align="center"
      px={4}
      py={3}
      bg={headerBg}
      shadow="sm"
    >
      {isMobile ? (
        <Icon
          as={ArrowLeft}
          boxSize={6}
          color={iconColor}
          cursor="pointer"
          onClick={onBack}
        />
      ) : (
        <div style={{ width: 24 }} /> // Placeholder to maintain spacing
      )}

      <VStack flex="1" spacing={0} align="center">
        <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
          {chat.lead?.name || "Чат"}
        </Text>
        <Text fontSize="xs" opacity={0.7} fontWeight="medium">
          {isConnected ? "Подключено" : "Не подключено"}
        </Text>
      </VStack>

      <Avatar
        src={chat.lead?.photo}
        name={chat.lead.name}
        size="sm"
        cursor="pointer"
        onClick={onOpen}
      />

      <ChatInfoModal open={isOpen} onClose={onClose} />
    </Flex>
  );
};

ChatHeader.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ChatHeader;
