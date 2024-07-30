import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { UN_RATE_MOVIE } from "../utils/mutations";
import Auth from "../utils/auth";

const Lists = () => {
  const [unRateMovie] = useMutation(UN_RATE_MOVIE);
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || {};

  const handleUnRateMovie = async (movieId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await unRateMovie({
        variables: { movieId },
      });

      const updatedUser = data?.unRateMovie || {};
      console.log(updatedUser);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div>
        {userData.ratedMovies?.length ? (
          <div>
            {userData.ratedMovies?.map((movie) => (
              <div
                key={movie.movieId}
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                {movie.image && (
                  <img
                    src={movie.image}
                    alt={`The cover for ${movie.title}`}
                    className="movie-img-top"
                  />
                )}
                <div className="movie-body">
                  <h3>{movie.title}</h3>
                  <p className="small">Directed by: {movie.directors}</p>
                  <p>{movie.rating}</p>
                  <p>{movie.review}</p>
                  <button
                    className="btn btn-danger btn-block"
                    onClick={() => handleUnRateMovie(movie.movieId)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {userData.ratedMovies?.length ? (
              userData.ratedMovies.map((movie) => (
                <div key={movie.movieId} className="movie-card mb-3">
                  {movie.image && (
                    <img
                      src={movie.image}
                      alt={`The cover for ${movie.title}`}
                      className="movie-img-top"
                      style={{ width: "50%", height: "auto" }}
                    />
                  )}
                  <div className="movie-body">
                    <h3>{movie.title}</h3>
                    <p className="small">Directed by: {movie.directors}</p>
                    <p>{movie.review}</p>
                    <button
                      className="btn btn-danger btn-block"
                      onClick={() => handleUnRateMovie(movie.movieId)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <div className="flex space-x-4 max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                  <img
                    src="../src/assets/poster.jpg"
                    alt="The cover for movie"
                    className="movie-img-top rounded-lg"
                    style={{ width: "25%", height: "auto" }}
                  />
                  <div className="movie-body p-2 flex-1">
                    <div>
                      <h2 className="text-xl font-semibold">
                        Movie Title (2008)
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">☆☆☆☆☆</p>
                      <p className="mt-2 text-sm">
                        This movie is soooo good. Greatest of all time
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Lists;
