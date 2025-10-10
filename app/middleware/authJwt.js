const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.sh_users;

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token.split(' ')[1], config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isClient = async (req, res, next) => {
  await db.users.findOne({
    where: {
      id: req.userId
    }
  }).then(data => {
    if (data.dataValues.status !== 'driver') {
      next();
      return;
    } else {
      return res.status(403).send({
        message: "У вас нет доступа!"
      });
    }
  }).catch(err => {
    return res.status(403).send({
      message: "У вас нет доступа!"
    });
  });
};

isDriver = async (req, res, next) => {
  await db.users.findOne({
    where: {
      id: req.userId
    }
  }).then(data => {
    if (data.dataValues.status === 'driver') {
      next();
      return;
    } else {
      return res.status(403).send({
        message: "У вас нет доступа!"
      });
    }
  }).catch(err => {
    return res.status(403).send({
      message: "У вас нет доступа!"
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isDriver: isDriver,
  isClient: isClient
};
module.exports = authJwt;
