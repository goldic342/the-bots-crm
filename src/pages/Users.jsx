import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import UserList from "../components/User/UserList";
import { useEffect, useState } from "react";
import useApiRequest from "../hooks/useApiRequest";
import UserForm from "../components/User/UserForm";
import { getUsers, createUser, editUser, deleteUser } from "../api/users";

const Users = () => {
  const [users, setUsers] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });

  const [editFormData, setEditFormData] = useState({
    username: "",
    password: "",
    name: "",
  });

  const [editUserReq, isEditingUser, editUserError] = useApiRequest(
    async (id) => {
      return await editUser(
        id,
        editFormData.username,
        editFormData.password,
        editFormData.name,
      );
    },
  );
  const [fetchUsers, isLoading, error] = useApiRequest(async () => {
    return await getUsers();
  });
  const [createUserRequest, isCreatingUser, createUserError] = useApiRequest(
    async () => {
      return await createUser(
        formData.username,
        formData.password,
        formData.name,
      );
    },
  );

  const handleCreateUser = async () => {
    await createUserRequest();
    setFormData({ username: "", password: "", name: "" });
    const usersData = await fetchUsers();
    setUsers(usersData);
  };

  const handleEditUser = async (user) => {
    await editUserReq(user.id, editFormData);

    if (editUserError) return;

    setEditFormData({ username: "", password: "", name: "" });

    setUsers((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id !== user.id
          ? u
          : {
              ...u,
              username: editFormData.username || u.username,
              name: editFormData.name || u.name,
            },
      ),
    }));
  };

  const [deleteUserReq, isDeletingUser, deleteUserError] = useApiRequest(
    async (id) => {
      return await deleteUser(id);
    },
  );
  const handleDeleteUser = async (user) => {
    await deleteUserReq(user.id);

    if (deleteUserError) return;

    setUsers((prev) => ({
      ...prev,
      users: prev.users.filter((u) => u.id !== user.id),
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
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box w="full" minH="100vh" h="full" p={{ base: 2, lg: 4 }}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        pt={{ base: 10, md: 24 }}
      >
        <Flex direction="column" p={{ base: 1 }}>
          <Heading mb={2} textAlign="center">
            Управление пользователями
          </Heading>
          <Text
            fontSize="lg"
            maxW="4xl"
            color={textColor}
            mb={{ base: 10, md: 16 }}
            textAlign="center"
          >
            Здесь вы можете создавать новых пользователей, а также просматривать
            и управлять существующими. Используйте форму ниже для добавления
            нового пользователя.
          </Text>
        </Flex>
        <Box w="full" maxW="3xl" bg={formBg} p={{ base: 4, md: 8 }} mb={10}>
          <UserForm
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
        <UserList
          usersData={users}
          isLoading={isLoading}
          error={error}
          editInfo={{
            formData: editFormData,
            setFormData: setEditFormData,
            isLoading: isEditingUser,
            error: editUserError,
            onEdit: handleEditUser,
          }}
          deleteInfo={{
            isLoading: isDeletingUser,
            error: deleteUserError,
            onDelete: handleDeleteUser,
          }}
        />
      </Flex>
    </Box>
  );
};

export default Users;
