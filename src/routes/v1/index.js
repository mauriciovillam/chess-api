const express = require('express');
const userRoute = require('./game.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/game',
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
