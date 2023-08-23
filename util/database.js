const Sequelize = require('sequelize');

const sequelize = new Sequelize('test', 'test', 'test', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
});

sequelize.authenticate().then(() => {
    console.log("Successful Sequelize.");
}).catch((err) => {
    console.error(err.message);
});

sequelize.sync({
    // force: false,
    // force: true,
    // alter: false,
    // alter: true,
}).then(() => {
    console.log('DB CREATED');
}).catch((err) => {
    console.log(err);
})
module.exports = { sequelize };