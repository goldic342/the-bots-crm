import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { Bot, ChevronRight } from "lucide-react";

const BotsListItem = ({ name, active, onClick }) => {
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const inactiveDotBg = useColorModeValue("gray.200", "gray.600");

  return (
    <Flex
      justify="space-between"
      px={4}
      py={3}
      w="full"
      transition="background 0.2s ease-in-out"
      _hover={{ bg: hoverBg, cursor: "pointer" }}
      onClick={onClick}
    >
      <Flex justify="center" align="center" gap={2}>
        <Icon as={Bot} w={5} h={5} />
        <Text fontWeight="semibold">{name}</Text>
      </Flex>
      <Flex justify="center" align="center" gap={1}>
        <Box
          borderRadius="full"
          bg={active ? "green.300" : inactiveDotBg}
          w="12px"
          h="12px"
        />
        <ChevronRight />
      </Flex>
    </Flex>
  );
};

export default BotsListItem;
