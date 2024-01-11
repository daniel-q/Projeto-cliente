const { Op } = require("sequelize");
const { taxaOperacao } = require("./getTaxa");
const { Rendimento } = require("../../models/client/user");

async function enviaRendimento(valorValue, conta_n_contaValue, conta_agenciaValue, transaction) {
    try {
        
      
      const rendimento = await Rendimento.findAll({
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
      const valorTotal = valorValue + taxaOperacao("transferencia-p")
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

        return rendimento
    } else {
      resp.status(404).json({ error: 'registro não encontrado.' });
    }
    } catch (error) {
      resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
    }
  }

module.exports = enviaRendimento
