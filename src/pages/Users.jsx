import { Box, Flex, Heading } from "@chakra-ui/react";
import UserList from "../components/Users/UserList";
import { useEffect, useState } from "react";
import useApiRequest from "../hooks/useApiRequest";
import { getUsers } from "../api/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [fetchUsers, isLoading, error] = useApiRequest(async () => {
    return await getUsers();
  });

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
    };

    fetchData();
  }, []);

  return (
    <Box
      w={"full"}
      align={"center"}
      direction={"column"}
      h={"full"}
      justify={"center"}
    >
      <Flex direction={"column"} gap={6} align={"center"} mt={8}>
        <Heading size={"lg"}>Пользователи</Heading>
        <UserList users={users} isLoading={isLoading} error={error} />
      </Flex>
    </Box>
  );
};

export default Users;
