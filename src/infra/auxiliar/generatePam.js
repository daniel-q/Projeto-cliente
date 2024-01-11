const { calcularDigitoVerificador } = require('../auxiliar/calculaDigito');

function generatePam(conta){
    const numero = "5771"+conta.toString()
    const digito = calcularDigitoVerificador(numero)
    return parseInt(numero+digito)

}



module.exports = {generatePam}