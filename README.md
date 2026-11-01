# JOVI Scan

Aplicação web para **digitalizar documentos com a câmera do navegador**, organizá-los (público ou privado, data de vencimento), visualizar, editar, mover para a lixeira, restaurar e exportar para PDF.

Projeto acadêmico — Sprint 4 (Web).

## Integrantes

Veja [`INTEGRANTES.txt`](INTEGRANTES.txt).

---

## Como funciona

O projeto é dividido em duas partes:

| Pasta | O que é | Tecnologias |
|---|---|---|
| `frontend/` | SPA que roda no navegador | React 19, Vite 8, React Router 7, Tailwind CSS 4, jsPDF |
| `backend/` | API REST que guarda usuários, sessões e documentos | Python 3.11+, FastAPI, Uvicorn, Pydantic |

O frontend conversa com a API pelo endereço definido em `VITE_API_URL`. O backend não usa banco de dados real: os dados ficam em um **banco simulado** em JSON (`backend/banco/dados.json`) e as imagens em `backend/uploads/`. Os dois são criados automaticamente na primeira execução e não vão para o Git.

### Funcionalidades

- **Login e cadastro** de usuários, com opção "Lembrar-me" (sessão salva no `localStorage` ou só no `sessionStorage`) e expiração de sessão.
- **Digitalização pela câmera**: escolha o tipo (Documento, RG / CNH, Manuscrito, Tradução), dê um nome, defina vencimento e visibilidade e capture a foto.
- **Histórico** dos documentos digitalizados, com visualização e edição.
- **Documentos privados**: para abrir um documento privado é preciso a **senha privada** do usuário. Se ela ainda não existe, o usuário é levado a configurá-la. Após 5 tentativas erradas, o acesso fica bloqueado por 5 minutos.
- **Notificações de vencimento**: documento vencido, que vence hoje ou que vence nos próximos 30 dias.
- **Lixeira**: "Excluir" e "Limpar histórico" movem para a lixeira; de lá é possível restaurar ou excluir definitivamente.
- **Exportar PDF** com os documentos do histórico (se houver documento privado, a senha privada é exigida).

### Estrutura

```
.
├── backend/
│   ├── main.py            # cria a API e registra as rotas
│   ├── config.py          # configurações (lidas de variáveis de ambiente)
│   ├── banco/             # banco simulado em JSON
│   ├── modelos/           # modelos Pydantic (entrada/saída)
│   ├── rotas/             # autenticação, documentos, lixeira, senha privada
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # Header, Camera, Historico, Lixeira, modais...
│   │   ├── hooks/         # useSessao, useDocumentos, useCamera, useExportarPdf...
│   │   ├── pages/         # Login, Cadastro, Home
│   │   ├── routes/        # RotaPrivada, RotaPublica
│   │   └── services/      # api.js (chamadas para o backend)
│   ├── .env.example
│   └── package.json
├── scripts/
│   └── dev.js             # sobe backend e frontend juntos
└── package.json           # npm run dev da raiz
```

### Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Entrar |
| POST | `/auth/cadastro` | Criar conta |
| GET | `/auth/me` | Usuário logado |
| POST | `/auth/logout` | Sair |
| GET | `/documentos` | Listar documentos |
| POST | `/documentos` | Criar documento (upload da imagem) |
| PATCH | `/documentos/{id}` | Editar documento |
| DELETE | `/documentos/{id}` | Mover documento para a lixeira |
| DELETE | `/documentos` | Mover todos para a lixeira |
| GET | `/documentos/{id}/imagem` | Imagem do documento |
| POST | `/documentos/{id}/desbloquear` | Liberar documento privado com a senha |
| POST | `/documentos/exportar` | Liberar exportação em PDF |
| GET | `/lixeira` | Listar lixeira |
| POST | `/lixeira/{id}/restaurar` | Restaurar documento |
| DELETE | `/lixeira/{id}` | Excluir definitivamente |
| DELETE | `/lixeira` | Esvaziar lixeira |
| GET | `/usuarios/me/senha-privada` | Saber se a senha privada está configurada |
| PUT | `/usuarios/me/senha-privada` | Definir ou trocar a senha privada |

Com a API rodando, a documentação interativa fica em <http://localhost:8000/docs>.

---

## Como baixar

Pré-requisitos:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20.19+ (ou 22.12+) e npm
- [Python](https://www.python.org/) 3.11+

```bash
git clone https://github.com/Camera-Nova/Sprint4-Web.git
cd Sprint4-Web
```

---

## Como executar

Na **raiz do projeto**, rode:

```bash
npm run dev
```

Esse único comando sobe o **backend** e o **frontend** juntos, no mesmo terminal (as linhas de log aparecem com o prefixo `[backend]` ou `[frontend]`):

- API: <http://localhost:8000> (documentação em <http://localhost:8000/docs>)
- Aplicação: <http://localhost:5173>

Na primeira execução o script (`scripts/dev.js`) prepara tudo automaticamente:

1. cria o ambiente virtual `backend/.venv` e instala o `requirements.txt`;
2. cria o `frontend/.env` a partir do `frontend/.env.example`;
3. roda `npm install` no `frontend/`.

Nas próximas vezes ele só inicia os servidores. Para parar os dois, pressione **Ctrl + C**. Se um dos servidores cair, o outro também é encerrado.

> Se precisar reinstalar as dependências do backend (por exemplo, após mudar o `requirements.txt`), apague a pasta `backend/.venv` e rode `npm run dev` de novo. No frontend, rode `npm install` dentro de `frontend/`.

### Configuração do frontend (`frontend/.env`)

O arquivo `.env` define o endereço da API:

```env
VITE_API_URL=http://localhost:8000
```

### Variáveis de ambiente do backend (opcionais)

| Variável | Padrão | Descrição |
|---|---|---|
| `ORIGENS_PERMITIDAS` | `http://localhost:5173,http://127.0.0.1:5173` | Origens liberadas no CORS, separadas por vírgula |
| `CAMINHO_DADOS` | `backend/banco/dados.json` | Arquivo do banco simulado |
| `PASTA_UPLOADS` | `backend/uploads` | Pasta das imagens enviadas |
| `DURACAO_SESSAO_HORAS` | `24` | Duração da sessão sem "Lembrar-me" |
| `DURACAO_SESSAO_LEMBRAR_DIAS` | `30` | Duração da sessão com "Lembrar-me" |

### Executar separadamente (opcional)

Para subir cada parte em um terminal próprio:

```bash
cd backend
source .venv/bin/activate        # Windows (PowerShell): .venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

```bash
cd frontend
npm run dev
```

### Scripts

| Comando | Onde | O que faz |
|---|---|---|
| `npm run dev` | raiz | Sobe backend e frontend juntos |
| `npm run dev` | `frontend/` | Sobe só o frontend (Vite) |
| `npm run build` | `frontend/` | Gera a versão de produção em `dist/` |
| `npm run preview` | `frontend/` | Serve a versão de produção localmente |
| `npm run lint` | `frontend/` | Verifica o código com ESLint |

---

## Como utilizar

1. Abra <http://localhost:5173> e entre com o usuário de teste **`admin@jovi.com`** / **`Admin123`**, ou clique em **Criar conta** para se cadastrar (senha com no mínimo 8 caracteres).
2. Na tela inicial, escolha o **tipo de documento** e permita o acesso à câmera.
3. Preencha o nome, a data de vencimento (opcional) e a visibilidade (público ou privado) e clique em **Capturar foto**.
4. O documento aparece no **histórico**. Clique nele para visualizar; documentos privados pedem a senha privada.
5. Configure a **senha privada** pelo botão "Senha privada" no topo (no celular, ele fica no menu ☰).
6. Use **editar** para mudar nome, vencimento ou visibilidade, e **excluir** para mandar para a lixeira.
7. Em **Itens excluídos** (lixeira), restaure ou exclua definitivamente os documentos.
8. Clique em **Exportar PDF** para baixar os documentos do histórico.
9. Clique em **Sair** para encerrar a sessão.

> A câmera do navegador só funciona em `localhost` ou em sites com HTTPS. Para testar no celular, use um endereço HTTPS.
