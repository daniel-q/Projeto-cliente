const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.MYSQL_HOST, // A porta do MySQL, se não for a padrão (3306)
    database: 'banco',
    username: 'root',
    password: '',
});

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    cpf: {
        type: DataTypes.STRING(11),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM(
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ),
        allowNull: false,
    },
    cidade: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    bairro: {
        type: DataTypes.STRING(32),
    },
    rua: {
        type: DataTypes.STRING(32),
    },
    numero: {
        type: DataTypes.STRING(8),
    },
    telefone: {
        type: DataTypes.STRING(16),
    },
    status: {
        type: DataTypes.STRING(32),
    },
    email: {
        type: DataTypes.STRING(16),
    },
    complemento: {
        type: DataTypes.STRING(32),
    },
    criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'usuario',
    timestamps: false,
});

const Conta = sequelize.define('Conta', {
    n_conta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    tipo: {
        type: DataTypes.STRING(16),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(16),
    },
    saldo: {
        type: DataTypes.DECIMAL(16, 2),
        allowNull: false,
        defaultValue: 0,
    },
    agencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    tentativa: {
        type: DataTypes.INTEGER,
    },
    criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    senha: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
}, {
    tableName: 'conta',
    timestamps: false,
  
});

const Cartao = sequelize.define('Cartao', {
    pam: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    emissao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    tipo: {
        type: DataTypes.STRING(16),
        allowNull: false,
    },
    categoria: {
        type: DataTypes.STRING(16),
        allowNull: false,
    },
    vencimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    senha: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    cvc: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    conta_n_conta: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    conta_agencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    usuario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo', 'cancelado'),
        allowNull: false,
        defaultValue: 'ativo',
    },
}, {
    tableName: 'cartao',
    timestamps: false,
});

const UsuarioHasConta = sequelize.define('UsuarioHasConta', {
    usuario_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
    },
    conta_n_conta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    conta_agencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
}, {
    tableName: 'usuario_has_conta',
    timestamps: false,
});

const Rendimento = sequelize.define('Rendimento', {
    idrendimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    valor: {
        type: DataTypes.DECIMAL(16, 2),
        allowNull: true,
    },
    criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    update: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    conta_n_conta: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    conta_agencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'rendimento',
    timestamps: false, // Desativa a criação automática de campos "createdAt" e "updatedAt"
});

// Defina a relação com a tabela Conta
Rendimento.belongsTo(Conta, {
    foreignKey: {
        name: 'conta_n_conta',
    
    },
});

Rendimento.belongsTo(Conta, {
    foreignKey: {
        name: 'conta_agencia',
    },
});

// No modelo Usuario
Usuario.hasMany(UsuarioHasConta, { foreignKey: 'usuario_id' });

// No modelo UsuarioHasConta
UsuarioHasConta.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// No modelo Conta
Conta.hasMany(UsuarioHasConta, { foreignKey: { name: 'conta_n_conta', allowNull: false } });

// No modelo UsuarioHasConta
UsuarioHasConta.belongsTo(Conta, { foreignKey: { name: 'conta_n_conta', allowNull: false } });


module.exports = {Usuario,Conta,Cartao,UsuarioHasConta,Rendimento};

