import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Movie } from "../dataTypes";
import { getCookie } from "../myFunctions";
import AddMovieModal from "./modals/AddMovieModal";

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [addMovieShow, setAddMovienShow] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const data: Array<Movie> = await axios
        .get("http://localhost:8080/movie/all", {
          headers: { mode: "cors" },
        })
        .then((response) => response.data)
        .catch((err) => {
          console.log(err);
        });
      setMovies(data);
    };
    fetchData();
  }, []);

  const addToMovieList = (m: Movie) => {
    setMovies((pre) => [...pre, m]);
  };

  return (
    <>
      <h1>Movies</h1>
      {getCookie("token") !== null ? (
        <Button
          className="m-3"
          variant="primary"
          onClick={() => setAddMovienShow(true)}
        >
          Add movie
        </Button>
      ) : (
        <> </>
      )}

      {movies.map((movie) => (
        <Card
          className="mx-auto"
          key={movie.movieId}
        >
          <Card.Body>
            <Card.Title>{movie.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {movie.director}
            </Card.Subtitle>
            <Card.Text>
              Avrage Rating:{" "}
              {movie.averageRating === 0
                ? "Not yet rated"
                : movie.averageRating}
            </Card.Text>
          </Card.Body>
          <Link className="mb-3 mx-3" to={`/movie/${movie.movieId}`}>
            <Button>Detail</Button>
          </Link>
        </Card>
      ))}
      <AddMovieModal
        show={addMovieShow}
        onHide={() => setAddMovienShow(false)}
        addToMovieList={addToMovieList}
      />
    </>
  );
};

export default Movies;
