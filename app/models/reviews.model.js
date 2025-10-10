module.exports = (sequelize, Sequelize) => {
    const reviews = sequelize.define("reviews", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      author_id: {
        type: Sequelize.INTEGER
      },
      goods_id: {
        type: Sequelize.INTEGER
      },
      transport_id: {
        type: Sequelize.INTEGER
      },
      rating: {
        type: Sequelize.FLOAT
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.TEXT
      },
      is_publish: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  
    return reviews;
  };
  