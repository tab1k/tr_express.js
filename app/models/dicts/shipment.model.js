module.exports = (sequelize, Sequelize) => {
    const shipment = sequelize.define("shipment", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ru: {
        type: Sequelize.STRING
      },
      kz: {
        type: Sequelize.STRING
      },
      en: {
        type: Sequelize.STRING
      },
      zh: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.INTEGER
      },
      is_publish: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  
    return shipment;
  };
  