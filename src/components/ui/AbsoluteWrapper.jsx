import { Box } from "@chakra-ui/react";
const AbsoluteWrapper = ({ children, isMobile, bg, ...props }) => {
  return (
    <Box
      position={isMobile ? "absolute" : "static"}
      w="full"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={bg}
      display="flex"
      flexDirection="column"
      {...props}
    >
      {children}
    </Box>
  );
};

export default AbsoluteWrapper;
