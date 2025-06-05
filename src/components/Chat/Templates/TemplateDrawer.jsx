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
import { useTemplates } from "../../../contexts/TemplatesContext";
import useEntityManager from "../../../hooks/useEntityManager";
import useApiRequest from "../../../hooks/useApiRequest";
import InlineItemsList from "../../ui/InlineItemsList";

const TemplateDrawerMini = ({ isOpen, onClose }) => {
  const toast = useToast();
  const initialRef = useRef(null);
  const { templates, refresh, addTemplate, removeTemplate } = useTemplates();

  useEntityManager({ refresh }, []);

  const [text, setText] = useState("");
  const [createReq, creating, creatingError] = useApiRequest(async t =>
    addTemplate(t)
  );

  const handleCreate = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await createReq(trimmed);
    setText("");
    initialRef.current?.focus();
  };

  const [deleteReq, deleting, deletingError] = useApiRequest(async id =>
    removeTemplate(id)
  );

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
      size={"lg"}
      initialFocusRef={initialRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerHeader borderBottomWidth="1px">
          Шаблоны ответов
          <Text fontSize="sm" color="gray.500" mt={1}>
            Создайте, просматривайте и удаляйте текстовые шаблоны{" "}
          </Text>
        </DrawerHeader>

        <DrawerBody pt={4}>
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
              borderRadius={"md"}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Escape") setText("");
              }}
              size="md"
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

          <Box css={{ scrollbarWidth: "thin" }} pr={1}>
            {creating || deleting ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} h="38px" mb={2} borderRadius="md" />
              ))
            ) : (
              <InlineItemsList items={items} contentMaxH={32} />
            )}
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TemplateDrawerMini;
