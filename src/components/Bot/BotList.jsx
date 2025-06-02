import {
  Box,
  Flex,
  Input,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import BotItem from "./BotItem";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Bot } from "../../utils/types/botTypes";

const BotsList = ({ bots, onSelectBot, isLoading, error }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(bots);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResult(bots);
      return;
    }

    const foundBots = bots.filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSearchResult(foundBots);
  }, [searchQuery, bots]);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const notFoundTextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex
      height="100vh"
      w={{ base: "full", md: "lg", lg: "xl" }}
      flexDir="column"
      borderRight="1px"
      borderColor={borderColor}
      overflowY="auto"
    >
      <Flex
        borderBottom="1px"
        borderColor={borderColor}
        flexDir="column"
        gap={3}
        p={4}
      >
        <Box w="full">
          <Text fontSize="xl" fontWeight="bold">
            Боты
          </Text>
        </Box>
        <Box w="full">
          <Input
            placeholder="Поиск ботов..."
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
        </Box>
      </Flex>

      <VStack>
        {isLoading && <Text mt={4}>Загружаем...</Text>}
        {error && (
          <Text color="red.500" mt={4}>
            Ошибка при загрузке ботов!
          </Text>
        )}
        {!isLoading && !error && searchResult.length === 0 ? (
          <Text mt={4} color={notFoundTextColor}>
            Ничего не найдено :(
          </Text>
        ) : (
          searchResult.map((b) => (
            <BotItem key={b.id} bot={b} onClick={() => onSelectBot(b.id)} />
          ))
        )}
      </VStack>
    </Flex>
  );
};

BotsList.propTypes = {
  bots: PropTypes.arrayOf(Bot).isRequired,
  onSelectBot: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default BotsList;
