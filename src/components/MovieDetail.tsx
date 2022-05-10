import { wait } from "@testing-library/user-event/dist/utils";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Comment, Movie, Rating } from "../dataTypes";
import { clearCookies, getCookie, UpdateContext } from "../myFunctions";
import * as Yup from "yup";
import { Formik } from "formik";
import CommentComponent from "./CommentComponent";
import { FaStar } from "react-icons/fa";
import "../starStyle.css";

const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie>();
  const forceUpdate = useContext<any>(UpdateContext);
  const roles = getCookie("roles");
  const [updateShow, setUpdateShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const [comments, setCommnets] = useState<Array<Comment>>([]);
  const [isRated, setIsRated] = useState<boolean>();

  const schema = Yup.object().shape({
    text: Yup.string()
      .required("Comment is required")
      .min(5, "Comment is to short"),
  });

  useEffect(() => {
    const token = getCookie("token");
    const fetchDataDetail = async () => {
      const data: Movie = await axios
        .get(`http://localhost:8080/movie/detail/${id}`, {
          headers: { mode: "cors" },
        })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });
      setMovie(data);
    };
    const fetchDataComment = async () => {
      const data: Array<Comment> = await axios
        .get(`http://localhost:8080/comment/all/${id}`, {
          headers: { mode: "cors" },
        })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });
      setCommnets(data);
    };
    const fetchDataRating = async () => {
      const data = await axios
        .get(`http://localhost:8080/rating/rated/${id}`, {
          headers: { mode: "cors", Authorization: `Bearer ${token}` },
        })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });
      setIsRated(data.rated);
    };
    if (token) fetchDataRating();
    fetchDataDetail();
    fetchDataComment();
  }, [isRated]);

  const addComment = async (e: any) => {
    const token = getCookie("token");
    const newComment = {
      text: e.text,
    };
    console.log(newComment);
    const newDbComment: Comment = await axios
      .post(`http://localhost:8080/comment/create/${id}`, newComment, {
        headers: { mode: "cors", Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
    setCommnets(() => [...comments, newDbComment]);
  };

  const deleteMove = () => {
    const token = getCookie("token");
    axios
      .delete(`http://localhost:8080/movie/delete/${id}`, {
        headers: { mode: "cors", Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
    navigate("/movies");
    forceUpdate();
  };

  const sentRating = (starCount: number) => {
    if (isRated) {
      alert("You already rated");
      return;
    }
    const token = getCookie("token");
    const newRating: Rating = {
      starCount: starCount,
    };
    axios
      .post(`http://localhost:8080/rating/rate/${id}`, newRating, {
        headers: { mode: "cors", Authorization: `Bearer ${token}` },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
    setIsRated(true);
  };

  return (
    <>
      <h1>Movie detail</h1>
      {movie ? (
        <>
          <h3>
            {movie.name}{" "}
            {movie.averageRating === 0 ? "Not yet rated" : movie.averageRating}
          </h3>
          <h4>{movie.director}</h4>
          <div>{movie.ageRating}</div>
          <h5>Actors:</h5>
          <ul>
            {movie.actors.map((actor) => (
              <li key={actor}>{actor}</li>
            ))}
          </ul>
          <div>
            <small>
              Published by:{" "}
              {
                <Link to={`/profile/${movie.publisher.userId}`}>
                  {movie.publisher.username}
                </Link>
              }{" "}
              {movie.create}
            </small>
          </div>
          <div>
            <small>Last update: {movie.lastUpdate}</small>
          </div>
          {roles && movie ? (
            roles.includes("ROLE_ADMIN") ||
            movie.publisher.userId.toString() === getCookie("id") ? (
              <>
                <Button
                  onClick={deleteMove}
                  variant="danger"
                  className="mx-1 mt-2"
                >
                  Delete
                </Button>
              </>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
      <br />
      {getCookie("token") ? (
        isRated ? (
          <h4>You already rated</h4>
        ) : (
          <div id="rating_bar">
            <span onClick={() => sentRating(1)}></span>
            <span onClick={() => sentRating(2)}></span>
            <span onClick={() => sentRating(3)}></span>
            <span onClick={() => sentRating(4)}></span>
            <span onClick={() => sentRating(5)}></span>
          </div>
        )
      ) : (
        <></>
      )}

      <h2>Comments</h2>

      {getCookie("token") ? (
        <>
          <Formik
            validationSchema={schema}
            onSubmit={addComment}
            initialValues={{
              text: "",
            }}
          >
            {({ handleSubmit, handleChange, values, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="text">
                  <Form.Label>Text of message</Form.Label>
                  <Form.Control
                    type="text"
                    name="text"
                    value={values.text}
                    onChange={handleChange}
                    isInvalid={!!errors.text}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.text}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="add">
                  <Button
                    className="mr-auto mb-3"
                    variant="success"
                    type="submit"
                  >
                    Add Comment
                  </Button>
                </Form.Group>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <></>
      )}
      <ul>
        {comments.map((comment) => (
          <CommentComponent key={comment.text} comment={comment} />
        ))}
      </ul>
    </>
  );
};

export default MovieDetail;
