import { createContext, useCallback, useContext, useState } from "react";

import { useBot } from "./botContext";

const TemplatesContext = createContext(undefined);

export const useTemplates = () => {
  const ctx = useContext(TemplatesContext);
  if (!ctx)
    throw new Error("useTemplates must be used inside <TemplatesProvider>");
  return ctx;
};

export const TemplatesProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);

  const addTemplate = useCallback(
    template => setTemplates(prev => [...prev, template]),
    []
  );
  const removeTemplate = useCallback(
    templateId => setTemplates(prev => prev.filter(t => t.id !== templateId)),
    []
  );

  return (
    <TemplatesContext.Provider
      value={{
        templates,
        addTemplate,
        removeTemplate,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};
