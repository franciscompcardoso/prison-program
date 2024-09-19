const saltRounds = 10;
const connect = require('../config/connectMySQL');
var bcrypt = require('bcryptjs');
const jsonMessages = require('../assets/jsonMessages/bd');

function read(req, res) {
    
    connect.con.query('SELECT * from type_track where active = 1',
        function (err, rows, fields) {
            if (!err) {
    
                if (rows.length == 0) {
                    res.status(404).send("Data not found");
                } else {
                    res.status(200).send(rows);
                }
            } else console.log('Error while performing Query.', err);
        });
}


function readID(req, res) {
  
    const idtype_track = req.sanitize('id').escape();
    const post = {
        idtype_track: idtype_track
    };
    connect.con.query('SELECT * from type_track where ? ', post,
        function (err, rows, fields) {
            if (!err) {
                
                if (rows.length == 0) {
                    res.status(404).send({
                        "msg": "data not found"
                    });
                } else {
                    res.status(200).send(rows);
                }
            } else
                res.status(400).send({
                    "msg": err.code
                });
        }
    );
}

function save(req, res) {
    

    const type = req.sanitize('type').escape();
    req.checkBody('type', "insira apenas texto").matches(/^[a-z ]+$/i);
    const active = req.sanitize('active').escape();
    const errors = req.validationErrors();
	 
	 if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (type!= "NULL" && active!= 0) {
          
		   const post = {
            
           type : type,
           active : active,
           
           
            
        };
        
        const query = connect.con.query('INSERT INTO type_track SET ?', post, function (err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                res.status(200).location(rows.insertId).send({
                    "msg": "inserted with success"
                });
                console.log("Number of records inserted: " + rows.affectedRows);
            } else {
                if (err.code == "ER_DUP_ENTRY") {
                    res.status(409).send({ "msg": err.code });
                    console.log('Error while performing Query.', err);
                } else res.status(400).send({ "msg": err.code });
            }
        });
    };
	}
}


function deleteLogico(req, res) {
    const update = [0, req.sanitize('id').escape()];
    const query = connect.con.query('UPDATE type_track SET active = ? WHERE idtype_track=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDelete.status).send(jsonMessages.db.successDelete);
        }
        else {
            console.log(err);

            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}


module.exports = {
    read: read,
    readID: readID,
    save: save,
    //update: update,
    deleteLogico: deleteLogico
};