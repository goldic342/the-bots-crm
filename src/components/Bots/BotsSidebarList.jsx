import { Box, Flex, Input, VStack, Text } from "@chakra-ui/react";
import BotsListItem from "./BotsListItem";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const BotsSidebarList = ({ bots, onSelectBot, isLoading, error }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(bots);

  console.log(bots);
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

  return (
    <Flex
      height={"100vh"}
      flexDir={"column"}
      borderRight={"1px"}
      borderColor={"gray.200"}
    >
      <Flex
        borderBottom={"1px"}
        borderColor={"gray.200"}
        flexDir={"column"}
        gap={3}
        p={4}
      >
        <Box>
          <Text fontSize={"xl"} fontWeight={"bold"}>
            Ваши боты
          </Text>
        </Box>
        <Box w={"xs"}>
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
          <Text color={"red.500"} mt={4}>
            Ошибка при загрузке ботов!
          </Text>
        )}
        {!isLoading && !error && searchResult.length === 0 ? (
          <Text mt={4} color="gray.500">
            Ничего не найдено :(
          </Text>
        ) : (
          searchResult.map((b) => (
            <BotsListItem
              key={b.id}
              name={b.name}
              active={b.active}
              onClick={() => onSelectBot(b.id)}
            />
          ))
        )}
      </VStack>
    </Flex>
  );
};

BotsSidebarList.propTypes = {
  bots: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onSelectBot: PropTypes.func.isRequired,
};

export default BotsSidebarList;
