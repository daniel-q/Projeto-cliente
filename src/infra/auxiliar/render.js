const { Sequelize, Op } = require("sequelize");
//const { Rendimento, Conta, sequelize } = require("../../settings");
const { taxaRendimento } = require("./getTaxa");
const { calculaAniversario } = require("./calculaAniversario");
const { Rendimento, Conta } = require("../../models/client/user");
const connection = require("../../database");




async function render() {
    const dia = new Date();
    const update = `${dia.getUTCFullYear()}-` + `${dia.getUTCMonth() + 1}`.padStart(2, "0") + '-' + `${dia.getUTCDate()}`.padStart(2, "0");
  
    try {
      await connection.transaction(async (t) => {
        const rendimento = await Rendimento.findAll({
          where: {
            [Op.and]: [
              Sequelize.where(Sequelize.fn('DATE', Sequelize.col('Rendimento.update')), {
                [Op.lte]: update, // Menor ou igual
              }),
            ],
          },
          transaction: t, // Passando a transação para a consulta SQL
        });
  
        console.log(rendimento);
  
        for (const rend of rendimento) {
          const conta = await Conta.findOne({ where: { n_conta: rend.conta_n_conta, agencia: rend.conta_agencia } });
          const rendimentoCalculado = parseFloat(rend.valor) * taxaRendimento(conta.tipo);
          rend.valor = parseFloat(rend.valor) + rendimentoCalculado;
          conta.saldo = parseFloat(conta.saldo) + rendimentoCalculado;
  
          const rendimentoUpdate = rend.getDataValue('update');
          console.log(calculaAniversario(rendimentoUpdate, rend.criacao));
          rend.setDataValue('update', calculaAniversario(rendimentoUpdate, rend.criacao));
  
          await rend.save({ transaction: t }); // Passando a transação para o salvamento
          await conta.save({ transaction: t }); // Passando a transação para o salvamento
        }
      });
  
      console.log('Transação concluída com sucesso.');
    } catch (error) {
      console.error('Erro na transação:', error);
    }
}


module.exports = render
