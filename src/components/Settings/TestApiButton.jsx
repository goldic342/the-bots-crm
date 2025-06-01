import { FormControl, FormLabel, Button, useToast } from "@chakra-ui/react";
import { getMe } from "../../api/auth";
import useApiRequest from "../../hooks/useApiRequest";
import { useEffect } from "react";

const TestApiButton = () => {
  const toast = useToast();
  const [testApi, isLoading, error] = useApiRequest(
    async () => await getMe(true),
  );

  const handleClick = async () => {
    await testApi();
    toast({
      title: "Все работает!",
      description: "Информация успешно получена!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  useEffect(() => {
    if (!error) return;
    toast({
      title: "Что-то сломалось :(",
      description: error,
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  }, [error, toast]);

  return (
    <FormControl
      display="flex"
      alignItems="center"
      justifyContent={"space-between"}
    >
      <FormLabel htmlFor="dark-mode" mb="0">
        Протестировать API
      </FormLabel>
      <Button
        size={"sm"}
        variant={"outline"}
        isLoading={isLoading}
        onClick={handleClick}
      >
        Тест
      </Button>
    </FormControl>
  );
};

export default TestApiButton;
