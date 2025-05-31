import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
      await createUser(formData.username, formData.password, formData.name),
  );

  const handleCreateUser = async () => {
    await createUserRequest();
    setFormData({ username: "", password: "", name: "" });
    const usersData = await fetchUsers();
    setUsers(usersData);
  };

  const handleEditUser = (user) => {
    setUsers((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id !== user.id
          ? u
          : { ...u, username: user.username, name: user.name },
      ),
    }));
  };

  const handleDeleteUser = (user) => {
    setUsers((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== user.id),
    }));
  };

  const handleAddBot = (user, botId) => {
    setUsers((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id !== user.id
          ? u
          : {
              ...u,
              botsIds: [...(u.botsIds || []), botId],
            },
      ),
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };

    fetchData();
  }, []);

  const formBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      w="full"
      minH="100vh"
      px={{ base: 2, md: 6 }}
      pt={{ base: 6, md: 10 }}
      pb={20}
    >
      <Flex direction="column" align="center">
        <Box mb={10} textAlign="center" maxW="3xl">
          <Heading size="lg" mb={2}>
            Управление пользователями
          </Heading>
          <Text fontSize="md" color={textColor}>
            Создавайте новых пользователей и управляйте существующими через
            простую форму ниже.
          </Text>
        </Box>

        <Box
          w="full"
          maxW="3xl"
          bg={formBg}
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          boxShadow="sm"
          mb={12}
        >
          <UserForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateUser}
            isLoading={isCreatingUser}
            error={createUserError}
          />
        </Box>

        <Box w="full" maxW="6xl">
          <Heading size="md" textAlign={"center"}>
            Список пользователей
          </Heading>

          <UserList
            usersData={users}
            isLoading={isLoading}
            error={error}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onAddBot={handleAddBot}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default Users;
