module.exports = (sequelize, Sequelize) => {
  const users_transports = sequelize.define("users_transports", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    transport_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  });

  return users_transports;
};
