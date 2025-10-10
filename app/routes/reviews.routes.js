const express = require("express");
const router = require("express").Router();
const upload = require("../middleware/upload");
const { authJwt } = require("../middleware");

module.exports = function(app) {  
  const reviews = require("../controllers/reviews.controller.js");

  router.use(express.json());
  router.post("/", [authJwt.verifyToken], upload.single(""), reviews.create);

  app.use('/api/reviews', router);
};