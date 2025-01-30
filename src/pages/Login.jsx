import {
  Button,
  Container,
  Input,
  Stack,
  Text,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { login } from "../api/auth";
import { useAuth } from "../contexts/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { access_token } = await login(
        formData.username,
        formData.password,
      );
      setToken(access_token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Container
      centerContent
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack spacing={8} w="full" maxW="md" p={8} borderRadius="md">
        <Heading as="h2" size="lg">
          Войти
        </Heading>
        <Text color="gray.400">Введите данные чтобы авторизоваться</Text>
        <Stack spacing={4} w="full">
          <Input
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Имя пользователя"
            size="lg"
          />
          <Input
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Пароль"
            type="password"
            size="lg"
          />
          <Button size="lg" onClick={handleLogin}>
            Войти
          </Button>
        </Stack>
      </VStack>
    </Container>
  );
};

export default Login;
