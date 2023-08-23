const express = require('express');
const router = require('./routes');
const {sequelize} = require('./util/database');
const app = express();
const Port = 3000;

app.use(express.json());
app.use(router);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.listen(Port , (err)=>{
    if(err){
        console.log(err.message);
    }
    else{
        console.log(`Listening to server http://localhost:${Port}.`);
    }
});