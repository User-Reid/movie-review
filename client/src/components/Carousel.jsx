import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Movie from "./Movie";

import { useQuery } from "@apollo/client";
import { QUERY_ME } from "../utils/queries";

const MovieCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || {};

  return (
    <Slider {...settings}>
      {userData.ratedMovies.map((movie) => (
        <Movie movie={movie} />
      ))}
    </Slider>
  );
};

export default MovieCarousel;
