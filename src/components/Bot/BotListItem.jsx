import {
  Box,
  Flex,
  Text,
  Avatar,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { ChevronRight, Bot, Ban } from "lucide-react";
import PropTypes from "prop-types";
import { Bot as BotType } from "../../utils/types/botTypes";

const BotsListItem = ({ bot, onClick }) => {
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  const statusColors = {
    enabled: "green.400",
    disabled: "yellow.400",
    blocked: "red.400",
  };

  const isBlocked = bot.status !== "enabled";

  return (
    <Flex
      justify="space-between"
      align="center"
      px={4}
      py={3}
      w="full"
      transition="background 0.2s ease-in-out"
      _hover={isBlocked ? {} : { bg: hoverBg, cursor: "pointer" }}
      borderRadius="lg"
      boxShadow="sm"
      onClick={isBlocked ? undefined : onClick}
      cursor={isBlocked ? "not-allowed" : "pointer"}
      opacity={isBlocked ? 0.6 : 1}
    >
      <HStack spacing={4}>
        <Avatar size="md" src={bot.photo} />
        <VStack align="start" spacing={0}>
          <HStack spacing={1} overflow={"hidden"}>
            {bot.type === "bot" && <Icon as={Bot} color={"gray.400"} />}
            <Text fontWeight="bold" fontSize="lg" isTruncated maxW={"3xs"}>
              {bot.name}
            </Text>
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
        {isBlocked && <Icon as={Ban} color="red.500" boxSize={4} />}
        {!isBlocked && <ChevronRight />}
      </HStack>
    </Flex>
  );
};

BotsListItem.propTypes = {
  bot: BotType.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BotsListItem;
