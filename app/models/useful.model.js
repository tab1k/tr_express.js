module.exports = (sequelize, Sequelize) => {
    const useful = sequelize.define("useful", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.INTEGER
      },
      slug: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.INTEGER
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
  
    return useful;
  };
  