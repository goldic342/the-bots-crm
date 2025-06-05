import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search } from "lucide-react";
import { useSearch } from "../../../../contexts/SearchContext";

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  return (
    <InputGroup w={"full"}>
      <InputLeftElement pointerEvents="none">
        <Icon as={Search} color="gray.500" />
      </InputLeftElement>
      <Input
        placeholder="Поиск сообщений..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        autoFocus
      />
    </InputGroup>
  );
};

export default SearchBar;
