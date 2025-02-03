import { InputRightElement, InputGroup, Input, Button } from "@chakra-ui/react";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({
  onChange,
  deafultShow = false,
  size = "lg",
  ...props
}) => {
  const [show, setShow] = useState(deafultShow);

  return (
    <InputGroup size={size}>
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Пароль"
        size={size}
        onChange={(e) => onChange(e)}
        {...props}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          onClick={() => setShow(!show)}
          variant="link"
          tabIndex={"-1"}
        >
          {show ? <EyeOff /> : <Eye />}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
