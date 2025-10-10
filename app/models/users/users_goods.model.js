module.exports = (sequelize, Sequelize) => {
  const users_goods = sequelize.define("users_goods", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    good_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  });

  return users_goods;
};
