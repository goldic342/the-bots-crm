import { useNavigate } from "react-router-dom";
import BotsList from "../components/Bot/BotList";
import useApiRequest from "../hooks/useApiRequest";
import { useEffect, useState } from "react";
import { getBots } from "../api/bots";
import { useBot } from "../contexts/botContext";

const Bots = () => {
  const navigate = useNavigate();

  const { setBot } = useBot();

  const [bots, setBots] = useState([]);
  const [fetchBots, isLoading, error] = useApiRequest(async () => {
    return await getBots();
  }, true);

  useEffect(() => {
    const fetchData = async () => {
      const botsData = await fetchBots();
      setBots(botsData.bots || []);
    };
    fetchData();
  }, []);

  const handleSelectBot = botId => {
    setBot(bots.find(b => b.id == botId));
    navigate(`/dashboard/bots/${botId}`);
  };

  return (
    <BotsList
      bots={bots}
      onSelectBot={handleSelectBot}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default Bots;
