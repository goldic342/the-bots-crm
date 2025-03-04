import { useEffect, useRef } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ChatBubble from "./ChatBubble";
import ChatImageBubble from "./Media/ChatImageBubble";
import ChatAlbumBubble from "./Media/ChatAlbumBubble";
import ChatVideoBubble from "./Media/ChatVideoBubble";
import ChatAudioBubble from "./Media/ChatAudioBubble";
import { AudioProvider } from "../../contexts/AudioContext";

const ChatMessages = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const bg = useColorModeValue("gray.50", "gray.800");

  // ONLY FOR TEST
  const nt = new Date();
  nt.setHours(12, 0, 0, 0);

  return (
    <Box flex="1" p={4} overflowY="auto" bg={bg}>
      <AudioProvider>
        <ChatAudioBubble
          message={{
            id: "95617ae9-2e8e-4b48-8fe4-399ed3be1676",
            isOwn: false,
            src: "https://ia600209.us.archive.org/8/items/MetallicaMasterOfPuppets_0/02__Master_Of_Puppets_64kb.mp3",
            time: new Date().toLocaleTimeString(),
          }}
        />
        <ChatImageBubble
          message={{
            src: "https://i.natgeofe.com/n/4cebbf38-5df4-4ed0-864a-4ebeb64d33a4/NationalGeographic_1468962.jpg",
            id: "40ced9f0-3b82-4ad9-9198-c8e5ced4f7b0",
            isOwn: true,
            time: new Date().toLocaleTimeString(),
          }}
        />
        <ChatImageBubble
          message={{
            src: "https://www.dogsforgood.org/wp-content/uploads/2020/06/Dogs-For-Good-October-22-2019-308.jpga",
            id: "40ced9f0-3b82-4ad9-9198-c8e5ced4f7b0",
            isOwn: false,
            time: new Date().toLocaleTimeString(),
          }}
        />

        <ChatImageBubble
          message={{
            src: "https://i.pinimg.com/736x/1d/c6/89/1dc689fa8634241600c58f83c3a4d840.jpg",
            id: "40ced9f0-3b82-4ad9-9198-c8e5ced4f7b0",
            isOwn: true,
            time: new Date().toLocaleTimeString(),
          }}
        />
        <ChatVideoBubble
          message={{
            src: "https://videos.pexels.com/video-files/853757/853757-hd_1920_1080_25fps.mp4",
            thumbnail:
              "https://i.pinimg.com/236x/e0/ab/89/e0ab89eb94a3c34acc64069cafe7ba23.jpg",
            id: "40ced9f0-3b82-4ad9-9198-c8e5ced4f7b0",
            isOwn: true,
            time: new Date().toLocaleTimeString(),
          }}
        />

        <ChatAlbumBubble
          message={{
            isOwn: false,
            id: "5dfda440-c3b6-4f22-b495-e43fe3a1717c",

            urls: [
              { type: "img", src: "https://i.redd.it/12jrjjyj14ie1.jpeg" },
              {
                type: "video",
                thumbnail:
                  "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                src: "https://videos.pexels.com/video-files/855282/855282-hd_1280_720_25fps.mp4",
              },
              { type: "img", src: "https://i.redd.it/blidiwlp2qhe1.jpeg" },
              {
                type: "img",
                src: "https://api.slingacademy.com/public/sample-photos/1.jpega",
              },
              {
                type: "img",
                src: "https://api.slingacademy.com/public/sample-photos/2.jpeg",
              },
              {
                type: "img",
                src: "https://api.slingacademy.com/public/sample-photos/3.jpeg",
              },
              { type: "img", src: "https://via.placeholder.com/600/92c952" },
              { type: "img", src: "https://dummyjson.com/image/400x200" },
              {
                type: "img",
                src: "https://api.slingacademy.com/public/sample-photos/4.jpeg",
              },
              {
                type: "video",
                thumbnail:
                  "https://i.ytimg.com/vi/YlUKcNNmywk/maxresdefault.jpg",
                src: "https://videos.pexels.com/video-files/3184339/3184339-hd_1280_720_25fps.mp4",
              },
            ],

            time: new Date().toLocaleTimeString(),
          }}
        />
        <ChatAudioBubble
          message={{
            replyTo: {
              id: "ffb1529e-cf6f-4e82-b0aa-ad1c98e1ffda",
              type: "text",
              text: "e87a2026-1502-476f-929b-91c9ebc605e4 ca7e4797-2ac0-4de8-94c7-8de3af5e26d5",
            },
            id: "9f6137a5-3457-4693-b290-d58f99d1680e",
            isOwn: true,
            src: "https://roy31.oceansaver.in/pacific/?SfuRveHcsmjdi4fsLmTNTT4",
            time: new Date().toLocaleTimeString(),
          }}
        />

        <ChatAudioBubble
          message={{
            id: "2eae95c5-e4b1-47fb-a9d1-0241d9b10225",
            isOwn: true,
            src: "https://archive.org/download/505arcticmonkeyslyricsmp3160k_201910/505%20__%20arctic%20monkeys%20lyrics%28MP3_160K%29.mp3",
            time: new Date().toLocaleTimeString(),
          }}
        />
        <ChatAudioBubble
          // Older message loaded
          message={{
            id: "fc9feec0-6446-40a5-aac9-4e93e44c9dc9",
            isOwn: true,
            src: "https://ia904503.us.archive.org/30/items/soundcloud-165204531/165204531.mp3",
            time: nt.toLocaleTimeString(),
          }}
        />
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </AudioProvider>
    </Box>
  );
};

ChatMessages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  isTyping: PropTypes.bool,
};

export default ChatMessages;
