import {
  Button,
  Box,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Fade,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import PasswordInput from "../components/ui/PasswordInput";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Заполните все поля.");
      return;
    }
    try {
      const { access_token } = await login(
        formData.username,
        formData.password,
      );
      setToken(access_token);
      navigate("/dashboard/bots");
    } catch (error) {
      setError(error.response?.data?.detail || "Unexpected error");
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
          <PasswordInput
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <Button size="lg" onClick={handleLogin}>
            Войти
          </Button>
        </Stack>
        <Box h="20px">
          <Fade in={error}>
            <Text color={"red.500"}>{error}</Text>
          </Fade>
        </Box>
      </VStack>
    </Container>
  );
};

export default Login;
