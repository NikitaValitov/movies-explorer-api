const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res) => {
  res
    .status(404)
    .send({ message: 'Страница не найдена.' });
});

module.exports = router;
