const express = require('express');
const router = require('./routes');
require('dotenv').config();
const swagger = require('./swagger');
const app = express();
const Port = process.env.PORT;

app.use(express.json());
app.use(router);
app.use(swagger);

app.get('/', (req, res) => {
  return res.send({
    status: 200,
    healthy: true
  });
});

app.listen(Port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Listening to server http://localhost:${Port}.`);
  }
});
