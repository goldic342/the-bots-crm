import { Icon } from "@chakra-ui/react";
import { Check, CheckCheck } from "lucide-react";

const MessageRead = ({ isRead }) => {
  return (
    <>
      {isRead ? (
        <Icon as={CheckCheck} color="primary.400" />
      ) : (
        <Icon as={Check} color={"gray.500"} />
      )}
    </>
  );
};

export default MessageRead;
