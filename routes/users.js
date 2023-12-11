const userRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validation');

userRouter.get('/me', getUser);
userRouter.patch('/me', validationUpdateUser, updateUser);

module.exports = userRouter;
