const db = require("../models");
const useful = db.useful;
const Sequelize = require("sequelize");
const redisClient = require('../config/redisClient');
const Op = db.Sequelize.Op;


exports.findAll = async (req, res) => {
  const lang = req.query.lang || 'ru'
  await useful.findAll({
    where: {
      is_publish: true
    },
    include: [
      {
        model: db.translates,
        as: 'titleAs',
        attributes: []
      },
      {
        model: db.translates,
        as: 'slugAs',
        attributes: []
      }
    ],
    attributes: [
      "id",
      [Sequelize.col(`titleAs.${lang}`), "title"],
      [Sequelize.col(`slugAs.${lang}`), "slug"],
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
    const slug = req.params.slug
    const slugCondition = {
      [Op.or]: [
        { 'ru': slug },
        { 'en': slug },
        { 'kz': slug }
      ]
    };
    const slugid = await db.translates.findOne({ where: slugCondition })

    if (slugid) {
      await useful.findOne({
        where: {
          slug: slugid.id,
          is_publish: true
        },
        include: [
          {
            model: db.translates,
            as: 'titleAs',
            attributes: []
          },
          {
            model: db.translates,
            as: 'contentAs',
            attributes: []
          },
        ],
        attributes: [
          "id",
          [Sequelize.col(`titleAs.${lang}`), "title"],
          [Sequelize.col(`contentAs.${lang}`), "content"],
        ]
      })
        .then(async data => {
          if (data) {
            // await redisClient.set(redisKey, JSON.stringify({ data, meta, cache: true }));
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
    } else {
      res.status(404).send({ error: "Нет такой статьи по slug" })
    }
    // }
  } catch (err) {
    res.status(400).send({ error: err })
  }
};
