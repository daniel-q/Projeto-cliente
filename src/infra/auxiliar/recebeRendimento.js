const { Sequelize, Op } = require("sequelize");
const { Rendimento } = require("../../models/client/user");
const { calculaAniversario } = require("./calculaAniversario");

async function recebeRendimento(valorValue, n_contaValueOrigen, agenciaValueOrigen,transaction){
  console.log("teste")    
  const hoje = new Date();
  const updateValue = calculaAniversario(`${hoje.getUTCFullYear()}-` + `${hoje.getUTCMonth() + 1}`.padStart(2, "0") + '-' + `${hoje.getUTCDate()}`.padStart(2, "0"), `${hoje.getUTCFullYear()}-` + `${hoje.getUTCMonth() + 1}`.padStart(2, "0") + '-' + `${hoje.getUTCDate()}`.padStart(2, "0"));
  
  try{
      
      const rendimento = await Rendimento.findOne({
          where: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('DATE', Sequelize.col('Rendimento.update')), '=', updateValue),
              { conta_n_conta: n_contaValueOrigen },
              { conta_agencia: agenciaValueOrigen }
            ]
          }
        });
        console.log(rendimento)  
        if (rendimento) {
          console.log("teste1")
          rendimento.valor = parseFloat(rendimento.valor) + valorValue;
          await rendimento.save({ transaction });
          console.log("teste3")
          return rendimento
        }else {
          console.log("teste5")            
            const newRendimento = await this.rendimento.create({
              valor: valorValue,
              conta_n_conta: contaValue,
              conta_agencia: agenciaValue,
              update: updateValue
            }, { transaction });
            
            return newRendimento
          }

    }
    catch(err){
        await transaction.rollback();
    }

}


module.exports = recebeRendimento
