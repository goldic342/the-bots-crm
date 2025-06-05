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
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import TemplateList from "./TemplateList";
import { useTemplates } from "../../../contexts/TemplatesContext";

const TemplateDrawer = ({ isOpen, onClose }) => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [text, setText] = useState("");

  const { templates, addTemplate, removeTemplate, loading, error } =
    useTemplates();

  if (error) {
    toast({
      title: "Не удалось выполнить операцию с шаблонами",
      status: "error",
      position: "bottom-right",
      duration: 3000,
    });
  }

  const handleCreate = () =>
    addTemplate(text).then(() => {
      setText("");
      inputRef.current?.focus();
    });

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="lg"
      initialFocusRef={inputRef}
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
          {/* add-new form */}
          <HStack
            mb={4}
            as="form"
            onSubmit={e => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <Input
              ref={inputRef}
              placeholder="Новый шаблон"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === "Escape" && setText("")}
              size="md"
              borderRadius="md"
            />
            <Tooltip label="Создать шаблон" hasArrow>
              <IconButton
                aria-label="Создать шаблон"
                icon={<Plus size={18} />}
                size="md"
                type="submit"
                isDisabled={!text.trim()}
                isLoading={loading}
              />
            </Tooltip>
          </HStack>

          <TemplateList
            templates={templates}
            Icon={X}
            onIconClick={t => removeTemplate(t.id)}
            loading={loading}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TemplateDrawer;
