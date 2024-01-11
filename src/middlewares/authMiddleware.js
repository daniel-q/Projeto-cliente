const User = require('../models/UserMaster');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    async protected(req, res, next) {
        const token = req.session.token;

        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            req.user = user;
            next();
        });
    }
};
