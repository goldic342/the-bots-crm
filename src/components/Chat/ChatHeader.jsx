import {
  Flex,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import PropTypes from "prop-types";
import ChatInfoModal from "./ChatInfoModal";

const ChatHeader = ({ chat, onBack }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const headerBg = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("gray.500", "gray.300");

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
        <Text fontSize="xl" fontWeight="bold">
          {chat?.name || "Чат"}
        </Text>
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
  chat: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onBack: PropTypes.func,
};

export default ChatHeader;
