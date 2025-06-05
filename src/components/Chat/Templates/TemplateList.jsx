import { Box, Skeleton } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import InlineItemsList from "../../ui/InlineItemsList";
import useApiRequest from "../../../hooks/useApiRequest";
import { getTemplates as loadFetch } from "../../../api/templates";
import { useTemplates } from "../../../contexts/TemplatesContext";
import { useParams } from "react-router-dom";

/**
 * Fetch-and-render list of templates.
 *
 * Props:
 *   botId        – required, used for API calls
 *   Icon         – icon component shown on every row
 *   onIconClick  – (id) => void, handler for icon press
 */
const TemplateList = ({ Icon, onIconClick }) => {
  const { templates, setTemplates } = useTemplates();
  const { botId } = useParams();

  /* pull from server once per mount (or when botId changes) */
  const [load, loading] = useApiRequest(async () => {
    const { templates: serverTemplates } = await loadFetch(botId);
    setTemplates(serverTemplates);
  });

  useEffect(() => {
    load(botId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  /* adapt data for InlineItemsList */
  const items = useMemo(
    () =>
      templates.map(t => ({
        id: t.id,
        label: t.text,
        icon: Icon,
        onClick: () => onIconClick?.(t),
      })),
    [templates, Icon, onIconClick]
  );

  return (
    <Box pr={1}>
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} h="38px" mb={2} borderRadius="md" />
        ))
      ) : (
        <InlineItemsList items={items} contentMaxH="120px" />
      )}
    </Box>
  );
};

export default TemplateList;
