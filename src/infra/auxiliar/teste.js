const { default: axios } = require("axios");
const { response } = require("express");
const assinarDigitalmente = require("./geraAssinatura");
const bcrypt =  require("bcryptjs")




/*axios.get('http://localhost:3000/cartao/').then(res => {
    dados = {pam:res.data[0].pam,vencimento:res.data[0].vencimento}
    assinatura = assinarDigitalmente(dados)
    axios.post('http://localhost:3000/login/',assinatura)

}
)

*/
async function fetchAndSendData() {
    try {
        const response = await axios.get('http://localhost:3000/cartao/');
        
        // Manipule os dados da resposta
        dados = { pam: response.data[1].pam, vencimento: response.data[1].vencimento };
        
        // Assine digitalmente os dados
        assinatura = assinarDigitalmente(dados);
        assinatura.senha = '11111'
        console.log(assinatura)
        // Faça a chamada POST de forma assíncrona usando async/await
        await axios.post('http://localhost:3000/login/', assinatura);


        console.log('Assinatura enviada com sucesso!');
    } catch (error) {
        console.error('Erro durante a execução:', error);
    }
}

// Chame a função assíncrona
fetchAndSendData();

