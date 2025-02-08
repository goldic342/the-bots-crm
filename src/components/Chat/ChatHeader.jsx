import { Flex, Icon, Text, useBreakpointValue } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import PropTypes from "prop-types";

const ChatHeader = ({ chat, onBack }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex align="center" p={4} bg="gray.100">
      {isMobile && (
        <Icon
          as={ArrowLeft}
          boxSize={6}
          color={"gray.700"}
          mr={2}
          cursor="pointer"
          onClick={onBack}
        />
      )}
      <Text fontSize="xl" fontWeight="bold">
        {chat?.name || "Чат"}
      </Text>
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
