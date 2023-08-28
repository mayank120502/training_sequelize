const Sequelize = require('sequelize');
const { sequelize } = require('../util/database.js');
const post = sequelize.define('post', {
  post_id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
    // defaultValue: Sequelize.UUIDV4,
    // defaultValue: Sequelize.DataTypes.UUIDV4
    defaultValue: sequelize.fn('uuid_generate_v4')
  },
  title: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  desc: {
    type: Sequelize.STRING(30)
  },
  uploader: {
    type: Sequelize.STRING(30),
    allowNull: false
  },
  verification: {
    // 0-> unverified post, 1-> verified post (To be done by admin only), 2-> Softdeleted post
    type: Sequelize.ENUM('0', '1', '2'),
    defaultValue: '0'
  },
  image: {
    type: Sequelize.TEXT,
  }
}, {
  timestamps: true
});

module.exports = post;
