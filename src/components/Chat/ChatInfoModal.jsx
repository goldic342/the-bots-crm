import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  useClipboard,
  Avatar,
} from "@chakra-ui/react";
import { useChats } from "../../contexts/ChatContext";
import { useState } from "react";

const ChatInfoModal = ({ open, onClose }) => {
  const { currentChat } = useChats();
  const { botId, lead, status } = currentChat;

  const { onCopy: copyLeadId } = useClipboard(lead.id.toString());
  const { onCopy: copyBotId } = useClipboard(botId.toString());

  const [copiedField, setCopiedField] = useState(null);

  const copiedColor = useColorModeValue("green.100", "green.300");

  const handleCopy = (field, copyFn) => {
    copyFn();
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 700);
  };

  return (
    <Modal isOpen={open} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent borderRadius="lg" overflow="hidden">
        <ModalHeader
          bg={useColorModeValue("gray.100", "gray.800")}
          textAlign="center"
          fontSize="lg"
        >
          Информация о чате
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={0}>
          <Box
            bg={useColorModeValue("gray.50", "gray.800")}
            textAlign="center"
            p={5}
          >
            <Avatar
              src={lead.photo}
              alt="Lead Avatar"
              borderRadius="full"
              boxSize="80px"
              mx="auto"
              mb={3}
            />
            <Text fontSize="lg" fontWeight="bold">
              {lead.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              @{lead.username}
            </Text>
          </Box>

          <VStack spacing={3} align="stretch" p={4}>
            <HStack justifyContent="space-between">
              <Text fontWeight="medium">ID:</Text>
              <Text
                color="gray.600"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ color: "blue.500" }}
                bg={
                  copiedField === "leadId"
                    ? copiedColor
                    : "transparent"
                }
                px={2}
                borderRadius="md"
                onClick={() => handleCopy("leadId", copyLeadId)}
              >
                {currentChat.id}
              </Text>
            </HStack>

            <HStack justifyContent="space-between">
              <Text fontWeight="medium">Бот ID:</Text>
              <Text
                color="gray.600"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ color: "blue.500" }}
                bg={
                  copiedField === "botId"
                    ? copiedColor
                    : "transparent"
                }
                px={2}
                borderRadius="md"
                onClick={() => handleCopy("botId", copyBotId)}
              >
                {botId}
              </Text>
            </HStack>

            <HStack justifyContent="space-between">
              <Text fontWeight="medium">Статус:</Text>
              <Text
                color={status === "blocked" ? "red.500" : "green.500"}
              >
                {status}
              </Text>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatInfoModal;
