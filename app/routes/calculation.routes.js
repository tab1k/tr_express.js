const router = require("express").Router();
const upload = require("../middleware/upload");
const { authJwt } = require("../middleware");

module.exports = function(app) {  
  const calculation = require("../controllers/calculation.controller.js");

  router.post("/distance", upload.single(""), calculation.distance);
  router.post("/price", upload.single(""), calculation.price);

  app.use('/api/calculation', router);
};