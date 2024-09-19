const jsonMessages = require('../assets/jsonMessages/bd');
const saltRounds = 10;
const connect = require('../config/connectMySQL');
var bcrypt = require('bcryptjs');

function read(req, res) {
    //criar e executar a query de leitura na BD
    // const iduser = req.sanitize('id').escape();//colocaras quatrofunções(...)//exportaras funções
    connect.con.query('SELECT * from space where active = 1',
        function (err, rows, fields) {
            if (!err) {
                //verifica os resultados se o número de linhas for 0 devolve dados não encontrados, caso contrário envia os resultados (rows).
                if (rows.length == 0) {
                    res.status(404).send("Data not found");
                } else {
                    res.status(200).send(rows);
                }
            } else console.log('Error while performing Query.', err);
        });
}

function readIDEspaco(req, res) {
    const local = req.sanitize('local').escape();
    const post = {localidade: local};
    const query = connect.con.query ('SELECT id_espaco FROM space where ?', post, function(err, rows, fields){
        console.log(query.sql);
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

function readID(req, res) {
    //criar e executar a query de leitura na BD
    const id_espaco = req.sanitize('id').escape();
    const post = {
        id_espaco: id_espaco
    };
    connect.con.query('SELECT * from space where ?', post,
        function (err, rows, fields) {
            if (!err) {
                //verifica os resultados se o número de linhas for 0 devolve dados não encontrados, caso contrário envia os resultados(rows).
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

function readLocal(req,res){
    const local = req.sanitize('local').escape();
    const post = { localidade: local };
    const query = connect.con.query('SELECT count(*) as result FROM space where ?', post, function(err, rows, fields) {
        console.log(query.sql);
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
    
    
    const localidade = req.sanitize('localidade').escape();
    const morada_espaco = req.sanitize('morada_espaco').escape();
    const coordenadas_gps = req.sanitize('coordenadas_gps').escape();	
   // const receita_monetaria_espaco = req.sanitize('receita_monetaria_espaco').escape();
    //const active = req.sanitize('active').escape();

    req.checkBody("localidade", "Insira apenas texto").matches(/^[a-z ]+$/i);
        req.checkBody('morada_espaco', "Insira apenas texto").matches(/^[a-z ]+$/i);
        //req.checkBody("descricao", "Insira apenas texto").matches(/^[a-z ]+$/i);
    
    const errors = req.validationErrors();
	 
	 if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (localidade != "NULL" && morada_espaco != "NULL" && coordenadas_gps != 'NULL') {
          
		   const post = {
            
            localidade : localidade,
            morada_espaco : morada_espaco,
            coordenadas_gps : coordenadas_gps,
            //active : active,
            
        };
        
        const query = connect.con.query('INSERT INTO space SET ?', post, function (err, rows, fields) {
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

function update(req, res) {
    
    const localidade = req.sanitize('localidade').escape();
    const morada_espaco = req.sanitize('morada_espaco').escape();
    const coordenadas_gps = req.sanitize('coordenadas_gps').escape();
    const id_espaco = req.sanitize('id_espaco').escape();
    const errors = req.validationErrors();
    if (errors) { 
        res.send(errors);
        return;
    }
    else {
        if (localidade != "NULL" && morada_espaco != "NULL" && coordenadas_gps != "NULL" && id_espaco != "NULL") {
            const update = [localidade, morada_espaco,coordenadas_gps, id_espaco];
            const query = connect.con.query('UPDATE space SET localidade = ?, morada_espaco = ?, coordenadas_gps = ? where id_espaco = ?', update, function(err, rows, fields) {
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

function deleteLogico(req, res) {
    const update = [0, req.sanitize('id').escape()];
    const query = connect.con.query('UPDATE space SET active = ? WHERE id_espaco=?', update, function(err, rows, fields) {
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
    readIDEspaco: readIDEspaco,
    readLocal: readLocal,
    save: save,
    update: update,
    deleteLogico: deleteLogico,
    
};