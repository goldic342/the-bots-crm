import { Flex, Heading, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  const bg = useColorModeValue("gray.50", "gray.900");
  const iconColor = useColorModeValue("gray.400", "gray.500");
  const headingColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Flex
      justify="center"
      bg={bg}
      w="full"
      h="100vh"
      align="center"
      flexDir="column"
    >
      <Icon as={MessageSquare} w={12} h={12} color={iconColor} />
      <Heading fontWeight="normal" size="md" color={headingColor}>
        Чат не выбран...
      </Heading>
      <Text color={textColor} fontSize="sm" textAlign="center">
        Выберите чат из списка чтобы начать общаться
      </Text>
    </Flex>
  );
};

export default NoChatSelected;
