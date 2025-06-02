import {
  Box,
  Flex,
  Text,
  Badge,
  Tooltip,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useChats } from "../../../../contexts/ChatContext";

const MAX_COUNT_DISPLAY = 99;

const FolderItem = ({ folder }) => {
  const { currentFolder, setCurrentFolder } = useChats();

  const isActive = currentFolder?.id === folder.id;
  const badgeColor = useColorModeValue(
    isActive ? "primary.500" : "gray.500",
    isActive ? "primary.300" : "gray.400",
  );

  const displayCount =
    folder.totalUnreadMessages > MAX_COUNT_DISPLAY
      ? `${MAX_COUNT_DISPLAY}+`
      : folder.totalUnreadMessages;

  return (
    <Flex
      as="button"
      role="group"
      onClick={() => setCurrentFolder(folder)}
      direction="column"
      justify="center"
      align="center"
      cursor="pointer"
      p={2}
      minW="7rem"
      borderRadius="md"
    >
      <Flex w="100%" align="center" gap={1} maxW="100%">
        <Tooltip label={folder.name} openDelay={500}>
          <Text flex="1" fontSize="sm" isTruncated>
            {folder.name}
          </Text>
        </Tooltip>

        {folder.totalUnreadMessages > 0 && (
          <Badge
            bg={badgeColor}
            color="white"
            borderRadius="full"
            px={2}
            fontSize="xs"
            lineHeight="1.1"
            minW="1.5rem"
            textAlign="center"
            flexShrink={0}
          >
            {displayCount}
          </Badge>
        )}
      </Flex>

      <Box
        w="85%"
        borderBottom="3px solid"
        borderRadius="full"
        opacity={0.5}
        borderColor={isActive ? "primary.300" : "transparent"}
        transition="border-color 0.25s ease"
        mt={1}
      />
    </Flex>
  );
};

FolderItem.propTypes = {
  folder: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    botId: PropTypes.number.isRequired,
    totalUnreadMessages: PropTypes.number.isRequired,
  }).isRequired,
};

export default FolderItem;
