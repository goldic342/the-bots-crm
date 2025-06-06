import {
  IconButton,
  Flex,
  Badge,
  Input,
  Box,
  Fade,
  useColorModeValue,
  Tooltip,
  useOutsideClick,
} from "@chakra-ui/react";
import { Paperclip, Mail } from "lucide-react";
import { useRef, useState } from "react";
import TemplateListPopOver from "./Templates/TemplateListPopOver";
import PropTypes from "prop-types";

const ChatInputMenu = ({
  show,
  isDisabled,
  setText,
  file,
  handleFileChange,
  popupRef,
}) => {
  const [open, setOpen] = useState(false);
  const templatesRef = useRef(null);

  useOutsideClick({
    ref: templatesRef,
    handler: () => setOpen(false),
  });

  return (
    <Fade in={show} unmountOnExit>
      <Flex
        ref={popupRef}
        position="absolute"
        bottom="120%"
        left={0}
        flexDir="column"
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="md"
        boxShadow="md"
        zIndex={10}
        p={1}
        gap={1}
      >
        <Box position="relative">
          <Tooltip label="Прикрепить файл">
            <label htmlFor="file-upload">
              <IconButton
                cursor={"pointer"}
                isDisabled={isDisabled}
                icon={
                  <Paperclip
                    color={useColorModeValue(
                      "var(--chakra-colors-blackAlpha-600)",
                      "var(--chakra-colors-whiteAlpha-900)"
                    )}
                  />
                }
                bg={"transparent"}
                size="sm"
                _hover={{
                  bg: useColorModeValue("blackAlpha.100", "whiteAlpha.300"),
                }}
                as="span"
                aria-label="Attach file"
              />
            </label>
          </Tooltip>
          <Input
            isDisabled={isDisabled}
            id="file-upload"
            type="file"
            display="none"
            onChange={handleFileChange}
          />
          {file && (
            <Badge
              colorScheme="green"
              borderRadius="full"
              fontSize="0.7em"
              position="absolute"
              top="-2px"
              right="-2px"
              px={1}
            >
              1
            </Badge>
          )}
        </Box>

        <Tooltip label="Шаблоны">
          <Box position={"relative"}>
            <IconButton
              cursor={"pointer"}
              isDisabled={isDisabled}
              onClick={() => setOpen(prev => !prev)}
              icon={
                <Mail
                  color={useColorModeValue(
                    "var(--chakra-colors-blackAlpha-600)",
                    "var(--chakra-colors-whiteAlpha-900)"
                  )}
                />
              }
              bg={"transparent"}
              size="sm"
              _hover={{
                bg: useColorModeValue("blackAlpha.100", "whiteAlpha.300"),
              }}
              as="span"
              aria-label="Template"
            />

            <TemplateListPopOver
              open={open}
              templatesRef={templatesRef}
              setText={setText}
              onClose={() => setOpen(false)}
            />
          </Box>
        </Tooltip>
      </Flex>
    </Fade>
  );
};

ChatInputMenu.propTypes = {
  show: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  file: PropTypes.any,
  handleFileChange: PropTypes.func.isRequired,
  setText: PropTypes.func.isRequired,
  popupRef: PropTypes.any.isRequired, // ref
};

export default ChatInputMenu;
