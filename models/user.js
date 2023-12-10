const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../constants/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле является обязательным.'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле является обязательным.'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Поле является обязательным.'],
    minlength: [2, 'минимальная длина 2 символа.'],
    maxlength: [30, 'максимальаня длина 30 символов.'],
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль.');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
