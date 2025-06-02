import {
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Box,
  Tooltip,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

import { useWS } from "../../../contexts/WSContext";

import ChatList from "./ChatList";
import SearchBar from "./Search/SearchBar";
import SearchResults from "./Search/SearchResults";
import { useBot } from "../../../contexts/botContext";
import { getBot } from "../../../api/bots";
import FolderList from "./Folder/FolderList";

const ChatListInterface = () => {
  const { isConnected } = useWS();
  const { botId } = useParams();
  const { bot, setBot } = useBot();

  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const statusColor = isConnected ? "green.500" : "red.500";

  useEffect(() => {
    if (bot.status) return;
    const fetchBot = async () => {
      try {
        const resp = await getBot(botId);
        setBot(resp);
      } catch (e) {
        console.error("Error while fetching a bot:", e);
      }
    };

    fetchBot();
  }, [bot, botId, setBot]);

  return (
    <Flex
      h={{ base: "max-content", md: "100vh" }}
      overflowY="auto"
      w={{ base: "full", md: "xl", lg: "2xl" }}
      borderRight="1px"
      borderColor={borderColor}
      flexDir="column"
    >
      <Flex align="center" p={4} borderBottom="1px" borderColor={borderColor}>
        <IconButton
          as={ArrowLeft}
          boxSize={5}
          variant="ghost"
          _hover={{ cursor: "pointer" }}
          onClick={() => {
            if (showSearch) {
              setShowSearch(false);
            } else {
              navigate("/dashboard/bots");
            }
          }}
        />

        {showSearch ? (
          <SearchBar />
        ) : (
          <Flex align="center" gap={2} flex="1">
            <Text fontSize="xl" fontWeight="bold">
              {bot.name || "Чаты"}
            </Text>
            <Tooltip label="Статус подключения к WebSocket">
              <Box w={2} h={2} borderRadius="full" bg={statusColor} />
            </Tooltip>
          </Flex>
        )}

        <Spacer />

        {!showSearch && (
          <IconButton
            as={Search}
            variant={"ghost"}
            boxSize={5}
            _hover={{ cursor: "pointer", transform: "scale(1.1)" }}
            onClick={() => setShowSearch(true)}
          />
        )}
      </Flex>

      {showSearch ? (
        <SearchResults />
      ) : (
        <Box>
          <FolderList />
          <ChatList />
        </Box>
      )}
    </Flex>
  );
};

export default ChatListInterface;
