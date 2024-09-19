const jsonMessages = require('../assets/jsonMessages/bd');
const saltRounds = 10;
const connect = require('../config/connectMySQL');
var bcrypt = require('bcryptjs');

function read(req, res) {
    
    connect.con.query('SELECT * from track where active = 1',
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
    const idTrack = req.sanitize('id').escape();
    const post = { idTrack : idTrack };
    connect.con.query('SELECT * FROM track where ?', post, function(err, rows, fields) {
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

/*function save(req, res) {
    const track_name = req.sanitize('track_name').escape();
    const distance = req.sanitize('distance').escape();
    const idTracktype_fk = req.sanitize('idTracktype_fk').escape();	
    const idActivity_fk = req.sanitize('idActivity_fk').escape();
    const idEspacoT_fk = req.sanitize('idEspacoT_fk').escape();
	const capacity = req.sanitize('capacity').escape();
	const active = req.sanitize('active').escape();
     
    const errors = req.validationErrors();
	 
	 if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (track_name != "NULL" && distance != "NULL" && idTracktype_fk != 'NULL' && 
        idActivity_fk != "NULL" && idEspacoT_fk != "NULL" && capacity != 'NULL' && active != 0) {
          
		   const post = {
            
            track_name : track_name,
            distance : distance,
            idTracktype_fk : idTracktype_fk,            
            idActivity_fk : idActivity_fk,
            idEspacoT_fk : idEspacoT_fk,
            capacity : capacity,
            active : active,
        };
        
        const query = connect.con.query('INSERT INTO track SET ?', post, function (err, rows, fields) {
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
}*/
function save(req, res) {
    
    const track_name = req.sanitize('track_name').escape();
    const distance = req.sanitize('distance').escape();
    const idTracktype_fk = req.sanitize('idTracktype_fk').escape();	
    const idActivity_fk = req.sanitize('idActivity_fk').escape();
    const idEspacoT_fk = req.sanitize('idEspacoT_fk').escape();
    const capacity = req.sanitize('capacity').escape();
    
    req.checkBody('track_name', "insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody('distance', "insira apenas numeros").isNumeric();
    req.checkBody('capacity', "insira apenas numeros").isNumeric();

    const errors = req.validationErrors();
    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (track_name != "NULL" && distance != "NULL" && capacity != 'NULL') {
            const post = { 
            track_name : track_name,
            distance : distance,
            
            capacity : capacity,
            };
            
            const query = connect.con.query('INSERT INTO track SET ?', post, function(err, rows, fields) {
                console.log(query.sql);
                if (!err) {
                    console.log(rows.insertId);
                    res.status(jsonMessages.db.successInsert.status).location(rows.insertId).send(jsonMessages.db.successInsert);
                }
                else {
                    console.log(err);
                    res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
                }
            });
        }
        else
            res.status(jsonMessages.db.requiredData.status).send(jsonMessages.db.requiredData);
    }
}

function readAll(req, res) {
    
    connect.con.query('SELECT * FROM track a, type_track b, activity d, space e WHERE a.idTracktype_fk = b.idtype_track AND a.idActivity_fk = d.id_Atividade AND a.idEspacoT_fk = e.id_espaco', 

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

function deleteLogico(req, res) {
    const update = [0, req.sanitize('id').escape()];
    const query = connect.con.query('UPDATE track SET active = ? WHERE idTrack=?', update, function(err, rows, fields) {
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

function update(req, res) {
    const track_name = req.sanitize('track_name').escape();
    const distance = req.sanitize('distance').escape();
    const idTracktype_fk = req.sanitize('idTracktype_fk').escape();	
    const idEspacoT_fk = req.sanitize('idEspacoT_fk').escape();
	const capacity = req.sanitize('capacity').escape();
    const idTrack = req.sanitize('idTrack').escape();
    const errors = req.validationErrors();

    req.checkBody('track_name', "insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody('distance', "insira apenas numeros").isNumeric();
    req.checkBody('capacity', "insira apenas numeros").isNumeric();
 
 if (errors) {
    res.send(errors);
    return;
}
else {
    if  (track_name!= "NULL" && distance != "NULL" && capacity!= 'NULL') {
        const update = [track_name, distance, capacity, idTrack];
        const query = connect.con.query('UPDATE track SET track_name=?, distance=?, capacity=? WHERE idTrack=?', update, function(err, rows, fields) {
            console.log(query.sql);
            if (!err) {
                console.log("Number of records updated: " + rows.affectedRows);
                res.status(200).send({ "msg": "update with success" });
            } else {
                res.status(400).send({ "msg": err.code });
                console.log('Error while performing Query.', err);
            }
        });
    }
    

}
}

module.exports = {
    read: read,
    readID: readID,
    save: save,
    readAll : readAll,
    update: update,
    deleteLogico: deleteLogico,
};