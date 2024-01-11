//const {User} = require("../../settings.js")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

/*class UserRepository{
    constructor(User){
      this.user = User
    }
    async getAllUsers(req, resp) {
        try {
          const users = await this.user.findAll();
          resp.status(200).json(users);
        } catch (error) {
          // Lidar com erros de consulta, se houver
          console.error(error);
          resp.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
      }
      async getOneUser(req, resp) {
        try {
          const id = parseInt(req.params.id);
          const user = await this.user.findByPk(id);
          if (user) {
            resp.status(200).json(user);
          } else {
            resp.status(404).json({ error: 'Usuário não encontrado.' });
          }
        } catch (error) {
          console.error(error);
          resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
        }
      }
      async insertUser(req, resp) {
        try {
          const {usernamevalue, emailvalue, passwordvalue,cepvalue,estadovalue,cidadevalue,bairrovalue,ruavalue,numerovalue,complementovalue } = req.body;
          const password = bcrypt.hashSync(passwordvalue, bcrypt.genSaltSync(10))

          const newUser = await this.user.create({
            nome: usernamevalue,
            email: emailvalue,
            senha: password,
            cep: cepvalue,
            estado: estadovalue,
            cidade: cidadevalue,
            bairro: bairrovalue,
            rua: ruavalue,
            numero: numerovalue,
            complemento: complementovalue,
          });
          resp.status(201).json(newUser);
        } catch (error) {
          console.error(error);
          resp.status(500).json({ error: 'Erro ao adicionar usuário.' });
        }
      }

      async  updateUser(req, resp) {
        try {
          const id = parseInt(req.params.id);
          const {
            name,
            email,
            senha,
            cep,
            estado,
            cidade,
            bairro,
            rua,
            numero,
            complemento,
          } = req.body;
      
          const hashedSenha = bcrypt.hashSync(senha, 10);
      
          const user = await this.user.findByPk(id);
      
          if (!user) {
            return resp.status(404).send(`User with ID: ${id} not found`);
          }
      
          user.name = name;
          user.email = email;
          user.senha = hashedSenha;
          user.cep = cep;
          user.estado = estado;
          user.cidade = cidade;
          user.bairro = bairro;
          user.rua = rua;
          user.numero = numero;
          user.complemento = complemento;
      
          await user.save();
      
          resp.status(200).send(`User modified with ID: ${id}`);
        } catch (error) {
          console.error(error);
          resp.status(500).send('Error updating user');
        }
      }
    

    
    async  deleteUser(req, resp) {
      try {
        const id = parseInt(req.params.id);
        const user = await this.user.findByPk(id);
    
        if (!user) {
          return resp.status(404).send(`User with ID: ${id} not found`);
        }
    
        await user.destroy();
    
        resp.status(200).send(`User deleted with ID: ${id}`);
      } catch (error) {
        console.error(error);
        resp.status(500).send('Error deleting user');
      }
    }
    async login(req, resp){
      console.log("teste")
      try {
        const {cpfvalue,senha} = req.body;
        const user = await this.user.findOne({ where: { cpf: cpfvalue } });
        if (user) {
          if(bcrypt.compareSync(senha, user.senha)){
            const token = jwt.sign({ sub: user.id}, process.env.KEY, {
              expiresIn: '1h' // Defina a expiração do token como apropriado
            });
          
            resp.json({ token });

          }
          else{
            resp.status(404).json({ error: 'Senha incorreta.' });
          }
        } else {
          resp.status(404).json({ error: 'Usuário não encontrado.' });
        }
      } catch (error) {
        console.error(error);
        resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
      }
    }
    authorize(req, res, next) {
        const token = req.headers.authorization;  
        console.log(typeof token)
    
        if (!token) {
          return res.status(401).json({ message: 'Token não fornecido' });
        }
    
        jwt.verify(token, process.env.KEY, (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: 'Token inválido' });
          }
          next();
        });
      
    }
    

}

*/

class User{
    constructor(Usuario){
        this.user = Usuario;
    }

    async getAllUsers(req, resp){
        try {
            const users = await this.user.findAll();
            resp.status(200).json(users);
        } catch (error) {
            // Lidar com erros de consulta, se houver
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    }
    async getUsersBy(req, resp){
        try {
            const {tipo,valor} = req.body;
            const users = await this.user.findAll({where:{[tipo]:valor}});
            resp.status(200).json(users);
        } catch (error) {
            // Lidar com erros de consulta, se houver
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    }

    async getUserById(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const user = await this.user.findByPk(id);
            if (user) {
                resp.status(200).json(user);
            } else {
                resp.status(404).json({ error: 'Usuário não encontrado.' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
        }
    }

    async insertUser(req, resp) {
        try {
            const 
                {nomeValue,
                    cpfValue,
                    estadoValue,
                    cidadeValue,
                    bairroValue,
                    ruaValue,
                    numeroValue,
                    telefoneValue,
                    statusValue,
                    emailValue} = req.body;

            const newUser  = await this.user.create({
                nome: nomeValue,
                cpf: cpfValue,
                estado: estadoValue,
                cidade: cidadeValue,
                bairro: bairroValue,
                rua: ruaValue,
                numero: numeroValue,
                telefone: telefoneValue,
                status: statusValue,
                email: emailValue,
            });

      

            if (!newUser) {

                return resp.status(404).send(`User with ID: ${id} not found`);
            }

      
            resp.status(200).json(newUser);
      
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
        }
    }

    async updateUser(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const 
                {nomeValue,
                    cpfValue,
                    estadoValue,
                    cidadeValue,
                    bairroValue,
                    ruaValue,
                    numeroValue,
                    telefoneValue,
                    statusValue,
                    emailValue} = req.body;

            const user = await this.user.findByPk(id);
      
            user.nome = nomeValue;
            user.cpf = cpfValue;
            user.estado = estadoValue;
            user.cidade = cidadeValue;
            user.bairro = bairroValue;
            user.rua = ruaValue;
            user.numero = numeroValue;
            user.telefone = telefoneValue;
            user.status = statusValue;
            user.email = emailValue;

            await user.save();
      
            if (user) {
                resp.status(200).json(user);
            } else {
                resp.status(404).json({ error: 'Usuário não encontrado.' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Erro ao buscar o usuário.' });
        }

    }

    async  deleteUser(req, resp) {
        try {
            const id = parseInt(req.params.id);
            const user = await this.user.findByPk(id);
  
            if (!user) {
                return resp.status(404).send(`User with ID: ${id} not found`);
            }
  
            await user.destroy();
  
            resp.status(200).send(`User deleted with ID: ${id}`);
        } catch (error) {
            console.error(error);
            resp.status(500).send('Error deleting user');
        }
    }

}

module.exports = {User};


