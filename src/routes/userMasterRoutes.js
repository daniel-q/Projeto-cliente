const express = require('express');

const routerUserMaster = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userMasterController = require('../controller/userMasterController/userMasterController');
const logincontroller = require('../controller/userMasterController/loginController');
const homeController = require('../controller/userMasterController/homeController');
const {auth} = require('../middlewares/authenticate');
const { verify } = require('jsonwebtoken');

//routerUserMaster.post('/login-master', logincontroller.loginUser);

routerUserMaster.post('/login-master', auth);
routerUserMaster.post('/register', userMasterController.registerUser);
//routerUserMaster.post('/verificar-2fa', logincontroller.verifyTwoFactor);

routerUserMaster.get('/login-master', logincontroller.loginRender);
routerUserMaster.get('/logout-master', logincontroller.logout);
routerUserMaster.get('/dashboard',verify, homeController.home);
routerUserMaster.get('/profile',verify, userMasterController.profile);


  



module.exports = routerUserMaster;