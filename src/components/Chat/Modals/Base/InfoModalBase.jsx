import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
  Text,
  Avatar,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Row from "./Row";

const MotionContent = motion.create(ModalContent);

const InfoModalBase = ({
  isOpen,
  onClose,
  title,
  avatarSrc,
  avatarName,
  username,

  details = [], // [{key,label,value,copyable,onClick,color}]
  footer = null, // ReactNode

  size = "md",
  children,
}) => {
  const headerBg = useColorModeValue("gray.100", "gray.800");
  const avatarBg = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.800");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} isCentered>
      <ModalOverlay />
      <MotionContent
        borderRadius="lg"
        overflow="hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <ModalHeader
          bg={headerBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          py={4}
          fontSize="lg"
        >
          {title}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody p={0}>
          <Box textAlign="center" p={6} bg={avatarBg}>
            <Avatar
              src={avatarSrc}
              name={avatarName}
              borderRadius="full"
              boxSize="80px"
              mx="auto"
              mb={3}
            />
            <Text fontSize="lg" fontWeight="bold">
              {avatarName}
            </Text>
            {username && (
              <Text fontSize="sm" color="gray.500">
                @{username}
              </Text>
            )}
          </Box>

          {details.length && (
            <VStack spacing={2} align="stretch" p={4}>
              {details.map((d, i) => (
                <Row key={d.key ?? i} {...d} hoverBg={hoverBg} />
              ))}
            </VStack>
          )}

          {children}
        </ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </MotionContent>
    </Modal>
  );
};

InfoModalBase.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  avatarSrc: PropTypes.string,
  avatarName: PropTypes.string.isRequired,
  username: PropTypes.string,

  /* new */
  details: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string, // unique-ish
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      copyable: PropTypes.bool,
      onClick: PropTypes.func,
      color: PropTypes.string,
    })
  ),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
  footer: PropTypes.node,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "full"]),
  children: PropTypes.node,
};

export default InfoModalBase;
