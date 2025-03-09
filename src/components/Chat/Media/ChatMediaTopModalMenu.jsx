import { Flex, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { ArrowLeft, Download } from "lucide-react";
import PropTypes from "prop-types";

const ChatMediaTopModalMenu = ({ onClose, mediaUrl }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleDownload = () => {
    if (!mediaUrl) return;

    const link = document.createElement("a");
    link.href = mediaUrl;
    link.setAttribute("download", "media-file");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Flex
      w="100%"
      px={{ base: 6, md: 12, lg: 16 }}
      py={8}
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
        _hover={{ bg: "whiteAlpha.300" }}
        aria-label="Back"
        size={isMobile ? "mg" : "lg"}
      />
      <IconButton
        icon={<Download size={"26px"} />}
        onClick={handleDownload}
        variant="ghost"
        color="white"
        _hover={{ bg: "whiteAlpha.300" }}
        aria-label="Download"
        size={isMobile ? "mg" : "lg"}
      />
    </Flex>
  );
};

ChatMediaTopModalMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  mediaUrl: PropTypes.string.isRequired,
};

export default ChatMediaTopModalMenu;
