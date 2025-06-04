import {
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { Trash } from "lucide-react";
import PropTypes from "prop-types";

const TemplateItemMini = ({ template, onDelete }) => (
  <HStack
    justify="space-between"
    align="flex-start"
    w="100%"
    px={3}
    py={2}
    mb={1}
    borderWidth="1px"
    borderRadius="md"
    borderColor={useColorModeValue("gray.100", "gray.600")}
    _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}
  >
    <Tooltip label={template.text}>
      <Text fontSize="sm" noOfLines={2} pr={2}>
        {template.text}
      </Text>
    </Tooltip>
    <IconButton
      aria-label="Удалить шаблон"
      icon={<Trash size={16} />}
      variant="ghost"
      size="xs"
      onClick={onDelete}
    />
  </HStack>
);

TemplateItemMini.propTypes = {
  template: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TemplateItemMini;
