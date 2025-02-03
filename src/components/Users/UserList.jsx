import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
} from "@chakra-ui/react";
const UserList = ({ users, isLoading, error }) => {
  if (isLoading) {
    return (
      <Box width={"6xl"} padding={6} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Загружаем пользователей...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box width={"6xl"} padding={6} textAlign="center">
        <Text color="red.500" fontWeight="bold">
          Ошибка: {error}
        </Text>
      </Box>
    );
  }
  return (
    <Box width={"6xl"} padding={6}>
      <Table variant={"striped"}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Username</Th>
            <Th>Role</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td color={"gray.600"}>{user.id}</Td>
              <Td>{user.username}</Td>
              <Td>{user.role}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
export default UserList;
