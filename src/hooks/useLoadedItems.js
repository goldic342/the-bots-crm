import { useState } from "react";

const useLoadedItems = () => {
  const [loadedItems, setLoadedItems] = useState({});

  const onLoad = src => {
    setLoadedItems(prev => ({
      ...prev,
      [src]: true,
    }));
  };

  return [loadedItems, onLoad];
};

export default useLoadedItems;
