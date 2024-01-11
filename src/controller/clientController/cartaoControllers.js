const { CartaoR } = require('../../infra/repository/cartaoRepository.js');
const {Cartao} = require('../../infra/settings.js');

const getCartaoBy = (req, resp) => {
    const cartaoRepository = new CartaoR(Cartao);
    cartaoRepository.getCartaoBy(req, resp);
    console.log(resp);
};

const getAllCartao = (req, resp) => {
    const cartaoRepository = new CartaoR(Cartao);
    cartaoRepository.getAllCartao(req, resp);
    
};
  
const createCartao = (req, resp) => {
    const cartaoRepository = new CartaoR(Cartao);
    cartaoRepository.insertCartao(req, resp);
    
};


    
module.exports = {
    getCartaoBy,
    getAllCartao,
    createCartao
};