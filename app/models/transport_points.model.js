module.exports = (sequelize, Sequelize) => {
    const transport_points = sequelize.define("transport_points", {
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
      transport_id: {
        type: Sequelize.INTEGER
      },
    });
  
    return transport_points;
  };
  