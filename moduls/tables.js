const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');
var SHA1 = require("crypto-js/sha1");

//LOGIN
router.post('/:table/login',(req,res)=>{
    let {email, password} = req.body
    let table = req.params.table
    //TODO: validáció kell
    query(`SELECT * FROM ${table} WHERE email=? AND password=?` ,[email, SHA1(password).toString()], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})
//Register
router.post('/:table/registration',(req,res)=>{
    const table = req.params.table
    let {name, email, password, confirm} = req.body;

    //TODO: validációt kell még írni
    query(`INSERT INTO ${table} (name, email, password) VALUES(?,?,?) ` ,[name,email,SHA1(password).toString()], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);  
})

//Select All records from table
router.get("/:table", (req, res)=>{
    const table = req.params.table
    query(`SELECT * FROM ${table}` ,[], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})

//Select one records from table
router.get("/:table/:id", (req, res)=>{
    const table = req.params.table
    const id = req.params.id
    query(`SELECT * FROM ${table} WHERE id=?` ,[id], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})
//Add new record to :table
router.post("/:table", (req, res)=>{
    const table = req.params.table
    let fields = Object.keys(req.body).join(',');
    let values="'"+ Object.values(req.body).join("' ,'") + "'";
    
    query(`INSERT INTO ${table} (${fields}) VALUES(${values}) ` ,[], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);  
    
})
//Update records in :table by :id
router.patch('/:table/:id',(req,res)=>{
    const table = req.params.table
    let id = req.params.id
    let fields = Object.keys(req.body);
    let values =Object.values(req.body)

    let updates=[]
    for(let i=0; i<fields.length; i++){
        updates.push(`${fields[i]}='${values[i]}'`)
    }
    let str = updates.join(',')

    query(`UPDATE ${table} SET ${str} WHERE id=?` ,[id], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);  
})



//delete by id
router.get("/:table/:id", (req, res)=>{
    const table = req.params.table
    const id = req.params.id
    query(`DELETE * FROM ${table} WHERE id=?` ,[id], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);
})



module.exports = router;

//http:localhost:3000/users
//http:localhost:3000/products
//http:localhost:3000/customers