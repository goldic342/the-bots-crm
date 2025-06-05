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
  SlideFade,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import PasswordInput from "../components/ui/PasswordInput";
import { useAutoLogin } from "../hooks/useAutoLogin";

const Login = () => {
  useAutoLogin(); // AUTOLOGIN ONLY FOR DEVELOPER

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    navigate("/dashboard/bots");
  }, [token, navigate]);

  const handleLogin = async e => {
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
      setError(
        error.response?.data?.detail?.message ||
          error.response?.data?.detail ||
          "Неизвестная ошибка"
      );
    }
  };

  const formBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.500", "gray.300");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const buttonHover = useColorModeValue("blue.600", "blue.400");

  return (
    <Box
      bgGradient={useColorModeValue(
        "linear(to-br, blue.50, gray.100)",
        "linear(to-br, gray.900, blue.900)"
      )}
    >
      <Container
        centerContent
        h="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <SlideFade in={true} offsetY="20px">
          <VStack
            spacing={8}
            w="full"
            minW={{ base: "auto", md: "md" }}
            maxW="lg"
            p={10}
            bg={formBg}
            borderRadius="xl"
            boxShadow="xl"
          >
            <VStack>
              <Heading as="h2" size="lg">
                Войти
              </Heading>
              <Text color={textColor} textAlign="center">
                Введите данные чтобы авторизоваться
              </Text>
            </VStack>

            <Stack spacing={5} w="full">
              <Input
                onChange={e =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
                placeholder="Имя пользователя"
                size="lg"
                type="text"
                bg={inputBg}
                borderColor={inputBorder}
                borderRadius="xl"
                autoComplete="username"
              />
              <PasswordInput
                onChange={e =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                bg={inputBg}
                borderColor={inputBorder}
                borderRadius="xl"
              />
              <Button
                size="lg"
                onClick={handleLogin}
                colorScheme="blue"
                borderRadius="xl"
                transition="all 0.2s"
                _hover={{ bg: buttonHover }}
                _active={{ transform: "scale(0.98)" }}
              >
                Войти
              </Button>
            </Stack>
            <Box minH="24px">
              <Fade in={!!error}>
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              </Fade>
            </Box>
          </VStack>
        </SlideFade>
      </Container>
    </Box>
  );
};

export default Login;
