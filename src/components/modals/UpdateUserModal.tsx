import { Credentials, ModalProps, User } from "../../dataTypes";
import React, { useContext } from "react";
import { Button, Modal, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { getCookie, UpdateContext } from "../../myFunctions";

interface Props {
  onHide: () => void;
  show: boolean;
  updateUserState: (change: User) => void;
}

const UpdateUserModal: React.FC<Props> = (props) => {
  const [user, setUser] = useState<User>();
  const {updateUserState, ...modal} = props;

  const schema = Yup.object().shape({
    username: Yup.string(),
    firstName: Yup.string(),
    lastName: Yup.string(),
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = getCookie("id");
      const user: User = await axios
        .get(`http://localhost:8080/auth/profile/${userId}`, {
          headers: { mode: "cors" },
        })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });
      setUser(user);
    };
    fetchData();
  }, []);

  const updateUser = async (e: any) => {
    const userId = getCookie("id");
    const token = getCookie("token");
    const newUser = {
      username: e.username,
      firstName: e.firstName,
      lastName: e.lastName,
    };
    const data: User = await axios
      .put(`http://localhost:8080/auth/update/${userId}`, newUser, {
        headers: { mode: "cors", Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
    updateUserState(data);
    props.onHide()
  };

  return (
    <>
      <Modal
        {...modal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Update personal informations</h1>
          <Formik
            validationSchema={schema}
            onSubmit={updateUser}
            initialValues={
              user
                ? {
                    username: user.username,
                    firstName: user.firstname,
                    lastName: user.lastname,
                  }
                : { username: "", firstName: "", lastName: "" }
            }
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="username">
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
                <Form.Group controlId="firstName">
                  <Form.Label>First name</Form.Label>
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
                <Form.Group controlId="lastName" className="mb-3">
                  <Form.Label>Last name</Form.Label>
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
                <Form.Group controlId="update">
                  <Button className="mr-auto" variant="success" type="submit">
                    Save changes
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

export default UpdateUserModal;
