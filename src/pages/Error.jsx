import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate, useRouteError } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bg="gray.900"
      color="white"
      p={4}
    >
      <Heading size="2xl" mb={4}>
        {error?.status || "Ой!"}
      </Heading>
      <Text fontSize="lg" mb={6}>
        {error?.statusText || "Something went wrong!"}
      </Text>
      <Button size="lg" onClick={() => navigate("/")}>
        На главную
      </Button>
    </Box>
  );
};

export default Error;
