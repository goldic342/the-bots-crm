import {
  Box,
  Button,
  Heading,
  Text,
  Collapse,
  Code,
  Tooltip,
  useColorModeValue,
  VStack,
  ScaleFade,
} from "@chakra-ui/react";
import { useNavigate, useRouteError } from "react-router-dom";
import { useState } from "react";

const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  const [clickCount, setClickCount] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleReveal = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setShowDetails(true);
    }
  };

  const errorMessages = [
    "Что-то пошло не так.",
    "Вселенная дала сбой.",
    "Кажется, это не должно было произойти.",
    "Эта страница убежала за хлебом и не вернулась.",
    "Ваш клик вызвал парадокс. Извините.",
    "Хьюстон, у нас проблема.",
  ];

  const status = error?.status || "Ошибка";
  const statusText =
    error?.statusText ||
    errorMessages[Math.floor(Math.random() * errorMessages.length)];
  const message = error?.message || "Нет дополнительной информации.";
  const stack = error?.stack || "Стек вызовов недоступен.";
  const data = error?.data;

  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, blue.50)",
    "linear(to-br, gray.900, blue.900)",
  );

  const textColor = useColorModeValue("gray.800", "gray.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const detailBg = useColorModeValue("gray.100", "gray.800");

  return (
    <Box
      minHeight="100vh"
      bgGradient={bgGradient}
      color={textColor}
      px={6}
      py={12}
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <ScaleFade in={true} offsetY="20px" initialScale={0.9}>
        <VStack spacing={8} maxW="700px" w="full">
          <Tooltip
            label={`Нажмите ${5 - clickCount} раз(а) для показа деталей`}
            isDisabled={showDetails}
            placement="top"
          >
            <Heading
              size="2xl"
              cursor="pointer"
              onClick={handleReveal}
              transition="color 0.2s"
              _hover={{ color: "blue.400" }}
              userSelect="none"
            >
              {status}
            </Heading>
          </Tooltip>

          <Text fontSize="xl">{statusText}</Text>

          <Text fontSize="md" color={mutedColor} maxW="lg">
            {message}
          </Text>

          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => navigate("/")}
            px={6}
            borderRadius="full"
            _hover={{ transform: "translateY(-4px)", boxShadow: "md" }}
          >
            На главную
          </Button>

          <Collapse in={showDetails} animateOpacity>
            <Box
              mt={6}
              w="full"
              bg={detailBg}
              p={4}
              borderRadius="md"
              textAlign="left"
            >
              <Text fontWeight="bold" mb={2}>
                Детали ошибки (для разработчиков):
              </Text>

              {data && (
                <>
                  <Text mb={1}>
                    <strong>Data:</strong>
                  </Text>
                  <Code
                    display="block"
                    whiteSpace="pre-wrap"
                    mb={3}
                    fontSize="sm"
                  >
                    {JSON.stringify(data, null, 2)}
                  </Code>
                </>
              )}

              <Text mb={1}>
                <strong>Stack:</strong>
              </Text>
              <Code display="block" whiteSpace="pre-wrap" fontSize="xs">
                {stack}
              </Code>
            </Box>
          </Collapse>
        </VStack>
      </ScaleFade>
    </Box>
  );
};

export default Error;
