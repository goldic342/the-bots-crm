import {
  Box,
  Flex,
  Text,
  Avatar,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import PropTypes from "prop-types";
import { Bot } from "../../utils/types/botTypes";

const BotsListItem = ({ bot, onClick }) => {
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  // Status dot colors based on bot.status
  const statusColors = {
    enabled: "green.400",
    disabled: "yellow.400",
    blocked: "red.400",
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      px={4}
      py={3}
      w="full"
      transition="background 0.2s ease-in-out"
      _hover={{ bg: hoverBg, cursor: "pointer" }}
      borderRadius="lg"
      boxShadow="sm"
      onClick={onClick}
    >
      <HStack spacing={4}>
        <Avatar size="md" src={bot.photo} />
        <VStack align="start" spacing={0}>
          <HStack justify={"space-between"} spacing={4} overflow={"hidden"}>
            <Text fontWeight="bold" fontSize="lg" isTruncated maxW={"3xs"}>
              {bot.name}
            </Text>
            <Badge colorScheme={bot.type === "bot" ? "blue" : "cyan"}>
              {bot.type}
            </Badge>
          </HStack>
          <Text fontSize="sm" color="gray.500" isTruncated maxW={"3xs"}>
            @{bot.username}
          </Text>
        </VStack>
      </HStack>
      <HStack spacing={2}>
        <Box
          borderRadius="full"
          bg={statusColors[bot.status] || "gray.400"}
          w="12px"
          h="12px"
        />
        <ChevronRight />
      </HStack>
    </Flex>
  );
};

BotsListItem.propTypes = {
  bot: Bot.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BotsListItem;
