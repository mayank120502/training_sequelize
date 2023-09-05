const Sequelize = require('sequelize');
const { sequelize } = require('../util/database.js');
const post = sequelize.define('post', {
  post_id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: sequelize.fn('uuid_generate_v4')
  },
  title: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  desc: {
    type: Sequelize.STRING(30)
  },
  uploader: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  verification: {
    // 0-> disabled post, 1-> verified post (),
    type: Sequelize.ENUM('0', '1', '2'),
    defaultValue: '1'
  },
  image: {
    type: Sequelize.TEXT
  }
}, {
  timestamps: true,
  paranoid: true
  // freezeTableName: true
});

module.exports = post;
