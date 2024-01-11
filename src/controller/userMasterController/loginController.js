const User = require('../../models/UserMaster');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
module.exports = {
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
        
            const user = await User.findOne({ where: { email } });
            
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }
        
            const passwordMatch = await bcrypt.compare(password, user.password);
        
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
        
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1H' });
            
            req.session.token = token;
            req.session.userId = user.id;


            const secret = speakeasy.generateSecret({ length: 20 });

            user.twoFASecret = secret.base32;
            await user.save();

            const otpAuthUrl = speakeasy.otpauthURL({
                secret: secret.base32,
                label: 'Bank SOFTEX',
                issuer: 'UFRN',
            });

            const qrCode = await qrcode.toDataURL(otpAuthUrl);

            res.render('UserMaster/pages-2fa-setup', { qrCode });
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        
    },

    logout(req, res){
        req.session.destroy((err) => {
            if (err) {
                console.error('Erro ao destruir a sessão:', err);
                return res.status(500).send('Erro ao fazer logout');
            }
    
            res.redirect('/login-master');
        });
    },
    async verifyTwoFactor(req, res) {
        try {
            const { code } = req.body;

            const user = await User.findByPk(req.session.userId);
            


            const verified = speakeasy.totp.verify({
                secret: user.twoFASecret,
                encoding: 'base32',
                token: code,
                window:0
            });

            if (verified) {
                res.redirect('/dashboard');
            } else {
                res.redirect('/login-master');
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    loginRender(req,res){
        res.render('UserMaster/pages-sign-in-master',); 
    },

    
};

