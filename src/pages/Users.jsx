import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import UserList from "../components/Users/UserList";
import { useEffect, useState } from "react";
import useApiRequest from "../hooks/useApiRequest";
import NewUserForm from "../components/Users/NewUserForm";
import { getUsers, createUser } from "../api/users"; // Assuming createUser API is here

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [fetchUsers, isLoading, error] = useApiRequest(async () => {
    return await getUsers();
  });

  const [createUserRequest, isCreatingUser, createUserError] = useApiRequest(
    async () => {
      return await createUser(
        formData.username,
        formData.password,
        formData.role,
      );
    },
  );

  const handleCreateUser = async () => {
    await createUserRequest();
    setFormData({ username: "", password: "", role: "" });
    const usersData = await fetchUsers();
    setUsers(usersData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };

    fetchData();
  }, []);

  return (
    <Box w="full" minH="100vh" p={4} pt={20}>
      <Flex direction="column" align="center" justify="center">
        <Heading mb={2}>Управление пользователями</Heading>
        <Text
          fontSize="lg"
          maxW={"4xl"}
          color={"gray.600"}
          mb={16}
          textAlign="center"
        >
          Здесь вы можете создавать новых пользователей, а также просматривать и
          управлять существующими. Используйте форму ниже для добавления нового
          пользователя.
        </Text>
        <Box w="full" maxW="3xl" bg="white" p={8} mb={10}>
          <NewUserForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateUser}
            isLoading={isCreatingUser}
            error={createUserError}
          />
        </Box>
        <Heading size="xl" mb={4}>
          Пользователи
        </Heading>
        <UserList users={users} isLoading={isLoading} error={error} />
      </Flex>
    </Box>
  );
};

export default Users;
