const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { calculaAniversario } = require('../auxiliar/calculaAniversario');
const { Sequelize, Op} = require('sequelize');

dotenv.config();


class RendimentoTable{
    constructor(Rendimento){
        this.rendimento = Rendimento;
    }

    async getAllRendimentos(req, resp){
        try {
            const rendimentos = await this.rendimento.findAll();
            resp.status(200).json(rendimentos);
        } catch (error) {
            // Lidar com erros de consulta, se houver
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar rendimentos.' });
        }
    }
    async getRendimentoBy(req, resp){
        try {
            const {tipo,valor} = req.body;
            const rendimentos = await this.rendimento.findAll({where:{[tipo]:valor}});

      
            resp.status(200).json(rendimentos);
        } catch (error) {
            // Lidar com erros de consulta, se houver
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar rendimentos.' });
        }
    }

    async getRendimentoById(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const rendimento = await this.rendimento.findByPk(id);
            if (rendimento) {
                resp.status(200).json(rendimento);
            } else {
                resp.status(404).json({ error: 'Usuário não encontrado.' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
        }
    }

    async insertRendimento(req, resp) {
        try {
            const 
                {valorValue,
                    conta_n_contaValue,
                    conta_agenciaValue
                } = req.body;
            const hoje = new Date();

            const updateValue = calculaAniversario(`${hoje.getUTCFullYear()}-`+`${hoje.getUTCMonth()+1}`.padStart(2, '0')+'-'+`${hoje.getUTCDate()}`.padStart(2, '0'),`${hoje.getUTCFullYear()}-`+`${hoje.getUTCMonth()+1}`.padStart(2, '0')+'-'+`${hoje.getUTCDate()}`.padStart(2, '0'));
      
            const rendimentos = await this.rendimento.findOne({
                where: {
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('DATE', Sequelize.col('Rendimento.update')), '=', updateValue),
                        { conta_n_conta: conta_n_contaValue },
                        { conta_agencia: conta_agenciaValue }
                    ]
                }
            });
      
            if(rendimentos){
        
                rendimentos.valor = parseFloat(rendimentos.valor)+valorValue; 
                rendimentos.save();
                resp.status(200).json(rendimentos);
            }
            else{
                const newRendimento  = await this.rendimento.create({
                    valor: valorValue,
                    conta_n_conta: conta_n_contaValue,
                    conta_agencia: conta_agenciaValue,
                    update:updateValue
                });

      

                if (!newRendimento) {

                    return resp.status(404).send(`User with ID: ${id} not found`);
                }

      
                resp.status(200).json(newRendimento);}
      
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
        }
    }

    async updateRendimento(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const 
                {valorValue,updateValue} = req.body;

            const rendimento = await this.rendimento.findByPk(id);
      
            rendimento.valor = valorValue;

            rendimento.update = updateValue;
      
            await rendimento.save();
      
            if (rendimento) {
                resp.status(200).json(rendimento);
            } else {
                resp.status(404).json({ error: 'Usuário não encontrado.' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
        }

    }

    async  deleteUser(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const rendimento = await this.rendimento.findByPk(id);
  
            if (!rendimento) {
                return resp.status(404).send(`User with ID: ${id} not found`);
            }
  
            await rendimento.destroy();
  
            resp.status(200).send(`User deleted with ID: ${id}`);
        } catch (error) {
            console.error(error);
            resp.status(500).send('Error deleting user');
        }
    }

}

module.exports = {RendimentoTable};