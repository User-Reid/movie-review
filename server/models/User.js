const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const movieSchema = require("./Movie");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    ratedMovies: {
      type: [movieSchema],
      default: [],
    },
    favoriteMovies: {
      type: [movieSchema],
      default: [],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// hash user password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  const checkDuplicates = (movies) => {
    const movieIds = movies.map(movie => movie.movieId);
    return movieIds.length === new Set(movieIds).size;
  };

  if (!checkDuplicates(this.ratedMovies)) {
    return next(new Error("Duplicate movie in ratedMovies"));
  }

  if (!checkDuplicates(this.favoriteMovies)) {
    return next(new Error("Duplicate movie in favoriteMovies"));
  }

  next();
});

// validate password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.virtual("ratedMovieCount").get(function () {
  return this.ratedMovies.length;
});
userSchema.virtual("favoriteMovieCount").get(function () {
  return this.favoriteMovies.length;
});

const User = model("User", userSchema);

module.exports = User;
