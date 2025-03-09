import { HStack, Icon } from "@chakra-ui/react";
import { ChatMessage } from "../../utils/types/chatTypes";
import ChatBubbleBase from "./ChatBubbleBase";
import { File } from "lucide-react";
import CRLink from "../ui/CRLink";

const ChatFileBubble = ({ message }) => {
  // Extract filename from the URL
  const fileName = message.content.url.split("/").pop();

  return (
    <ChatBubbleBase {...message}>
      <HStack spacing={3} align="center" borderRadius="md" p={2}>
        <Icon as={File} boxSize={6} />

        <CRLink
          to={message.content.url}
          fontWeight="bold"
          _hover={{ textDecoration: "underline", transform: "scale(1.1)" }}
        >
          {fileName}
        </CRLink>
      </HStack>
    </ChatBubbleBase>
  );
};

ChatFileBubble.propTypes = { message: ChatMessage.isRequired };
export default ChatFileBubble;
