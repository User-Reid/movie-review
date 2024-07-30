const { Schema } = require("mongoose");

const movieSchema = new Schema({
  movieId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0, // Minimum value for rating
    max: 5, // Maximum value for rating
  },
});

module.exports = movieSchema;
