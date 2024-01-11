const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const User = require('../models/UserMaster');
const { Usuario,Conta,Cartao,UsuarioHasConta,Rendimento,Operacoes,LogCliente } = require('../models/client/user');
const connection = new Sequelize(dbConfig);

User.init(connection);
Usuario.init(connection);
Conta.init(connection);
Cartao.init(connection);
UsuarioHasConta.init(connection);
Rendimento.init(connection);
Operacoes.init(connection);
LogCliente.init(connection);

async function testConnection() {
    try {
      await connection.authenticate();
      console.log('Conexão bem-sucedida.');
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
    }
}

testConnection()

module.exports = connection;

