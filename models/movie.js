const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле является обязательным.'],
  },
  director: {
    type: String,
    required: [true, 'Поле является обязательным.'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле является обязательным.'],
  },
  year: {
    type: String,
    required: [true, 'Поле является обязательным.'],
  },
  description: {
    type: String,
    required: [true, 'Поле является обязательным.'],
  },
  image: {
    type: String,
    required: [true, 'Поле является обязательным.'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL.',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле является обязательным.'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL.',
    },
  },
  thumbnail: {
    type: String,
    ref: 'movie',
    required: [true, 'Поле является обязательным.'],
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL.',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Поле является обязательным.'],
  },
  movieId: {
    type: Number,
    required: [true, 'Поле является обязательным.'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле является обязательным.'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле является обязательным.'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
