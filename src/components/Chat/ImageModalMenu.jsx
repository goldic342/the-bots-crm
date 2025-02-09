import { Flex, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { ArrowLeft, Download } from "lucide-react";
import PropTypes from "prop-types";

const ImageModalMenu = ({ onClose, imageUrl }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      w="100%"
      px={{ base: 6, md: 12, lg: 16 }}
      py={isMobile ? 4 : 8}
      bg={"blackAlpha.900"}
      justifyContent="space-between"
      alignItems="center"
      zIndex={10}
    >
      <IconButton
        icon={<ArrowLeft size={"26px"} />}
        onClick={onClose}
        variant="ghost"
        color="white"
        aria-label="Back"
        size={isMobile ? "lg" : "md"}
      />
      <IconButton
        icon={<Download size={"26px"} />}
        onClick={() => console.log(`Download: ${imageUrl}`)}
        variant="ghost"
        color="white"
        aria-label="Download"
        size={isMobile ? "lg" : "md"}
      />
    </Flex>
  );
};

ImageModalMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default ImageModalMenu;
