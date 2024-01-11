const { Conta, Cartao } = require('../infra/settings');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {verificarAssinaturaDigital} = require('../infra/auxiliar/verificaAssinatura');
const bcrypt =  require('bcryptjs');
dotenv.config();


module.exports = {async auth(req, resp, next){
    
    try {
        
        const { pan,dataf, senha } = req.body;
        let vencimento = new Date(dataf).getTime();
        
        
        if(verificarAssinaturaDigital(req, resp, next) && vencimento>Date.now()){
            
            const cartao = await Cartao.findByPk(pan);
            if (cartao) {
                if(cartao.status == 'ativo'){
                    const conta = await Conta.findOne({where:{n_conta:cartao.conta_n_conta,agencia:cartao.conta_agencia}});
                    console.log(conta);
                    if(3>conta.tentativa){
                        if(bcrypt.compareSync(senha, cartao.senha)){
                            
                            const token = jwt.sign({ sub: cartao.usuario_id,ag:cartao.conta_agencia,ct:cartao.conta_n_conta}, process.env.SECRET_KEY, {
                                expiresIn: '1h' // Defina a expiração do token como apropriado
                            });
                            req.session.token = token;
                            req.session.userId = cartao.usuario_id;
                            req.session.agencia = cartao.conta_agencia
                            req.session.conta = cartao.conta_n_conta
                            req.session.tipo = conta.tipo
                            req.session.categoria = 'cliente'
                            
                            resp.redirect('/home');
                            
                            

                        }
                        else{
                            conta.tentativa += 1;
                            if (conta.tentativa>=3){
                                conta.status = 'bloqueada';
                            }
                            await conta.save();
                            resp.status(404).json({ error: 'Senha incorreta.' });

                        }
                    }else{
                        resp.status(404).json({ error: 'Conta bloqueada' });
                    }
                } else {
                    resp.status(404).json({ error: 'Cartao não encontrado.' });
                }
            }else{
                resp.status(404).json({ error: 'Cartao invalido.' });
            }
        }
        else{
            resp.status(404).json({ error: 'Erro ao identificar integridade' });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Erro ao gerar token.' });
    }
}};
