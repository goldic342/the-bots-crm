import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Select,
  List,
  ListItem,
  Box,
  Spinner,
  Divider,
  Collapse,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useApiRequest from "../../hooks/useApiRequest";
import { addBot } from "../../api/users";
import { getBots } from "../../api/bots";

const AddBotModal = ({ isOpen, onClose, selectedUser, onAddBot }) => {
  const [AddBotReq, isLoading, addError] = useApiRequest(
    async (userId, botId) => {
      return await addBot(userId, botId);
    },
  );

  const [fetchBots, isFetchingBots, fetchError] = useApiRequest(getBots);

  const [currentUserBots, setCurrentUserBots] = useState([]);
  const [availableBots, setAvailableBots] = useState([]);
  const [selectedBotId, setSelectedBotId] = useState("");

  const [showCurrentBots, setShowCurrentBots] = useState(false);

  useEffect(() => {
    if (!isOpen || !selectedUser) return;

    const loadBots = async () => {
      const { bots } = await fetchBots();
      if (!bots) return;

      const userBotIds = selectedUser.botsIds || [];
      const userBots = bots.filter((bot) => userBotIds.includes(bot.id));
      setCurrentUserBots(userBots);

      const unassignedBots = bots.filter((bot) => !userBotIds.includes(bot.id));
      setAvailableBots(unassignedBots);

      setShowCurrentBots(false);
    };

    loadBots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedUser]);

  const handleAddBot = async () => {
    if (!selectedBotId) return;

    await AddBotReq(selectedUser.id, selectedBotId);
    if (addError) return;

    onAddBot(selectedUser);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Управление ботами для{" "}
          <Text as="span" color="blue.600">
            {selectedUser?.name}
          </Text>
        </ModalHeader>

        <ModalBody>
          <Box mb={4}>
            <Text fontWeight="semibold">Текущие боты пользователя:</Text>
            <Text
              fontSize="sm"
              color="blue.500"
              cursor="pointer"
              mt={1}
              onClick={() => setShowCurrentBots((prev) => !prev)}
            >
              {showCurrentBots
                ? "Скрыть"
                : currentUserBots.length > 0
                  ? "Показать ботов"
                  : "Нет ботов"}
            </Text>

            <Collapse in={showCurrentBots} animateOpacity>
              <Box mt={2} pl={3}>
                {currentUserBots.length > 0 ? (
                  <List spacing={1}>
                    {currentUserBots.map((bot) => (
                      <ListItem key={bot.id}>• {bot.name}</ListItem>
                    ))}
                  </List>
                ) : (
                  <Text color="gray.500" mt={1}>
                    У пользователя нет ботов
                  </Text>
                )}
              </Box>
            </Collapse>
          </Box>

          <Divider mb={4} />

          <Box>
            <Text fontWeight="semibold">Добавить нового бота:</Text>

            {isFetchingBots && (
              <Box mt={2} mb={2}>
                <Spinner size="sm" mr={2} />
                <Text as="span" fontSize="sm" color="gray.600">
                  Загрузка списка ботов...
                </Text>
              </Box>
            )}
            {fetchError && (
              <Text color="red.500" mb={2}>
                {fetchError}
              </Text>
            )}
            {addError && (
              <Text color="red.500" mb={2}>
                {addError}
              </Text>
            )}
            <Box mt={2}>
              {availableBots.length > 0 ? (
                <Select
                  placeholder="Выберите бота"
                  value={selectedBotId}
                  onChange={(e) => setSelectedBotId(e.target.value)}
                >
                  {availableBots.map((bot) => (
                    <option key={bot.id} value={bot.id}>
                      {bot.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <Text color="gray.500" mt={1}>
                  Нет доступных ботов
                </Text>
              )}
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            mr={3}
            isDisabled={isLoading}
          >
            Отменить
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleAddBot}
            isLoading={isLoading}
            isDisabled={!selectedBotId || isFetchingBots}
          >
            Добавить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

AddBotModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onAddBot: PropTypes.func.isRequired,
};

export default AddBotModal;
