import { createContext, useCallback, useContext, useState } from "react";
import {
  getTemplates as loadFetch,
  createTemplate as createFetch,
  removeTemplate as removeFetch,
} from "../api/templates";
import useApiRequest from "../hooks/useApiRequest";
import { useParams } from "react-router-dom";

const TemplatesContext = createContext(undefined);

export const useTemplates = () => {
  const ctx = useContext(TemplatesContext);
  if (!ctx)
    throw new Error("useTemplates must be used inside <TemplatesProvider>");
  return ctx;
};

export const TemplatesProvider = ({ children }) => {
  const { botId } = useParams();
  const [templates, setTemplates] = useState([]);

  /* ---- load ---- */
  const [load, loading, loadErr] = useApiRequest(async () => {
    const { templates: serverTemplates } = await loadFetch(botId);
    setTemplates(serverTemplates);
  });

  /* ---- create ---- */
  const [createReq, creating, createErr] = useApiRequest(async text => {
    const newTpl = await createFetch(botId, text);
    setTemplates(prev => [newTpl, ...prev]);
    return newTpl;
  });
  const addTemplate = useCallback(
    text => text.trim() && createReq(text.trim()),
    [createReq]
  );

  /* ---- delete ---- */
  const [deleteReq, deleting, deleteErr] = useApiRequest(async id => {
    await removeFetch(botId, id);
    setTemplates(prev => prev.filter(t => t.id !== id));
  });
  const removeTemplate = useCallback(id => deleteReq(id), [deleteReq]);

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        setTemplates, // exposed in case a caller really needs manual set
        addTemplate,
        removeTemplate,
        // extra state helpers if useful to the caller
        loading: loading || creating || deleting,
        error: loadErr || createErr || deleteErr,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};
