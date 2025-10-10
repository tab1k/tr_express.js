const router = require("express").Router();

module.exports = function(app) {  
  const type_activity = require("../controllers/type_activity.controller.js");

  router.get("/", type_activity.findAll);
  router.get("/:id", type_activity.findOne);

  app.use('/api/activity', router);
};