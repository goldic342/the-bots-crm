import { useEffect, useRef } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ChatBubble from "./ChatBubble";
import ChatImageBubble from "./ChatImageBubble";
import ChatImageAlbumBubble from "./ChatImageAlbumBubble";

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const bg = useColorModeValue("gray.50", "gray.800");

  return (
    <Box flex="1" p={4} overflowY="auto" bg={bg}>
      {/*Placeholder*/}
      <ChatImageBubble
        message={{
          url: "https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962.jpg",
          id: "40ced9f0-3b82-4ad9-9198-c8e5ced4f7b0",
          isOwn: true,
          time: new Date().toLocaleTimeString(),
        }}
      />
      <ChatImageBubble
        message={{
          url: "https://www.dogsforgood.org/wp-content/uploads/2020/06/Dogs-For-Good-October-22-2019-308.jpg",
          id: "40ced9f0-3b82-4ad9-9198-c8e5ced4f7b0",
          isOwn: false,
          time: new Date().toLocaleTimeString(),
        }}
      />

      <ChatImageBubble
        message={{
          url: "https://i.pinimg.com/736x/1d/c6/89/1dc689fa8634241600c58f83c3a4d840.jpg",
          id: "40ced9f0-3b82-4ad9-9198-c8e5ced4f7b0",
          isOwn: true,
          time: new Date().toLocaleTimeString(),
        }}
      />
      <ChatImageAlbumBubble
        message={{
          isOwn: false,
          id: "5dfda440-c3b6-4f22-b495-e43fe3a1717c",
          urls: [
            "https://i.redd.it/azdlwaiataie1.jpeg",
            "https://i.redd.it/blidiwlp2qhe1.jpeg",
            "https://i.redd.it/12jrjjyj14ie1.jpeg",
          ],
          time: new Date().toLocaleTimeString(),
        }}
      />
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  isTyping: PropTypes.bool,
};

export default ChatMessages;
