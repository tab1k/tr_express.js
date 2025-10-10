const express = require("express");
const router = require("express").Router();
const upload = require("../middleware/upload");
const { authJwt } = require("../middleware");

module.exports = function(app) {  
  const goods = require("../controllers/goods.controller.js");

  router.use(express.json());
  router.post("/", [authJwt.verifyToken], upload.single(""), goods.create);
  router.get("/", [authJwt.verifyToken], goods.findAll);
  router.post("/search", upload.single(""), goods.search);
  router.get("/:id", [authJwt.verifyToken], goods.findOne);
  router.put("/:id", [authJwt.verifyToken], upload.single(""), goods.update);
  router.delete("/:id", [authJwt.verifyToken], goods.delete);

  app.use('/api/goods', router);
};