import {
  Box,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import PropTypes from "prop-types";
import UserItem from "./UserItem";
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
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(false);
  const [isAddBotOpen, setIsAddBotOpen] = useState(false);

  const users = usersData?.users ?? [];

  const handleDeleteClick = user => {
    setSelectedUser(user);
    onOpen();
  };

  const handleEditClick = user => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleAddBotClick = user => {
    setSelectedUser(user);
    setIsAddBotOpen(true);
  };

  if (error) {
    return (
      <Box w="full" p={6} textAlign="center">
        <VStack spacing={4}>
          <Box p={6} bg={cardBg} borderRadius="lg">
            <Text color="red.500" fontWeight="bold" fontSize="lg">
              Ошибка загрузки данных
            </Text>
            <Text color={mutedTextColor} mt={2}>
              {error}
            </Text>
          </Box>
        </VStack>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box w="full" p={6}>
        {[...Array(6)].map((_, i) => (
          <UserItem isLoading={true} key={i} />
        ))}
        <Text mt={6} textAlign="center" fontSize="sm" color={mutedTextColor}>
          Загрузка пользователей...
        </Text>
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box w="full" p={6} textAlign="center">
        <VStack spacing={6}>
          <Box
            p={8}
            bg={cardBg}
            borderRadius="xl"
            border="2px dashed"
            borderColor={cardBorder}
          >
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="medium" color={textColor}>
                Пока нет пользователей
              </Text>
              <Text fontSize="sm" color={mutedTextColor}>
                Создайте первого пользователя, используя форму выше
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="full">
      <VStack spacing={4} w="full">
        {users.map(user => (
          <UserItem
            key={user.id}
            user={user}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onAddBot={handleAddBotClick}
          />
        ))}
      </VStack>

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
