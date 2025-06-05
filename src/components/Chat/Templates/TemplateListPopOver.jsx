import { Fade, Flex, useColorModeValue } from "@chakra-ui/react";
import TemplateList from "./TemplateList";
import { Check } from "lucide-react";

const TemplateListPopOver = ({ open, templatesRef, setText }) => {
  const handleTemplateClick = template => setText(template.text);

  return (
    <Fade in={open} unmountOnExit>
      <Flex
        position="absolute"
        left="130%"
        ref={templatesRef}
        maxH={96}
        minW={{ base: "80vw", md: "44vw", lg: "40vw" }}
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
        <TemplateList Icon={Check} onIconClick={handleTemplateClick} />
      </Flex>
    </Fade>
  );
};

export default TemplateListPopOver;
