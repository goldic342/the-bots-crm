import {
  Box,
  Flex,
  Button,
  Heading,
  VStack,
  Text,
  Avatar,
  useColorModeValue,
  Collapse,
  useToast,
  Tag,
  TagLabel,
  Badge,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { logout } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import ColorModeSwitcher from "../components/ui/ColorModeSwitcher";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/ui/Logout";

const roleRu = {
  admin: "Админ",
  manager: "Менеджер",
};

const Settings = () => {
  const { user, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const [debugVisible, setDebugVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const toast = useToast();

  const handleLogout = async (e) => {
    e.preventDefault();

    await logout();

    setToken(null);
    setUser(null);

    navigate("/");
  };

  const handleSecretClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 10) {
      setDebugVisible(true);
      toast({
        title: "Режим отладки включён",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      bg={useColorModeValue("gray.100", "gray.900")}
      minH="100vh"
      w="full"
      p={6}
      align="center"
      justify="center"
    >
      <Box
        bg={useColorModeValue("white", "gray.800")}
        p={8}
        borderRadius="2xl"
        boxShadow="2xl"
        maxW="lg"
        w="full"
        position="relative"
      >
        <Badge
          position="absolute"
          top={4}
          right={4}
          variant="solid"
          borderRadius="full"
          px={3}
          textTransform={"none"}
        >
          {roleRu[user.role] || user.role}
        </Badge>

        <VStack spacing={2} align="center">
          <Avatar
            size="xl"
            name={user.name}
            bgGradient="linear(to-br, blue.400, teal.300)"
            color="white"
          />
          <Box textAlign="center">
            <Heading size="md" color={useColorModeValue("gray.700", "white")}>
              {user.name}
            </Heading>
            <Tag
              size="sm"
              colorScheme="blue"
              mt={1}
              borderRadius="full"
              variant="subtle"
            >
              <TagLabel>@{user.username}</TagLabel>
            </Tag>
          </Box>

          <Text
            onClick={handleSecretClick}
            cursor="pointer"
            fontSize="xs"
            color={useColorModeValue("gray.400", "gray.600")}
          >
            {user.id}
          </Text>

          <Collapse in={debugVisible} animateOpacity>
            <Box
              mt={2}
              maxH="150px"
              overflowY="auto"
              w="full"
              bg={useColorModeValue("gray.100", "gray.700")}
              p={3}
              borderRadius="md"
              fontSize="sm"
              fontFamily="mono"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
            >
              <Text fontWeight="bold" mb={1}>
                Bots IDs:
              </Text>
              <Text>{user.botsIds.join(", ")}</Text>
            </Box>
          </Collapse>

          <VStack spacing={4} mt={3} w={"full"}>
            <ColorModeSwitcher />
            <LogoutButton onConfirm={handleLogout} />
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Settings;
