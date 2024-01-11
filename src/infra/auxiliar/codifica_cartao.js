const crypto = require('crypto');

function assinarDigitalmente(dados) {
    const hmac = crypto.createHmac('sha256', chaveSecreta); // chave secreta deve ser definida e conhecida pelo cartão e banco de dados
    const dadosString = JSON.stringify(dados);
    const assinatura = hmac.update(dadosString).digest('hex');
  
    return {
      dados: dados,
      assinatura: assinatura
    };
  }

module.exports = {assinarDigitalmente}