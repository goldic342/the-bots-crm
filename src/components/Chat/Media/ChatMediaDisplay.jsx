import { Box, IconButton, Image, Skeleton } from "@chakra-ui/react";
import { Play } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

const ChatMediaDisplay = ({ media }) => {
  const [loaded, setLoaded] = useState(false);
  console.log(loaded, media.src);
  return (
    <Box position="relative" width="full" height="auto" maxW={96}>
      {!loaded && <Skeleton height={64} width="100%" />}
      {media.type === "img" ? (
        <Image
          src={media.src}
          alt="album-item"
          objectFit="cover"
          width="100%"
          height="100%"
          cursor="pointer"
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
            cursor="pointer"
            style={!loaded ? { display: "none" } : {}}
            onLoad={() => setLoaded(true)}
          />

          <IconButton
            aria-label="Воспроизвести"
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
  );
};

ChatMediaDisplay.propTypes = {
  media: PropTypes.shape({
    type: PropTypes.oneOf(["img", "video"]).isRequired,
    src: PropTypes.string.isRequired,
    thumbnail: PropTypes.string, // only for videos
  }).isRequired,
};

export default ChatMediaDisplay;
