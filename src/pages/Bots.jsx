import { useNavigate } from "react-router-dom";
import BotsList from "../components/Bot/BotList";
import useApiRequest from "../hooks/useApiRequest";
import { useEffect, useState } from "react";
import { getBots } from "../api/bots";

const Bots = () => {
  const navigate = useNavigate();
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

  return (
    <BotsList
      bots={bots}
      onSelectBot={(botId) => navigate(`/dashboard/bots/${botId}`)}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default Bots;
