module.exports = (sequelize, Sequelize) => {
  const Translates = sequelize.define("translates", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique:true
    },
    kz: {
      type: Sequelize.TEXT('long')
    },
    en: {
      type: Sequelize.TEXT('long')
    },
    ru: {
      type: Sequelize.TEXT('long')
    },
    zh: {
      type: Sequelize.TEXT('long')
    }
  });

  return Translates;
};