import { Box, Flex, Text } from "@chakra-ui/react";
import { Bot, ChevronRight } from "lucide-react";

const BotsListItem = ({ name, active }) => {
  return (
    <Flex
      justify={"space-between"}
      px={4}
      py={3}
      w={"full"}
      transition={"background 0.2s ease-in-out"}
      _hover={{ bg: "gray.100", cursor: "pointer" }}
    >
      <Flex justify={"center"} align={"center"} gap={2}>
        <Bot size={"20px"} />
        <Text fontWeight={"semibold"}>{name}</Text>
      </Flex>
      <Flex justify={"center"} align={"center"} gap={1}>
        <Box
          borderRadius={"full"}
          bg={active ? "green.300" : "gray.200"}
          w={"12px"}
          h={"12px"}
        />
        <ChevronRight />
      </Flex>
    </Flex>
  );
};

export default BotsListItem;
