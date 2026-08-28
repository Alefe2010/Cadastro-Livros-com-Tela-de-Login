const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");
const path = require("path")

const cookieParser = require('cookie-parser')


require("dotenv-safe").config();

app.use(cookieParser())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

function verifyJWT(req, res, next){
    const token = req.cookies.token

    if(!token){
        console.log("Sem token!")
        return res.redirect('/login')
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
        if (err){
            console.log("Token inválido!")
            return res.redirect('/login')
        }
        req.usuarioId = decoded.id
        next()
    })
}

//Ele vai acessar a pasta login, e vai procurar pelo index.html ou seja a rota '/' e não a rota de login '/login'. Vai retornar cannot GET.
app.get('/', verifyJWT, (req, res) => {
    return res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
// 2. ROTA GET /login (Entrega a tela de Login)
app.get('/login', (req, res) => {
    return res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', (req, res) => {
    const {usuario, senha} = req.body;
    console.log('Usuário: '+ usuario + ' Senha: ' + senha);
    if(usuario === 'alefe' && senha === '123'){
        console.log('logado!')
        const token = jwt.sign(
            {id: 1},
            process.env.JWT_SECRET,
            {expiresIn: '15m'}
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });
        console.log("Token ativo:" + token)
        return res.redirect('/');
    }

    res.redirect('/login?erro=true')
});

app.get('/logout', (req,res)=>{
    res.clearCookie('token');
    console.log('logout')
    res.redirect('/login');

});

let livros = [
    {
        isbnLivro: 1,
        nomeLivro: 'Livro 1',
        categoriaLivro: 'Romance'
    }
];
app.get('/livros', verifyJWT, (req, res) =>{
    res.json(livros)
})
app.post('/livros', verifyJWT, (req, res) => {
    const { isbnLivro, nomeLivro, categoriaLivro } = req.body;

    const newItem = {
        isbnLivro,
        nomeLivro,
        categoriaLivro
    };

    console.log("Livro recebido:", newItem);

    livros.push(newItem);

    res.status(201).json(newItem);
});

app.put('/livros/:isbn', verifyJWT, (req, res) => {
    const {isbn} = req.params
    const {name, iSBN} = req.body

    for(x in livros){
        if(parseInt(livros[x].isbnLivro) === parseInt(isbn)){
            livros[x].nomeLivro = name
            livros[x].isbnLivro = iSBN
            return res.status(200).json({message: "Atualização completa"})
        }
    }
    return res.status(404).json({message: "Livro não encontrado!"})
})

app.patch('/livros/:isbn', verifyJWT, (req, res) => {
    const {isbn} = req.params
    const {name} = req.body

    for(x in livros){
        if(parseInt(livros[x].isbnLivro) == parseInt(isbn)){
            livros[x].nomeLivro = name
            return res.status(200).json({message: "Atualização parcial"})
        }
    }
    return res.status(404).json({message: "Livro não encontrado!"})
})

app.delete('/livros/:isbn', verifyJWT, (req, res) => {
    const {isbn} = req.params
    const index = livros.findIndex(l => l.isbnLivro == isbn)

    if(index == -1) {
        return res.status(404).json({message: "Livro não encontrado"})
    }
    console.log(`O livro "${livros[index].nomeLivro}" foi deletado com sucesso.`)
    livros.splice(index, 1)
    return res.status(200).json({message: "Livro deletado com sucesso!"})
})


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});