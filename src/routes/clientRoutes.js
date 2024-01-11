const express = require('express');
const { getUserBy,createUser } = require('../controller/clientController/userController');
const { createConta, getAllContas, saque, deposito, transferencia } = require('../controller/clientController/contaControllers');
const { createCartao, getAllCartao } = require('../controller/clientController/cartaoControllers');
// const { auth } = require('../../infra/db/midleware/authenticate');
const { auth } = require('../middlewares/authenticate');
const { getAllRendimentos, createRendimento, getRendimentosBy } = require('../controller/clientController/rendimentoControllers');
const { verify } = require('jsonwebtoken');
const router = express.Router();



router.get('/', (req, resp) => {
    resp.render('pages-sign-in.ejs');
});

router.get('/home',verify,(req, resp) => {
    resp.render('Client/home.ejs');
});

router.post('/teste',verify,(req, resp) => {
    console.log(req.session)
    resp.send(202)
});

router.get('/cadastro',(req, resp) => {
    resp.render('Client/cadastro');
});

router.post('/login', auth);
router.get('/users/', getUserBy);
router.post('/users/', createUser);

 
router.get('/contas/', getAllContas);
router.post('/contas/', createConta);

router.get('/cartao/', getAllCartao);
router.post('/cartao/', createCartao);

router.post('/saque/',verify, saque);
router.post('/deposito/',verify, deposito);
router.post('/transferencia/',verify, transferencia);

router.get('/rendimento/', getAllRendimentos);
router.post('/rendimento/', createRendimento);
router.get('/rendimentosBy/',getRendimentosBy);

router.post('/login/',auth);

module.exports = router;