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
  IconButton,
  HStack,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useApiRequest from "../../hooks/useApiRequest";
import { addBot, removeBot } from "../../api/users";
import { getUserBots, getBots } from "../../api/bots";
import { X } from "lucide-react";

const AddBotModal = ({ isOpen, onClose, selectedUser, onAddBot }) => {
  const [AddBotReq, isAdding, addError] = useApiRequest(
    async (userId, botId) => await addBot(userId, botId)
  );

  const [RemoveBotReq, isRemoving, removeError] = useApiRequest(
    async (userId, botId) => await removeBot(userId, botId)
  );

  const [fetchBots, isFetchingBots, fetchError] = useApiRequest(getBots);
  const [fetchUserBots] = useApiRequest(userId => getUserBots(userId));

  const [currentUserBots, setCurrentUserBots] = useState([]);
  const [availableBots, setAvailableBots] = useState([]);
  const [selectedBotId, setSelectedBotId] = useState("");

  const refreshBotLists = async () => {
    if (!selectedUser?.id) return;

    const allBotsRes = await fetchBots();
    const userBotsRes = await fetchUserBots(selectedUser.id);

    const allBots = allBotsRes?.bots || [];
    const userBots = userBotsRes?.bots || [];

    const userBotIds = userBots.map(bot => bot.id);
    const unassignedBots = allBots.filter(bot => !userBotIds.includes(bot.id));

    setCurrentUserBots(userBots);
    setAvailableBots(unassignedBots);
  };

  useEffect(() => {
    if (!isOpen || !selectedUser) return;
    refreshBotLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedUser]);

  const handleAddBot = async () => {
    if (!selectedBotId) return;
    await AddBotReq(selectedUser.id, selectedBotId);
    if (addError) return;

    await refreshBotLists();
    onAddBot(selectedUser);
    setSelectedBotId("");
  };

  const handleRemoveBot = async botId => {
    await RemoveBotReq(selectedUser.id, botId);
    if (removeError) return;

    await refreshBotLists();
    onAddBot(selectedUser);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Боты —{" "}
          <Text as="span" color="blue.600">
            {selectedUser?.name}
          </Text>
        </ModalHeader>

        <ModalBody>
          {isFetchingBots ? (
            <HStack spacing={2} mb={3}>
              <Spinner size="sm" />
              <Text fontSize="sm" color="gray.600">
                Загрузка...
              </Text>
            </HStack>
          ) : (
            <>
              <Box mb={4}>
                <Text fontWeight="semibold" mb={1}>
                  Назначенные боты:
                </Text>
                <Box maxH="150px" overflowY="auto" pl={1}>
                  {currentUserBots.length > 0 ? (
                    <List spacing={2}>
                      {currentUserBots.map(bot => (
                        <ListItem key={bot.id}>
                          <HStack justify="space-between">
                            <Text fontSize="sm">{bot.name}</Text>
                            <IconButton
                              icon={<X size={16} />}
                              size="xs"
                              variant="ghost"
                              aria-label="Удалить"
                              onClick={() => handleRemoveBot(bot.id)}
                              isLoading={isRemoving}
                            />
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Text color="gray.500" fontSize="sm">
                      Нет ботов
                    </Text>
                  )}
                </Box>
              </Box>

              <Divider mb={4} />

              <Box>
                <Text fontWeight="semibold" mb={1}>
                  Добавить бота:
                </Text>
                {availableBots.length > 0 ? (
                  <Select
                    placeholder="Выберите бота"
                    value={selectedBotId}
                    onChange={e => setSelectedBotId(e.target.value)}
                    size="sm"
                  >
                    {availableBots.map(bot => (
                      <option key={bot.id} value={bot.id}>
                        {bot.name}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    Нет доступных ботов
                  </Text>
                )}
              </Box>
            </>
          )}

          {(fetchError || addError || removeError) && (
            <Text color="red.500" fontSize="sm" mt={3}>
              {fetchError || addError || removeError}
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} mr={2}>
            Закрыть
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleAddBot}
            isLoading={isAdding}
            isDisabled={!selectedBotId}
            size="sm"
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
