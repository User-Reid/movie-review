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

      throw new AuthentificationError("Not authenticated");
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

      throw new AuthentificationError("Not authenticated");
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
