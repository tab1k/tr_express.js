const db = require("../models");
const type_activity = db.type_activity;
const Sequelize = require("sequelize");
const redisClient = require('../config/redisClient');
const Op = db.Sequelize.Op;


exports.findAll = async (req, res) => {
  const lang = req.query.lang || 'ru'
  await type_activity.findAll({
    where: {
      is_publish: true
    },
    include: [
      {
        model: db.translates,
        as: 'titleAs',
        attributes: []
      }
    ],
    attributes: [
      "id",
      [Sequelize.col(`titleAs.${lang}`), "title"],
      'position'
    ],
    order: [
      [Sequelize.literal('ISNULL(position)'), 'ASC'],
      ['position', 'ASC']
    ]
  })
    .then(async data => {
      res.send({ data });
    })
    .catch(err => {
      res.status(500).send({
        error:
          err.message || "Some error occurred while retrieving Speciality."
      });
    });
};

exports.findOne = async (req, res) => {
  try {
    let lang = req.query.lang || 'ru'
    const id = req.params.id
    await type_activity.findOne({
      where: {
        id: id,
        is_publish: true
      },
      include: [
        {
          model: db.translates,
          as: 'titleAs',
          attributes: []
        }
      ],
      attributes: [
        "id",
        [Sequelize.col(`titleAs.${lang}`), "title"]
      ]
    })
      .then(async data => {
        if (data) {
          res.status(200).send({ data })
        } else {
          res.status(404).send({ error: 'Нет такой статьи по slug' });
        }
      })
      .catch(err => {
        res.status(500).send({
          error:
            err.message || "Some error occurred while retrieving Speciality."
        });
      });
  } catch (err) {
    res.status(400).send({ error: err })
  }
};
