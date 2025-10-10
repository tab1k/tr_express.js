const router = require("express").Router();

module.exports = function(app) {  
  const dicts = require("../controllers/dicts.controller.js");

  router.get("/", dicts.findAll);
  router.get("/uploadaddress", dicts.uploadAddress);

  app.use('/api/dicts', router);
};