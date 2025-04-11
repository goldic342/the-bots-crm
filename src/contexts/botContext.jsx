import { createContext, useContext, useEffect, useState } from "react";

const BotContext = createContext(undefined);

export const useBot = () => {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error("useBot must be used within a BotProvider");
  }
  return context;
};

export const BotProvider = ({ children }) => {
  const [bot, setBot] = useState({});

  return (
    <BotContext.Provider
      value={{
        bot,
        setBot,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};
