import { useNavigate } from "react-router-dom";
import BotsSidebarList from "../components/Bots/BotsSidebarList";

const Bots = () => {
  const navigate = useNavigate();
  const mockBots = [
    {
      name: "SkiShop",
      active: true,
      id: "77efd608-29a4-406e-896d-c537042837e3",
    },
    {
      name: "Support Bot",
      active: true,
      id: "6e6c10f2-aa71-4d94-bcc4-47f5cccbfea4",
    },
    {
      name: "SneakerHead",
      active: true,
      id: "15f9dfb0-29d2-45d6-b175-3584348fcc795",
    },
    {
      name: "RequestsBot",
      active: false,
      id: "94a185c5-09ae-440a-97d0-673457c66aba",
    },
  ];

  return (
    <BotsSidebarList
      bots={mockBots}
      onSelectBot={(botId) => navigate(`/dashboard/chats/${botId}`)}
    />
  );
};

export default Bots;
