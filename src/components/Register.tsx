import React, { useState } from "react";
import { Button } from "react-bootstrap";
import RegisterModal from "./modals/RegisterModal";

const Register: React.FC = () => {
  const [registerShow, setRegisterShow] = useState<boolean>(false);

  return (
    <>
      <h1>Registration</h1>

      <Button variant="primary" onClick={() => setRegisterShow(true)}>
        Register
      </Button>

      <RegisterModal
        show={registerShow}
        onHide={() => setRegisterShow(false)}
      />
    </>
  );
};

export default Register;
