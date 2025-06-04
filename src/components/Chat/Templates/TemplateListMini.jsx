import {
  Box,
  HStack,
  IconButton,
  Input,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTemplates } from "../../../contexts/TemplatesContext";
import useEntityManager from "../../../hooks/useEntityManager";
import useApiRequest from "../../../hooks/useApiRequest";
import TemplateItemMini from "./TemplateItemMini";
import { useParams } from "react-router-dom";

const TemplateListMini = () => {
  const { botId } = useParams();
  const toast = useToast();
  const { templates, refresh, addTemplate, removeTemplate } = useTemplates();

  /* auto-load once */
  useEntityManager({ refresh }, []);

  /* create */
  const [text, setText] = useState("");
  const [createReq, creating, creatingError] = useApiRequest(async t =>
    addTemplate(t)
  );

  const handleCreate = async () => {
    if (!text.trim()) return;
    await createReq(text);
    setText("");
  };

  /* delete */
  const [deleteReq, deleting, deletingError] = useApiRequest(async id => {
    removeTemplate(id);
  });

  useEffect(() => {
    if (!creatingError && !deletingError) return;
    toast({
      title: `Не удалось ${creatingError ? "создать" : "удалить"} шаблон`,
      status: "error",
      position: "bottom-right",
      duration: 3000,
      isClosable: true,
    });
  }, [creatingError, deletingError, toast]);

  return (
    <Box px={3} py={1}>
      <HStack mb={2}>
        <Input
          placeholder="Новый шаблон"
          value={text}
          onChange={e => setText(e.target.value)}
          size="sm"
          isDisabled={creating}
        />
        <IconButton
          aria-label="Создать шаблон"
          icon={<Plus size={18} />}
          size="sm"
          isLoading={creating}
          onClick={handleCreate}
        />
      </HStack>

      <Box maxH={200} overflowY="auto" css={{ scrollbarWidth: "thin" }} pr={1}>
        {!templates.length &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} h="38px" mb={2} borderRadius="md" />
          ))}

        {templates.map(t => (
          <TemplateItemMini
            key={t.id}
            template={t}
            onDelete={() => deleteReq(t.id)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TemplateListMini;
