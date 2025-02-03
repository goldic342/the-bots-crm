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
      <Box width="full" maxW="6xl" p={6} textAlign="center">
        <Spinner size="xl" color="primary.500" />
        <Text mt={4}>Загружаем пользователей...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box width="full" maxW="6xl" p={6} textAlign="center">
        <Text color="red.500" fontWeight="bold">
          Ошибка: {error}
        </Text>
      </Box>
    );
  }
  return (
    <Box width="full" maxW="6xl" p={6}>
      <Table variant="simple" colorScheme="primary">
        <Thead bg="primary.400">
          <Tr>
            <Th color="white">ID</Th>
            <Th color="white">Username</Th>
            <Th color="white">Role</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td color="gray.700">{user.id}</Td>
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
