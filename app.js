const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const router = require('./routes');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(requestLogger);

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);
app.use(auth, router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`Server listen port ${PORT}`);
});
