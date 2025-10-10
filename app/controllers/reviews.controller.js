const db = require("../models");
const useful = db.useful;
const Sequelize = require("sequelize");
const redisClient = require('../config/redisClient');
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.create = async (req, res) => {
  try {
    const request = req.body
    request.author_id = req.userId
    const user = await db.users.findOne({
      where: {
        [Op.or]: [
          { email: request.user },
          { phone: request.user }
        ]
      }
    })
    if (user) request.user_id = user.id
    await db.reviews.create(request).then(async data => {
      res.status(201).send({data})
    }).catch(err => {
      res.status(500).send({
        error:
          err.message || "Some error occurred while retrieving Speciality."
      });
    });
  } catch (error) {
    res.status(500).send({error})
  }
}