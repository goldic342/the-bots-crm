import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Input,
  Skeleton,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import useApiRequest from "../../../hooks/useApiRequest";
import InlineItemsList from "../../ui/InlineItemsList";

import {
  removeTemplate as removeFetch,
  createTemplate as createFetch,
  getTemplates as loadFetch,
} from "../../../api/templates";
import { useParams } from "react-router-dom";

const TemplateDrawer = ({ isOpen, onClose }) => {
  const { botId } = useParams();
  const toast = useToast();
  const initialRef = useRef(null);

  const [templates, setTemplates] = useState([]);
  const [text, setText] = useState("");

  const [loadTemplates, loading, loadingError] = useApiRequest(async () => {
    const result = await loadFetch(botId);
    setTemplates(result.templates);
  });

  const [createReq, creating, creatingError] = useApiRequest(async newText => {
    const newItem = await createFetch(botId, newText);
    setTemplates(prev => [newItem, ...prev]);
    setText("");
    initialRef.current?.focus();
  });

  const [deleteReq, deleting, deletingError] = useApiRequest(async id => {
    await removeFetch(botId, id);
    setTemplates(prev => prev.filter(t => t.id !== id));
  });

  useEffect(() => {
    if (isOpen) loadTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!creatingError && !deletingError && !loadingError) return;
    toast({
      title: `Не удалось ${
        creatingError
          ? "создать"
          : deletingError
            ? "удалить"
            : "загрузить шаблоны"
      }`,
      status: "error",
      position: "bottom-right",
      duration: 3000,
    });
  }, [creatingError, deletingError, loadingError, toast]);

  const handleCreate = () => {
    if (!text.trim()) return;
    createReq(text.trim());
  };

  const items = useMemo(
    () =>
      templates.map(t => ({
        id: t.id,
        label: t.text,
        icon: X,
        onClick: () => deleteReq(t.id),
      })),
    [templates, deleteReq]
  );

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="lg"
      initialFocusRef={initialRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Шаблоны ответов
          <Text fontSize="sm" color="gray.500" mt={1}>
            Создайте, просматривайте и удаляйте текстовые шаблоны
          </Text>
        </DrawerHeader>

        <DrawerBody pt={4} overflowY="auto" maxH="calc(100vh - 160px)">
          <HStack
            mb={4}
            as="form"
            onSubmit={e => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <Input
              ref={initialRef}
              placeholder="Новый шаблон"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Escape") setText("");
              }}
              size="md"
              borderRadius="md"
              isDisabled={creating}
            />
            <Tooltip label="Создать шаблон" hasArrow>
              <IconButton
                aria-label="Создать шаблон"
                icon={<Plus size={18} />}
                size="md"
                type="submit"
                isDisabled={!text.trim()}
                isLoading={creating}
              />
            </Tooltip>
          </HStack>

          <Box pr={1}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} h="38px" mb={2} borderRadius="md" />
              ))
            ) : (
              <InlineItemsList items={items} contentMaxH="120px" />
            )}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TemplateDrawer;
