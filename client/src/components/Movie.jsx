const Movie = ({ src, alt, rating }) => {
  const renderRatingContent = () => {
    if (rating === 1) {
      return (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white pb-6 w-full text-center flex justify-center space-x-1">
          <img
                  src="../src/assets/star.png"
                  alt="star"
                  className="w-12 h-12"
                />
        </div>
      );
    } else if (rating === 2) {
      return (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white pb-6 w-full text-center flex justify-center space-x-1">
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
</div>
      )
    } else if (rating === 3) {
      return (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white pb-6 w-full text-center flex justify-center space-x-1">
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
</div>
      )
    } else if (rating === 4) {
      return (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white pb-6 w-full text-center flex justify-center space-x-1">
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
</div>
      )
    } else if (rating === 5) {
      return (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white pb-6 w-full text-center flex justify-center space-x-1">
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
  <img
    src="../src/assets/star.png"
    alt="star"
    className="w-12 h-12"
  />
</div>
      )
    }
    return null;
  };

  return (
    <div className="relative flex flex-col space-y-4 max-w-sm p-2 md:m-2">
      <img
        src={src}
        alt={alt}
        className="movie-img-top rounded-lg w-full h-auto shadow-xl"
      />
      {renderRatingContent()}
    </div>
  );
};

export default Movie;