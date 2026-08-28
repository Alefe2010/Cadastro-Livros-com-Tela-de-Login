# 📖 Cadastro-Livros
Um cadasto de livros, com uma tela de login inicial, onde o usuário precisa logar com usuário = alefe e senha = 123, para que receba um token e possa acessar o cadastro de livros

readme_content = """# 📚 Sistema de Gerenciamento de Livros (API REST & Autenticação JWT)

Este é um projeto de uma aplicação web para gerenciamento de livros (CRUD completo) desenvolvida em **Node.js** com **Express**. O sistema conta com autenticação segura baseada em **JWT (JSON Web Tokens)** armazenados em **Cookies HTTP-Only**, além de renderização de páginas HTML estáticas e integração assíncrona via `fetch` no Front-End.

---

## 🎯 Funcionalidades

- **Autenticação & Segurança:**
  - Login de usuários com verificação de credenciais.
  - Geração de Token JWT com tempo de expiração.
  - Armazenamento seguro de tokens em cookies `httpOnly`.
  - Middleware de proteção de rotas (`verifyJWT`) que bloqueia acessos não autorizados e redireciona para a tela de login.
  - Rota de `logout` com limpeza de cookies.

- **Gerenciamento de Livros (CRUD RESTful):**
  - **GET `/livros`**: Listagem de todos os livros cadastrados.
  - **POST `/livros`**: Cadastro de novos livros (ISBN, Nome e Categoria).
  - **PUT `/livros/:isbn`**: Atualização completa de um livro existente.
  - **PATCH `/livros/:isbn`**: Atualização parcial (apenas nome) de um livro.
  - **DELETE `/livros/:isbn`**: Remoção de um livro da lista.

---

## 🛠️ Tecnologias Utilizadas

- **Back-End:** Node.js, Express.js
- **Autenticação:** JSON Web Token (`jsonwebtoken`), Cookie-Parser
- **Segurança & Auxiliares:** `cors`, `dotenv-safe`
- **Front-End:** HTML5, CSS3, JavaScript (Fetch API / ES6+)

---

## 📁 Estrutura do Projeto

```text
.
├── views/
│   ├── index.html       # Painel principal do sistema (Protegido por JWT)
│   └── login.html       # Tela de login (Acesso público)
├── .env                 # Arquivo de variáveis de ambiente (Chave secreta do JWT)
├── .env.example         # Exemplo de configuração de ambiente
├── .gitignore           # Arquivos e pastas ignorados pelo Git
├── package.json         # Dependências e scripts do Node.js
└── server.js            # Servidor Express, rotas e middlewares
```

## 🚀 Como Executar o Projeto
Siga as instruções abaixo para rodar o projeto em sua máquina local.

## 📋 Pré-requisitos
Node.js instalado (versão 14 ou superior recomendada).

Gerenciador de pacotes npm (instalado junto com o Node.js).

## 🔧 Passo a Passo
Clonar o Repositório:

Bash
git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
cd seu-repositorio
Instalar as Dependências:
Como a pasta node_modules não é enviada para o repositório, execute o comando abaixo para instalar todos os pacotes necessários:

Bash
npm install
Configurar as Variáveis de Ambiente:
Crie um arquivo chamado .env na raiz do projeto baseado no .env.example:

Snippet de código
JWT_SECRET=sua_chave_secreta_aqui
💡 Substitua sua_chave_secreta_aqui por uma chave forte de sua preferência.

Iniciar o Servidor:

Bash
node server.js
(Ou npm start se você configurou o script no package.json).

Acessar a Aplicação:
Abra o seu navegador e acesse:
http://localhost:3000

## 🔑 Credenciais de Teste
Para realizar o login no sistema, utilize o usuário e senha padrão definidos no código:

**Usuário: alefe**

**Senha: 123**

## 🧪 Testando o Fluxo de Autenticação
Ao acessar http://localhost:3000/ sem estar logado, o middleware verifyJWT irá interceptar a requisição e redirecionar automaticamente para http://localhost:3000/login.

Insira as credenciais de teste para entrar.

Após o login bem-sucedido, o servidor enviará o cookie HTTP-Only com o token JWT e redirecionará para a tela principal (/).

Na tela principal, você poderá listar, adicionar, editar (PUT/PATCH) e excluir livros.

Para testar o encerramento da sessão, clique em Logout para apagar o cookie e bloquear novamente o acesso às rotas protegidas.

├── package.json         # Dependências e scripts do Node.js
└── server.js            # Servidor Express, rotas e middlewares
