const { jwt } = require('jsonwebtoken');


module.exports = {async verify(req, res, next) {
    //const token = req.headers.authorization; 
    console.log(token) 
    const token = req.session.token;
    

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        next();
    });
  
}};
