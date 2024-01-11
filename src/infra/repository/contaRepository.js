const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
const { generateConta } = require('../auxiliar/generateAccount');
//const { sequelize, LogCliente } = require('../../settings');
const { calculaAniversario } = require('../auxiliar/calculaAniversario');
const { Op, Sequelize } = require('sequelize');
//const recebeRendimento = require('../auxiliar/recebeRendimento');
const enviaRendimento = require('../auxiliar/enviaRendimento');
const { taxaOperacao } = require('../auxiliar/getTaxa');
const recebeRendimento = require('../auxiliar/recebeRendimento');
const { logSave } = require('../../middlewares/logCliente');
const connection = require('../../database');


dotenv.config();



class ContaHC{
  constructor(conta,hasConta,rendimento){
    this.conta = conta
    this.hasConta = hasConta
    this.rendimento = rendimento

  }

  async getAllContas(req, resp){
    try {
      const contas = await this.conta.findAll();
      resp.status(200).json(contas);
    } catch (error) {
      // Lidar com erros de consulta, se houver
      console.error(error);
      resp.status(500).json({ error: 'Erro ao buscar Contas.' });
    }
  }
  async getContasBy(req, resp){
    try {
      const {tipo,valor} = req.body
      const contas = await this.conta.findAll({where:{[tipo]:valor}})
      resp.status(200).json(contas);
    } catch (error) {
      // Lidar com erros de consulta, se houver
      console.error(error);
      resp.status(500).json({ error: 'Erro ao buscar contas.' });
    }
  }

  async getContaById(req, resp) {
    try {
      const {n_contaValue,
        agenciaValue,
        } = req.body;
      const conta = await this.conta.findOne({where:{n_conta:n_contaValue,agencia:agenciaValue}});
      if (conta) {
        resp.status(200).json(conta);
      } else {
        resp.status(404).json({ error: 'Conta não encontrada.' });
      }
    } catch (error) {
      console.error(error);
      resp.status(500).json({ error: 'Erro ao buscar a conta.' });
    }
  }

  async insertConta(req, resp) {
    const transaction = await sequelize.transaction();

    try {
      const 
      {idValue,
      tipoValue,
      senhaValue,
      
      statusValue,
      } = req.body;
      const contaValue = generateConta(idValue)
      console.log(contaValue)
      const newConta  = await this.conta.create({
        n_conta: contaValue,
        tipo: tipoValue,
        status: statusValue,
        agencia: 1,
        senha: bcrypt.hashSync(senhaValue, bcrypt.genSaltSync(10))
      },
      { transaction }
      );


      const newLink = await this.hasConta.create({
        usuario_id :idValue,
        conta_n_conta:contaValue,
        conta_agencia:1 
      },
      { transaction }
      );

      await transaction.commit();
      resp.status(200).json({newConta,newLink});
      
      
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      resp.status(500).json({ error: 'Erro ao buscar o Conta.' });
    }

    
  }

  async updateConta(req, resp) {
    try {
      const id = parseInt(req.params.id);
      const 
      {tipoValue,
      senhaValue,
      saldoValue,
      
      statusValue,
      } = req.body;

      const conta = await this.conta.findByPk(id);
      
      conta.tipo = tipoValue;
      conta.senha = bcrypt.hashSync(senhaValue, bcrypt.genSaltSync(10));
      conta.saldo = saldoValue;
      conta.status = statusValue;
      
      await conta.save()
      
      if (conta) {
        resp.status(200).json(conta);
        await conta.save()
      } else {
        resp.status(404).json({ error: 'conta não encontrada.' });
      }
    } catch (error) {
    
      resp.status(500).json({ error: 'Erro ao buscar conta.' });
    }

  }

  async deposito(req, resp) {
    const { depositoValue,idUser,agenciaValue,contaValue,tipo,categoria} = req.body;

    
    logSave(200,idUser,categoria,contaValue,agenciaValue)
    

    try {
      const conta = await this.conta.findOne({ where: { n_conta: contaValue, agencia: agenciaValue } });
      
  
      if (!conta) {
        return resp.status(404).send(`Conta não encontrada`);
      }
  
      const hoje = new Date();
      
      const updateValue = calculaAniversario(`${hoje.getUTCFullYear()}-` + `${hoje.getUTCMonth() + 1}`.padStart(2, "0") + '-' + `${hoje.getUTCDate()}`.padStart(2, "0"), `${hoje.getUTCFullYear()}-` + `${hoje.getUTCMonth() + 1}`.padStart(2, "0") + '-' + `${hoje.getUTCDate()}`.padStart(2, "0"));
      
      const transaction = await connection.transaction();
      
      try {
        if(tipo == 'poupanca'){
          const rendimento = await this.rendimento.findOne({
            where: {
              [Op.and]: [
                Sequelize.where(Sequelize.fn('DATE', Sequelize.col('Rendimento.update')), '=', updateValue),
                { conta_n_conta: contaValue },
                { conta_agencia: agenciaValue }
              ]
            }
          });
          
          if (rendimento) {
            rendimento.valor = parseFloat(rendimento.valor) + parseFloat(depositoValue);
            
            
            await rendimento.save({ transaction });
          } else {
            
            const newRendimento = await this.rendimento.create({
              valor: depositoValue,
              conta_n_conta: contaValue,
              conta_agencia: agenciaValue,
              update: updateValue
            }, { transaction });
            
          }
      }
        conta.saldo = parseFloat(conta.saldo) + parseFloat(depositoValue);
        await conta.save({ transaction });
        await transaction.commit();
        logSave(210,idUser,categoria,contaValue,agenciaValue,depositoValue)

        //resp.status(200).json(conta);
        return 202
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      resp.status(500).json({ error: 'Erro ao fazer depósito.' });
    }
  }
  


    async  deleteConta(req, resp) {
      try {
        const id = parseInt(req.params.id);
        const conta = await this.conta.findByPk(id);
    
        if (!conta) {
          return resp.status(404).send(`Conta with ID: ${id} not found`);
        }
    
        await conta.destroy();
    
        resp.status(200).send(`User deleted with ID: ${id}`);
      } catch (error) {
        console.error(error);
        resp.status(500).send('Error deleting account');
      }
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
        const {tipo,valor} = req.body
        const rendimentos = await this.rendimento.findAll({where:{[tipo]:valor}})
  
        
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
        const hoje = new Date()
  
        const updateValue = calculaAniversario(`${hoje.getUTCFullYear()}-`+`${hoje.getUTCMonth()+1}`.padStart(2, "0")+'-'+`${hoje.getUTCDate()}`.padStart(2, "0"),`${hoje.getUTCFullYear()}-`+`${hoje.getUTCMonth()+1}`.padStart(2, "0")+'-'+`${hoje.getUTCDate()}`.padStart(2, "0"))
        
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
          
          rendimentos.valor = parseFloat(rendimentos.valor)+valorValue 
          rendimentos.save()
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
        
        rendimento.valor = valorValue
  
        rendimento.update = updateValue
        
        await rendimento.save()
        
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

    async saque(req, resp) {
      const { valorValue, conta_n_contaValue, conta_agenciaValue,idUser,categoria } = req.body;
      
      logSave(100,idUser,categoria,conta_n_contaValue,conta_agenciaValue)
      try {
        await connection.transaction(async (transaction) => {
          // Chama o método saqueRendimento dentro da transação
          
    
          // Atualiza a conta
          const conta = await this.conta.findOne({
            where: { n_conta: conta_n_contaValue, agencia: conta_agenciaValue },
          });

          let taxa = 0
          if(conta.tipo == 'poupanca'){
            taxa = taxaOperacao("saque-p")
          }
          let rend = []
          if (parseFloat(conta.saldo)+taxa >= parseFloat(valorValue)) {
            conta.saldo = parseFloat(conta.saldo) - parseFloat(valorValue)-taxa;
            await conta.save({ transaction });
            
            if(conta.tipo == 'poupanca'){
              console.log(conta.tipo)
              rend = await this.saqueRendimento(req, resp, transaction);
      
            }
            logSave(110,idUser,categoria,conta_n_contaValue,conta_agenciaValue, parseFloat(valorValue)+taxa)
            console.log("chegaqui")
            
          } else {
            resp.status(500).send('Saldo insuficiente');
          }
        });
        return 202
      } catch (error) {
        resp.status(500).json({ error: 'Erro ao processar a transação.' });
      }
    }
    
    async saqueRendimento(req, resp, transaction) {
      try {
        const { valorValue, conta_n_contaValue, conta_agenciaValue } = req.body;
        
        
        const rendimento = await this.rendimento.findAll({
          where: {
            [Op.and]: [
              { conta_n_conta: conta_n_contaValue },
              { conta_agencia: conta_agenciaValue },
            ],
          },
          order: [['update', 'DESC']],
          transaction, // Passa a transação para a consulta do Sequelize
        });
        
        let currentSum = 0;
        const recordsToDelete = [];
        const valorTotal = parseFloat(valorValue) + taxaOperacao("saque-p")
        if (rendimento && rendimento.length > 0) {
          for (const record of rendimento) {
              currentSum += parseFloat(record.valor); // Substitua 'valor' pelo nome do campo que representa o valor do registro
              if (currentSum > valorTotal) {
                
                record.valor = currentSum - valorTotal
                await record.save({transaction})  
                
                break; // Parar quando atingir ou ultrapassar o valor alvo
              }
              
              recordsToDelete.push(record);
              if(currentSum == valorTotal){
                break
              }
            }
          
             
            await Promise.all(recordsToDelete.map(record => record.destroy({transaction})));
          
            
          return 202
      } else {
        resp.status(404).json({ error: 'registro não encontrado.' });
      }
      } catch (error) {
        resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
      }
    }

    async tranferencia(req, resp){
      const { valorValue, n_contaValueOrigen, agenciaValueOrigen,n_contaValueDestino, agenciaValueDestino ,idUser,categoria} = req.body;
      
      logSave(400,idUser,categoria,n_contaValueOrigen,agenciaValueOrigen)
      if(!valorValue){
        return resp.status(500).send('valor invalido');
      }
      
      try{
        await connection.transaction(async (transaction) => {
          
          const contaOrigem = await this.conta.findOne({
            where: { n_conta: n_contaValueOrigen, agencia: agenciaValueOrigen },
          });
          const contaDestino = await this.conta.findOne({
            where: { n_conta: parseInt(n_contaValueDestino), agencia: parseInt(agenciaValueDestino) },
          });
          
          if (!contaOrigem){
            return resp.status(404).send({error:"Conta de origem não encontrada"})
          }
          
          if (!contaDestino){
            return resp.status(404).send({error:"Conta de destino não encontrada"})
          }

          
          let taxa = 0
          if(contaOrigem.tipo=='poupanca'){
            taxa = taxaOperacao("transferencia-p")
            
          }
          
          
          
          if (parseFloat(valorValue)+taxa>parseFloat(contaOrigem.saldo)){
            return resp.status(404).send({error:"Saldo insuficiente"})
          }
          console.log('teste2')
          if(contaOrigem.tipo=='poupanca'){
            
            await enviaRendimento(parseFloat(valorValue), n_contaValueOrigen, agenciaValueOrigen,transaction)
          }
          console.log('teste3')
          contaOrigem.saldo = parseFloat(contaOrigem.saldo)-parseFloat(valorValue)-taxa
          await contaOrigem.save({transaction})
          console.log('teste4')
          if(contaDestino.tipo=='poupanca'){
            
            await recebeRendimento(parseFloat(valorValue), parseInt(n_contaValueDestino), parseInt(agenciaValueDestino),transaction)
          }
          console.log('teste5')
          contaDestino.saldo = parseFloat(contaDestino.saldo)+parseFloat(valorValue)
          await contaDestino.save({transaction})
          console.log('teste7')
          const idOutro = await this.hasConta.findOne({where:{[Op.and]: [
            { conta_n_conta: parseInt(n_contaValueDestino) },
            { conta_agencia: parseInt(agenciaValueDestino) },
          ],}})
          
          logSave(410,idUser,categoria,n_contaValueOrigen,agenciaValueOrigen, parseFloat(valorValue)+taxa)
          logSave(610,idOutro.usuario_id,categoria,n_contaValueDestino,agenciaValueDestino, parseFloat(valorValue))
          
        })
        
        resp.status(200)
      }
      catch{
        resp.status(500).send('Erro de transferencia');
      }
    }



    async  deleteRendimento(req, resp) {
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
module.exports = {ContaHC}
