import {
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Box,
  Tooltip,
  Spacer,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Search } from "lucide-react";

import { useWS } from "../../../contexts/WSContext";

import ChatItemStack from "./ChatItemStack";
import SearchBar from "./Search/SearchBar";
import SearchResults from "./Search/SearchResults";

const ChatListInterface = ({ isLoading, error, onSelectChat }) => {
  const { botId } = useParams();
  const { isConnected, setBotId } = useWS();

  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const statusColor = isConnected ? "green.500" : "red.500";

  useEffect(() => {
    setBotId(botId);
  }, [botId, setBotId]);

  return (
    <Flex
      h={{ base: "max-content", md: "100vh" }}
      overflowY="auto"
      w={{ base: "full", md: "xl", lg: "2xl" }}
      borderRight="1px"
      borderColor={borderColor}
      flexDir="column"
    >
      <Flex
        align="center"
        gap={3}
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Icon
          as={ArrowLeft}
          boxSize={5}
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
              Чаты
            </Text>
            <Tooltip label="Статус подключения к WebSocket">
              <Box w={2} h={2} borderRadius="full" bg={statusColor} />
            </Tooltip>
          </Flex>
        )}

        <Spacer />

        {!showSearch && (
          <Icon
            as={Search}
            boxSize={5}
            mr={4}
            _hover={{ cursor: "pointer", transform: "scale(1.1)" }}
            onClick={() => setShowSearch(true)}
          />
        )}
      </Flex>

      {showSearch ? (
        <SearchResults />
      ) : (
        <ChatItemStack
          isLoading={isLoading}
          onSelectChat={onSelectChat}
          error={error}
        />
      )}
    </Flex>
  );
};

ChatListInterface.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
};

export default ChatListInterface;
