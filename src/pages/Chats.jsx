import ChatListInterface from "../components/Chat/ChatList/ChatListInterface.jsx";
import { Outlet } from "react-router-dom";
import { SearchProvider } from "../contexts/SearchContext.jsx";

const Chats = () => {
  return (
    <SearchProvider>
      <ChatListInterface />
      <Outlet />
    </SearchProvider>
  );
};

export default Chats;
