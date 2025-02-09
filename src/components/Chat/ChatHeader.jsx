import {
  Flex,
  Icon,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import PropTypes from "prop-types";
import ChatInfoModal from "./ChatInfoModal";

const ChatHeader = ({ chat, onBack }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex justify={"space-between"} align={"center"} p={4} bg="gray.100">
      <Flex align={"center"}>
        {isMobile && (
          <Icon
            as={ArrowLeft}
            boxSize={6}
            color={"gray.500"}
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
        cursor={"pointer"}
        onClick={onOpen}
        color={"gray.500"}
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
