import {
  Box,
  Flex,
  VStack,
  HStack,
  Avatar,
  Text,
  Tooltip,
  IconButton,
  Badge,
  Skeleton,
  SkeletonCircle,
  useColorModeValue,
} from "@chakra-ui/react";
import { Edit, Plus, Trash, Bot } from "lucide-react";

const UserItem = ({ user, isLoading, onEdit, onAddBot, onDelete }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const cardBorder = useColorModeValue("gray.200", "whiteAlpha.200");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box
      bg={cardBg}
      w="full"
      p={4}
      transition="all 0.2s"
      _hover={{
        bg: hoverBg,
      }}
      cursor="pointer"
      position="relative"
      sx={{
        "&:not(:last-child)": {
          borderBottom: "1px solid",
          borderColor: cardBorder,
        },
      }}
    >
      <Flex align="center" justify="space-between" gap={6}>
        <Flex align="center" gap={4} flex="1" minW={0}>
          {isLoading ? (
            <SkeletonCircle size="14" />
          ) : (
            <Avatar
              size="lg"
              name={user.name || user.username}
              color="white"
              fontSize="lg"
              fontWeight="bold"
              flexShrink={0}
            />
          )}

          <VStack align="start" spacing={1} flex="1" minW={0}>
            {isLoading ? (
              <Skeleton height="20px" width="60%" />
            ) : (
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={textColor}
                noOfLines={1}
              >
                {user.name || "Без имени"}
              </Text>
            )}

            <HStack spacing={4} wrap="wrap">
              {isLoading ? (
                <>
                  <Skeleton height="16px" width="80px" />
                  <Skeleton height="16px" width="60px" />
                  <Skeleton height="16px" width="100px" />
                </>
              ) : (
                <>
                  <Text fontSize="sm" color={mutedTextColor} noOfLines={1}>
                    @{user.username}
                  </Text>
                  <Text color={mutedTextColor}>ID: {user.id}</Text>
                </>
              )}
            </HStack>
          </VStack>
        </Flex>

        <HStack spacing={2} flexShrink={0}>
          {isLoading ? (
            <>
              <Skeleton height="32px" width="32px" borderRadius="full" />
              <Skeleton height="32px" width="32px" borderRadius="full" />
              <Skeleton height="32px" width="32px" borderRadius="full" />
            </>
          ) : (
            <>
              <Tooltip label="Редактировать пользователя" placement="top">
                <IconButton
                  aria-label="Edit"
                  icon={<Edit size={16} />}
                  variant="ghost"
                  size="sm"
                  colorScheme="blue"
                  onClick={() => onEdit(user)}
                  _hover={{ bg: "blue.50" }}
                />
              </Tooltip>
              <Tooltip label="Добавить бота" placement="top">
                <IconButton
                  aria-label="Add Bot"
                  icon={<Plus size={16} />}
                  variant="ghost"
                  size="sm"
                  colorScheme="green"
                  onClick={() => onAddBot(user)}
                  _hover={{ bg: "green.50" }}
                />
              </Tooltip>
              <Tooltip label="Удалить пользователя" placement="top">
                <IconButton
                  aria-label="Delete"
                  icon={<Trash size={16} />}
                  variant="ghost"
                  colorScheme="red"
                  size="sm"
                  onClick={() => onDelete(user)}
                  _hover={{ bg: "red.50" }}
                />
              </Tooltip>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default UserItem;
