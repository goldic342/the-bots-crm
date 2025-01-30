import { InputRightElement, InputGroup, Input, Button } from "@chakra-ui/react";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({ onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <InputGroup size="lg">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Пароль"
        size="lg"
        onChange={(e) => onChange(e)}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          onClick={() => setShow(!show)}
          variant="link"
        >
          {show ? <EyeOff /> : <Eye />}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
