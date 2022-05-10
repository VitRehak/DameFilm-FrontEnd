import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearCookies, UpdateContext } from "../myFunctions";

const LogOut: React.FC = () => {
  const forceUpdate = useContext<any>(UpdateContext);

  const navigate = useNavigate();

  useEffect(() => {
    clearCookies();
    navigate("/");
    forceUpdate();
  }, []);

  return <></>;
};

export default LogOut;
