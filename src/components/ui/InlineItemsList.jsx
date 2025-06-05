import {
  List,
  ListItem,
  HStack,
  Box,
  Text,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

/**
 * Re-usable inline list where the (potentially long) label
 * can scroll inside its own box instead of stretching the row.
 *
 * @param {{ items: Item[]; contentMaxH?: string | number }} props
 */
const InlineItemsList = ({
  items,
  contentMaxH = "120px",
  noItemsText = "Элементов нет.",
}) => {
  const itemBg = useColorModeValue("gray.100", "gray.800");

  if (!items || items.length === 0) {
    return (
      <Text color="gray.500" fontSize="sm">
        {noItemsText}
      </Text>
    );
  }

  return (
    <List spacing={2}>
      {items.map(({ id, label, icon: Icon, onClick }, index) => (
        <ListItem key={id ?? index}>
          <HStack
            justify="space-between"
            align="start"
            w="100%"
            bg={itemBg}
            p={2}
            borderRadius={"md"}
          >
            <Box
              flex={1}
              maxH={contentMaxH}
              overflowY="auto"
              whiteSpace="pre-wrap"
              alignSelf={"center"}
            >
              <Text fontSize="sm">{label}</Text>
            </Box>

            {Icon && (
              <IconButton
                icon={<Icon size={16} />}
                size="sm"
                variant="ghost"
                aria-label="action"
                onClick={onClick}
              />
            )}
          </HStack>
        </ListItem>
      ))}
    </List>
  );
};

InlineItemsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      onClick: PropTypes.func,
    })
  ).isRequired,
  contentMaxH: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default InlineItemsList;
