const { Op } = require("sequelize");
const { LogCliente } = require("../models/client/user");


async function logSave(codigo,usuario,categoria,conta,agencia,valor = null,mensagem = null){
    console.log(codigo)
    if(categoria == 'cliente'){
        await LogCliente.create({usuario_id:usuario,operacoes_idoperacoes:codigo,valor:valor,comentario:mensagem,conta_n_conta:conta,conta_agencia:agencia})}
}


async function allLog(req, resp){
    const {tipoValue, idValue} = req.body
    if(tipoValue =='cliente'){
        const logCliente = await LogCliente.findAll()
        if(!logCliente){
            resp.send(404).json({error:"logs não encontrados"})
        }
        resp.send(202).json(logCliente)
    }
    else{
        resp.send(404).json({error:"categoria de log não encontrada"})
    }
}

async function allLogUser(req, resp){
    const {tipoValue, idValue} = req.body
    if(tipoValue =='cliente'){
        const logCliente = await LogCliente.findAll({where:{idlog_cliente:idValue}})
        if(!logCliente|| logCliente.length === 0){
            resp.send(404).json({error:"logs não encontrados"})
        }
        resp.send(202).json(logCliente)
    }
    else{
        resp.send(404).json({error:"categoria de log não encontrada"})
    }
}

async function allLogUserTransacoes(req, resp){
    const {tipoValue, idValue} = req.body
    if(tipoValue =='cliente'){
        const logCliente = await LogCliente.findAll(
            {where:
                {idlog_cliente:idValue},
            [Op.or]:[{operacoes_idoperacoes:110},{operacoes_idoperacoes:210},{operacoes_idoperacoes:410},{operacoes_idoperacoes:610}]})
        if(!logCliente|| logCliente.length === 0){
            resp.send(404).json({error:"log não encontrado"})
        }
        resp.send(202).json(logCliente)
    }
    else{
        resp.send(404).json({error:"categoria de log não encontrada"})
    }
}

async function allLogUserTransacoesByDate(req, resp) {
    const { tipoValue, idValue, datainicial, datafinal } = req.body;
  
    if (tipoValue == 'cliente') {
      const logCliente = await LogCliente.findAll({
        where: {
          idlog_cliente: idValue,
          [Op.or]: [{ operacoes_idoperacoes: 110 }, { operacoes_idoperacoes: 210 }, { operacoes_idoperacoes: 410 }],
          timestamp: {
            [Op.between]: [datainicial, datafinal],
          },
        },
      });
  
      if (!logCliente || logCliente.length === 0) {
        resp.status(404).json({ error: "Log não encontrado" });
      } else {
        resp.status(202).json(logCliente);
      }
    } else {
      resp.status(404).json({ error: "Categoria de log não encontrada" });
    }
  }

module.exports = {logSave,allLog ,allLogUser ,allLogUserTransacoes ,allLogUserTransacoesByDate}
