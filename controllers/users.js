const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user');
const { ERROR_CODE } = require('../constants/constants');
const NotFoundError = require('../constants/NotFoundError');
const BadRequestError = require('../constants/BadRequestError');
const ConflictError = require('../constants/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => userSchema.create({ email, password: hash, name }))
    .then((user) => res.status(ERROR_CODE.CREATED).send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
      } if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует.'));
      } return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  userSchema
    .findById(req.user._id)
    .orFail(() => new NotFoundError('Пользователь не найден.'))
    .then((user) => res.status(ERROR_CODE.OK).send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  userSchema
    .findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден.'));
      } return res.status(ERROR_CODE.OK).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      } return next(err);
    });
};
