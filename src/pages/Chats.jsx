import ChatListInterface from "../components/Chat/ChatList/ChatListInterface.jsx";
import { Outlet } from "react-router-dom";
import { SearchProvider } from "../contexts/SearchContext.jsx";
import { TemplatesProvider } from "../contexts/TemplatesContext.jsx";

const Chats = () => {
  return (
    <SearchProvider>
      <TemplatesProvider>
        <ChatListInterface />
        <Outlet />
      </TemplatesProvider>
    </SearchProvider>
  );
};

export default Chats;
