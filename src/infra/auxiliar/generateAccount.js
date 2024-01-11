const { calcularDigitoVerificador } = require('../auxiliar/calculaDigito');

function generateConta(id){
    const stringId= id.toString().padStart(4, "0")
    const randomComponent = Math.floor( Math.random() * 10 ).toString().padStart(2, "0")
    const numero = "127"+stringId+randomComponent
    digito = calcularDigitoVerificador(numero)
    
    return parseInt(numero+digito)

    
}



module.exports = {generateConta}