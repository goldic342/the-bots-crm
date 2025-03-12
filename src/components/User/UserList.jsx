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
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";

const UserList = ({
  usersData = {},
  isLoading,
  error,
  editInfo,
  deleteInfo,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerBg = useColorModeValue("primary.500", "primary.700");
  const cellTextColor = useColorModeValue("gray.600", "gray.300");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const users = usersData?.users ?? []; // Ensure users is always an array

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  if (error) {
    return (
      <Box width="full" maxW="6xl" p={6} textAlign="center">
        <Text color="red.500" fontWeight="bold">
          Ошибка: {error}
        </Text>
      </Box>
    );
  }

  if (isLoading || users.length === 0) {
    return (
      <Box width="full" maxW="6xl" p={6} textAlign="center">
        <Spinner size="xl" color="primary.500" />
        <Text mt={4}>Загружаем пользователей...</Text>
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
            <Th color="white">Name</Th>
            <Th color="white">Actions</Th>
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
              <Td color={cellTextColor}>{user.name}</Td>
              <Td>
                <IconButton
                  aria-label="Edit User"
                  icon={<Edit />}
                  bg={"green.500"}
                  colorScheme="green"
                  onClick={() => handleEditClick(user)}
                  mr={2}
                />
                <IconButton
                  aria-label="Delete User"
                  icon={<Trash />}
                  bg={"red.500"}
                  colorScheme="red"
                  onClick={() => handleDeleteClick(user)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        selectedUser={selectedUser}
        {...deleteInfo}
      />
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        selectedUser={selectedUser}
        {...editInfo}
      />
    </Box>
  );
};

UserList.propTypes = {
  editInfo: PropTypes.shape({
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
  }),
  deleteInfo: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
  }),
  usersData: PropTypes.shape({
    users: PropTypes.array,
    count: PropTypes.number,
  }),
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default UserList;
