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
    const query = `select m.codigo,m.nombre from menu m where m.habilitado = 1 and m.idnegocio =${codigo}
                    and (select count(p.codigo) from productos p where p.idMenu = m.Codigo) > 0`
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

router.post('/guardarPedido', (req,res) => {
    let codigo = ""
    mysql.query("select ifnull(max(codigo),0) + 1 as proximo from pedido_enc", (err,rows) => {
        if(err){
            console.log(err.message)
            res.json(err.message)
            return
        }
        codigo = rows[0].proximo        
        const {idusuario,idnegocio,valor,direccion,metodopago} = req.body
        res.json(idusuario,idnegocio)
        /*mysql.query(`insert into pedido_enc(codigo,idusuario,idnegocio,valor,direccion,metodopago,fechaing)
        values(?,?,?,?,?,?,NOW())`,[codigo,idusuario,idnegocio,valor,direccion,metodopago],(err,rows) => {
            if(err){
                console.log(err.message)
                return
            }
            res.json(codigo)
        })*/
    })
})

router.post('/guardarPedidoDet' ,(req,res) => {
    const {idpedido,idproducto,valor,cantidad} = req.body
    mysql.query(`insert into pedido_det (idpedidoenc,idproducto,valor,cantidad)
    values(?,?,?,?)`, [idpedido,idproducto,valor,cantidad] , (err,rows) => {
        if(err){
            console.log(err.message)
            return
        }
        res.json(true)
    })
})
module.exports = router;