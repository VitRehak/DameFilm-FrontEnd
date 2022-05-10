import React, { useState } from "react";
import { Button } from "react-bootstrap";
import LogInModal from "./modals/LogInModal";

const LogIn: React.FC =()=> {
    const [loginShow, setLoginShow] = useState<boolean>(false);

    return (
      <>
        <h1>Login</h1>
  
        <Button variant="primary" onClick={() => setLoginShow(true)}>
        Login
        </Button>
  
        <LogInModal
          show={loginShow}
          onHide={() => setLoginShow(false)}
        />
      </>
    );
}

export default LogIn;
