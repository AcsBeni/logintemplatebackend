const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');


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