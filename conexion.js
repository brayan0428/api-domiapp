const mysql = require('mysql');

const mysqlConnect = mysql.createConnection ({
    host : 'db4free.net',
    user : 'admin_domiapp',
    password : 'Br4y4n0428',
    database : 'domi_app'
})

mysqlConnect.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Conectado correctamente');
    }
})

module.exports = mysqlConnect;