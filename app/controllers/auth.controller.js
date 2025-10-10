const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const Op = db.Sequelize.Op;
const config = require("../config/auth.config");
const { sendEmail } = require('../services/sendEmail');
const redisClient = require('../config/redisClient');
require('dotenv').config();
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const user = await db.users.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { phone: req.body.email }
        ]
      }
    })
    if (user) {
      res.status(409).json({ error: 'Такой пользователь уже существует!' });
    } else {
      const user = {
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 8),
      }

      if (req.body.email.includes('@')) {
        user.email = req.body.email
      } else {
        user.phone = req.body.email
      }

      db.users.create(user).then(async datar => {
        if (req.body.referral) {
          const refs = await db.users.findOne({
            where: {
              referral: req.body.referral
            }
          })
          await db.users_referrals.create({
            user_id: datar.id,
            ref_id: refs.id
          })
        }
        await db.users.findOne({
          where: {
            id: datar.id
          },
          attributes: { exclude: ['createdAt', 'updatedAt', 'password'] }
        }).then(async data => {
          const verificationCode = generateVerificationCode();
          await redisClient.set(`sendsms:${req.body.email}`, verificationCode, 'EX', 300);
          await sendEmail(req.body.email, 
            "Подтвердить адрес электронной почты", 
            `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:0;padding:0;width:100%">
            <tbody><tr>
            <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';padding:25px 0;text-align:center">
            <a href="https://akzhol-way.mydev.kz" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';color:#3d4852;font-size:19px;font-weight:bold;text-decoration:none;display:inline-block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://akzhol-way.mydev.kz&amp;source=gmail&amp;ust=1710844166476000&amp;usg=AOvVaw2GEJBj855jkUfZ0OpH-nur">
            Trucking Desk
            </a>
            </td>
            </tr>
            
            
            <tr>
            <td width="100%" cellpadding="0" cellspacing="0" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#edf2f7;border-bottom:1px solid #edf2f7;border-top:1px solid #edf2f7;margin:0;padding:0;width:100%;border:hidden!important">
            <table class="m_483934953961746544inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#ffffff;border-color:#e8e5ef;border-radius:2px;border-width:1px;margin:0 auto;padding:0;width:570px">
            
            <tbody><tr>
            <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';max-width:100vw;padding:32px"><span class="im">
            <h1 style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';color:#3d4852;font-size:18px;font-weight:bold;margin-top:0;text-align:left">Здравствуйте!</h1>
            <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Пожалуйста, введите этот код на сайте для подтверждения вашего адреса электронной почты.</p>
            <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:30px auto;padding:0;text-align:center;width:100%">
            <tbody><tr>
            <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
            <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
            <tbody><tr>
            <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
            <tbody><tr>
            <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
            <p class="m_483934953961746544button" rel="noopener" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';border-radius:4px;color:#fff;display:inline-block;overflow:hidden;text-decoration:none;background-color:#2d3748;border-bottom:8px solid #2d3748;border-left:18px solid #2d3748;border-right:18px solid #2d3748;font-size: 24px;letter-spacing: .6rem;border-top:8px solid #2d3748">${verificationCode}</p>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Если Вы не создавали учетную запись, никаких дополнительных действий не требуется.</p>
            <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">С уважением,<br>
            Trucking Desk</p>
            
            
            </span><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';border-top:1px solid #e8e5ef;margin-top:25px;padding-top:25px">
            <tbody><tr>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            
            <tr>
            <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
            <table class="m_483934953961746544footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:0 auto;padding:0;text-align:center;width:570px">
            <tbody><tr>
            <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';max-width:100vw;padding:32px">
            <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';line-height:1.5em;margin-top:0;color:#b0adc5;font-size:12px;text-align:center">© 2024 Trucking Desk. Все права защищены.</p>
            
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>
            </td>
            </tr>
            </tbody></table>`);
          res.status(200).send({status: true});
        })
      }).catch((err) => {
        res.status(400).send({
          error: "Такой email уже существует!" + err,
        });
      })
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}


exports.check = async (req, res) => {
  try {
    const user = await db.users.findOne({
      where: {
        email: req.body.email
      }
    })
    if (!user) {
      res.status(404).json({ error: 'Такого пользователя не существует!' });
    } else {
      const savedCode = await redisClient.get(`sendsms:${req.body.email}`);
      if (savedCode == req.body.code) {
        await db.users.update({
          email_verified_at: new Date()
        },{
          where: {
            email: req.body.email
          }
        })
        await db.users.findOne({
          where: {
            email: req.body.email
          },
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
          .then(user => {
            if (!user) {
              return res.status(404).send({ error: "Пользователь не существует" });
            }

            const token = jwt.sign({ id: user.id }, config.secret, {});
            
            const objj = user.dataValues
            
            objj.accessToken = token
            delete objj.password
            return res.status(200).send({data: objj});
      
          })
          .catch(err => {
            return res.status(400).send({ error: err.message });
          });
      } else {
        return res.status(404).send("Код не найден!")
      }
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

exports.resend = async (req, res) => {
  try {
    const user = await db.users.findOne({
      where: {
        email: req.body.email
      }
    })
    if (!user) {
      res.status(404).json({ error: 'Такого пользователя не существует!' });
    } else {
      const verificationCode = generateVerificationCode();
      await redisClient.set(`sendsms:${req.body.email}`, verificationCode, 'EX', 300);
      await sendEmail(req.body.email, 
        "Подтвердить адрес электронной почты", 
        `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:0;padding:0;width:100%">
        <tbody><tr>
        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';padding:25px 0;text-align:center">
        <a href="https://akzhol-way.mydev.kz" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';color:#3d4852;font-size:19px;font-weight:bold;text-decoration:none;display:inline-block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://akzhol-way.mydev.kz&amp;source=gmail&amp;ust=1710844166476000&amp;usg=AOvVaw2GEJBj855jkUfZ0OpH-nur">
        Trucking Desk
        </a>
        </td>
        </tr>
        <tr>
        <td width="100%" cellpadding="0" cellspacing="0" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#edf2f7;border-bottom:1px solid #edf2f7;border-top:1px solid #edf2f7;margin:0;padding:0;width:100%;border:hidden!important">
        <table class="m_483934953961746544inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#ffffff;border-color:#e8e5ef;border-radius:2px;border-width:1px;margin:0 auto;padding:0;width:570px">
        
        <tbody><tr>
        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';max-width:100vw;padding:32px"><span class="im">
        <h1 style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';color:#3d4852;font-size:18px;font-weight:bold;margin-top:0;text-align:left">Здравствуйте!</h1>
        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Пожалуйста, введите этот код на сайте для подтверждения вашего адреса электронной почты.</p>
        <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:30px auto;padding:0;text-align:center;width:100%">
        <tbody><tr>
        <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <tbody><tr>
        <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <tbody><tr>
        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <p class="m_483934953961746544button" rel="noopener" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';border-radius:4px;color:#fff;display:inline-block;overflow:hidden;text-decoration:none;background-color:#2d3748;border-bottom:8px solid #2d3748;border-left:18px solid #2d3748;border-right:18px solid #2d3748;font-size: 24px;letter-spacing: .6rem;border-top:8px solid #2d3748">${verificationCode}</p>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Если Вы не создавали учетную запись, никаких дополнительных действий не требуется.</p>
        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">С уважением,<br>
        Trucking Desk</p>
        
        
        </span><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';border-top:1px solid #e8e5ef;margin-top:25px;padding-top:25px">
        <tbody><tr>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        
        <tr>
        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <table class="m_483934953961746544footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:0 auto;padding:0;text-align:center;width:570px">
        <tbody><tr>
        <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';max-width:100vw;padding:32px">
        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';line-height:1.5em;margin-top:0;color:#b0adc5;font-size:12px;text-align:center">© 2024 Trucking Desk. Все права защищены.</p>
        
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>`);
      res.status(200).send({status: true});
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

exports.verifycation = async (req, res) => {
  await db.users.findOne({
    where: {
      id: req.params.id
    }
  }).then(async user => {
    if (!user) {
      return res.status(404).send({ error: "Пользователь не найден" });
    }
    const passwordIsValid = bcrypt.compareSync(
      user.email,
      req.query.hash
    );
    if (passwordIsValid) {
      await db.users.update({
        email_verified_at: new Date()
      },{
        where: {
          id: req.params.id
        }
      }).then(data => {
        res.redirect(process.env.FRONT_URL + `auth`);
      }).catch(err => {
        res.status(400).send({ error: err });
      });
    } else {
      res.status(404).send({ error: "Невалидная ссылка" });
    }
  }).catch(err => {
    res.status(500).send({ error: err });
  });
}

exports.saveRole = async (req, res) => {
  try {
    await db.users.update({
      current_role: req.body.role
    }, {
      where: {
        id: req.userId
      }
    }).then(num => {
      if (num == 1) {
        res.status(200).send({
          status: true
        });
      } else {
        res.status(400).send({
          status: false
        });
      }
    }).catch(err => {
      res.status(500).send({error: err})
    })
  } catch (error) {
    res.status(500).send({error})
  }
}

exports.signin = (req, res) => {
  const chks = {}
  if (req.body.email.includes('@')) {
    chks.email = req.body.email
  } else {
    chks.phone = req.body.email
  }
  db.users.findOne({
    where: chks,
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ error: "Пользователь не существует" });
      }
      
      if (!user.email_verified_at) {
        return res.status(400).send({ status: false, message: "Аккаунт не верифицирован!" });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          error: "Неверные данные пользователя!"
        });
      }
      const token = jwt.sign({ id: user.id }, config.secret, {});
      
      const objj = user.dataValues
      
      objj.accessToken = token
      delete objj.password
      res.status(200).send({data: objj});

      // res.status(200).send({
      //   id: user.id,
      //   name: user.name,
      //   surname: user.surname,
      //   email: user.email,
      //   phone: user.phone,
      //   role: role,
      //   accessToken: token
      // });
    })
    .catch(err => {
      res.status(400).send({ error: err.message });
    });
};

function generateVerificationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

exports.recovery = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.users.findOne({
      where: {
        email: email
      }
    })
    if (user) {
      const verificationCode = generateVerificationCode();
      await redisClient.set(`sendsms:${email}`, verificationCode, 'EX', 300);
      const result = await sendEmail(email, 
        "Восстановление аккаунта", 
        `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:0;padding:0;width:100%">
        <tbody><tr>
        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';padding:25px 0;text-align:center">
        <a href="https://akzhol-way.mydev.kz" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';color:#3d4852;font-size:19px;font-weight:bold;text-decoration:none;display:inline-block" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://akzhol-way.mydev.kz&amp;source=gmail&amp;ust=1710844166476000&amp;usg=AOvVaw2GEJBj855jkUfZ0OpH-nur">
        Trucking Desk
        </a>
        </td>
        </tr>
        
        
        <tr>
        <td width="100%" cellpadding="0" cellspacing="0" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#edf2f7;border-bottom:1px solid #edf2f7;border-top:1px solid #edf2f7;margin:0;padding:0;width:100%;border:hidden!important">
        <table class="m_483934953961746544inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';background-color:#ffffff;border-color:#e8e5ef;border-radius:2px;border-width:1px;margin:0 auto;padding:0;width:570px">
        
        <tbody><tr>
        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';max-width:100vw;padding:32px"><span class="im">
        <h1 style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';color:#3d4852;font-size:18px;font-weight:bold;margin-top:0;text-align:left">Здравствуйте!</h1>
        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Пожалуйста, введите этот код на сайте для восстановление аккаунта.</p>
        <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:30px auto;padding:0;text-align:center;width:100%">
        <tbody><tr>
        <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <tbody><tr>
        <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <tbody><tr>
        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <p class="m_483934953961746544button" rel="noopener" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';border-radius:4px;color:#fff;display:inline-block;overflow:hidden;text-decoration:none;background-color:#2d3748;border-bottom:8px solid #2d3748;border-left:18px solid #2d3748;border-right:18px solid #2d3748;font-size: 24px;letter-spacing: .6rem;border-top:8px solid #2d3748">${verificationCode}</p>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">Если Вы не выполнили такое действие, никаких дополнительных действий не требуется.</p>
        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;line-height:1.5em;margin-top:0;text-align:left">С уважением,<br>
        Trucking Desk</p>
        
        
        </span><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';border-top:1px solid #e8e5ef;margin-top:25px;padding-top:25px">
        <tbody><tr>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        
        <tr>
        <td style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'">
        <table class="m_483934953961746544footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';margin:0 auto;padding:0;text-align:center;width:570px">
        <tbody><tr>
        <td align="center" style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';max-width:100vw;padding:32px">
        <p style="box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';line-height:1.5em;margin-top:0;color:#b0adc5;font-size:12px;text-align:center">© 2024 Trucking Desk. Все права защищены.</p>
        
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>
        </td>
        </tr>
        </tbody></table>`);
        res.status(200).send({status: true})
    } else {
      res.status(404).send({message: "Пользователь не найдена!"})
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

exports.restore = async (req, res) => {
  const request = req.body
  const savedCode = await redisClient.get(`sendsms:${req.body.email}`);
  if (savedCode == req.body.code) {
    await db.users.update({
      password: bcrypt.hashSync(request.password, 8)
    }, {
      where: {
        email: request.email
      }
    }).then(data => {
      res.status(200).send({status: true})
    }).catch(error => {
      res.status(400).send({error})
    })
  } else {
    res.status(400).send({error: "Недействительная ссылка!"})
  }
}

exports.delete = async (req, res) => {
  await db.users.destroy({
    where: {
      id: req.userId
    }
  }).then(data => {
    res.status(200).send({status: true})
  }).catch(err => {
    res.status(500).send({status: false})
  })
};



exports.userhash = async (req, res) => {
  try {
    const users = await db.users.findAll();
    
    const updatePromises = users.map(async (user) => {
      const referralCode = generateReferralCode();
      await db.users.update(
        { referral: referralCode },
        { where: { id: user.id } }
      );
    });
    
    await Promise.all(updatePromises);

    res.status(200).send({ status: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Ошибка обновления пользователей" });
  }
};

function generateReferralCode() {
  return crypto.randomBytes(5).toString('hex'); // 10 символов (каждый байт - 2 символа в hex)
}

exports.logout = (req, res) => {
  const authHeader = req.headers["authorization"];
  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: 'You have been Logged Out' });
    } else {
      res.send({ msg: 'Error' });
    }
  });
};