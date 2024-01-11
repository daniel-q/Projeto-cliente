const User = require('../../models/UserMaster');
const bcrypt = require('bcrypt');
module.exports = {
    async registerUser(req,res){
        try {
            
            const { name, email, password } = req.body;
            const hashedPassword =  await bcrypt.hash(password, 10);
        
            const user = await User.create({
                name,
                email,
                password: hashedPassword
            });
        
            res.status(201).json({ user });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    profile(req,res){
        res.render('UserMaster/pages-profile',); 
    }
};