const db = require("../models");
const type_activity = db.type_activity;
const Sequelize = require("sequelize");
const redisClient = require('../config/redisClient');
const Op = db.Sequelize.Op;

exports.distance = async (req, res) => {
  try {
    const start_point = req.body.start_point || false
    const end_point = req.body.end_point || false
    if (!start_point || !end_point) {
      return res.status(400).send({message: "Отправьте все параметры"})
    }
    return res.status(200).send({
      distance: 80,
      travel_time: 36
    })
  } catch (err) {
    res.status(400).send({ error: err })
  }
};

exports.price = async (req, res) => {
  try {
    const dimension = req.body.dimension || false
    const value = req.body.value || false
    const start_point = req.body.start_point || false
    const end_point = req.body.end_point || false
    if (!start_point || !end_point || !dimension || !value) {
      return res.status(400).send({message: "Отправьте все параметры"})
    }
    return res.status(200).send({
      result: {
        distance: 80,
        weight: 24,
        avg_cost: 36000,
        delivery_time: 12
      },
      reverse: {
        total_distance: 80,
        weight: 24,
        avg_cost: 36000,
        avg_price: 12
      }
    })
  } catch (err) {
    res.status(400).send({ error: err })
  }
};
