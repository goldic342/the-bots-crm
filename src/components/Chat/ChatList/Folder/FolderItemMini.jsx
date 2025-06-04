import {
  Badge,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { Trash } from "lucide-react";
import PropTypes from "prop-types";

const MAX = 99;

const FolderItemMini = ({ folder, isActive, onSelect, onDelete }) => {
  const badgeColor = useColorModeValue(
    isActive ? "primary.500" : "gray.500",
    isActive ? "primary.300" : "gray.400"
  );

  const unread =
    folder.totalUnreadMessages > MAX ? `${MAX}+` : folder.totalUnreadMessages;

  return (
    <HStack
      px={3}
      py={1}
      borderRadius="md"
      bg={isActive ? "primary.50" : "transparent"}
      _hover={{ bg: "gray.100" }}
      onClick={onSelect}
      spacing={1}
    >
      <Tooltip label={folder.name}>
        <Text fontSize="sm" maxW={80} isTruncated>
          {folder.name}
        </Text>
      </Tooltip>

      {folder.totalUnreadMessages > 0 && (
        <Badge bg={badgeColor} color="white" fontSize="xs">
          {unread}
        </Badge>
      )}

      {folder.id !== 0 && (
        <IconButton
          aria-label="Удалить папку"
          as={Trash}
          variant="ghost"
          size="xs"
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
        />
      )}
    </HStack>
  );
};

FolderItemMini.propTypes = {
  folder: PropTypes.object.isRequired,
  isActive: PropTypes.bool,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
};

export default FolderItemMini;
