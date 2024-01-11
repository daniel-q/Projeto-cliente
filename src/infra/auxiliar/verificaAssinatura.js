const crypto = require('crypto');



  
module.exports = {async verificarAssinaturaDigital(req, res, next) {
    const { pan,dataf, assinatura } = req.body;
    console.log(pan)
    console.log(assinatura)
    const dados = {
        pan: pan,
        data: dataf
        
      }
    const hmac = crypto.createHmac('sha256', 'wqrteq21245ys#d'); // chave secreta deve ser definida e conhecida pelo cartão e banco de dados
    const dadosString = JSON.stringify(dados);
    const assinaturaCalculada = hmac.update(dadosString).digest('hex');
    console.log(assinaturaCalculada)
    return assinatura === assinaturaCalculada;
}}