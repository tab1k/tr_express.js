module.exports = (sequelize, Sequelize) => {
    const goods = sequelize.define("goods", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      volume: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      transportation_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      transportation_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      character: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shipment_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      note: {
        type: Sequelize.TEXT
      },
      fio: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      type_payment_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sum: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      currency_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
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
  
    return goods;
  };
  