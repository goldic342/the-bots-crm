import { HStack, Text, useColorModeValue } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ActionRow = ({ icon: Icon, label, onClick }) => (
  <HStack
    w="full"
    px={2}
    py={1}
    borderRadius="md"
    cursor="pointer"
    transition="background 0.2s"
    onClick={onClick}
    bg={useColorModeValue("gray.100", "gray.800")}
    spacing={3}
  >
    <Icon size={18} />
    <Text fontWeight="medium">{label}</Text>
  </HStack>
);

ActionRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ActionRow;
