const router = require("express").Router();

module.exports = function(app) {  
  const useful = require("../controllers/search.controller.js");

  router.get("/city", useful.findCities);

  app.use('/api/search', router);
};