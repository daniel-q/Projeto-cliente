const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const routerClient = require('./routes/clientRoutes');
const routerUserMaster = require('./routes/userMasterRoutes');
require('./database');
require('dotenv').config();


const app = express();
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(routerClient);
app.use(routerUserMaster);

const getDirname = () => {
    const { cwd } = process;
    return cwd();
};
const dirname = getDirname();

app.set('views', path.resolve(dirname, 'src','views'));
app.set('view engine', 'ejs');
app.use(express.static(path.resolve(dirname,'public'))); 


app.listen(process.env.PORT,()=>{
    console.log(`
    Node version 20.10.0,
    Starting development server at http://127.0.0.1:3300/
    Quit the server with CONTROL-C.
    `);
});