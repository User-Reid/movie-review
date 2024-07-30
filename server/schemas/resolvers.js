const { signToken, AuthenticationError } = require("../utils/auth");
const { User } = require("../models");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    rateMovie: async (parent, { movieInput }, context) => {
      if (context.user) {
        try {
          // Ensure that the ratedMovies array does not contain the movie already
          const user = await User.findById(context.user._id);
          const isMovieRated = user.ratedMovies.some(movie => movie.movieId === movieInput.movieId);
    
          if (isMovieRated) {
            throw new Error("Movie already rated");
          }
    
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: {
                ratedMovies: movieInput,
              },
            },
            { new: true, runValidators: true }
          );
    
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new Error("Failed to Rate Movie");
        }
      }
    
      throw new AuthenticationError("Not authenticated");
    },

    unRateMovie: async (parent, { movieId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("User not logged in");
      }

      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { ratedMovies: { movieId } } },
        { new: true }
      );
    },
    
    addMovieToFavorite: async (parent, { movieInput }, context) => {
      if (context.user) {
        try {
          // Ensure that the favoriteMovies array does not contain the movie already
          const user = await User.findById(context.user._id);
          const isMovieFavorite = user.favoriteMovies.some(movie => movie.movieId === movieInput.movieId);
    
          if (isMovieFavorite) {
            throw new Error("Movie already in favorites");
          }
    
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            {
              $addToSet: {
                favoriteMovies: movieInput,
              },
            },
            { new: true, runValidators: true }
          );
    
          return updatedUser;
        } catch (err) {
          console.log(err);
          throw new Error("Failed to add movie to favorites!");
        }
      }
    
      throw new AuthenticationError("Not authenticated");
    },

    unFavoriteMovie: async (parent, { movieId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("User not logged in");
      }

      return User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { favoriteMovies: { movieId } } },
        { new: true }
      );
    },
  },
};

module.exports = resolvers;
