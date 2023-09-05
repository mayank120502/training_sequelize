const Sequelize = require('sequelize');
require('dotenv').config();

const database = process.env.SEQUELIZE_DATABASE;
const username = process.env.SEQUELIZE_USER;
const password = process.env.SEQUELIZE_PASSWORD;
const host = process.env.SEQUELIZE_HOST;
const port = process.env.SEQUELIZE_PORT;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect: 'postgres',
  port,
  logging: false
});

sequelize.authenticate().then(() => {
  console.log('Successful Sequelize.');
}).catch((err) => {
  console.error(err.message);
});

sequelize.sync({
  // force: true,
  alter: false
}).then(() => {
  console.log('DB CREATED');
}).catch((err) => {
  console.log(err);
});
module.exports = { sequelize };
