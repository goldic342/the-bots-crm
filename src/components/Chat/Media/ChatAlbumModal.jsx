import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Flex,
  IconButton,
  Skeleton,
  Image,
  chakra,
  HStack,
} from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ChatMediaModal from "./ChatMediaModal";

const ChatAlbumModal = ({ isOpen, onClose, items, time }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailRefs = useRef([]);
  const [loadedThumbs, setLoadedThumbs] = useState({});

  const currentItem = items[currentIndex];
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Vim metioned btw
      if (event.key === "ArrowRight" || event.key === "l") {
        handleNext();
      } else if (event.key === "ArrowLeft" || event.key === "h") {
        handlePrev();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (thumbnailRefs.current[currentIndex]) {
      thumbnailRefs.current[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  if (!items || items.length === 0) {
    return null;
  }

  const renderMain = () => {
    if (currentItem.type === "video") {
      return (
        <chakra.video
          src={currentItem.src}
          controls
          autoPlay
          height="100%"
          width="100%"
          objectFit="contain"
        />
      );
    }
    return (
      <Image
        src={currentItem.src}
        alt="album-item"
        height="100%"
        width="100%"
        objectFit="contain"
      />
    );
  };

  return (
    <ChatMediaModal
      isOpen={isOpen}
      onClose={onClose}
      mediaUrl={currentItem.src}
      mediaType={currentItem.type === "video" ? "video" : "image"}
      time={time}
    >
      {items.length === 1 ? (
        <Box position="relative" width="100%" height="100%" overflow="hidden">
          {renderMain()}
        </Box>
      ) : (
        <Flex
          direction="column"
          w="100%"
          h="100%"
          position="relative"
          overflow="hidden"
        >
          <Box flex="1" position="relative" overflow="hidden">
            {renderMain()}
            <IconButton
              icon={<ChevronLeft size={28} />}
              onClick={handlePrev}
              variant="ghost"
              color="white"
              position="absolute"
              left="2"
              top="50%"
              transform="translateY(-50%)"
              _hover={{ bg: "blackAlpha.300" }}
              aria-label="Previous"
              size="lg"
            />
            <IconButton
              icon={<ChevronRight size={28} />}
              onClick={handleNext}
              variant="ghost"
              color="white"
              position="absolute"
              right="2"
              top="50%"
              transform="translateY(-50%)"
              _hover={{ bg: "blackAlpha.300" }}
              aria-label="Next"
              size="lg"
            />
          </Box>

          <Box
            h="90px"
            bg="blackAlpha.800"
            p={2}
            overflowX="auto"
            overflowY="hidden"
            flexShrink={0}
          >
            <HStack
              spacing={2}
              justify={{ base: "flex-start", md: "center" }}
              display="flex"
              overflowY="scroll"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {items.map((item, idx) => {
                const isActive = idx === currentIndex;
                const src = item.type === "img" ? item.src : item.thumbnail;
                return (
                  <Box
                    key={idx}
                    ref={(el) => (thumbnailRefs.current[idx] = el)}
                    border={
                      isActive ? "2px solid white" : "2px solid transparent"
                    }
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setCurrentIndex(idx)}
                    flex="0 0 auto"
                    boxSize={{ base: 16, md: 16, lg: 20 }}
                    position="relative"
                    filter={!isActive && "brightness(80%)"}
                    overflow="hidden"
                  >
                    {!loadedThumbs[src] && (
                      <Skeleton
                        height="100%"
                        width="100%"
                        startColor="whiteAlpha.100"
                        endColor="whiteAlpha.500"
                      />
                    )}
                    <Image
                      src={src}
                      alt="thumbnail"
                      boxSize="100%"
                      objectFit="cover"
                      style={!loadedThumbs[src] ? { display: "none" } : {}}
                      onLoad={() =>
                        setLoadedThumbs((prev) => ({
                          ...prev,
                          [src]: true,
                        }))
                      }
                    />
                  </Box>
                );
              })}
            </HStack>
          </Box>
        </Flex>
      )}
    </ChatMediaModal>
  );
};

ChatAlbumModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(["img", "video"]).isRequired,
      src: PropTypes.string.isRequired,
    }),
  ).isRequired,
  time: PropTypes.string,
};

export default ChatAlbumModal;
