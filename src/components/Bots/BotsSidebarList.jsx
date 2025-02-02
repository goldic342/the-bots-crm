import { Box, Flex, Input, VStack, Text } from "@chakra-ui/react";
import BotsListItem from "./BotsListItem";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const BotsSidebarList = ({ bots, onSelectBot }) => {
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
        {searchResult.length > 0 ? (
          searchResult.map((b) => (
            <BotsListItem
              key={b.id}
              name={b.name}
              active={b.active}
              onClick={() => onSelectBot(b.id)}
            />
          ))
        ) : (
          <Text mt={4} color="gray.500">
            Ничего не найдено :(
          </Text>
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
