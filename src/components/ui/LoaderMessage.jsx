import { Center, Text } from "@chakra-ui/react";

const LoaderMessage = ({
  isError = false,
  h = "100vh",
  w = "full",
  children
  ...props
}) => {
  return (
    <Center h={h} w={w}>
      <Text
        fontSize={"lg"}
        color={isError ? "red.500" : 'gray.700'}
        textAlign={"center"}
        p={12}
        {...props}
      >
        {children}
      </Text>
    </Center>
  );
};

export default LoaderMessage;
