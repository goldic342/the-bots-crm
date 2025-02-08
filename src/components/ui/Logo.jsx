import { Box, Icon } from "@chakra-ui/react";
import { Activity } from "lucide-react";

const Logo = ({ w = "48px", h = "48px" }) => {
  return (
    <Box
      w={w}
      h={h}
      bgGradient="linear(to-r, teal.400, primary.500)"
      borderRadius="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxShadow="md"
    >
      <Icon as={Activity} w={6} h={6} color="white" />
    </Box>
  );
};

export default Logo;
