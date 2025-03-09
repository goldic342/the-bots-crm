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
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import PasswordInput from "../components/ui/PasswordInput";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    navigate("/dashboard/bots");
  }, [token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Заполните все поля.");
      return;
    }
    try {
      const { accessToken } = await login(formData.username, formData.password);
      setToken(accessToken);
      navigate("/dashboard/bots");
    } catch (error) {
      setError(error.response?.data?.detail?.message || "Неизвестная ошибка");
    }
  };

  const formBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.400", "gray.200");

  return (
    <Container
      centerContent
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack
        spacing={8}
        w="full"
        maxW="md"
        p={8}
        bg={formBg}
        borderRadius="md"
        boxShadow="md"
      >
        <Heading as="h2" size="lg">
          Войти
        </Heading>
        <Text color={textColor} textAlign="center">
          Введите данные чтобы авторизоваться
        </Text>
        <Stack spacing={4} w="full">
          <Input
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Имя пользователя"
            size="lg"
            type="text"
            spellCheck={false}
            autoCorrect={"off"}
            autoCapitalize="off"
            inputMode="text"
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
            <Text color="red.500">{error}</Text>
          </Fade>
        </Box>
      </VStack>
    </Container>
  );
};

export default Login;
