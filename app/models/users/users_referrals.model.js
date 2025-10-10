module.exports = (sequelize, Sequelize) => {
  const users_referrals = sequelize.define("users_referrals", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    ref_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
  });

  return users_referrals;
};
