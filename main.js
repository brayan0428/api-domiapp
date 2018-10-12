const express = require('express');
const app = express();

app.use(express.json());
app.use(require('./routes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT,(err) => {
    if(err){
        console.log(err);
        return;
    }
    console.log('El servidor esta corriendo');
})