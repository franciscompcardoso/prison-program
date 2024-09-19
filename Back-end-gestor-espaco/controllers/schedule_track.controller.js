const saltRounds = 10;
const connect = require('../config/connectMySQL');
var bcrypt = require('bcryptjs');
const jsonMessages = require('../assets/jsonMessages/bd');

function read(req, res) {
    
    connect.con.query('SELECT * from schedule_track where active = 1',
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


function readID (req, res) {
    const idschedule_track = req.sanitize('id').escape();
    const post = { idschedule_track : idschedule_track };
    connect.con.query('SELECT * FROM schedule_track where ?', post, function(err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
        else {
            if (rows.length == 0) {
                res.status(jsonMessages.db.noRecords.status).send(jsonMessages.db.noRecords);
            }
            else {
                res.send(rows);
            }
        }
    });
}


function save(req, res) {
    

    const day = req.sanitize('day').escape();
    const initial_time = req.sanitize('initial_time').escape();
    const final_time = req.sanitize('final_time').escape();
    const track_fk = req.sanitize('track_fk').escape();
    const active = req.sanitize('active').escape();
    const errors = req.validationErrors();

    
	 
	 if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (day!= "NULL" && initial_time != "NULL" && final_time != 'NULL' && track_fk != "NULL" && active != 0) {
          
		   const post = {
            
           day : day,
           initial_time : initial_time,
           final_time : final_time,
           track_fk : track_fk,
           active : active,
            
        };
        
        const query = connect.con.query('INSERT INTO schedule_track SET ?', post, function (err, rows, fields) {
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
    const query = connect.con.query('UPDATE schedule_track SET active = ? WHERE idschedule_track=?', update, function(err, rows, fields) {
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