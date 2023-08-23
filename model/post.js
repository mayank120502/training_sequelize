const Sequelize = require('sequelize');
const { sequelize } = require('../util/database.js');
const user = require('./user');
const post = sequelize.define('post', {
    post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    desc: {
        type: Sequelize.STRING(30),
    },
    uploader: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    verification: {
        // 0-> pending , 1-> approved , 2-> false delete
        type: Sequelize.ENUM('0' , '1' , '2'),
        defaultValue: '0',
    }
}, {
    timestamps: true,
});

module.exports = post;