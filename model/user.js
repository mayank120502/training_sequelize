const Sequelize = require('sequelize');
const { sequelize } = require('../util/database.js');

const user = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(30),
    defaultValue: 'Person'
  },
  email: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true
  },
  phone: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING(61),
    allowNull: false
  },
  type: {
    // 0-> User , 1-> Admin
    type: Sequelize.ENUM('0', '1'),
    defaultValue: '0'
  },
  token: {
    type: Sequelize.STRING
  },
  status: {
    // 0-> pending , 1-> verified , 2-> inactive , (SOFT DELETE is ON)
    type: Sequelize.ENUM('0', '1', '2'),
    defaultValue: '0'

  }
}, {
  timestamps: true,
  paranoid: true
});

module.exports = user;
