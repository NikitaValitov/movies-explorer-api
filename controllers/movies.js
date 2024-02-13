const movieSchema = require('../models/movie');
const { ERROR_CODE } = require('../constants/constants');
const BadRequestError = require('../constants/BadRequestError');
const NotFoundError = require('../constants/NotFoundError');
const ForbiddenError = require('../constants/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  movieSchema
    .find({ owner: req.user._id })
    .then((movies) => res.status(ERROR_CODE.OK).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  movieSchema
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    })
    .then((movie) => res.status(ERROR_CODE.CREATED).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      } return next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  movieSchema
    .findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        return next(new NotFoundError('Фильм не найден.'));
      } if (req.user._id !== movie.owner.toString()) {
        return next(new ForbiddenError('Нельзя удалять фильмы, сохраненные другими пользователями.'));
      } return movieSchema.deleteOne(movie)
        .then(() => {
          res.status(ERROR_CODE.OK).send({ message: 'Фильм удален.' });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удалении фильма.'));
      } return next(err);
    });
};
