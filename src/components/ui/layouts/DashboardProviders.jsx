import { WSProvider } from "../../../contexts/WSContext";
import { BotProvider } from "../../../contexts/botContext";
import { ChatProvider } from "../../../contexts/ChatContext";

const DashboardProviders = ({ children }) => (
  <BotProvider>
    <ChatProvider>
      <WSProvider>{children}</WSProvider>
    </ChatProvider>
  </BotProvider>
);

export default DashboardProviders;
