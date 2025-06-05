import { createContext, useCallback, useContext, useState } from "react";

const FoldersContext = createContext(undefined);

export const useFolders = () => {
  const ctx = useContext(FoldersContext);
  if (!ctx) throw new Error("useFolders must be used inside <FoldersProvider>");
  return ctx;
};

/** Keeps track of all folders (per bot) **and** the folder the UI is showing. */
export const FoldersProvider = ({ children }) => {
  // Shape: { [botId]: Folder[] }
  const [folders, setFolders] = useState({});
  const [currentFolder, setCurrentFolder] = useState(null);

  /** For backwards compatibility with code that still expects “0 for null” */
  const getFolderKey = useCallback(
    folderId => (folderId != null ? folderId : 0),
    []
  );

  const addFolders = useCallback(
    (botId, newFolders, mode = "add") =>
      setFolders(prev => ({
        ...prev,
        [botId]: [...(mode === "add" ? prev[botId] || [] : []), ...newFolders],
      })),
    []
  );

  const removeFolder = useCallback(
    (botId, folderId) =>
      setFolders(prev => ({
        ...prev,
        [botId]: (prev[botId] || []).filter(f => f.id !== folderId),
      })),
    []
  );

  const editFolder = useCallback((botId, folderId, newFolderData) => {
    setFolders(prev => ({
      ...prev,
      [botId]: (prev[botId] || []).map(f =>
        folderId === f.id
          ? { ...f, ...newFolderData, id: f.id, botId: f.botId }
          : f
      ),
    }));
  }, []);

  return (
    <FoldersContext.Provider
      value={{
        folders,
        currentFolder,
        setCurrentFolder,
        addFolders,
        removeFolder,
        editFolder,
        getFolderKey,
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
};
