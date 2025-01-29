import {
  Button,
  Container,
  Input,
  Stack,
  Text,
  VStack,
  Heading,
} from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Container
      centerContent
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={10} w={"full"} maxW={"md"} p={8} borderRadius="md">
        <Heading as="h2" size="lg">
          Войти
        </Heading>
        <Stack spacing={4} w={"full"}>
          <Input placeholder="Имя пользователя" size="lg" />
          <Input placeholder="Пароль" type="password" size="lg" />
          <Button colorScheme="cyan" size="lg" textColor={"white"}>
            Login
          </Button>
        </Stack>
      </VStack>
    </Container>
  );
}
