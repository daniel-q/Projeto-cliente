function taxaRendimento(tipo){
    return 0.001
}

function taxaOperacao(tipo){
    if (tipo == "saque-p"){
        return 2.95
    }
    if (tipo == "transferencia-p"){
        return 2.45
    }
}


module.exports = {taxaRendimento,taxaOperacao}
