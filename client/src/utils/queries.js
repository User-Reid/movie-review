import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query Me {
    me {
      _id
      username
      email
      password
      ratedMovieCount
      ratedMovies {
        movieId
        title
        image
        rating
      }
      favoriteMovieCount
      favoriteMovies {
        movieId
        title
        image
        rating
      }
    }
  }
`;
