const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const db = require("../models");
const { fn, col } = require('sequelize');
const Op = db.Sequelize.Op;
const config = require("../config/auth.config");

exports.changePassword = (req, res) => {
  db.users
    .findOne({
      where: {
        id: req.userId,
      },
    })
    .then((user) => {
      if (user.isPassword) {
        var passwordIsValid = bcrypt.compareSync(
          req.body.current_password,
          user.password
        );

        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Неправильный пароль!",
          });
        } else {
          db.users
            .update(
              {
                isPassword: true,
                password: bcrypt.hashSync(req.body.new_password, 8),
              },
              {
                where: {
                  id: req.userId,
                },
              }
            )
            .then((data) => {
              res.status(200).send({
                message: "Пароль успешно изменен!",
              });
            })
            .catch((err) => {
              res.status(500).send({
                error: "Не удалось сменить пароль!",
              });
            });
        }
      } else {
        db.users
          .update(
            {
              isPassword: true,
              password: bcrypt.hashSync(req.body.new_password, 8),
            },
            {
              where: {
                id: req.userId,
              },
            }
          )
          .then((data) => {
            res.status(200).send({
              message: "Пароль успешно изменен!",
            });
          })
          .catch((err) => {
            res.status(500).send({
              error: "Не удалось сменить пароль!",
            });
          });
      }
    });
};



exports.becomeDriver = (req, res) => {
  const request = req.body
  const id_card = req.files['id_card'] ? req.files['id_card'][0] : false;
  const driver_license = req.files['driver_license'] ? req.files['driver_license'][0] : null;

  if (!id_card || id_card.length === 0 || !driver_license || driver_license.length === 0) {
    return res.status(400).send({ message: "Please upload files" });
  }
  request.id_card = `/upload/${id_card.filename}`
  request.driver_license = `/upload/${driver_license.filename}`
  request.status = 'moderate'
  db.users
    .update(request, {
      where: {
        id: req.userId,
      },
    })
    .then((user) => {
      res.status(200).send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({
        error: err,
      });
    });
};

exports.me = (req, res) => {
  const lang = req.query.lang || 'ru'
  db.users
    .findOne({
      include: [
        {
          model: db.reviews,
          as: 'reviews',
          include: [
            {
              model: db.goods,
              as: 'goods',
              include: [{
                model: db.goods_points,
                as: "points",
                include: [
                  {
                    model: db.city,
                    as: "city",
                    attributes: [
                      'id',
                      [Sequelize.col('ru'), "name"]
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
                model: db.goods_cars,
                as: "type_cars",
                attributes: ['type_car_id'],
                include: [
                  {
                    model: db.type_car,
                    as: 'type_car',
                    attributes: [`${lang}`]
                  }
                ]
              },
              {
                model: db.shipment,
                as: "shipment",
                attributes: ['id', [Sequelize.col(`${'ru'}`), "title"]]
              },
              {
                model: db.type_payment,
                as: "type_payment",
                attributes: ['id', [Sequelize.col(`${'ru'}`), "title"]]
              },
              {
                model: db.currency,
                as: "currency",
                attributes: ['id', [Sequelize.col(`${'ru'}`), "title"]]
              }]
            },
            {
              model: db.transport,
              as: 'transport',
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
                        [Sequelize.col(`${'ru'}`), "name"]
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
                  model: db.shipment,
                  as: "shipment",
                  attributes: ['id', [Sequelize.col(`${'ru'}`), "title"]]
                },
                {
                  model: db.transport_cars,
                  as: "type_cars",
                  attributes: ['type_car_id'],
                  include: [
                    {
                      model: db.type_car,
                      as: 'type_car',
                      attributes: [`${lang}`]
                    }
                  ]
                }
              ]
            }
          ]
        }, {
          model: db.users_referrals,
          as: 'refs',
          include: [
            {
              model: db.users,
              as: 'user',
              attributes: ['id', 'name', 'email', 'phone']
            }
          ]
        }
      ],
      where: {
        id: req.userId,
      },
    })
    .then(async (user) => {
      if (!user) return res.status(403).send({error: "Невалидный токен!"})
      const averageRating = await db.reviews.findOne({
        where: {
          user_id: user.id
        },
        attributes: [[fn('AVG', col('rating')), 'averageRating']]
      })
      const objj = user.dataValues
      delete objj.password
      // delete objj.email_verified_at
      delete objj.createdAt
      delete objj.updatedAt
      objj.avg_rating = averageRating ? averageRating?.get('averageRating') : null;
      res.status(200).send(objj);
    })
    .catch((err) => {
      res.status(500).send({
        error: err,
      });
    });
};

exports.edit = (req, res) => {
  let user = {};

  if (req.body?.name) {
    user.name = req.body.name;
  }
  if (req.body?.surname) {
    user.surname = req.body.surname;
  }
  if (req.body?.gender) {
    user.gender = req.body.gender;
  }
  if (req.body?.birthday) {
    user.birthday = req.body.birthday;
  }
  if (req.body?.phone) {
    user.phone = req.body.phone;
  }
  if (req.body?.email) {
    user.email = req.body.email;
  }
  if (req.body?.iin) {
    user.iin = req.body.iin;
  }

  if (req.file?.filename) {
    user.image = "/upload/" + req.file.filename;
  }

  // const id_card = req.files['id_card'] ? req.files['id_card'][0] : false;
  // const driver_license = req.files['driver_license'] ? req.files['driver_license'][0] : null;
  // const image = req.files['image'] ? req.files['image'][0] : null;

  // if (id_card) user.id_card = `/upload/${id_card.filename}`
  // if (driver_license) user.driver_license = `/upload/${driver_license.filename}`
  // if (image) user.image = `/upload/${image.filename}`

  db.users
    .update(user, {
      where: {
        id: req.userId,
      },
    })
    .then((data) => {
      db.users
        .findOne({
          where: {
            id: req.userId,
          },
        })
        .then((user) => {
          const objj = user.dataValues
          delete objj.password
          // delete objj.email_verified_at
          delete objj.createdAt
          delete objj.updatedAt
          res.status(200).send(objj);
        })
        .catch((err) => {
          res.status(500).send({
            error: "Ошибка валидации!",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({ error: err });
    });
};

exports.housingList = async (req, res) => {
  try {
    const lang = req.query.lang || 'ru'

    await db.houses.findAll({
      where: {
        user_id: req.userId
      },
      include: [
        {
          model: db.translates,
          as: 'nameAs',
          attributes: []
        },
        {
          model: db.houses_images,
          as: 'images',
          where: {
            is_main: true
          },
          attributes: ['id', 'image']
        },
      ],
      attributes: [
        "id",
        "slug",
        [Sequelize.col(`nameAs.${lang}`), "name"],
        "status",
        "moderate_date",
        "revision_text",
      ]
    }).then(data => {
      res.status(200).send({
        current: data.filter(el => el.status !== 'deleted'),
        deleted: data.filter(el => el.status === 'deleted')
      })
    }).catch(err => {
      res.status(500).send({ error: err })
    })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.housingBooking = async (req, res) => {
  const lang = req.query.lang || 'ru'

  try {
    await db.houses_booking.findAll({
      where: {
        user_id: req.userId
      },
      include: [
        {
          model: db.houses,
          as: 'house',
          include: ['images']
        }
      ]
    }).then(data => {
      res.status(200).send({ data })
    }).catch(err => {
      res.status(500).send({ error: err })
    })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.housingWorkingBooking = async (req, res) => {
  const lang = req.query.lang || 'ru'

  try {
    await db.houses_booking.findAll({
      include: [
        {
          model: db.houses,
          as: 'house',
          where: {
            user_id: req.userId
          },
          required: true,
          include: ['images']
        }
      ]
    }).then(data => {
      res.status(200).send({ data })
    }).catch(err => {
      res.status(500).send({ error: err })
    })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.reservation = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.reviews = async (req, res) => {
  try {
    const body = req.body
    body.user_id = req.userId
    await db.reviews.create(body).then(data => {
      return res.status(201).send({ status: true })
    }).catch(err => {
      return res.status(400).send({ status: false })
    })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.reviewsMy = async (req, res) => {
  try {
    await db.reviews.findAll({
      where: {
        user_id: req.userId
      }
    }).then(data => {
      return res.status(200).send(data)
    }).catch(error => {
      res.status(500).send({ error })
    })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.reviewsHouse = async (req, res) => {
  try {
    const houses = await db.houses.findAll({
      where: {
        user_id: req.userId
      }
    })
    await db.reviews.findAll({
      where: {
        house_id: houses.map(el => el.id) || []
      }
    }).then(data => {
      return res.status(200).send(data)
    }).catch(error => {
      res.status(500).send({ error })
    })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.messagesReply = async (req, res) => {
  try {
    const oldmessage = await db.messages.findOne({
      where: {
        id: req.params.id
      }
    })
    const data = {
      sender_id: req.userId,
      recipient_id: oldmessage?.dataValues?.sender_id || null,
      text: req.body.text,
      is_moderator: oldmessage?.dataValues?.sender_id ? false : true,
      topic: req.body.topic,
      reply_id: req.params.id
    }
    await db.messages.create(data).then(mess => {
      res.status(200).send({ status: true })
    })
  } catch (error) {
    res.status(500).send({ error })
  }
}


exports.messages = async (req, res) => {
  try {
    await db.messages.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.userId },
          { recipient_id: req.userId }
        ]
      },
      include: [
        {
          model: db.users,
          as: 'sender',
          attributes: ['id', 'surname', 'name', 'phone', 'email']
        },
        {
          model: db.users,
          as: 'recipient',
          attributes: ['id', 'surname', 'name', 'phone', 'email']
        }
      ]
    }).then(mess => {
      res.status(200).send({ data: mess })
    })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.finance = async (req, res) => {
  try {

  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.addGood = async (req, res) => {
  try {
    const request = req.body
    request.user_id = req.userId
    const isGood = await db.users_goods.findOne({
      where: {
        good_id: request.good_id,
        user_id: request.user_id,
      }
    })
    if (!isGood) {
      await db.users_goods.create(request)
    }
    res.status(201).send({ status: true })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.deleteGood = async (req, res) => {
  try {
    const request = {
      good_id: req.params.id,
      user_id: req.userId
    }
    await db.users_goods.destroy({
      where: request
    })
    res.status(200).send({ status: true })
  } catch (error) {
    res.status(500).send({ error })
  }
}


exports.addTransport = async (req, res) => {
  try {
    const request = req.body
    request.user_id = req.userId
    const isTransport = await db.users_transports.findOne({
      where: {
        transport_id: request.transport_id,
        user_id: request.user_id,
      }
    })
    if (!isTransport) {
      await db.users_transports.create(request)
    }
    res.status(201).send({ status: true })
  } catch (error) {
    res.status(500).send({ error })
  }
}

exports.deleteTransport = async (req, res) => {
  try {
    const request = {
      transport_id: req.params.id,
      user_id: req.userId
    }
    await db.users_transports.destroy({
      where: request
    })
    res.status(200).send({ status: true })
  } catch (error) {
    res.status(500).send({ error })
  }
}