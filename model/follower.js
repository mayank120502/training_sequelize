const Sequelize = require('sequelize');
const { sequelize } = require('../util/database.js');
const following = sequelize.define('following', {
  followedTo: {
    type: Sequelize.UUID,
    allowNull: false
  },
  followedBy: {
    type: Sequelize.UUID,
    allowNull: false
  }
}, {
  // timestamps: true,
  freezeTableName: true,
  indexes: [
    { fields: ['followedTo', 'followedBy'] }
  ]
});

module.exports = following;
