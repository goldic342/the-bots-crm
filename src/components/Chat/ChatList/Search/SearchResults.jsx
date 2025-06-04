import { useState } from "react";
import { VStack, Box } from "@chakra-ui/react";
import SpinnerLoader from "../../../ui/SpinnerLoader";
import LoaderMessage from "../../../ui/LoaderMessage";
import { useSearch } from "../../../../contexts/SearchContext";
import useInfiniteScroll from "../../../../hooks/useInfiniteScroll";
import {
  SEARCH_MESSAGES_LIMIT,
  SEARCH_MESSAGES_OFFSET,
} from "../../../../constants";
import ChatItem from "../ChatItem";
import { useNavigate, useParams } from "react-router-dom";
import { useMessages } from "../../../../contexts/MessagesContext";

const SearchResults = () => {
  const {
    fetchSearchResults,
    isSearching,
    setSearchResults,
    error,
    searchResults = {},
    setScrollToId,
    setIsFetched,
  } = useSearch();
  const { botId } = useParams();
  const navigate = useNavigate();
  const { checkMessageExists } = useMessages();

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const safeSearchResults = {
    count: searchResults.count ?? 0,
    messages: Array.isArray(searchResults.messages)
      ? searchResults.messages
      : [],
  };

  const [offset, setOffset] = useState(SEARCH_MESSAGES_OFFSET + 1);
  const loadMoreResults = async () => {
    if (safeSearchResults.count < SEARCH_MESSAGES_LIMIT) {
      stopObserving();
      setIsVisible(false);
      return;
    }

    setIsLoadingMore(true);
    const newResults = await fetchSearchResults(offset);
    setIsLoadingMore(false);

    if (!newResults || (newResults.count ?? 0) < SEARCH_MESSAGES_LIMIT) {
      stopObserving();
      setIsVisible(false);
      return;
    }

    setOffset(prev => prev + SEARCH_MESSAGES_OFFSET);
    setSearchResults(prev => {
      return {
        count: prev.count + newResults.count,
        messages: [...prev.messages, ...newResults.messages],
      };
    });
  };

  const { lastElementRef, stopObserving, setIsVisible } = useInfiniteScroll({
    isLoading: isSearching,
    onLoadMore: loadMoreResults,
    useEffectDropCondition:
      isLoadingMore || safeSearchResults.count < SEARCH_MESSAGES_LIMIT,
  });

  const handleClick = (message, lead) => {
    setScrollToId(message.id);

    if (checkMessageExists(lead.id, message.id)) {
      setIsFetched(true);
    } else {
      setIsFetched(false);
    }

    navigate(`/dashboard/bots/${botId}/chat/${lead.id}`);
  };
  return (
    <VStack align="stretch" spacing={2}>
      {isSearching && !isLoadingMore ? (
        <SpinnerLoader h={{ base: "20vh", md: "94vh" }} />
      ) : null}

      {error && (
        <LoaderMessage h={{ base: "20vh", md: "94vh" }} isError>
          Не удалось загрузить результаты: {error}
        </LoaderMessage>
      )}

      {!isSearching && !error && safeSearchResults.count === 0 ? (
        <LoaderMessage h={{ base: "20vh", md: "94vh" }}>
          Похоже ничего нет...
        </LoaderMessage>
      ) : null}

      {(!isSearching && !error) || (isLoadingMore && isSearching)
        ? safeSearchResults.messages.map(data => {
            const message = data.message;
            const lead = data.lead;
            return (
              <ChatItem
                key={`${message.id}:${lead.id}`}
                chat={{
                  botId: Number(botId), // PropTypes requires Number
                  lead,
                  updates: [],
                  status: "active",
                  lastMessage: message,
                }}
                onClick={() => handleClick(message, lead)}
              />
            );
          })
        : null}

      {isLoadingMore && (
        <SpinnerLoader h="10vh" text="Загрузка следующих результатов..." />
      )}

      {error && (
        <LoaderMessage h="10vh" isError>
          Не удалось загрузить результаты: {error}
        </LoaderMessage>
      )}

      <Box w="full" h="20px" bg="transparent" ref={lastElementRef} />
    </VStack>
  );
};

export default SearchResults;
