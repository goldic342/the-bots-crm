// components/Media/ChatAlbumBubble.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { Grid, Box, Image, Skeleton, Text } from "@chakra-ui/react";
import ChatBubbleBase from "../ChatBubbleBase";
import ChatAlbumModal from "./ChatAlbumModal";
import useLoadedItems from "../../../hooks/useLoadedItems";

const ChatAlbumBubble = ({ message }) => {
  const { urls, isOwn, time } = message;
  const [isModalOpen, setModalOpen] = useState(false);
  const [loadedMedia, onMediaLoad] = useLoadedItems();

  // Decide how many images to show in the preview
  const maxDisplayCount = 4;
  const hasMore = urls.length > maxDisplayCount;
  const visibleItems = urls.slice(
    0,
    hasMore ? maxDisplayCount - 1 : maxDisplayCount,
  );

  const handleClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <ChatBubbleBase
        isOwn={isOwn}
        time={time}
        onClick={handleClick}
        includePadding={false}
      >
        <Grid
          templateColumns="repeat(2, 1fr)"
          maxW={96}
          maxH={96}
          overflow="hidden"
        >
          {visibleItems.map((item, idx) => {
            const src = item.type === "img" ? item.src : item.thumbnail;
            return (
              <Box key={idx} position="relative">
                {!loadedMedia[src] && <Skeleton height="100%" width="100%" />}
                <Image
                  src={src}
                  alt="album-item"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                  fallbackSrc="https://placehold.co/300x300?text=Not+Found"
                  style={!loadedMedia[src] ? { display: "none" } : {}}
                  onLoad={() => onMediaLoad(src)}
                />
              </Box>
            );
          })}

          {hasMore && (
            <Box
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {!loadedMedia[urls[maxDisplayCount - 1].src] && (
                <Skeleton height="100%" width="100%" />
              )}
              <Image
                src={
                  urls[maxDisplayCount - 1].type === "img"
                    ? urls[maxDisplayCount - 1].src
                    : urls[maxDisplayCount - 1].thumbnail
                }
                alt="album-item"
                width="100%"
                height="100%"
                objectFit="cover"
                fallbackSrc="https://placehold.co/300x300?text=Not+Found"
                filter={"auto"}
                brightness={"60%"}
                style={
                  !loadedMedia[urls[maxDisplayCount - 1].src]
                    ? { display: "none" }
                    : {}
                }
                onLoad={() => onMediaLoad(urls[maxDisplayCount - 1].src)}
              />
              <Text
                position="absolute"
                zIndex={2}
                color="white"
                fontWeight="bold"
                fontSize="lg"
              >
                +{urls.length - maxDisplayCount + 1}
              </Text>
            </Box>
          )}
        </Grid>
      </ChatBubbleBase>

      <ChatAlbumModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        items={urls}
        time={time}
      />
    </>
  );
};

ChatAlbumBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    urls: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(["img", "video"]).isRequired,
        src: PropTypes.string.isRequired,
        thumbnail: PropTypes.string,
      }),
    ).isRequired,
    time: PropTypes.string,
    isOwn: PropTypes.bool,
  }).isRequired,
};

export default ChatAlbumBubble;
