const db = require("../models");
const useful = db.useful;
const Sequelize = require("sequelize");
const redisClient = require('../config/redisClient');
const Op = db.Sequelize.Op;


exports.findCities = async (req, res) => {
  const lang = req.query.lang || 'ru'
  const text = req.query.text || 'ru'
  await db.city.findAll({
    where: {
      [Op.or]: [
        {
          ru: {
            [Op.like]: `%${text}%`
          }
        },
        {
          kz: {
            [Op.like]: `%${text}%`
          }
        },
        {
          en: {
            [Op.like]: `%${text}%`
          }
        }
      ]
    },
    include: ['country'],
    order: [
      [Sequelize.literal('ISNULL(city.position)'), 'ASC'],
      ['position', 'ASC']
    ]
  })
    .then(async data => {
      const result = data.map(el => {
        return {
          id: el.id,
          title: `${el.dataValues.country[lang]}, ${el.dataValues[lang]}`
        }
      })
      res.send({ data: result });
    })
    .catch(err => {
      res.status(500).send({
        error:
          err.message || "Some error occurred while retrieving Speciality."
      });
    });
};