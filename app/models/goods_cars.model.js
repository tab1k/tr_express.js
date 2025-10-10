module.exports = (sequelize, Sequelize) => {
    const goods_cars = sequelize.define("goods_cars", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type_car_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      goods_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    });
  
    return goods_cars;
  };
  