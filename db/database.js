var mysql = require('mysql2');

class Database {

    #conexao;

    get conexao() { return this.#conexao;} 
    set conexao(conexao) { this.#conexao = conexao; }

    constructor() {

        this.#conexao = mysql.createPool({
            host: '144.22.238.97',
            database: 'schema_produtos',
            user: 'glaucojunior',
            password: 'Grau#839355',
        });
        
    }

    ExecutaComando(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results);
            });
        })
    }
    
    ExecutaComandoNonQuery(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results.affectedRows > 0);
            });
        })
    }

    ExecutaComandoLastInserted(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results.insertId);
            });
        })
    }

}

module.exports = Database;