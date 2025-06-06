import { Fade, Flex, useColorModeValue } from "@chakra-ui/react";
import TemplateList from "./TemplateList";
import { Check } from "lucide-react";

const TemplateListPopOver = ({ open, templatesRef, setText, onClose }) => {
  const handleTemplateClick = template => setText(template.text);

  const itemBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Fade in={open} unmountOnExit>
      <Flex
        position="absolute"
        left="130%"
        ref={templatesRef}
        maxH={96}
        w={"100%"}
        minW={{ base: "80vw", md: "44vw", lg: "40vw" }}
        maxW={{ base: "80vw", md: "44vw", lg: "40vw" }}
        overflowY="auto"
        bottom={4}
        flexDir="column"
        bg={useColorModeValue("white", "gray.700")}
        borderRadius="md"
        boxShadow="md"
        zIndex={10}
        p={4}
        pl={2}
        gap={2}
      >
        <TemplateList
          Icon={Check}
          onIconClick={t => {
            handleTemplateClick(t);
            onClose();
          }}
          itemBg={itemBg}
        />
      </Flex>
    </Fade>
  );
};

export default TemplateListPopOver;
