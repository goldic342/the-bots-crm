import { useState } from "react";
import ChatBubbleBase from "../ChatBubbleBase";
import ChatAlbumModal from "./ChatAlbumModal";
import ChatMediaDisplay from "./ChatMediaDisplay";
import { MediaMessage } from "../../../utils/types";

const ChatImageBubble = ({ message }) => {
  const { src, time } = message;
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <ChatBubbleBase
        {...message}
        includePadding={false}
        onClick={() => setModalOpen(true)} // open the full-screen modal
      >
        <ChatMediaDisplay media={{ type: "img", src }} />
      </ChatBubbleBase>

      <ChatAlbumModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        items={[{ type: "img", src }]}
        time={time}
      />
    </>
  );
};

ChatImageBubble.propTypes = { message: MediaMessage };
export default ChatImageBubble;
