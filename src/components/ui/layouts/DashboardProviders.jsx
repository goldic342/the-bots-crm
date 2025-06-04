import { WSProvider } from "../../../contexts/WSContext";
import { BotProvider } from "../../../contexts/botContext";
import { ChatsProvider } from "../../../contexts/ChatsContext";
import { FoldersProvider } from "../../../contexts/FoldersContext";
import { MessagesProvider } from "../../../contexts/MessagesContext";

const DashboardProviders = ({ children }) => (
  <BotProvider>
    <FoldersProvider>
      <MessagesProvider>
        <ChatsProvider>
          <WSProvider>{children}</WSProvider>
        </ChatsProvider>
      </MessagesProvider>
    </FoldersProvider>
  </BotProvider>
);

export default DashboardProviders;
