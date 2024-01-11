const { User } = require('../../models/client/user.js');
const {Usuario} = require('../../models/client/user.js');


const getUserBy = (req, resp) => {
    const userRepository = new User(Usuario);
    userRepository.getUsersBy(req, resp);
    console.log(resp);
};
  
const createUser = (req, resp) => {
    const userRepository = new User(Usuario);
    userRepository.insertUser(req, resp);
    
};
  
const login = (req,res)=>{
    res.render('pages-sign-in.ejs',); 
};

// const deposito = (req,res)=>{
//     res.render('UserMaster/index',); 
// };

// const saque = (req,res)=>{
//     res.render('UserMaster/index',); 
// };

// const extrato = (req,res)=>{
//     res.render('UserMaster/index',); 
// };
    
module.exports = {
      
    getUserBy,
    createUser,
    // deposito,
    // saque,
    // extrato
};