const express = require("express");
const router = require("express").Router();
const upload = require("../middleware/upload");
const { authJwt } = require("../middleware");

module.exports = function(app) {  
  const transport = require("../controllers/transport.controller.js");

  router.use(express.json());
  router.post("/", [authJwt.verifyToken, authJwt.isDriver], upload.single(""), transport.create);
  router.get("/", [authJwt.verifyToken, authJwt.isDriver], transport.findAll);
  router.post("/search", upload.single(""), transport.search);
  router.get("/:id", [authJwt.verifyToken, authJwt.isDriver], transport.findOne);
  router.put("/:id", [authJwt.verifyToken, authJwt.isDriver], upload.single(""), transport.update);
  router.delete("/:id", [authJwt.verifyToken, authJwt.isDriver], transport.delete);

  app.use('/api/transport', router);
};