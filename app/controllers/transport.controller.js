const db = require("../models");
const useful = db.useful;
const Sequelize = require("sequelize");
const redisClient = require('../config/redisClient');
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.create = async (req, res) => {
  try {
    const points = req.body.points || false
    const type_cars = req.body.type_car_ids || false

    if (!points || typeof points[0] === 'string' || points?.length < 2) {
      return res.status(400).send({ message: 'Нет пунктов погрузки / разгрузки' })
    }

    if (type_cars && type_cars.length) {
      const checkTypeCars = await db.type_car.findAll({
        where: {
          id: type_cars
        }
      })
      if (checkTypeCars.length !== type_cars.length) {
        return res.status(400).send({ message: 'Не все типы машин найдены' })
      }
    } else {
      return res.status(400).send({ message: 'Не выбраны типы машин' })
    }


    for (const point of points) {
      point.city_id = parseInt(point.city_id)
      point.radius_id = parseInt(point.radius_id)
      if (
        !point.city_id ||
        !point.radius_id ||
        !point.type ||
        !Number.isInteger(point.city_id) ||
        !Number.isInteger(point.radius_id) ||
        typeof point.type !== 'string'
      ) {
        return res.status(400).send({
          message: 'Каждый пункт должен содержать числовые city_id и radius_id, а также строковое значение type'
        });
      }
    }

    const request = req.body
    request.user_id = req.userId
    await db.transport.create(request).then(async data => {
      points.forEach(el => {
        el.transport_id = data.id
      })
      await db.transport_points.bulkCreate(points)
      const typs = type_cars.map(el => {
        return {
          type_car_id: el,
          transport_id: data.id
        }
      })
      await db.transport_cars.bulkCreate(typs)
      res.status(201).send({ data })
    }).catch(err => {
      res.status(500).send({
        error:
          err.message || "Some error occurred while retrieving Speciality."
      });
    });
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.findAll = async (req, res) => {
  const lang = req.query.lang || 'ru'

  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 10);
    await db.transport.findAll({
      where: {
        user_id: req.userId,
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      include: [
        {
          model: db.transport_points,
          as: "points",
          include: [
            {
              model: db.city,
              as: "city",
              attributes: [
                'id',
                [Sequelize.col(`${lang}`), "name"]
              ]
            },
            {
              model: db.radius,
              as: "radius",
              attributes: [
                'id',
                'name'
              ]
            }
          ]
        },
        {
          model: db.users,
          as: "user",
          attributes: ['id', 'name', 'phone', 'email']
        },
        {
          model: db.shipment,
          as: "shipment",
          attributes: ['id', [Sequelize.col(`${lang}`), "title"]]
        },
        {
          model: db.transport_cars,
          as: "type_cars",
          attributes: ['type_car_id']
        }
      ],
      attributes: {
        exclude: ['shipment_id']
      }
    })
      .then(async data => {
        const updatedData = await Promise.all(
          data.map(async el => {
            const txt = await db.type_car.findAll({
              where: {
                id: el.type_cars.map(elel => elel.dataValues.type_car_id)
              },
              attributes: ['id', [Sequelize.col(`${lang}`), "title"]]
            });
            el.dataValues.type_cars = txt.map(e => e.dataValues.title).join(', ');
            el.dataValues.type_cars_id = txt
            return el;
          })
        );
        res.send({ data: updatedData });
      })
      .catch(err => {
        res.status(500).send({
          error:
            err.message || "Some error occurred while retrieving Speciality."
        });
      });
  } catch (error) {
    res.status(500).send({ error })
  }
};


exports.search = async (req, res) => {
  const lang = req.query.lang || 'ru'

  let transports = []
  try {
    const searchParams = {};

    const typecars = {}
    if (req.body.type_car_ids) {
      typecars.type_car_id = req.body.type_car_ids;
    }

    if (req.body.shipment_id) {
      searchParams.shipment_id = req.body.shipment_id;
    }

    if (req.body.weight) {
      searchParams.weight = parseFloat(req.body.weight);
    }

    if (req.body.volume) {
      searchParams.volume = parseFloat(req.body.volume);
    }

    if (req.body.from_weight || req.body.to_weight) {
      searchParams.weight = {};
      if (req.body.from_weight) {
        searchParams.weight[Op.gte] = parseFloat(req.body.from_weight);
      }
      if (req.body.to_weight) {
        searchParams.weight[Op.lte] = parseFloat(req.body.to_weight);
      }
    }

    if (req.body.from_volume || req.body.to_volume) {
      searchParams.volume = {};
      if (req.body.from_volume) {
        searchParams.volume[Op.gte] = parseFloat(req.body.from_volume);
      }
      if (req.body.to_volume) {
        searchParams.volume[Op.lte] = parseFloat(req.body.to_volume);
      }
    }

    if (req.body.transportation_start) {
      const da = req.body.transportation_day || 0
      const transportationStart = new Date(req.body.transportation_start);
      const transportationDay = parseInt(da, 10);

      const transportationEnd = new Date(transportationStart);
      transportationEnd.setDate(transportationEnd.getDate() + transportationDay);

      searchParams.transportation_start = {
        [Op.between]: [transportationStart, transportationEnd],
      };
    }


    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 10);

    searchParams.createdAt = {
      [Op.gte]: sevenDaysAgo
    }

    let searchFilter = null
    let filteredPointsAll = false
    const pointsConditions = req.body.points || [];
    if (pointsConditions && pointsConditions.length) {
      searchFilter = {};

      const filteredPoints = pointsConditions.filter(point =>
        Number.isInteger(parseInt(point.city_id)) &&
        point.type !== null
      ).map(point => {
        const ovj = {};
        if (point.city_id) ovj.city_id = parseInt(point.city_id);
        if (Number.isInteger(parseInt(point.radius_id))) ovj.radius_id = parseInt(point.radius_id);
        if (point.type) ovj.type = point.type;
        return ovj;
      });

      if (filteredPoints.length > 1) {
        filteredPointsAll = filteredPoints
        searchFilter[Op.or] = filteredPoints;
      } else {
        searchFilter[Op.or] = filteredPoints;
      }
    }

    let transportsIds = await db.transport.findAll({
      where: searchParams,
      include: [
        {
          model: db.transport_points,
          as: "points",
          where: searchFilter,
        }
      ]
    })
    transports = await db.transport.findAll({
      where: {
        id: transportsIds.map(el => el.id)
      },
      include: [
        {
          model: db.transport_points,
          as: "points",
          include: [
            {
              model: db.city,
              as: "city",
              attributes: [
                'id',
                [Sequelize.col(`${lang}`), "name"]
              ]
            },
            {
              model: db.radius,
              as: "radius",
              attributes: [
                'id',
                'name'
              ]
            }
          ]
        },
        {
          model: db.users,
          as: "user",
          attributes: ['id', 'name', 'phone', 'email']
        },
        {
          model: db.shipment,
          as: "shipment",
          attributes: ['id', [Sequelize.col(`${lang}`), "title"]]
        },
        {
          model: db.transport_cars,
          as: "type_cars",
          attributes: ['type_car_id'],
          where: typecars,
          required: true
        }
      ],
      attributes: {
        exclude: ['shipment_id']
      },
      order: [['id', 'DESC']]
    })

    const checkConditions = (array, conditions) => {
      return conditions.every(condition =>
        array.some(item => {
          const conditionKeys = Object.keys(condition);
          const itemKeys = Object.keys(item.dataValues);

          return conditionKeys.every(key =>
            itemKeys.includes(key) && item.dataValues[key] === condition[key]
          );
        })
      );
    };

    transports = await Promise.all(
      transports.map(async el => {

        let lat = false
        if (filteredPointsAll) {
          lat = checkConditions(el.points, filteredPointsAll)
        } else {
          lat = true
        }
        if (lat) {
          const txt = await db.type_car.findAll({
            where: {
              id: el.type_cars.map(elel => elel.dataValues.type_car_id)
            },
            attributes: ['id', [Sequelize.col(`${lang}`), "title"]]
          });
          el.dataValues.type_cars = txt.map(e => e.dataValues.title).join(', ');
          el.dataValues.type_cars_id = txt;
          return el;
        } else {
          return false
        }
      })
    );
    let token = req.headers["authorization"];
    if (token) {
      let user_id = ""
      jwt.verify(token.split(' ')[1], config.secret, (err, decoded) => {
        user_id = decoded.id;
      });
      console.log('user_id', user_id);

      let likedTransportsIds = [];
      if (user_id) {
        const likedGoods = await db.users_transports.findAll({
          where: {
            user_id: user_id
          },
          attributes: ['transport_id']
        });
        likedTransportsIds = likedGoods.map(lg => lg.transport_id); // Extract good_ids
      }
      console.log('likedTransportsIds', likedTransportsIds);


      // Add `is_like` field and sort goods
      const result = transports.filter(el => el).map(transport => ({
        ...transport.toJSON(),
        is_like: likedTransportsIds.includes(transport.id)
      }));

      // Sort: liked goods first
      result.sort((a, b) => (b.is_like ? 1 : 0) - (a.is_like ? 1 : 0));

      return res.status(200).send({ data: result })
    }
    const result = transports.filter(el => el).map(transport => ({
      ...transport.toJSON(),
      is_like: false
    }));
    return res.status(200).send({ data: result })
  } catch (error) {
    res.status(500).send({ error })
  }
};

exports.findOne = async (req, res) => {
  const lang = req.query.lang || 'ru'

  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 10);

    await db.transport.findOne({
      where: {
        id: req.params.id,
        user_id: req.userId,
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      },
      include: [
        {
          model: db.transport_points,
          as: "points",
          include: [
            {
              model: db.city,
              as: "city",
              attributes: [
                'id',
                [Sequelize.col(`${lang}`), "name"]
              ]
            },
            {
              model: db.radius,
              as: "radius",
              attributes: [
                'id',
                'name'
              ]
            }
          ]
        },
        {
          model: db.users,
          as: "user",
          attributes: ['id', 'name', 'phone', 'email']
        },
        {
          model: db.shipment,
          as: "shipment",
          attributes: ['id', [Sequelize.col(`${lang}`), "title"]]
        },
        {
          model: db.transport_cars,
          as: "type_cars",
          attributes: ['type_car_id']
        }
      ],
      attributes: {
        exclude: ['shipment_id']
      }
    })
      .then(async data => {
        const txt = await db.type_car.findAll({
          where: {
            id: data.type_cars.map(elel => elel.dataValues.type_car_id)
          },
          attributes: ['id', [Sequelize.col(`${lang}`), "title"]]
        });
        data.dataValues.type_cars = txt.map(e => e.dataValues.title).join(', ');
        data.dataValues.type_cars_id = txt
        data ? res.send({ data }) : res.status(404).send({ message: 'Машина не найдена' });
      })
      .catch(err => {
        res.status(500).send({
          error:
            err.message || "Some error occurred while retrieving Speciality."
        });
      });
  } catch (error) {
    res.status(500).send({ error })
  }
};

exports.update = async (req, res) => {
  try {
    const request = req.body

    const points = req.body.points || false

    if (points && typeof points[0] !== 'string') {
      await db.transport_points.destroy({
        where: {
          transport_id: req.params.id
        }
      })
      points.forEach(el => {
        el.transport_id = req.params.id
      })
      await db.transport_points.bulkCreate(points)
    }

    await db.transport.update(request, {
      where: {
        id: req.params.id,
        user_id: req.userId
      }
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
  } catch (error) {
    res.status(500).send({ error })
  }
};

exports.delete = async (req, res) => {
  try {
    await db.transport.destroy({
      where: {
        id: req.params.id,
        user_id: req.userId
      }
    })
      .then(async data => {
        res.send({ success: data ? true : false });
      })
      .catch(err => {
        res.status(500).send({
          error:
            err.message || "Some error occurred while retrieving Speciality."
        });
      });
  } catch (error) {
    res.status(500).send({ error })
  }
};
