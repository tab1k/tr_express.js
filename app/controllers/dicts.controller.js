const db = require("../models");
const useful = db.useful;
const Sequelize = require("sequelize");
const redisClient = require('../config/redisClient');
const countries = require('./countries');
const Op = db.Sequelize.Op;


exports.findAll = async (req, res) => {
  try {
    const lang = req.query.lang || 'ru'
    const list = req.query.list || ''
    const data = {}
    if (list.includes('type_activity')) {
      data.type_activity = await db.type_activity.findAll({
        where: {
          is_publish: true
        },
        attributes: [
          "id",
          [Sequelize.col(`${lang}`), "title"]
        ],
        order: [
          [Sequelize.literal('ISNULL(position)'), 'ASC'],
          ['position', 'ASC']
        ]
      })
    }
    if (list.includes('type_car')) {
      data.type_car = await db.type_car.findAll({
        where: {
          is_publish: true
        },
        attributes: [
          "id",
          [Sequelize.col(`${lang}`), "title"]
        ],
        order: [
          [Sequelize.literal('ISNULL(position)'), 'ASC'],
          ['position', 'ASC']
        ]
      })
    }
    if (list.includes('radius')) {
      data.radius = await db.radius.findAll({
        where: {
          is_publish: true
        },
        attributes: [
          "id",
          "name",
          ["name", "title"]
        ],
        order: [
          [Sequelize.literal('ISNULL(position)'), 'ASC'],
          ['position', 'ASC']
        ]
      })
    }
    if (list.includes('type_payment')) {
      data.type_payment = await db.type_payment.findAll({
        where: {
          is_publish: true
        },
        attributes: [
          "id",
          [Sequelize.col(`${lang}`), "title"]
        ],
        order: [
          [Sequelize.literal('ISNULL(position)'), 'ASC'],
          ['position', 'ASC']
        ]
      })
    }
    if (list.includes('shipment')) {
      data.shipment = await db.shipment.findAll({
        where: {
          is_publish: true
        },
        attributes: [
          "id",
          [Sequelize.col(`${lang}`), "title"]
        ],
        order: [
          [Sequelize.literal('ISNULL(position)'), 'ASC'],
          ['position', 'ASC']
        ]
      })
    }
    if (list.includes('currency')) {
      data.currency = await db.currency.findAll({
        where: {
          is_publish: true
        },
        attributes: [
          "id",
          [Sequelize.col(`${lang}`), "title"]
        ],
        order: [
          [Sequelize.literal('ISNULL(position)'), 'ASC'],
          ['position', 'ASC']
        ]
      })
    }
    if (list.includes('country')) {
      const countries = await db.country.findAll({
        where: {
          is_publish: true
        },
        attributes: [
          "id", 
          [Sequelize.col(`${lang}`), "title"]
        ],
        order: [
          [Sequelize.literal('ISNULL(position)'), 'ASC'],
          ['position', 'ASC']
        ]
      })
      
      const country = await Promise.all(countries.map(async el => {
        const cities = await db.city.findAll({
          where: {
            country_id: el.id
          },
          attributes: [
            "id", 
            [Sequelize.col(`${lang}`), "title"]
          ],
          order: [
          [Sequelize.literal('ISNULL(position)'), 'ASC'],
          ['position', 'ASC']
        ]
        })
        return {
          id: el.id,
          title: el.dataValues.title,
          cities: cities
        }
      }))
      data.country = country
    }
    res.status(200).send({data})
  } catch (error) {
    res.status(500).send({error})
  }
};

exports.uploadAddress = async (req, res) => {
  try {
    if (countries && countries.length) {
      createTranslationsAndData(countries)
      .then(() => res.status(200).send({status: true}))
      .catch(error => res.status(500).send({error}));
    } else {
      res.status(500).send({error: "Файл не найден"})
    }
  } catch (error) {
    res.status(500).send({error})
  }
}


async function createTranslationsAndData(address) {
  for (const country of address) {
    const countryObj = {
      ru: country.name,
      kz: country.name,
      en: country.name,
      is_publish: true
    };
    const countryId = await db.country.create(countryObj);

    await Promise.all(
      country.cities.map(async city => {
        if (city.childs?.length) {
          await createChildCities(city.childs, countryId.id);
        }
      })
    );
  }
}

async function createChildCities(childs, parentId) {
  return Promise.all(
    childs.map(async child => {
      const childObj = {
        ru: child.name,
        en: child.name,
        kz: child.name,
        country_id: parentId
      };
      await db.city.create(childObj);
    })
  );
}