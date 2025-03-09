import {
  Flex,
  Heading,
  Input,
  VStack,
  Text,
  Button,
  FormControl,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import PasswordInput from "../ui/PasswordInput";
import { useState } from "react";
import { PropTypes } from "prop-types";
import genPassword from "../../utils/genPassword";
import { Lock } from "lucide-react";

const UserForm = ({
  formData,
  setFormData,
  isLoading,
  error,
  onSubmit,
  showHeader = true,
}) => {
  const [formErrors, setFormErrors] = useState({
    name: "",
    username: "",
    password: "",
  });

  const textColor = useColorModeValue("gray.600", "gray.300");

  const validateForm = () => {
    let errors = { username: "", password: "", name: "" };

    if (!formData.username) {
      errors.username = "Username обязателен";
    }
    if (!formData.password) {
      errors.password = "Пароль обязателен";
    }
    if (!formData.name) {
      errors.name = "Имя обязательно";
    }

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    onSubmit();
  };

  return (
    <Flex direction="column" gap={4}>
      {showHeader && (
        <Flex direction="column" gap={{ base: 2, md: 4 }}>
          <Heading size="lg" textAlign="center">
            Создать пользователя
          </Heading>
          <Text color={textColor} mb={4} textAlign="center">
            Заполните все поля ниже, чтобы добавить нового пользователя в
            систему.
          </Text>
        </Flex>
      )}

      <VStack spacing={4}>
        <FormControl>
          <Input
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            isInvalid={!!formErrors.username}
          />
          {formErrors.username && (
            <Text color="red.500" fontSize="sm">
              {formErrors.username}
            </Text>
          )}
        </FormControl>
        <FormControl>
          <Input
            placeholder="Имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            isInvalid={!!formErrors.name}
          />
          {formErrors.name && (
            <Text color="red.500" fontSize="sm">
              {formErrors.name}
            </Text>
          )}
        </FormControl>
        <FormControl display="flex" gap={4}>
          <PasswordInput
            deafaultShow={true}
            size="md"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            isInvalid={!!formErrors.password}
          />
          <IconButton
            variant="outline"
            icon={<Lock />}
            onClick={() =>
              setFormData({ ...formData, password: genPassword() })
            }
          ></IconButton>
          {formErrors.password && (
            <Text color="red.500" fontSize="sm">
              {formErrors.password}
            </Text>
          )}
        </FormControl>
        <Button w="full" onClick={validateForm} isLoading={isLoading}>
          Создать
        </Button>

        {error && (
          <Text color="red.500" textAlign="center">
            Ошибка: {error}
          </Text>
        )}
      </VStack>
    </Flex>
  );
};

UserForm.propTypes = {
  formData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  showHeader: PropTypes.bool,
};

export default UserForm;
