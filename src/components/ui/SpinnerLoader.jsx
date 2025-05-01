import { Center, Spinner } from "@chakra-ui/react";

const SpinnerLoader = ({ w = "full", h = "100vh", size = "xl", ...props }) => {
  return (
    <Center h={h} w={w} {...props}>
      <Spinner size={size} color="primary.500" />
    </Center>
  );
};

export default SpinnerLoader;
