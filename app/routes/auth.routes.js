const upload = require("../middleware/upload");
const { authJwt } = require("../middleware");
const express = require("express");
const router = require("express").Router();

module.exports = function(app) {  
  const authUser = require("../controllers/auth.controller.js");
  
  router.use(express.json());

  router.post("/register", upload.single(""), authUser.register);
  router.post("/resend-sms", upload.single(""), authUser.resend);
  router.post("/check-sms", upload.single(""), authUser.check);
  router.post("/login", upload.single(""), authUser.signin);
  router.put("/save-role", [authJwt.verifyToken], upload.single(""), authUser.saveRole);
  router.get("/verification/:id", authUser.verifycation);
  router.post("/recovery", upload.single(""), authUser.recovery);
  router.post("/restore", upload.single(""), authUser.restore);
  router.delete("/delete", [authJwt.verifyToken], authUser.delete);
  router.get("/logout", [authJwt.verifyToken],  authUser.logout);
  router.get("/userhash", authUser.userhash);

  app.use('/api/auth', router);
};