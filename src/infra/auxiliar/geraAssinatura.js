const crypto = require('crypto');

function assinarDigitalmente(dados) {
    const hmac = crypto.createHmac('sha256', 'wqrteq21245ys#d');
    const dadosString = JSON.stringify(dados);
    const assinatura = hmac.update(dadosString).digest('hex');
  
    return {
      dados: dados,
      assinatura: assinatura
    };
  }

module.exports =  assinarDigitalmente