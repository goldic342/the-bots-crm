import {
  Box,
  Flex,
  Text,
  Avatar,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronRight, Bot } from "lucide-react";
import PropTypes from "prop-types";
import { Bot as BotType } from "../../utils/types/botTypes";
import BotNotAvaliableModal from "./BotNotAvaliableModal";

const BotsListItem = ({ bot, onClick }) => {
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = () => {};

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
        <ChevronRight />
      </HStack>
      <BotNotAvaliableModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

BotsListItem.propTypes = {
  bot: BotType.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BotsListItem;
