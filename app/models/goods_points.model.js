module.exports = (sequelize, Sequelize) => {
    const goods_points = sequelize.define("goods_points", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      radius_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ['loading', 'unloading'],
        defaultValue: 'loading',
        allowNull: false
      },
      goods_id: {
        type: Sequelize.INTEGER
      },
    });
  
    return goods_points;
  };
  