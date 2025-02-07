import { Box, Text, Center } from "@chakra-ui/react";
const Forbidden = () => {
  return (
    <Center h="100vh">
      <Box textAlign="center" p={6} borderRadius="md" bg="primary.100">
        <Text fontSize="2xl" fontWeight="bold" color="primary.700">
          403 - Access Denied
        </Text>
        <Text mt={2} color="primary.600">
          You do not have permission to view this page.
        </Text>
      </Box>
    </Center>
  );
};

export default Forbidden;
