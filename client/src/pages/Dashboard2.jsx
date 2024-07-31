/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import StarRating from "../components/StarRating";
import { useMovies } from "../hooks/useMovies";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useKey } from "../hooks/useKey";
import { useMutation, useQuery } from "@apollo/client";
import { RATE_MOVIE } from "../utils/mutations";
import Heart from "../components/Heart";
import { QUERY_ME } from "../utils/queries";

import Auth from "../utils/auth";

const KEY = "e91d2696";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [selected, setSelected] = useState(false);
  const [rateMovie, { error2, data }] = useMutation(RATE_MOVIE);
  const me = useQuery(QUERY_ME);
  const userData = me.data?.me || {};
  const [rated, setRated] = useLocalStorageState([], "rated");

  // useEffect(() => {
  //   if (!Auth.loggedIn()) {
  //     window.location.assign("/login"); // Redirect to login page if not logged in
  //   }
  // }, []);

  function handleSelectMovie(movie) {
    setSelectedId((selectedId) =>
      movie.imdbID === selectedId ? null : movie.imdbID
    );
    setSelected(!selected);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  async function handleAddRated(movie, userRating) {
    console.log("in handle add rated");
    console.log(movie);
    // setRated((rated) => [...rated, movie]);
    const movieToRate = {
      movieId: movie.imdbID,
      title: movie.Title,
      image: movie.Poster,
      rating: userRating,
    };

    console.log(movieToRate);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      console.log("running mutation thing");
      const { data } = await rateMovie({
        variables: { movieInput: movieToRate },
      });
      console.log({ data });
    } catch (err) {
      console.error(err);
    }
  }

  function handleDeleteRated(id) {
    setRated((rated) => rated.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("rated", JSON.stringify(rated));
    },
    [rated]
  );

  return (
    <div className="h-full w-screen">
      <NavBar>
        <Search query={query} setQuery={setQuery} setSelected={setSelected} />
        <NumResults movies={movies} />
      </NavBar>
      <Main selected={selected}>
        {!selected ? (
          <Box className="flex">
            {isLoading && <Loader />}
            {!isLoading && !error && (
              <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
            )}
            {error && <ErrorMessage message={error} />}
          </Box>
        ) : (
          <Box>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddRated={handleAddRated}
                rated={rated}
                movies={movies}
                userData={userData}
              />
            ) : (
              <RatedMovieList rated={rated} onDeleteRated={handleDeleteRated} />
            )}
          </Box>
        )}
      </Main>
    </div>
  );
}

function NavBar({ children }) {
  return (
    <nav className="flex items-center justify-between nav-bar align-center">
      {children}
    </nav>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}

function Search({ query, setQuery, selected, setSelected }) {
  const inputElement = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputElement.current) return;

    inputElement.current.focus();
    setQuery("");
  });

  function handleSearchReset() {
    setQuery("");
    setSelected(false);
  }

  // useEffect(function () {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, []);

  return (
    <input
      className="flex content-center h-8 search align-center"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
      onClick={handleSearchReset}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  );
}

function Main({ children, selected }) {
  const mainClass = selected
    ? "flex h-full main w-screen justify-center"
    : "flex h-full main w-screen justify-around";

  return <main className={mainClass}>{children}</main>;
}

function Box({ children, setDisplay, display }) {
  return <div className={display === true ? "box" : "box"}>{children}</div>;
}

/*
function RatedBox() {
  const [rated, setRated] = useState(tempRatedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <RatedSummary rated={rated} />
          <RatedMovieList rated={rated} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <ul className="w-full">
      <li
        className="flex items-center w-full cursor-pointer p-1 border-b hover:bg-gray-200"
        onClick={() => onSelectMovie(movie)}
      >
        <img
          className="h-12 w-7 mr-2"
          src={movie.Poster}
          alt={`${movie.Title} poster`}
        />
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{movie.Title}</h3>
          <p className="text-sm text-gray-500">({movie.Year})</p>
        </div>
      </li>
    </ul>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddRated,
  rated,
  userData,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isRated = rated.map((movie) => movie.imdbID).includes(selectedId);
  const ratedUserRating = rated.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const { Title: title, Poster: poster } = movie;

  useKey("Escape", onCloseMovie);

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "Reel Reviews";
    };
  }, [title]);

  return (
    <div className="flex items-center justify-center items-center w-screen">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative flex flex-col p-4">
          <h1 className="text-2xl mb-4 text-center">{title}</h1>
          <img
            src={poster}
            alt={`Poster of ${title} movie`}
            className="rounded-lg w-full max-w-md h-auto mb-4 shadow-xl"
          />
          <div className="flex flex-col items-center text-center">
            {!isRated ? (
              <>
                <StarRating
                  maxRating={5}
                  size={48}
                  onSetRating={setUserRating}
                  onAddRated={onAddRated}
                  movie={movie}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => onAddRated(movie, userRating)}
                    type="button"
                    className="focus:outline-none text-black bg-yellow-300 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5"
                  >
                    Submit Rating
                  </button>
                  <Heart
                    movie={movie}
                    userData={userData}
                    userRating={userRating}
                  />
                </div>
              </>
            ) : (
              <p>You rated this movie {ratedUserRating}/5⭐</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RatedMovieList({ rated, onDeleteRated }) {
  return (
    <ul className="list">
      {rated.map((movie) => (
        <RatedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteRated={onDeleteRated}
        />
      ))}
    </ul>
  );
}

function RatedMovie({ movie, onDeleteRated }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          onClick={() => onDeleteRated(movie.imdbID)}
          className="btn-delete"
        >
          X
        </button>
      </div>
    </li>
  );
}
