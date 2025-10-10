const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const AdminJSSequelize = require('@adminjs/sequelize')
const adminOptions = require("./app/admin");
const bcrypt = require("bcryptjs");
const moment = require('moment-timezone');
require('dotenv').config();

const DEFAULT_ADMIN = {
  email: 'admin@gmail.com',
  password: 'admin',
}
const PORT = process.env.PORT;
const db = require("./app/models");
const Op = db.Sequelize.Op;

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
})

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const start = async () => {
  moment.tz.setDefault('Asia/Almaty');
  const app = express();
  app.use('/', express.static(path.join(__dirname, "/public")));
  app.use('/upload', express.static(path.join(__dirname, "/upload")));
  app.use(cors());

  const destroyWeek = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 10);
    console.log('sevenDaysAgo', sevenDaysAgo);

    try {
      await db.goods.destroy({
        where: {
          createdAt: {
            [Op.lte]: sevenDaysAgo
          }
        }
      });

      await db.transport.destroy({
        where: {
          createdAt: {
            [Op.lte]: sevenDaysAgo
          }
        }
      });
    } catch (err) {
      console.error('Failed to cleanup old records', err);
    }
  }

  cron.schedule('0 9,15,21 * * *', async () => {
    await destroyWeek()
  });

  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      // store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  )

  app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  require("./app/routes")(app);
  app.use(admin.options.rootPath, adminRouter)
  admin.watch()

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  // await db.users.sync({alter: true})
  try {
    await db.sequelize.sync();
    console.log("Synced db.");
    await destroyWeek();
  } catch (err) {
    console.log("Failed to sync db:", err.message);
  }

  // simple route
  app.get("/", (req, res) => {
    res.redirect("/");
  });

  app.listen(PORT, () => {
    console.log(`new back is started: http://localhost:${PORT}`);
  });
}

start()
