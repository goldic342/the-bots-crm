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
  HStack,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import AddBotModal from "./AddBotModal";

const UserList = ({
  usersData = {},
  isLoading,
  error,
  onEdit,
  onDelete,
  onAddBot,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerBg = useColorModeValue("primary.500", "primary.700");
  const cellTextColor = useColorModeValue("gray.600", "gray.300");
  const [selectedUser, setSelectedUser] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(false);
  const [isAddBotOpen, setIsAddBotOpen] = useState(false);

  const users = usersData?.users ?? []; // Ensure users is always an array

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleAddBotClick = (user) => {
    setSelectedUser(user);
    setIsAddBotOpen(true);
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

  if (isLoading) {
    return (
      <Box width="full" maxW="6xl" p={6} textAlign="center">
        <Spinner size="xl" color="primary.500" />
        <Text mt={4}>Загружаем пользователей...</Text>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box width="full" maxW="6xl" p={6} textAlign="center">
        <Text>Пока нет пользователей :(</Text>
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
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Edit User"
                    icon={<Edit />}
                    bg={"green.500"}
                    colorScheme="green"
                    onClick={() => handleEditClick(user)}
                  />
                  <IconButton
                    aria-label="Add bot to User"
                    icon={<Plus />}
                    bg={"yellow.500"}
                    onClick={() => handleAddBotClick(user)}
                  />
                  <IconButton
                    aria-label="Delete User"
                    icon={<Trash />}
                    bg={"red.500"}
                    onClick={() => handleDeleteClick(user)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        selectedUser={selectedUser}
        onDelete={onDelete}
      />
      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        selectedUser={selectedUser}
        onEdit={onEdit}
      />
      <AddBotModal
        onAddBot={onAddBot}
        isOpen={isAddBotOpen}
        onClose={() => setIsAddBotOpen(false)}
        selectedUser={selectedUser}
      />
    </Box>
  );
};

UserList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddBot: PropTypes.func.isRequired,
  usersData: PropTypes.shape({
    users: PropTypes.array,
    count: PropTypes.number,
  }),
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default UserList;
