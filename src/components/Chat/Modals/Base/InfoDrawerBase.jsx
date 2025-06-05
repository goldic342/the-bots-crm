import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Box,
  Text,
  Avatar,
  VStack,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import Row from "./Row";
import ActionGroup from "./ActionGroup";

const InfoDrawerBase = ({
  isOpen,
  onClose,
  title,
  avatarSrc,
  avatarName,
  username,

  details = [], // [{ key,label,value,copyable,onClick,color }]
  actions = [], // see propTypes below
  footer = null, // ReactNode

  children,
}) => {
  const headerBg = useColorModeValue("gray.100", "gray.800");
  const avatarBg = useColorModeValue("gray.50", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Drawer
      isOpen={isOpen}
      placement={useBreakpointValue({ base: "bottom", md: "right" })}
      size={{ base: "full", md: "md", lg: "lg" }}
      onClose={onClose}
      blockScrollOnMount={false}
    >
      <DrawerOverlay />

      <DrawerContent>
        <DrawerHeader
          bg={headerBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          py={4}
          fontSize="lg"
        >
          {title}
        </DrawerHeader>

        <DrawerCloseButton />

        <DrawerBody p={0} display="flex" flexDir="column">
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

          {details.length > 0 && (
            <VStack spacing={2} align="stretch" p={4}>
              {details.map((d, i) => (
                <Row key={d.key ?? i} {...d} hoverBg={hoverBg} />
              ))}
            </VStack>
          )}

          {actions.length > 0 && (
            <VStack w="full" spacing={4} px={4} py={4}>
              {(() => {
                const groups = [];
                let current = [];

                actions.forEach((a, idx) => {
                  if (a?.type === "spacer") {
                    if (current.length) {
                      groups.push(
                        <ActionGroup
                          key={`grp-${groups.length}`}
                          items={current}
                        />
                      );
                      current = [];
                    }

                    groups.push(<Box key={`gap-${idx}`} h={1} />);
                  } else {
                    current.push(a);
                  }
                });

                if (current.length) {
                  groups.push(
                    <ActionGroup key={`grp-${groups.length}`} items={current} />
                  );
                }
                return groups;
              })()}
            </VStack>
          )}

          {children}

          {footer && (
            <Box mt="auto" p={4}>
              {footer}
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

InfoDrawerBase.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  avatarSrc: PropTypes.string,
  avatarName: PropTypes.string.isRequired,
  username: PropTypes.string,

  details: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      copyable: PropTypes.bool,
      onClick: PropTypes.func,
      color: PropTypes.string,
    })
  ),

  actions: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        icon: PropTypes.elementType.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
      }),
      PropTypes.shape({
        type: PropTypes.oneOf(["spacer"]).isRequired,
      }),
    ])
  ),

  footer: PropTypes.node,
  children: PropTypes.node,
};

export default InfoDrawerBase;
