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
import { useState } from "react";
import useColors from "../../../hooks/useColors";

const ChatMediaDisplay = ({ media }) => {
  const [loaded, setLoaded] = useState(false);

  const { text, primary } = useColors();
  const textColor = media.isOwn
    ? "white"
    : useColorModeValue("black", "whiteAlpha.900");

  return (
    <Box
      position="relative"
      width={loaded ? "full" : 96}
      maxW={96}
      textAlign="center"
    >
      <Box width="100%" height={loaded ? "auto" : 64}>
        {!loaded && <Skeleton height={64} width="100%" />}
        {media.type === "image" ? (
          <Image
            src={media.src}
            alt="album-item"
            objectFit="cover"
            width="100%"
            height="100%"
            fallbackSrc="https://placehold.co/600x400?text=Image+Not+Found"
            cursor="pointer"
            onError={() => setLoaded(true)}
            style={!loaded ? { display: "none" } : {}}
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <Box position="relative" width="100%" height="100%">
            <Image
              src={media.thumbnail}
              alt="video-thumbnail"
              objectFit="cover"
              width="100%"
              height="100%"
              fallbackSrc="https://placehold.co/600x400?text=Thumbnail+Not+Found"
              cursor="pointer"
              onError={() => setLoaded(true)}
              style={!loaded ? { display: "none" } : {}}
              onLoad={() => setLoaded(true)}
            />
            <IconButton
              aria-label="Play"
              icon={<Play />}
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              color="white"
              bg={"blackAlpha.500"}
              _hover={{ bg: "blackAlpha.600" }}
              size="lg"
              borderRadius="50%"
              zIndex={1}
            />
          </Box>
        )}
      </Box>
      {media.text && (
        <Box p={2}>
          <Text
            textAlign={"left"}
            fontSize="md"
            color={textColor}
            whiteSpace="pre-wrap"
            wordBreak="break-word"
          >
            {media.text}
          </Text>
        </Box>
      )}
    </Box>
  );
};

ChatMediaDisplay.propTypes = {
  media: PropTypes.shape({
    type: PropTypes.oneOf(["image", "video"]).isRequired,
    src: PropTypes.string.isRequired,
    text: PropTypes.string,
    thumbnail: PropTypes.string, // only for videos
    isOwn: PropTypes.bool.isRequired,
  }).isRequired,
};

export default ChatMediaDisplay;
