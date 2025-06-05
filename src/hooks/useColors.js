import { useColorModeValue } from "@chakra-ui/react";

const useColors = isOwn => {
  return {
    primary: useColorModeValue("primary.500", "primary.400"),
    text: useColorModeValue("gray.100", "gray.700"),
  };
};

export default useColors;
