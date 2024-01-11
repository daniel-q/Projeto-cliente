const {Model, DataTypes } = require('sequelize');
  

class Usuario extends Model {
    static init(sequelize) {
        super.init(
            {
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
                        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
                        'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
                        'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
                        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
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
                sequelize,
                tableName: 'usuario',
                timestamps: false,
            }
        );
    }
}


        

class Conta extends Model {
    static init(sequelize) {
        super.init(
            {
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
            }, 
            {
                sequelize,
                tableName: 'conta',
                timestamps: false,
            
            }
        );

    }
}

class Cartao extends Model {
    static init(sequelize) {
        super.init(
            {
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
            },
            {
                sequelize,
                tableName: 'cartao',
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // Defina a relação com a tabela Conta
        Cartao.belongsTo(models.Conta, {
            foreignKey: 'conta_n_conta',
        });

        Cartao.belongsTo(models.Conta, {
            foreignKey: 'conta_agencia',
        });

        // Defina a relação com a tabela Usuario
        Cartao.belongsTo(models.Usuario, {
            foreignKey: 'usuario_id',
        });
    }
}
    

class UsuarioHasConta extends Model {
    static init(sequelize) {
        super.init(
            {
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
            },
            {
                sequelize,
                tableName: 'usuario_has_conta',
                timestamps: false,
            }
        );
    }
}


class Rendimento extends Model {
    static init(sequelize) {
        super.init(
            {
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
            },
            {
                sequelize,
                tableName: 'rendimento',
                timestamps: false,
            }
        );
    }



    static associate(models) {
        // Defina a relação com a tabela Conta
        Rendimento.belongsTo(models.Conta, {
            foreignKey: 'conta_n_conta',
        });

        Rendimento.belongsTo(models.Conta, {
            foreignKey: 'conta_agencia',
        });
    }
}

class Operacoes extends Model {
    static init(sequelize) {
        super.init(
            {
                idoperacoes: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                  },
                  descricao: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                  },
                
            },
            {
                sequelize,
                tableName: 'operacoes',
                timestamps: false,
            }
        );
    }
}

class LogCliente extends Model {
    static init(sequelize) {
        super.init(
            {
                timestamp: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                  },
                  idlog_cliente: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                  },
                  comentario: {
                    type: DataTypes.STRING(45),
                  },
                  usuario_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                  },
                  operacoes_idoperacoes: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                  },
                  valor: {
                    type: DataTypes.DECIMAL(16, 2),
                    allowNull: true,
                  },
                  conta_agencia: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                conta_n_conta: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                
                
            },
            {
                sequelize,
                tableName: 'log_cliente',
                timestamps: false,
            }
        );
    }

    static associate(models) {
        // Defina a relação com a tabela Conta
        LogCliente.belongsTo(models.Conta, {
            foreignKey: 'conta_n_conta',
        });

        LogCliente.belongsTo(models.Conta, {
            foreignKey: 'conta_agencia',
        });
    }


}

Usuario.associate = function(models) {
    // Defina suas associações aqui
    Usuario.hasMany(models.UsuarioHasConta, { foreignKey: 'usuario_id' });
};
  
Conta.associate = function(models) {
    // Defina suas associações aqui
    Conta.hasMany(models.UsuarioHasConta, { foreignKey: { name: 'conta_n_conta', allowNull: false } });
};
  
UsuarioHasConta.associate = function(models) {
    // Defina suas associações aqui
    UsuarioHasConta.belongsTo(models.Usuario, { foreignKey: 'usuario_id' });
    UsuarioHasConta.belongsTo(models.Conta, { foreignKey: { name: 'conta_n_conta', allowNull: false } });
};
  


module.exports = {Usuario,Conta,Cartao,UsuarioHasConta,Rendimento,Operacoes,LogCliente};