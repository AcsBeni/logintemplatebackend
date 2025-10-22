require('dotenv').config();
const logger = require('./logger');

var mysql = require('mysql');


var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: '2025_katicabufe'
    /*
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME*/
});
function query(sql,params=[],callback, req=''){
    const start = Date.now();

    const context = req ? `${req.method} ${req.originalUrl}`: "NO Context"
    const txt = req.method == 'GET' ? 'sent' : "affected";
    pool.query(sql,params,(error, results)=>{
        if(process.env.DEBUG ==1){
            const duration = Date.now() - start
            if(error){
                logger.error(`[DB ERROR] ${error.message}`);
            }else{
                const count= Array.isArray(results)? results.length: results.affectedRows;
                logger.info(`${context} - ${count} rekord(s) ${txt}. |${duration}ms`)
            }
            if(callback) callback(error,results);
        }
        
    });
}

pool.on('acquire', function(connection){
    console.log("Connection %d acquired", connection.threadId)

})
pool.on('connection', function(connection){
    console.log("Connection %d established", connection.threadId)
})

pool.on('enqueue', function(connection){
    console.log("Waiting for available connection slot", connection.threadId)
})
pool.on('release', function(connection){
    console.log("Connection %d released", connection.threadId)
})


module.exports = {query};