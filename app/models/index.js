const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  logging: false,
  operatorsAliases: '0',
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.translates = require("./translates.model.js")(sequelize, Sequelize);

db.country = require("./dicts/country.model.js")(sequelize, Sequelize);
db.city = require("./dicts/city.model.js")(sequelize, Sequelize);
db.currency = require("./dicts/currency.model.js")(sequelize, Sequelize);
db.shipment = require("./dicts/shipment.model.js")(sequelize, Sequelize);
db.type_activity = require("./dicts/type_activity.model.js")(sequelize, Sequelize);
db.radius = require("./dicts/radius.model.js")(sequelize, Sequelize);
db.type_car = require("./dicts/type_car.model.js")(sequelize, Sequelize);
db.type_payment = require("./dicts/type_payment.model.js")(sequelize, Sequelize);

db.goods = require("./goods.model.js")(sequelize, Sequelize);
db.goods_points = require("./goods_points.model.js")(sequelize, Sequelize);
db.goods_cars = require("./goods_cars.model.js")(sequelize, Sequelize);

db.transport = require("./transport.model.js")(sequelize, Sequelize);
db.transport_points = require("./transport_points.model.js")(sequelize, Sequelize);
db.transport_cars = require("./transport_cars.model.js")(sequelize, Sequelize);

db.useful = require("./useful.model.js")(sequelize, Sequelize);

db.users = require("./users/users.model.js")(sequelize, Sequelize);
db.users_goods = require("./users/users_goods.model.js")(sequelize, Sequelize);
db.users_referrals = require("./users/users_referrals.model.js")(sequelize, Sequelize);
db.users_transports = require("./users/users_transports.model.js")(sequelize, Sequelize);

db.reviews = require("./reviews.model.js")(sequelize, Sequelize);

db.users.hasMany(db.reviews, { foreignKey: "author_id", as: "reviews", onDelete: 'CASCADE' });

db.users_referrals.belongsTo(db.users, { foreignKey: "user_id", as: "user" });
db.users_referrals.belongsTo(db.users, { foreignKey: "ref_id", as: "ref" });

db.users.hasMany(db.users_referrals, { foreignKey: "ref_id", as: "refs", onDelete: 'CASCADE' });

db.reviews.belongsTo(db.goods, { foreignKey: "goods_id", as: "goods", onDelete: 'CASCADE' });
db.reviews.belongsTo(db.transport, { foreignKey: "transport_id", as: "transport", onDelete: 'CASCADE' });
db.reviews.belongsTo(db.users, { foreignKey: "author_id", as: "author", onDelete: 'CASCADE' });
db.reviews.belongsTo(db.users, { foreignKey: "user_id", as: "userid", onDelete: 'CASCADE' });

db.city.belongsTo(db.country, { foreignKey: "country_id", as: "country" });
db.country.hasMany(db.city, { foreignKey: "country_id", as: "cities", onDelete: 'CASCADE' });

db.transport.hasMany(db.transport_points, { foreignKey: "transport_id", as: "points" });

db.transport_points.belongsTo(db.city, { foreignKey: "city_id", as: "city", onDelete: 'CASCADE' });
db.transport_points.belongsTo(db.radius, { foreignKey: "radius_id", as: "radius", onDelete: 'CASCADE' });

db.transport.belongsTo(db.shipment, { foreignKey: "shipment_id", as: "shipment" });
db.transport.belongsTo(db.users, { foreignKey: "user_id", as: "user" });
db.transport.hasMany(db.transport_cars, { foreignKey: "transport_id", as: "type_cars" });
db.transport_cars.belongsTo(db.type_car, { foreignKey: "type_car_id", as: "type_car"});

db.users.hasMany(db.transport, { foreignKey: "user_id", as: "transports", onDelete: 'CASCADE' });

db.users.hasMany(db.users_transports, { foreignKey: "user_id", as: "utransports", onDelete: 'CASCADE' });
db.users.hasMany(db.users_goods, { foreignKey: "user_id", as: "ugoods", onDelete: 'CASCADE' });

db.users_goods.belongsTo(db.goods, { foreignKey: "good_id", as: "good", onDelete: 'CASCADE' });
db.users_transports.belongsTo(db.transport, { foreignKey: "good_id", as: "transports", onDelete: 'CASCADE' });

db.goods.hasMany(db.goods_points, { foreignKey: "goods_id", as: "points" });

db.goods_points.belongsTo(db.city, { foreignKey: "city_id", as: "city", onDelete: 'CASCADE' });
db.goods_points.belongsTo(db.radius, { foreignKey: "radius_id", as: "radius", onDelete: 'CASCADE' });

db.goods.hasMany(db.goods_cars, { foreignKey: "goods_id", as: "type_cars" });
db.goods_cars.belongsTo(db.type_car, { foreignKey: "type_car_id", as: "type_car"});

db.goods.belongsTo(db.shipment, { foreignKey: "shipment_id", as: "shipment" });
db.goods.belongsTo(db.type_payment, { foreignKey: "type_payment_id", as: "type_payment" });
db.goods.belongsTo(db.currency, { foreignKey: "currency_id", as: "currency" });
db.goods.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

db.users.hasMany(db.goods, { foreignKey: "user_id", as: "goods", onDelete: 'CASCADE' });

db.useful.belongsTo(db.translates, { foreignKey: "title", as: "titleAs" });
db.useful.belongsTo(db.translates, { foreignKey: "slug", as: "slugAs" });
db.useful.belongsTo(db.translates, { foreignKey: "content", as: "contentAs" });

module.exports = db;
