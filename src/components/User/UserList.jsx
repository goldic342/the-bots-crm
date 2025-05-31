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
  const headerBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(false);
  const [isAddBotOpen, setIsAddBotOpen] = useState(false);

  const users = usersData?.users ?? [];

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
      <Box w="full" maxW="6xl" p={6} textAlign="center">
        <Text color="red.500" fontWeight="bold">
          Ошибка: {error}
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box w="full" maxW="6xl" p={6} textAlign="center">
        <Spinner size="xl" color="blue.500" />
        <Text mt={4} fontSize="sm" color="gray.500">
          Загрузка пользователей...
        </Text>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box w="full" maxW="6xl" p={6} textAlign="center">
        <Text fontSize="sm" color="gray.500">
          Пока нет пользователей
        </Text>
      </Box>
    );
  }

  return (
    <Box
      w="full"
      maxW="6xl"
      p={{ base: 2, md: 6 }}
      overflowX={{ base: "auto", md: "visible" }}
    >
      <Table size="md" variant="simple">
        <Thead bg={headerBg}>
          <Tr>
            <Th>ID</Th>
            <Th>Username</Th>
            <Th>Имя</Th>
            <Th textAlign="right">Действия</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id} borderBottom={`1px solid ${borderColor}`}>
              <Td color={textColor} fontSize="sm">
                {user.id}
              </Td>
              <Td color={textColor} fontSize="sm">
                {user.username}
              </Td>
              <Td color={textColor} fontSize="sm">
                {user.name}
              </Td>
              <Td>
                <HStack spacing={1} justify="flex-end">
                  <IconButton
                    aria-label="Edit"
                    icon={<Edit size={16} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(user)}
                  />
                  <IconButton
                    aria-label="Add Bot"
                    icon={<Plus size={16} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddBotClick(user)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<Trash size={16} />}
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
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
