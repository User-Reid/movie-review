import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { UN_RATE_MOVIE } from "../utils/mutations";
import { ADD_MOVIE_TO_FAVORITE } from "../utils/mutations";
import { UN_FAVORITE_MOVIE } from "../utils/mutations";
import Auth from "../utils/auth";
import Movie from "../components/Movie.jsx";

const RatedList = () => {
  const [unfavoriteMovie] = useMutation(UN_FAVORITE_MOVIE);
  const [unrateMovie] = useMutation(UN_RATE_MOVIE);
  const [favoriteMovie] = useMutation(ADD_MOVIE_TO_FAVORITE);
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || {};

  const handleUnrateMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.error("No token found");
      return false;
    }

    try {
      const { data } = await unrateMovie({
        variables: { movieId },
      });

      const updatedUser = data?.unrateMovie || {};
      console.log(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavoriteMovie = async (movieId, title, image, rating) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.error("No token found");
      return false;
    }

    try {
      const { data } = await favoriteMovie({
        variables: { movieInput: { movieId, title, image, rating } },
      });

      const updatedUser = data?.favoriteMovie || {};
      console.log(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfavoriteMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.error("No token found");
      return false;
    }

    try {
      const { data } = await unfavoriteMovie({
        variables: { movieId },
      });

      const updatedUser = data?.unfavoriteMovie || {};
      console.log(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <div>
      <h1 className="flex justify-center text-4xl">RATED</h1>
      <div className="flex justify-center min-h-screen p-4">
        {userData.ratedMovies?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
            {userData.ratedMovies.map((movie) => {
              const isFavorite = userData.favoriteMovies.some(
                (favMovie) => favMovie.movieId === movie.movieId
              );

              console.log(movie.rating);

              return (
                <div key={movie.movieId}>
                  <Movie
                    src={movie.image}
                    alt={movie.title}
                    rating={movie.rating}
                  />
                  <div className="mt-1 mb-1 flex space-x-2 justify-center">
                    {!isFavorite ? (
                      <button
                        onClick={() =>
                          handleFavoriteMovie(
                            movie.movieId,
                            movie.title,
                            movie.image,
                            movie.rating
                          )
                        }
                        type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-red-900"
                      >
                        Favorite
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnfavoriteMovie(movie.movieId)}
                        type="button"
                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-red-900"
                      >
                        Unfavorite
                      </button>
                    )}
                    <button
                      onClick={() => handleUnrateMovie(movie.movieId)}
                      type="button"
                      className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-900"
                    >
                      Unrate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center">No rated movies found</div>
        )}
      </div>
    </div>
  );
};

export default RatedList;
