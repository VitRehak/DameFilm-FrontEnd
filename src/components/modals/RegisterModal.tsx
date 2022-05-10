import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { UpdateContext } from "../../myFunctions";
import { Credentials, ModalProps, User } from "../../dataTypes";

const RegisterModal: React.FC<ModalProps> = (props) => {
  const forceUpdate = useContext<any>(UpdateContext);

  const [userRoles, setUserRoles] = useState<Array<string>>([]);
  const [roles, setRoles] = useState<Array<string>>([]);

  const navigate = useNavigate();

  const schema = Yup.object().shape({
    username: Yup.string()
      .required()
      .min(5, "Username is to short"),
    email: Yup.string()
      .required()
      .email("Invalid Email"),
    password: Yup.string()
      .required()
      .min(5, "Password is to short"),
    passwordAgain: Yup.string()
      .required()
      .oneOf([Yup.ref("password")], "Password does not match"),
    firstName: Yup.string(),
    lastName: Yup.string(),
  });

  useEffect(() => {
    const fetchData = async () => {
      const data: Array<string> = await axios
        .get("http://localhost:8080/auth/roles", { headers: { mode: "cors" } })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });
      setRoles(data);
    };
    fetchData();
  }, []);

  const register = async (e: any) => {
    const newUser = {
      email: e.email,
      password: e.password,
      username: e.username,
      firstName: e.firstName,
      lastName: e.lastName,
      roles: userRoles,
    };

    const data: Credentials = await axios
      .post("http://localhost:8080/auth/register", newUser, {
        headers: { mode: "cors" },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
    if (data.token === undefined) {
      alert("User with this email already exists try different email");
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
          <Modal.Title id="contained-modal-title-vcenter">
            User Registration
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Register</h1>
          <Formik
            validationSchema={schema}
            onSubmit={register}
            initialValues={{
              username: "",
              email: "",
              password: "",
              passwordAgain: "",
              firstName: "",
              lastName: "",
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="usename">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={!!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>
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
                <Form.Group controlId="password">
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
                <Form.Group controlId="passwordAgain">
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    name="passwordAgain"
                    value={values.passwordAgain}
                    onChange={handleChange}
                    isInvalid={!!errors.passwordAgain}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.passwordAgain}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Form.Group controlId="firstname">
                    <Form.Label>*First name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      isInvalid={!!errors.firstName}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="lastName">
                    <Form.Label>*Last name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      isInvalid={!!errors.lastName}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                {roles.map((role: string) => {
                  return (
                    <Form.Group className="mb-3" controlId={role} key={role}>
                      <Form.Check
                        onChange={(e: any) => {
                          if (e.target.checked)
                            setUserRoles(() => [...userRoles, e.target.value]);
                          else {
                            setUserRoles(() =>
                              userRoles.filter((r) => r !== e.target.value)
                            );
                          }
                        }}
                        value={role}
                        type="checkbox"
                        label={role.substring(5)}
                      />
                    </Form.Group>
                  );
                })}
                <Form.Group controlId="Register">
                  <Button variant="success" type="submit">
                    Register
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

export default RegisterModal;
