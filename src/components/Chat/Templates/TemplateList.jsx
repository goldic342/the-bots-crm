import { Fade, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import TemplateItem from "./TemplateItem";
import useApiRequest from "../../../hooks/useApiRequest";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTemplates } from "../../../api/templates";
import SpinnerLoader from "../../ui/SpinnerLoader";

const TemplateList = ({ open, templatesRef, setText }) => {
  const { botId } = useParams();
  const [templates, setTemplates] = useState([]);

  const [fetchTemplates, isLoading, error] = useApiRequest(async botId => {
    return await getTemplates(botId);
  });

  useEffect(() => {
    const fetchTemps = async () => {
      const res = await fetchTemplates(botId);
      setTemplates(res.templates);
    };
    fetchTemps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botId]);

  return (
    <Fade in={open} unmountOnExit>
      <Flex
        position={"absolute"}
        left={"130%"}
        ref={templatesRef}
        maxH={96}
        minW={{ base: "80vw", md: "44vw", lg: "40vw" }}
        overflowY={"auto"}
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
        {isLoading && (
          <HStack>
            <SpinnerLoader size="md" h={10} w={"fit-content"} />
            <Text>Загружаем...</Text>
          </HStack>
        )}
        {error && <Text color="red.500">Ошибка при загрузке шаблонов</Text>}

        {!isLoading && !error && templates.length === 0 && (
          <Text>Шаблонов нет.</Text>
        )}

        {!isLoading &&
          !error &&
          templates.map((t, id) => (
            <TemplateItem template={t} setText={setText} key={id} />
          ))}
      </Flex>
    </Fade>
  );
};

export default TemplateList;
