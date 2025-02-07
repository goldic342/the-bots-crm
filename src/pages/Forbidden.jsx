import { Box, Text, Center } from "@chakra-ui/react";
const Forbidden = () => {
  return (
    <Center h="100vh" w={"100%"}>
      <Box textAlign="center" p={6}>
        <Text fontSize="2xl" fontWeight="bold">
          403 - Access Denied
        </Text>
        <Text mt={2} color="red.500">
          You don&apos;t have permission to view this page.
        </Text>
      </Box>
    </Center>
  );
};

export default Forbidden;
