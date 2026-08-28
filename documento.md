# Consumo de API Node.js com HTML: Métodos HTTP (GET, POST, PUT, PATCH, DELETE)

Este material demonstra como uma página HTML pode interagir com uma API RESTful construída em Node.js, utilizando os principais métodos HTTP para operações CRUD (Create, Read, Update, Delete).

## 1. A API Node.js

Nossa API de exemplo é um servidor Node.js utilizando o framework Express. Ela gerencia uma coleção de 'itens' em memória e expõe endpoints para cada método HTTP. O CORS (Cross-Origin Resource Sharing) está habilitado para permitir requisições da página HTML.

**`server.js`**
```javascript
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let items = [
    { id: 1, name: 'Item Inicial' }
];

// GET: Buscar todos os itens
app.get('/api/items', (req, res) => {
    res.json(items);
});

// POST: Criar um novo item
app.post('/api/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        name: req.body.name
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// PUT: Atualizar um item completamente
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
        items[index] = { id, name: req.body.name };
        res.json(items[index]);
    } else {
        res.status(404).json({ message: 'Item não encontrado' });
    }
});

// PATCH: Atualizar parcialmente um item
app.patch('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);
    if (item) {
        if (req.body.name) item.name = req.body.name;
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item não encontrado' });
    }
});

// DELETE: Remover um item
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    items = items.filter(i => i.id !== id);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

## 2. A Página HTML para Consumo da API

A página HTML utiliza JavaScript assíncrono (`fetch` API) para fazer requisições HTTP à API Node.js. Cada método é demonstrado através de funções JavaScript acionadas por botões na interface.

**`index.html`**
```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consumo de API - Métodos HTTP</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 20px auto; padding: 0 20px; line-height: 1.6; }
        .card { border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
        .controls { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
        button { padding: 8px 15px; cursor: pointer; border: none; border-radius: 4px; color: white; }
        .btn-get { background-color: #28a745; }
        .btn-post { background-color: #007bff; }
        .btn-put { background-color: #ffc107; color: black; }
        .btn-patch { background-color: #17a2b8; }
        .btn-delete { background-color: #dc3545; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Consumo de API Node.js</h1>
    
    <div class="controls">
        <button class="btn-get" onclick="handleGet()">GET (Listar)</button>
        <input type="text" id="itemName" placeholder="Nome do item">
        <button class="btn-post" onclick="handlePost()">POST (Criar)</button>
    </div>

    <div id="output">
        <h3>Itens na API:</h3>
        <div id="itemsList">Carregando...</div>
    </div>

    <script>
        const API_URL = 'http://localhost:3000/api/items';

        // GET - Listar Itens
        async function handleGet() {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                renderItems(data);
            } catch (error) {
                console.error('Erro no GET:', error);
            }
        }

        // POST - Criar Item
        async function handlePost() {
            const name = document.getElementById('itemName').value;
            if (!name) return alert('Digite um nome');

            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                });
                document.getElementById('itemName').value = '';
                handleGet();
            } catch (error) {
                console.error('Erro no POST:', error);
            }
        }

        // PUT - Atualizar Completo
        async function handlePut(id) {
            const newName = prompt('Novo nome (PUT - Substituição completa):');
            if (!newName) return;

            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });
                handleGet();
            } catch (error) {
                console.error('Erro no PUT:', error);
            }
        }

        // PATCH - Atualizar Parcial
        async function handlePatch(id) {
            const newName = prompt('Novo nome (PATCH - Atualização parcial):');
            if (!newName) return;

            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });
                handleGet();
            } catch (error) {
                console.error('Erro no PATCH:', error);
            }
        }

        // DELETE - Remover
        async function handleDelete(id) {
            if (!confirm('Deseja excluir este item?')) return;

            try {
                await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });
                handleGet();
            } catch (error) {
                console.error('Erro no DELETE:', error);
            }
        }

        function renderItems(items) {
            const list = document.getElementById('itemsList');
            list.innerHTML = items.map(item => `
                <div class="card">
                    <strong>ID: ${item.id}</strong> - ${item.name}
                    <div style="margin-top: 10px;">
                        <button class="btn-put" onclick="handlePut(${item.id})">PUT</button>
                        <button class="btn-patch" onclick="handlePatch(${item.id})">PATCH</button>
                        <button class="btn-delete" onclick="handleDelete(${item.id})">DELETE</button>
                    </div>
                </div>
            `).join('');
        }

        // Inicializar lista
        handleGet();
    </script>
</body>
</html>
```

## 3. Métodos HTTP e seu Uso

| Método HTTP | Propósito Principal | Exemplo na API (Endpoint) | Exemplo no HTML (Função) | Observações |
|-------------|---------------------|---------------------------|--------------------------|-------------|
| **GET**     | Recuperar dados     | `GET /api/items`          | `handleGet()`            | Não deve ter efeitos colaterais. Usado para listar ou obter um recurso específico. |
| **POST**    | Criar um novo recurso | `POST /api/items`         | `handlePost()`           | Envia dados no corpo da requisição para criar um novo item. |
| **PUT**     | Atualizar/Substituir um recurso completo | `PUT /api/items/:id`      | `handlePut(id)`          | Substitui *todo* o recurso com os dados fornecidos. Se o recurso não existe, pode criá-lo. |
| **PATCH**   | Atualizar parcialmente um recurso | `PATCH /api/items/:id`    | `handlePatch(id)`        | Aplica modificações parciais a um recurso existente. |
| **DELETE**  | Remover um recurso  | `DELETE /api/items/:id`   | `handleDelete(id)`       | Remove o recurso especificado pelo ID. |

## Como Executar

1.  **Inicie a API Node.js:**
    No diretório `api-demo`, execute:
    ```bash
    node server.js
    ```
    O servidor estará rodando em `http://localhost:3000`.

2.  **Abra a Página HTML:**
    Abra o arquivo `index.html` em seu navegador. Você poderá interagir com a API através dos botões e campos de entrada.

Este exemplo fornece uma base funcional para entender a comunicação entre front-end (HTML/JavaScript) e back-end (Node.js API) usando os métodos HTTP padrão.
