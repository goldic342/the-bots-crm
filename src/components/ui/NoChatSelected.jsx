import { Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <Flex
      justify={"center"}
      bg={"gray.50"}
      w={"full"}
      h={"100vh"}
      align={"center"}
      flexDir={"column"}
    >
      <Icon as={MessageSquare} w={12} h={12} color={"gray.400"} />
      <Heading fontWeight={"normal"} size={"md"}>
        Чат не выбран...
      </Heading>
      <Text color={"gray.600"} fontSize={"sm"}>
        Выберите чат из списка чтобы начать общаться
      </Text>
    </Flex>
  );
};

export default NoChatSelected;
