import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import UserList from "../components/User/UserList";
import { useEffect, useState } from "react";
import useApiRequest from "../hooks/useApiRequest";
import NewUserForm from "../components/User/NewUserForm";
import { getUsers, createUser } from "../api/users"; // Assuming createUser API is here

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
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
    setFormData({ username: "", password: "", role: "user" });
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
    <Box w="full" minH="100vh" h="full" p={{ base: 2, lg: 4 }}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        pt={{ base: 10, md: 24 }}
      >
        <Flex direction={"column"} p={{ base: 1 }}>
          <Heading mb={2} textAlign={"center"}>
            Управление пользователями
          </Heading>
          <Text
            fontSize="lg"
            maxW={"4xl"}
            color={"gray.600"}
            mb={{ base: 10, md: 16 }}
            textAlign="center"
          >
            Здесь вы можете создавать новых пользователей, а также просматривать
            и управлять существующими. Используйте форму ниже для добавления
            нового пользователя.
          </Text>
        </Flex>
        <Box w="full" maxW="3xl" bg="white" p={{ base: 4, md: 8 }} mb={10}>
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
