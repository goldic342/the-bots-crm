import { createContext, useCallback, useContext, useState } from "react";
import {
  getTemplates,
  createTemplate,
  removeTemplate as removeTemplateReq,
} from "../api/templates";
import useApiRequest from "../hooks/useApiRequest";
import { useBot } from "./botContext";

const TemplatesContext = createContext(undefined);

export const useTemplates = () => {
  const ctx = useContext(TemplatesContext);
  if (!ctx)
    throw new Error("useTemplates must be used inside <TemplatesProvider>");
  return ctx;
};

export const TemplatesProvider = ({ children }) => {
  const { bot } = useBot();
  const botId = bot.id;

  const [templates, setTemplates] = useState([]);

  /* generic request wrappers (loading/error handled in hook consumer) */
  const [fetchAll] = useApiRequest(async id => {
    const res = await getTemplates(id);
    setTemplates(res.templates);
  });

  const [createReq] = useApiRequest(async text => {
    const template = await createTemplate(botId, text);
    setTemplates(prev => [...prev, template]);
  });

  const [deleteReq] = useApiRequest(async templateId => {
    await removeTemplateReq(botId, templateId);
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  });

  /* convenience for consumers */
  const refresh = useCallback(() => fetchAll(botId), [fetchAll, botId]);
  const addTemplate = useCallback(text => createReq(text), [createReq]);
  const removeTemplate = useCallback(id => deleteReq(id), [deleteReq]);

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        refresh,
        addTemplate,
        removeTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};
