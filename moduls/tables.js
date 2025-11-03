const express = require('express');
const router = express.Router();
const {query} = require('../utils/database');
var SHA1 = require("crypto-js/sha1");
const { error } = require('winston');
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

//LOGIN
router.post('/:table/login',(req,res)=>{
    let {email, password} = req.body
    let table = req.params.table

    if(!email || !password){
        return res.status(400).send({error: "Hiányzó adatok!"})
        
    }

    

    query(`SELECT * FROM ${table} WHERE email=? AND password=?` ,[email, SHA1(password).toString()], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
        if(results.length ==0){
            return res.send({error: "Hibás belépési adatok!"})
        }
        res.status(200).json(results)
    },req);
})
//Register
router.post('/:table/registration',(req,res)=>{
    const table = req.params.table
    let {name, email, password, confirm} = req.body;

    if(!email || !password || !name || !confirm){
        return res.status(400).send({error: "Hiányzó adatok!"})
        
    }
    if(password != confirm){
        return res.status(400).send({error: "A két jelszó nem egyezik meg!"})      
    }
    if(!password.match(passwdRegExp)){
        return res.status(400).send({error: "A jelszó nem elég biztonságos!"})      
    }
    //TODO: validációt kell még írni
    query(`SELECT id FROM ${table} WHERE email =? `,[email],(error,results)=>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
        if(results.length !== 0){
            return res.status(400).json({ error: "Már létezik egy felhasználó ezzel az email címmel!" });
           
        }

    },req)
    query(`INSERT INTO ${table} (name, email, password, role) VALUES(?,?,?,'user') ` ,[name,email,SHA1(password).toString()], (error, results) =>{
        if(error) return res.status(500).json({errno: error.errno, msg: "Hiba történt :("}) ;
      
        res.status(200).json(results)
    },req);  
})
//Select records from :table by :field
router.get("/:table/:field/:op/:value", (req, res) => {
    const { table, field, op: opKey, value: rawValue } = req.params;
    const op = getOp(opKey); // your helper function should return a safe operator string
    let value = rawValue;
  
    if (opKey === "lk") {
      value = `%${value}%`;
    }
  
    // ✅ Use placeholders for identifiers
    const sql = `SELECT * FROM ?? WHERE ?? ${op} ?`;
  
    query(sql, [table, field, value], (error, results) => {
      if (error)
        return res.status(500).json({ errno: error.errno, msg: "Hiba történt :(" });
  
      res.status(200).json(results);
    });
  });

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


function getOp(op){
    switch(op){
        case 'eq': {op = '='; break;}
        case 'lt': {op = '<';break;}
        case 'lte':{op = '<=';break;}
        case 'gt': {op = '>';break;}
        case 'gte':{op = '>=';break;}
        case 'not':{op = '<>';break;}
        case 'lk': {op = 'like';break;}
    }
    return op;
}

module.exports = router;

//http:localhost:3000/users
//http:localhost:3000/products
//http:localhost:3000/customers