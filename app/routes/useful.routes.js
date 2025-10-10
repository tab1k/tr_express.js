const router = require("express").Router();

module.exports = function(app) {  
  const useful = require("../controllers/useful.controller.js");

  router.get("/", useful.findAll);
  router.get("/:slug", useful.findOne);

  app.use('/api/useful', router);
};