const { generateCVC } = require('../auxiliar/generateCVC');
const { generatePam } = require('../auxiliar/generatePam');
const { generateVencimento } = require('../auxiliar/generateVencimento');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class CartaoR{
    constructor(cartao){
        this.cartao = cartao;
    }
  
    async getAllCartao(req, resp){
        try {
            const cartao = await this.cartao.findAll();
            resp.status(200).json(cartao);
        } catch (error) {
        // Lidar com erros de consulta, se houver
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar Contas.' });
        }
    }
    async getCartaoBy(req, resp){
        try {
            const {tipo,valor} = req.body;
            const cartao = await this.cartao.findAll({where:{[tipo]:valor}});
            resp.status(200).json(cartao);
        } catch (error) {
        // Lidar com erros de consulta, se houver
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar contas.' });
        }
    }
  
    async getCartaoById(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const cartao = await this.cartao.findByPk(id);
            if (cartao) {
                resp.status(200).json(cartao);
            } else {
                resp.status(404).json({ error: 'Conta não encontrada.' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar a conta.' });
        }
    }
  
    async insertCartao(req, resp) {
        try {
            const 
                {categoriaValue,
                    tipoValue,
                    senhaValue,
        
                    statusValue,
                    contaValue,
                    agenciaValue,
                    idValue
                } = req.body;
            const pamValue = generatePam(contaValue);
            const cvcValue = generateCVC();
            const vencimentoValue = generateVencimento();
      
        
            const hashed = bcrypt.hashSync(senhaValue, bcrypt.genSaltSync(10));
        
            const newCartao  = await this.cartao.create({
                pam: pamValue,
                tipo: tipoValue,
                categoria: categoriaValue,
                cvc: cvcValue,
                conta_agencia: agenciaValue,
                status: statusValue,
                vencimento: vencimentoValue,
                conta_n_conta: contaValue,
                senha: hashed,
                usuario_id:idValue
            });
  
        
  
            if (!newCartao) {
  
                return resp.status(404).send(`User with ID: ${id} not found`);
            }
  
       
            resp.status(200).json(newCartao);
        
        
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao cadastraro Cartão.' });
        }
  
      
    }
  
    async updateCartao(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const 
                {tipoValue,
                    categoriaValue,
                    senhaValue,
        
                    statusValue,
                } = req.body;
  
            const cartao = await this.cartao.findByPk(id);
        
            cartao.tipo = tipoValue;
            cartao.senha = bcrypt.hashSync(senhaValue, bcrypt.genSaltSync(10));
            cartao.categoria = categoriaValue;
            cartao.status = statusValue;

            await cartao.save();

        
        
            if (cartao) {
                resp.status(200).json(cartao);
            } else {
                resp.status(404).json({ error: 'conta não encontrada.' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar conta.' });
        }
  
    }
  
    async  deleteCartao(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const cartao = await this.cartao.findByPk(id);
    
            if (!cartao) {
                return resp.status(404).send(`Conta with ID: ${id} not found`);
            }
    
            await cartao.destroy();
    
            resp.status(200).send(`User deleted with ID: ${id}`);
        } catch (error) {
            console.error(error);
            resp.status(500).send('Error deleting card');
        }
    }
  
}
  
module.exports = {CartaoR};