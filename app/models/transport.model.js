module.exports = (sequelize, Sequelize) => {
    const transport = sequelize.define("transport", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      shipment_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      volume: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      fio: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM,
        values: ['created', 'success', 'cancel'],
        defaultValue: 'created',
        allowNull: false
      },
    }, {
      paranoid: true, // Включает soft delete (добавляет поле `deletedAt`)
      timestamps: true // Добавляет `createdAt` и `updatedAt`
    });
  
    return transport;
  };
  