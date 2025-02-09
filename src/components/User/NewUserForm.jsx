import {
  Flex,
  Heading,
  Input,
  Select,
  VStack,
  Text,
  Button,
  FormControl,
} from "@chakra-ui/react";
import PasswordInput from "../ui/PasswordInput";
import { useState } from "react";
import { PropTypes } from "prop-types";
import genPassowrd from "../../utils/genPassword";
import genPassword from "../../utils/genPassword";

const CreateUserForm = ({
  formData,
  setFormData,
  isLoading,
  error,
  onSubmit,
}) => {
  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    role: "",
  });

  const validateForm = () => {
    let errors = { username: "", password: "", role: "" };

    if (!formData.username) {
      errors.username = "Username обязателен";
    }
    if (!formData.password) {
      errors.password = "Пароль обязателен";
    }
    if (!formData.role) {
      errors.role = "Роль обязательна";
    }

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    onSubmit();
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex direction={"column"} gap={{ base: 2, md: 4 }}>
        <Heading size="lg" textAlign={"center"}>
          Создать пользователя
        </Heading>
        <Text color="gray.600" mb={4} textAlign={"center"}>
          Заполните все поля ниже, чтобы добавить нового пользователя в систему.
        </Text>
      </Flex>

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
          <Select
            placeholder="Роль пользователя"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            value={formData.role}
            isInvalid={!!formErrors.role}
          >
            <option value="user">Менеджер</option>
            <option value="admin">Админ</option>
          </Select>
          {formErrors.role && (
            <Text color="red.500" fontSize="sm">
              {formErrors.role}
            </Text>
          )}
        </FormControl>
        <FormControl display={"flex"} gap={4}>
          <PasswordInput
            deafaultShow={true}
            size={"md"}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            isInvalid={!!formErrors.password}
          />
          <Button
            variant={"outline"}
            onClick={() =>
              setFormData({ ...formData, password: genPassword() })
            }
          >
            Сгенерировать
          </Button>
          {formErrors.password && (
            <Text color="red.500" fontSize="sm">
              {formErrors.password}
            </Text>
          )}
        </FormControl>
        <Button w="full" onClick={() => validateForm()} isLoading={isLoading}>
          Создать
        </Button>

        {error && (
          <Text color={"red.500"} textAlign={"center"}>
            Ошибка: {error}
          </Text>
        )}
      </VStack>
    </Flex>
  );
};

CreateUserForm.propTypes = {
  formData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};
export default CreateUserForm;
