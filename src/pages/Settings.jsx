import {
  Box,
  Flex,
  Heading,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import ColorModeSwitcher from "../components/ui/ColorModeSwitcher";

const Settings = () => {
  return (
    <Flex
      bg={useColorModeValue("gray.50", "gray.800")}
      minH="100vh"
      w="full"
      p={4}
      align="center"
      justify="center"
    >
      <Box
        bg={useColorModeValue("white", "gray.700")}
        p={8}
        borderRadius="md"
        boxShadow="sm"
        maxW="lg"
        w="full"
      >
        <Heading as="h1" size="lg" mb={12} textAlign="center">
          Настройки
        </Heading>
        <VStack spacing={6}>
          <ColorModeSwitcher />
        </VStack>
      </Box>
    </Flex>
  );
};

export default Settings;
