const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true,
      },
      unique: true
    },
    phone: {
      type: Sequelize.STRING,
      unique: true
    },
    iin: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    id_card: {
      type: Sequelize.STRING
    },
    driver_license: {
      type: Sequelize.STRING
    },
    google_id: {
      type: Sequelize.STRING,
      unique: true
    },
    email_verified_at: {
      type: Sequelize.DATE
    },
    driver_verified_at: {
      type: Sequelize.DATE
    },
    password: {
      type: Sequelize.STRING
    },
    referral: {
      type: Sequelize.STRING(10),
      unique: true
    },
    status: {
      type: Sequelize.ENUM,
      values: ['client', 'driver', 'moderate', 'cancel'],
      defaultValue: 'client',
      allowNull: false
    },
  });

  users.beforeCreate((user) => {
    const referralCode = generateReferralCode();
    user.referral = referralCode;
  });

  // Функция для генерации реферального кода из 10 случайных символов
  function generateReferralCode() {
    return crypto.randomBytes(5).toString('hex'); // 10 символов (каждый байт - 2 символа в hex)
  }

  return users;
};
