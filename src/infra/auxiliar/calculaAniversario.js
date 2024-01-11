function calculaAniversario(Atual,Original){
    const atual = new Date(Atual)
    const original = new Date(Original)
    try{
        if(!isNaN(atual) && !isNaN(original)){
            console.log('entrou')
            let m = atual.getUTCMonth()+2
            let a = atual.getUTCFullYear()
            let d = original.getUTCDate()
            
                if(m>12){
                    m = 1
                    a +=1
                }
                let data = `${a}-`+`${m}`.padStart(2, "0")+'-'+`${d}`.padStart(2, "0")
                while(((new Date(data).getUTCMonth())==m)){
                    d -=1
                    data = `${a}-`+`${m}`.padStart(2, "0")+'-'+`${d}`.padStart(2, "0")
                }
                return data
    }
    else{
        return 'data invalida'
    }
}catch(err){
    return console.log(err)
}
}

module.exports = {calculaAniversario}