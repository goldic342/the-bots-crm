import BotsSidebarList from "../components/BotsSidebarList";

const Bots = () => {
  return (
    <BotsSidebarList
      bots={[
        {
          name: "SkiShop",
          active: true,
        },
        {
          name: "Support Bot",
          active: true,
        },
        {
          name: "SneakerHead",
          active: true,
        },
        {
          name: "RequestsBot",
          active: false,
        },
      ]}
    />
  );
};

export default Bots;
