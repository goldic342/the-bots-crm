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
  useColorModeValue,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";

const UserList = ({ users, isLoading, error }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  // Use different header and cell text colors for light/dark modes.
  const headerBg = useColorModeValue("primary.500", "primary.700");
  const cellTextColor = useColorModeValue("gray.600", "gray.300");

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
    <Box
      width="full"
      maxW="6xl"
      p={{ base: 1, md: 6 }}
      overflowX={{ base: "scroll", md: "visible" }}
      pb={{ base: 10, md: 16, lg: 20 }}
    >
      <Table variant="simple" colorScheme="primary">
        <Thead bg={headerBg}>
          <Tr>
            <Th color="white">ID</Th>
            <Th color="white">Username</Th>
            <Th color="white">Role</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td color={cellTextColor}>
                {user.id.slice(0, isMobile ? 8 : -1)}
                {isMobile && <>...</>}
              </Td>
              <Td color={cellTextColor}>{user.username}</Td>
              <Td color={cellTextColor}>{user.role}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserList;
