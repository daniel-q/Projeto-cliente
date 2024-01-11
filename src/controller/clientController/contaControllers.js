const { ContaHC } = require('../../infra/repository/contaRepository.js');
const {Conta,UsuarioHasConta,Rendimento} = require('../../infra/settings.js');

const getContasBy = (req, resp) => {
    const contaRepository = new ContaHC(Conta,UsuarioHasConta,Rendimento);
    contaRepository.getContasBy(req, resp);
    console.log(resp);
};

const getAllContas = (req, resp) => {
    const contaRepository = new ContaHC(Conta,UsuarioHasConta,Rendimento);
    contaRepository.getAllContas(req, resp);
    
};
  
const createConta = (req, resp) => {
    const userRepository = new ContaHC(Conta,UsuarioHasConta,Rendimento);
    userRepository.insertConta(req, resp);
    
};

const saque = async (req, resp) =>  {
    req.body.teste = "req.body.teste"
    req.body.idUser = req.session.userId
    req.body.conta_agenciaValue = req.session.agencia
    req.body.conta_n_contaValue=req.session.conta 
    req.body.tipo = req.session.tipo
    req.body.categoria = req.session.categoria

    
    const contaRepository = new  ContaHC(Conta,UsuarioHasConta,Rendimento)
    const code = await contaRepository.saque(req, resp)
    console.log(code)
    if(code==202){
        console.log("cheg aqui")
        resp.render('Client/home.ejs')
    }
    
}

const deposito = async (req, resp) => {
    
    req.body.idUser = req.session.userId
    req.body.agenciaValue = req.session.agencia
    req.body.contaValue=req.session.conta 
    req.body.tipo = req.session.tipo
    req.body.categoria = req.session.categoria
    const contaRepository = new  ContaHC(Conta,UsuarioHasConta,Rendimento)
    const codigo = await contaRepository.deposito(req, resp)
    if(codigo==202){
    resp.render('Client/home.ejs')}
}
const transferencia = async (req, resp) => {
    
    req.body.idUser = req.session.userId
    req.body.tipo = req.session.tipo
    req.body.categoria = req.session.categoria
    req.body.n_contaValueOrigen = req.session.conta 
    req.body.agenciaValueOrigen = req.session.agencia
    
    const contaRepository = new  ContaHC(Conta,UsuarioHasConta,Rendimento)
    await contaRepository.tranferencia(req, resp)
    let alerta
    if(resp.statusCode ==200){
    alerta = 'Transferencia bem sucedida'
    }

    resp.render('Client/home.ejs',{alerta})

}
    
module.exports = {
      
    getContasBy,
    getAllContas,
    createConta,
    deposito,
    saque,
    transferencia
};