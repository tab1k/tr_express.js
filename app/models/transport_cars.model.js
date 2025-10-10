module.exports = (sequelize, Sequelize) => {
    const transport_cars = sequelize.define("transport_cars", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type_car_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      transport_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    });
  
    return transport_cars;
  };
  