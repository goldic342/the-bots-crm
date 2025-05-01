import {
  Flex,
  Text,
  IconButton,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { CheckCircle } from "lucide-react";
import PropTypes from "prop-types";

const TemplateItem = ({ template, setText }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      minW={{ base: "80vw", md: "44vw", lg: "40vw" }}
      px={3}
      py={2}
      borderRadius="md"
      borderColor={useColorModeValue("gray.100", "gray.500")}
      borderWidth={"1px"}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.800"),
      }}
      transition="background 0.2s"
    >
      <Text
        fontSize="sm"
        color={useColorModeValue("gray.800", "gray.100")}
        maxH="4.5em"
        overflowY="auto"
        pr={2}
        css={{
          scrollbarWidth: "thin",
        }}
      >
        {template.text}
      </Text>

      <Tooltip label="Применить шаблон" hasArrow>
        <IconButton
          onClick={() => setText(template.text)}
          aria-label="Применить шаблон"
          icon={<CheckCircle size={18} />}
          size="sm"
          variant="ghost"
          color={"green.400"}
          transition="color 0.2s"
          _hover={{
            color: "green.300",
          }}
        />
      </Tooltip>
    </Flex>
  );
};

TemplateItem.propTypes = {
  template: PropTypes.shape({
    text: PropTypes.string.isRequired,
  }).isRequired,
  setText: PropTypes.func.isRequired,
};

export default TemplateItem;
