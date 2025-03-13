import { useState, useEffect } from "react";
import LoaderMessage from "../../../ui/LoaderMessage";
import { Search } from "lucide-react";
import { Center, Icon, VStack } from "@chakra-ui/react";

const messages = [
  "Загружаем сообщения...",
  "Проверяем информацию...",
  "Греем серверы...",
  "Где-то потеряли данные...",
  "Подождите, мы тоже ждем...",
  "Отправляем запрос голубиной почтой...",
  "Пытаемся вспомнить пароль от базы данных...",
  "Пингуем сервер... если он ответит...",
  "Запрашиваем у магического шара...",
  "Грузим... а может и нет...",
  "Космические лучи мешают загрузке...",
];

const SearchLoading = ({ error }) => {
  // I put to much in it, but who cares?
  const [messageIndex, setMessageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const changeMessage = () => {
      setFade(false);

      setTimeout(() => {
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * messages.length);
        } while (nextIndex === messageIndex); // Ensure different message

        setMessageIndex(nextIndex);
        setFade(true); // Start fade-in effect

        setIsFlipping(Math.random() < 0.25);

        setTimeout(changeMessage, Math.random() * (5000 - 2000) + 2000);
      }, 300);
    };

    const timeout = setTimeout(
      changeMessage,
      Math.random() * (5000 - 2000) + 2000,
    );

    return () => clearTimeout(timeout);
  }, [messageIndex]);

  return (
    <Center h={"100vh"} w={"full"}>
      <VStack>
        <Icon
          boxSize={7}
          as={Search}
          style={{
            animation: isFlipping
              ? "flip 1.2s ease-in-out"
              : "bounceRotate 1.2s infinite ease-in-out",
          }}
        />
        <LoaderMessage
          h={10}
          w={"full"}
          style={{
            opacity: fade ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {messages[messageIndex]}
        </LoaderMessage>
        {error && <LoaderMessage isError>{error}</LoaderMessage>}
        <style>
          {`
          @keyframes bounceRotate {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-6px) rotate(-5deg);
            }
          }

          @keyframes flip {
            0% { transform: rotateY(0deg); }
            50% { transform: rotateY(180deg) translateY(-10px); }
            100% { transform: rotateY(360deg) translateY(0); }
          }
        `}
        </style>
      </VStack>
    </Center>
  );
};

export default SearchLoading;
