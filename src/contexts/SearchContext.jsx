import { createContext, useContext, useState, useEffect } from "react";
import useApiRequest from "../hooks/useApiRequest";
import { searchMessages } from "../api/chats";
import { useParams } from "react-router-dom";

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within an SearchProvider");
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const { botId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({});

  const [scrollToId, setScrollToId] = useState(0); // Id of message that needed to be scrolled to
  const [isFetched, setIsFetched] = useState(false); // Represents if message already fetched in memory (state)

  const [fetchSearchResults, isSearching, error] = useApiRequest(async () => {
    return await searchMessages(botId, searchQuery);
  });

  const [loadMoreSearchResults, isLoadingMore, loadingMoreError] =
    useApiRequest(async (locOffset = 0) => {
      return await searchMessages(botId, searchQuery, locOffset);
    });

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({});
      return;
    }

    if (isSearching) return;

    const delayDebounce = setTimeout(async () => {
      const results = await fetchSearchResults();
      setSearchResults(results || {});
    }, 500); // Debounced API call

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        error,
        fetchSearchResults,
        scrollToId,
        setScrollToId,
        isFetched,
        setIsFetched,
        loadMoreSearchResults,
        isLoadingMore,
        loadingMoreError,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
