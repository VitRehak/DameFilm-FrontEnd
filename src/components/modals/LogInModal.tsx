import { Credentials, ModalProps } from "../../dataTypes";
import React, { useContext } from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { UpdateContext } from "../../myFunctions";

const LogInModal: React.FC<ModalProps> = (props) => {
  const forceUpdate = useContext<any>(UpdateContext);

  const navigate = useNavigate();

  const schema = Yup.object().shape({
    email: Yup.string()
      .required()
      .email("Invalid Email"),
    password: Yup.string().required(),
  });

  const login = async (e: any) => {
    const loginUser = {
      email: e.email,
      password: e.password,
    };

    const data: Credentials = await axios
      .post("http://localhost:8080/auth/login", loginUser, {
        headers: { mode: "cors" }
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
    if (data.token === undefined) {
      alert("Wrong email or password");
      return;
    }

    let now = new Date();
    let time = now.getTime();
    let expireTime = time + 8 * 60 * 60 * 1000;
    now.setTime(expireTime);
    document.cookie = `token=${data.token};expires=` + now.toUTCString();
    document.cookie = `id=${data.userId};expires=` + now.toUTCString();
    document.cookie = `roles=${data.roles};expires=` + now.toUTCString();

    navigate("/");
    forceUpdate();
    
  };

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Login</h1>
          <Formik
            validationSchema={schema}
            onSubmit={login}
            initialValues={{
              email: "",
              password: "",
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="Login">
                  <Button className="mr-auto" variant="success" type="submit">
                    Login
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LogInModal;
