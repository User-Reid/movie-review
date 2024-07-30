import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const RATE_MOVIE = gql`
  mutation RateMovie($movieInput: MovieInput) {
    rateMovie(movieInput: $movieInput) {
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

export const UN_RATE_MOVIE = gql`
  mutation UnRateMovie($movieId: String!) {
    unRateMovie(movieId: $movieId) {
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

export const ADD_MOVIE_TO_FAVORITE = gql`
  mutation AddMovieToFavorite($movieInput: MovieInput) {
    addMovieToFavorite(movieInput: $movieInput) {
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

export const UN_FAVORITE_MOVIE = gql`
  mutation UnFavoriteMovie($movieId: String!) {
    unFavoriteMovie(movieId: $movieId) {
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
