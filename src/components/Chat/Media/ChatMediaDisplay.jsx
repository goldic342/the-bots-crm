import {
  Box,
  IconButton,
  Image,
  Skeleton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Play } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import useLazyLoad from "../../../hooks/useLazyLoad";

const ChatMediaDisplay = ({ media, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [ref, shouldLoad] = useLazyLoad();

  // reset skeleton when a new file comes in
  useEffect(() => setLoaded(false), [media.src]);

  const textColor = media.isOwn
    ? "white"
    : useColorModeValue("black", "whiteAlpha.900");

  return (
    <Box ref={ref} position="relative" w="full" maxW={96} textAlign="center">
      <Box w="full" aspectRatio={16 / 9}>
        {shouldLoad && (
          <Skeleton isLoaded={loaded} w="full" h="full">
            {media.type === "image" ? (
              <Image
                src={media.src}
                alt="album-item"
                objectFit="cover"
                w="full"
                h="full"
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                cursor="pointer"
                fallbackSrc="https://placehold.co/600x400?text=Image+Not+Found"
                onClick={onClick}
              />
            ) : (
              <Box position="relative" w="full" h="full" onClick={onClick}>
                <Image
                  src={media.previewUrl}
                  alt="video-thumbnail"
                  objectFit="cover"
                  w="full"
                  h="full"
                  onLoad={() => setLoaded(true)}
                  onError={() => setLoaded(true)}
                  fallbackSrc="https://placehold.co/600x400?text=Thumbnail+Not+Found"
                  cursor="pointer"
                />
                <IconButton
                  aria-label="Play"
                  icon={<Play />}
                  position="absolute"
                  inset="50% auto auto 50%"
                  transform="translate(-50%, -50%)"
                  color="white"
                  bg="blackAlpha.500"
                  _hover={{ bg: "blackAlpha.600" }}
                  size="lg"
                  borderRadius="full"
                  zIndex={1}
                />
              </Box>
            )}
          </Skeleton>
        )}
      </Box>

      {media.text && (
        <Text
          p={2}
          textAlign="left"
          fontSize="md"
          color={textColor}
          whiteSpace="pre-wrap"
          wordBreak="break-word"
        >
          {media.text}
        </Text>
      )}
    </Box>
  );
};
ChatMediaDisplay.propTypes = {
  media: PropTypes.shape({
    type: PropTypes.oneOf(["image", "video"]).isRequired,
    src: PropTypes.string.isRequired,
    text: PropTypes.string,
    previewUrl: PropTypes.string, // only for videos
    isOwn: PropTypes.bool.isRequired,
  }).isRequired,

  onClick: PropTypes.func.isRequired,
};

export default ChatMediaDisplay;
