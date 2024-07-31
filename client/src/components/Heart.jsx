import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_MOVIE_TO_FAVORITE, UN_FAVORITE_MOVIE } from "../utils/mutations";
import Auth from "../utils/auth";

const Heart = ({ movie, userData, userRating }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMovie] = useMutation(ADD_MOVIE_TO_FAVORITE);
  const [unfavoriteMovie] = useMutation(UN_FAVORITE_MOVIE);

  useEffect(() => {
    // Check if the movie is already in the user's favorite movies

    if (userData) {
      const favoriteMovie = userData.favoriteMovies.some(
        (favMovie) => favMovie.movieId === movie.imdbID
      );
      setIsFavorite(favoriteMovie);
    }
  }, [movie]);

  const handleToggleFavorite = async () => {

    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      console.error("No token found");
      return false;
    }

    try {
      if (isFavorite) {
        const { data } = await unfavoriteMovie({
          variables: { movieId: movie.imdbID },
        });
        console.log(data);
      } else {
        const { data } = await favoriteMovie({
          variables: {
            movieInput: {
              movieId: movie.imdbID,
              title: movie.Title,
              image: movie.Poster,

              rating: userRating,

            },
          },
        });
        console.log(data);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleToggleFavorite} className="heart-button">
      {isFavorite ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="red"
          viewBox="0 0 24 24"
          stroke="red"
          width="24"
          height="24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="gray"
          viewBox="0 0 24 24"
          stroke="gray"
          width="24"
          height="24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
    </button>
  );
};

export default Heart;
