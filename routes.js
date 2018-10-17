const express = require('express');
const router = express.Router();
const mysql = require('./conexion');
const crypto = require('crypto');

router.get("",(req,res) => {
    res.send('<h1>Api Restful DomiApp<h1>')
});

//Consultar todos los negocios
router.get("/negocios", (req,res) => {
    const query = `
        select n.codigo,n.nombre,n.logo,c.nombre as nombre_categoria,n.tiempoentrega,n.costoenvio from negocios n
        inner join mtcategoria c on c.Codigo = n.idcategoria
        where n.habilitado = 1
    `
    mysql.query(query,(err,rows) => {
        if(err){
            console.log(err,message)
            return
        }
        res.json(rows)
    })
})

//Consultar usuarios
router.post('/usuarios', (req,res) => {
    let {email,clave} = req.body
    let newClave = crypto.createHash('md5').update(clave).digest('hex');
    mysql.query(`select id,email from usuarios where email = ? and clave = ?`,[email,newClave], (err,rows) => {
        if(err){
            console.log(err.message)
            return
        }
        res.json(rows)
    })
})

//Consultar los menus de un negocio
router.get('/menu/:codigo', (req,res) => {
    const codigo = req.params.codigo
    const query = `select codigo,nombre from menu where habilitado = 1 and idnegocio =${codigo}`
    mysql.query(query , (err,rows) => {
        if(err){
            console.log(err.message)
            return
        }
        res.json(rows)
    })
})

//Consultar producto por codigo
router.get('/productos/:codigo', (req,res) => {
    const codigo = req.params.codigo
    const query = `select p.codigo,p.imagen,p.nombre,p.descripcion,p.precio from productos p where p.idMenu=${codigo}`
    mysql.query(query , (err,rows) => {
        if(err){
            console.log(err.message)
            return
        }
        res.json(rows)
    })
})

module.exports = router;