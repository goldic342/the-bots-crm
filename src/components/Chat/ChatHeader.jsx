import {
  Flex,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
  useColorModeValue,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import PropTypes from "prop-types";
import ChatInfoModal from "./ChatInfoModal";
import { useChats } from "../../contexts/ChatContext";

const ChatHeader = ({ onBack }) => {
  const { currentChat: chat } = useChats();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const headerBg = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.500", "gray.300");

  // TODO: add avatar last time and etc
  return (
    <Flex justify="space-between" align="center" p={4} bg={headerBg}>
      <Flex align="center">
        {isMobile && (
          <Icon
            as={ArrowLeft}
            boxSize={6}
            color={iconColor}
            mr={2}
            cursor="pointer"
            onClick={onBack}
          />
        )}

        <HStack>
          <Avatar src={chat.lead?.photo} size={"sm"} />
          <Text fontSize="xl" fontWeight="bold">
            {chat.lead?.name || "Чат"}
          </Text>
        </HStack>
      </Flex>
      <Icon
        as={EllipsisVertical}
        boxSize={6}
        cursor="pointer"
        onClick={onOpen}
        color={iconColor}
      />
      <ChatInfoModal open={isOpen} onClose={onClose} />
    </Flex>
  );
};

ChatHeader.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default ChatHeader;
