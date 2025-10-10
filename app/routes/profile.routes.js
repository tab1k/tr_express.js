const upload = require("../middleware/upload");
const { authJwt } = require("../middleware");
const express = require("express");
const router = require("express").Router();

module.exports = function(app) {  
  const profileUser = require("../controllers/profile.controller.js");

  router.use(express.json());
  router.put("/change-password", [authJwt.verifyToken], upload.single(""), profileUser.changePassword);
  router.get("/me", [authJwt.verifyToken], profileUser.me);
  router.post("/become-driver", [authJwt.verifyToken, authJwt.isClient], upload.fields([
    { name: 'id_card', maxCount: 1 },
    { name: 'driver_license', maxCount: 1 }
  ]), profileUser.becomeDriver);
  router.put("/edit", [authJwt.verifyToken], upload.single("image"), profileUser.edit);
  router.post("/add-good", [authJwt.verifyToken], upload.single(""), profileUser.addGood);
  router.delete("/delete-good/:id", [authJwt.verifyToken], profileUser.deleteGood);
  router.post("/add-transport", [authJwt.verifyToken], upload.single(""), profileUser.addTransport);
  router.delete("/delete-transport/:id", [authJwt.verifyToken], profileUser.deleteTransport);

  app.use('/api/profile', router);
};