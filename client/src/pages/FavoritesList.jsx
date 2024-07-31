import { useQuery, useMutation } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";
import { UN_FAVORITE_MOVIE } from "../utils/mutations";
import Auth from "../utils/auth";
import Movie from "../components/Movie.jsx";

const FavoritesList = () => {
  const [unfavoriteMovie] = useMutation(UN_FAVORITE_MOVIE);
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || {};

  console.log(userData);

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

  const getRating = (movieId) => {
    const ratedMovie = userData.ratedMovies.find(
      (movie) => movie.movieId === movieId
    );
    return ratedMovie ? ratedMovie.rating : "N/A";
  };

  if (loading) {
    return <h1 className="flex justify-center text-4xl">LOADING...</h1>;
  }

  return (
    <div>
      <h1 className="flex justify-center text-4xl">FAVORITES</h1>
      <div className="flex justify-center min-h-screen p-4">
        {userData.favoriteMovies?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
            {userData.favoriteMovies.map((movie) => (
              <div key={movie.movieId}>
                <Movie
                  src={movie.image}
                  alt={movie.title}
                  rating={getRating(movie.movieId)}
                />
                <div className="mt-1 mb-1 flex space-x-2 justify-center">
                  <button
                    onClick={() => handleUnfavoriteMovie(movie.movieId)}
                    type="button"
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-red-900"
                  >
                    Unfavorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">No favorite movies found</div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
