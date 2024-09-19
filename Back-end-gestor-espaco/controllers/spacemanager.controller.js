const jsonMessagesPath = __dirname + "/../assets/jsonMessages/";
const jsonMessages = require(jsonMessagesPath + "bd");

const connect = require('../config/connectMySQL'); //função de leitura que retorna o resultado no callback

function read(req, res) {
    //ler perfil completo
    const query = connect.con.query('SELECT * FROM  users a, space_manager b WHERE a.tipo = 1 AND a.ative = 1;', function(err, rows, fields) {
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

function readInfo(req, res){
    const id_gestor_espaco = req.sanitize('email').escape();
    const post = {email_gestor: id_gestor_espaco};
    const query = connect.con.query ('SELECT nome_gestor_espaco, morada, nif, telefone, data_nascimento,email_gestor, idEspacoSM_fk FROM space_manager where ?', post, function(err, rows, fields){
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

function readEmail(req, res) {
    //console.log(req.param("email"));
    //criar e executar a query de leitura na BD para um ID específico
    const id_gestor_espaco = req.sanitize('email').escape();
    const post = { email_gestor: id_gestor_espaco };
    const query = connect.con.query('SELECT count(*) as resultado FROM space_manager where ?', post, function(err, rows, fields) {
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
    
    const users_fk = req.sanitize('users_fk').escape();
    const nome_gestor_espaco = req.sanitize('nome_gestor_espaco').escape();
    const data_nascimento = req.sanitize('data_nascimento').escape();
    const morada = req.sanitize('morada').escape();
    const nif = req.sanitize('nif').escape();
    const telefone = req.sanitize('telefone').escape();
    const email_gestor = req.sanitize('email_gestor').escape();
    const idEspacoSM_fk = req.sanitize('idEspacoSM_fk').escape();

    const errors = req.validationErrors();

    req.checkBody("nome_gestor_espaco", "Insira apenas texto").matches(/^[a-z ]+$/i);
    //req.checkBody('data_nascimento', "Data formato errado").isDate();
    req.checkBody('morada', "insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody('nif', "insira apenas numeros").isNumeric();
    req.checkBody('telefone', "insira apenas numeros").isNumeric();
    req.checkBody("email_gestor", "Insira um email válido").isEmail();
    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        if (nome_gestor_espaco != "NULL" && email_gestor != 'NULL' && morada != "NULL" && nif != "NULL" && data_nascimento != "NULL" && telefone != "NULL") {
            const post = { 
                nome_gestor_espaco: nome_gestor_espaco,  
                email_gestor: email_gestor,
                morada: morada,
                nif: nif,
                data_nascimento: data_nascimento,
                telefone: telefone,
                idEspacoSM_fk : idEspacoSM_fk,
                users_fk : users_fk,
            };
            
            const query = connect.con.query('INSERT INTO space_manager SET ?', post, function(err, rows, fields) {
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

function update(req, res) {
    const id_gestor_espaco = req.sanitize('id_gestor_espaco').escape();
    const users_fk = req.sanitize('users_fk').escape();
    const nome_gestor_espaco = req.sanitize('nome_gestor_espaco').escape();
    const data_nascimento = req.sanitize('data_nascimento').escape();
    const morada = req.sanitize('morada').escape();
    const nif = req.sanitize('nif').escape();
    const telefone = req.sanitize('telefone').escape();
    const idEspacoSM_fk = req.sanitize('idEspacoSM_fk').escape();
    const email_gestor = req.sanitize('email_gestor').escape();

    req.checkBody("nome_gestor_espaco", "Insira apenas texto").matches(/^[a-z ]+$/i);
    //req.checkBody('data_nascimento', "Data formato errado").isDate();
    req.checkBody('morada', "insira apenas texto").matches(/^[a-z ]+$/i);
    req.checkBody('nif', "insira apenas numeros").isNumeric();
    req.checkBody('telefone', "insira apenas numeros").isNumeric();
    req.checkBody("email_gestor", "Insira um email válido").isEmail();

    const errors = req.validationErrors();
    
    if (errors) {
        res.send(errors);
        return;
    }
    else {
        
        if(nome_gestor_espaco != "NULL" && morada != "NULL" && nif != "NULL" && data_nascimento != "NULL" && telefone != "NULL" ){
        const update = [nome_gestor_espaco, morada, nif, telefone, data_nascimento, idEspacoSM_fk, users_fk, id_gestor_espaco, email_gestor];
        const query = connect.con.query('UPDATE space_manager SET nome_gestor_espaco=?, morada=?, nif=?, telefone=?, data_nascimento=?, idEspacoSM_fk=?, users_fk=?, email_gestor=? WHERE id_gestor_espaco =?', update, function(err, rows, fields) {
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
/*
//delete lógico
/*
function deleteL(req, res) {
    const update = [0, req.sanitize('id_gestor_espaco').escape()];
    const query = connect.con.query('UPDATE space_manager SET active = 1 WHERE id_gestor_espaco = ?', update, function(err, rows, fields) {
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


delete físico
function deleteF(req, res) {
    const update = req.sanitize('id_gestor_espaco').escape();
    const query = connect.con.query('DELETE FROM space_manager WHERE id_gestor_espaco=?', update, function(err, rows, fields) {
        console.log(query.sql);
        if (!err) {
            res.status(jsonMessages.db.successDeleteU.status).send(jsonMessages.db.successDeleteU);
        }
        else {
            console.log(err);
            res.status(jsonMessages.db.dbError.status).send(jsonMessages.db.dbError);
        }
    });
}
*/
function readAll(req, res) {
    
    connect.con.query('SELECT * FROM  space_manager a, space b, users c WHERE a.idEspacoSM_fk = b.id_espaco AND a.users_fk = c.id AND c.tipo = 1 AND c.ative = 1;',

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




module.exports = {
    read: read,
    readEmail: readEmail,
    readInfo: readInfo,
    save: save,
    update: update,
    //deleteL: deleteL,
    //deleteF: deleteF,
    readAll : readAll,
}