import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { ModalProps, Movie } from "../../dataTypes";
import * as Yup from "yup";
import axios from "axios";
import { getCookie } from "../../myFunctions";

export interface Props {
  onHide: () => void;
  show: boolean;
  addToMovieList: (m: Movie) => void;
}

const AddMovieModal: React.FC<Props> = (props) => {
  const [ageRatings, setAgeRatings] = useState<Array<string>>([]);
  const [ageRating, setAgeRating] = useState<string>("");
  const [actor, setActor] = useState<string>("");
  const [actors, setActors] = useState<Array<string>>([]);

  const { addToMovieList, ...modal } = props;

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(5, "Name is to short"),
    director: Yup.string()
      .required("Director is required")
      .min(5, "Directors name is to short"),
    actor: Yup.string().min(5, "Actors name is to short"),
  });

  useEffect(() => {
    const fetchData = async () => {
      const data: Array<string> = await axios
        .get("http://localhost:8080/movie/agerating", {
          headers: { mode: "cors" },
        })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });
      setAgeRatings(data);
    };
    fetchData();
  }, []);

  const addActor = (e: any) => {
    if (actor) setActors(() => [...actors, actor]);
    setActor("");
  };

  const handleAgeRating = (e: any) => {
    setAgeRating(e.target.value);
  };

  const addMovie = async (e: any) => {
    const token = getCookie("token");
    const newMovie = {
      name: e.name,
      director: e.director,
      actors: actors,
      ageRating: ageRating,
    };
    const newDbMovie: Movie = await axios
      .post(`http://localhost:8080/movie/create`, newMovie, {
        headers: { mode: "cors", Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
    setActors([]);
    addToMovieList(newDbMovie);
    props.onHide();
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
          <Modal.Title id="contained-modal-title-vcenter">Add</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>Add Movie</h1>
          <Formik
            validationSchema={schema}
            onSubmit={addMovie}
            initialValues={{
              name: "",
              director: "",
              actor: "",
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="director">
                  <Form.Label>Director</Form.Label>
                  <Form.Control
                    type="text"
                    name="director"
                    value={values.director}
                    onChange={handleChange}
                    isInvalid={!!errors.director}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.director}
                  </Form.Control.Feedback>
                </Form.Group>

                {ageRatings !== undefined ? (
                  <>
                    {ageRatings.map((a) => (
                      <Form.Group controlId="AgeRating" key={a}>
                        <Form.Check
                          label={a}
                          name="ageRating"
                          type="radio"
                          value={a}
                          onChange={(e) => handleAgeRating(e)}
                          checked={
                            ageRating ? a === ageRating : a === ageRatings[0]
                          }
                        />
                      </Form.Group>
                    ))}
                  </>
                ) : (
                  <></>
                )}
                <Form.Group className="mb-3" controlId="actor">
                  <Form.Label>New actor</Form.Label>
                  <Form.Control
                    type="text"
                    value={actor}
                    onChange={(e) => setActor(e.target.value)}
                    isInvalid={!!errors.actor}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.actor}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="addActor">
                  <Button
                    className="mx-auto"
                    variant="primary"
                    onClick={addActor}
                  >
                    Add Actor
                  </Button>
                  <Button
                    className="mx-auto"
                    variant="warning"
                    onClick={() => setActors([])}
                  >
                    Clear actors
                  </Button>
                </Form.Group>
                {actors !== undefined ? (
                  <>
                    <ul className="m-2">
                      {actors.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <></>
                )}

                <Form.Group controlId="Add">
                  <Button className="mr-auto" variant="success" type="submit">
                    Add
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

export default AddMovieModal;
