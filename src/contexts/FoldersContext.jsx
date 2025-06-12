import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMessages } from "./MessagesContext";

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
  const [currentFolder, setCurrentFolderState] = useState(null);
  const [prevFolderId, setPrevFolderId] = useState(null);

  const setCurrentFolder = useCallback(
    f => {
      setPrevFolderId(currentFolder?.id);
      setCurrentFolderState(f);
    },
    [currentFolder]
  );

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

  const changeUnread = useCallback(
    (botId, folderId, totalUnread, mode = "set") => {
      setFolders(prev => {
        return {
          ...prev,
          [botId]: (prev[botId] || []).map(f =>
            folderId === f.id
              ? {
                  ...f,
                  totalUnreadMessages:
                    mode === "set"
                      ? totalUnread
                      : f.totalUnreadMessages + totalUnread,
                }
              : f
          ),
        };
      });
    },
    []
  );

  return (
    <FoldersContext.Provider
      value={{
        folders,
        currentFolder,
        setCurrentFolder,
        addFolders,
        removeFolder,
        changeUnread,
        getFolderKey,
        prevFolderId,
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
};
