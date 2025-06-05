import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Container,
  VStack,
  HStack,
  Icon,
  Fade,
  ScaleFade,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import useApiRequest from "../hooks/useApiRequest";
import UserForm from "../components/User/UserForm";
import UserList from "../components/User/UserList";
import { getUsers, createUser } from "../api/users";

const Users = () => {
  const [users, setUsers] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });

  const [fetchUsers, isLoading, error] = useApiRequest(getUsers);
  const [createUserRequest, isCreatingUser, createUserError] = useApiRequest(
    async () =>
      await createUser(formData.username, formData.password, formData.name)
  );

  const bgGradient = useColorModeValue(
    "linear(to-tr, white, gray.50, blue.50)",
    "linear(to-tr, gray.800, gray.800, blue.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  const handleCreateUser = async () => {
    await createUserRequest();
    setFormData({ username: "", password: "", name: "" });
  };

  const handleEditUser = user => {
    setUsers(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id !== user.id
          ? u
          : { ...u, username: user.username, name: user.name }
      ),
    }));
  };

  const handleDeleteUser = user => {
    setUsers(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== user.id),
    }));
  };

  const handleAddBot = (user, botId) => {
    setUsers(prev => ({
      ...prev,
      users: prev.users.map(u =>
        u.id !== user.id
          ? u
          : {
              ...u,
              botsIds: [...(u.botsIds || []), botId],
            }
      ),
    }));
  };

  const refreshUsers = async () => {
    const usersData = await fetchUsers();
    setUsers(usersData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userCount = users?.users?.length || 0;

  return (
    <Box w="full" minH="100vh" bgGradient={bgGradient}>
      <Container maxW="7xl" pt={{ base: 8, md: 12 }} pb={6}>
        <Fade in={true}>
          <VStack spacing={6} textAlign="center" mb={8}>
            <Heading size="xl" fontWeight="bold">
              Управление пользователями
            </Heading>

            <Text
              fontSize="lg"
              color={mutedTextColor}
              maxW="2xl"
              lineHeight="1.6"
            >
              Создавайте новых пользователей и управляйте существующими через
              интуитивный интерфейс с расширенными возможностями управления.
            </Text>

            <VStack spacing={1}>
              {isLoading ? (
                <Skeleton height="32px" width="40px" />
              ) : (
                <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                  {userCount}
                </Text>
              )}

              <Text fontSize="sm" color={mutedTextColor}>
                Всего пользователей
              </Text>
            </VStack>
          </VStack>
        </Fade>

        {error && (
          <ScaleFade in={!!error}>
            <Alert status="error" borderRadius="lg" mb={6}>
              <AlertIcon />
              <Box>
                <AlertTitle>Ошибка загрузки данных!</AlertTitle>
                <AlertDescription>
                  Не удалось загрузить список пользователей. Проверьте
                  подключение к сети.
                </AlertDescription>
              </Box>
            </Alert>
          </ScaleFade>
        )}

        <ScaleFade in={true}>
          <Flex mb={8} w="full" justify={"center"}>
            <UserForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateUser}
              isLoading={isCreatingUser}
              error={createUserError}
              minW={{ base: "auto", md: "lg", lg: "2xl" }}
            />
          </Flex>
        </ScaleFade>

        <ScaleFade in={true}>
          <Box
            bg={cardBg}
            borderRadius="xl"
            border="1px solid"
            borderColor={cardBorder}
            boxShadow="xl"
            overflow="hidden"
          >
            <Box
              bg={useColorModeValue("gray.50", "gray.700")}
              px={6}
              py={4}
              borderBottom="1px solid"
              borderColor={cardBorder}
            >
              <HStack justify="space-between" align="center">
                <Heading size="md" color={textColor}>
                  Список пользователей
                </Heading>

                <Icon
                  as={RefreshCw}
                  color={mutedTextColor}
                  cursor="pointer"
                  _hover={{ color: accentColor, transform: "rotate(180deg)" }}
                  transition="all 0.3s"
                  onClick={refreshUsers}
                  boxSize={5}
                />
              </HStack>
            </Box>

            <UserList
              usersData={users}
              isLoading={isLoading}
              error={error}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onAddBot={handleAddBot}
            />
          </Box>
        </ScaleFade>
      </Container>
    </Box>
  );
};

export default Users;
