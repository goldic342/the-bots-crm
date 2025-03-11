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
import PropTypes from "prop-types";
import genPassword from "../../utils/genPassword";
import { Lock } from "lucide-react";
import { USER_FIELDS } from "../../formsConfig";

const UserForm = ({
  formData,
  setFormData,
  isLoading,
  error,
  onSubmit,
  showHeader = true,
  requiredFields = ["username", "password", "name"],
}) => {
  const [formErrors, setFormErrors] = useState({});
  const textColor = useColorModeValue("gray.600", "gray.300");

  const validateForm = () => {
    let errors = {};
    let isAnyFieldFilled = false;

    Object.keys(formData).forEach((key) => {
      const value = formData[key]?.trim();
      if (value.length > 0) {
        isAnyFieldFilled = true;
      }
      if (requiredFields.includes(key) && !value) {
        errors[key] = `${key} обязателен`;
      } else if (
        requiredFields.includes(key) &&
        USER_FIELDS[key] &&
        (value.length < USER_FIELDS[key].min ||
          value.length > USER_FIELDS[key].max)
      ) {
        errors[key] =
          `${key} должен содержать от ${USER_FIELDS[key].min} до ${USER_FIELDS[key].max} символов`;
      }
    });

    if (!isAnyFieldFilled) {
      errors.general = "Хотя бы одно поле должно быть заполнено";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit();
    }
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
            defaultShow={true}
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

        {formErrors.general && (
          <Text color="red.500" textAlign="center">
            {formErrors.general}
          </Text>
        )}

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
    username: PropTypes.string,
    password: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  showHeader: PropTypes.bool,
  requiredFields: PropTypes.arrayOf(PropTypes.string),
};

export default UserForm;
