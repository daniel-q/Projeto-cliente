const { RendimentoTable } = require('../../infra/repository/rendimentoRepository.js');
const { Rendimento} = require('../../infra/settings.js');

const getRendimentosBy = (req, resp) => {
    const contaRepository = new  RendimentoTable(Rendimento);
    contaRepository.getRendimentoBy(req, resp);
    console.log(resp);
};

const getAllRendimentos = (req, resp) => {
    const contaRepository = new  RendimentoTable(Rendimento);
    contaRepository.getAllRendimentos(req, resp);
    
};
  
const createRendimento = (req, resp) => {
    const userRepository = new  RendimentoTable(Rendimento);
    userRepository.insertRendimento(req, resp);
    
};


    
module.exports = {
      
    getRendimentosBy,
    getAllRendimentos,
    createRendimento
};