const connect = require('../config/connectMySQL');
const jsonMessages = require('../assets/jsonMessages/bd');

function read(req, res) {
    //criar e executar a query de leitura na BD
    connect.con.query('SELECT * from sponsership where active = 1',
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

function readID(req, res) {
    //criar e executar a query de leitura na BD
    const id_sponsership = req.sanitize('id').escape();
    const post = {
        id_sponsership: id_sponsership
    };
    connect.con.query('SELECT * from sponsership where ?', post,
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
};

function readAll(req, res) {
    
    connect.con.query('SELECT * FROM sponser a, sponsership b Where b.sponser_fk = a.id_patrocinador', 

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

function save(req, res) {
    
    
    const preco_patrocinio = req.sanitize('preco_patrocinio').escape();
    const txtNotas = req.sanitize('txtNotas').escape();
    const validade_patrocinio = req.sanitize('validade_patrocinio').escape(); 
    const sponser_fk = req.sanitize('sponser_fk').escape();
    const idEspacoS_fk = req.sanitize('idEspacoS_fk').escape();
           
    const errors = req.validationErrors();
     
     if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (preco_patrocinio != "NULL" && txtNotas != "NULL" && validade_patrocinio!= 'NULL' && sponser_fk != 'NULL' && idEspacoS_fk!= 'NULL') {
          
           const post = {
            
           preco_patrocinio : preco_patrocinio,
           txtNotas : txtNotas,
           validade_patrocinio : validade_patrocinio,
           sponser_fk: sponser_fk,
           idEspacoS_fk : idEspacoS_fk,
           

        };
        
        const query = connect.con.query('INSERT INTO sponsership SET ?', post, function (err, rows, fields) {
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
    const id_sponsership = req.sanitize('id_sponsership').escape();
    const preco_patrocinio = req.sanitize('preco_patrocinio').escape();
    const txtNotas = req.sanitize('txtNotas').escape();
    const validade_patrocinio = req.sanitize('validade_patrocinio').escape(); 
    const sponser_fk = req.sanitize('sponser_fk').escape();
    const idEspacoS_fk = req.sanitize('idEspacoS_fk').escape();

    const errors = req.validationErrors();
 
 if (errors) {
    res.send(errors);
    return;
}
else {
    if (preco_patrocinio != "NULL" && txtNotas != "NULL" && validade_patrocinio!= 'NULL' && sponser_fk != 'NULL') {
        const update = [preco_patrocinio, txtNotas, validade_patrocinio, sponser_fk, idEspacoS_fk, id_sponsership];
        const query = connect.con.query('UPDATE sponsership SET preco_patrocinio=?, txtNotas=?, validade_patrocinio=?, sponser_fk=?, idEspacoS_fk=? WHERE id_sponsership=?', update, function(err, rows, fields) {
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
    const query = connect.con.query('UPDATE sponsership SET active = ? WHERE id_sponsership=?', update, function(err, rows, fields) {
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
    update: update,
    deleteLogico: deleteLogico,
    readAll: readAll,
};