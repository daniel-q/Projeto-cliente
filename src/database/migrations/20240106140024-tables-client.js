'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('usuario', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            nome: {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            cpf: {
                type: Sequelize.STRING(11),
                allowNull: false,
            },
            estado: {
                type: Sequelize.ENUM(
                    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
                    'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
                    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
                    'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
                ),
                allowNull: false,
            },
            cidade: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            bairro: {
                type: Sequelize.STRING(32),
            },
            rua: {
                type: Sequelize.STRING(32),
            },
            numero: {
                type: Sequelize.STRING(8),
            },
            telefone: {
                type: Sequelize.STRING(16),
            },
            status: {
                type: Sequelize.STRING(32),
            },
            email: {
                type: Sequelize.STRING(16),
            },
            complemento: {
                type: Sequelize.STRING(32),
            },
            criacao: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });

        await queryInterface.createTable('conta', {
            n_conta: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            tipo: {
                type: Sequelize.STRING(16),
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING(16),
            },
            saldo: {
                type: Sequelize.DECIMAL(16, 2),
                allowNull: false,
                defaultValue: 0,
            },
            agencia: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            tentativa: {
                type: Sequelize.INTEGER,
            },
            criacao: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            senha: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
        });

        await queryInterface.createTable('cartao', {
            pam: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            emissao: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            tipo: {
                type: Sequelize.STRING(16),
                allowNull: false,
            },
            categoria: {
                type: Sequelize.STRING(16),
                allowNull: false,
            },
            vencimento: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            senha: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            cvc: {
                type: Sequelize.STRING(32),
                allowNull: false,
            },
            conta_n_conta: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            conta_agencia: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            usuario_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('ativo', 'inativo', 'cancelado'),
                allowNull: false,
                defaultValue: 'ativo',
            },
        });

        await queryInterface.createTable('usuario_has_conta', {
            usuario_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            conta_n_conta: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            conta_agencia: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
        });

        await queryInterface.createTable('rendimento', {
            idrendimento: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            valor: {
                type: Sequelize.DECIMAL(16, 2),
                allowNull: true,
            },
            criacao: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            update: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            conta_n_conta: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            conta_agencia: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('usuario');
        await queryInterface.dropTable('conta');
        await queryInterface.dropTable('cartao');
        await queryInterface.dropTable('usuario_has_conta');
        await queryInterface.dropTable('rendimento');
    }
};
