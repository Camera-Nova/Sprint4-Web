from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ORIGENS_PERMITIDAS
from rotas import autenticacao

app = FastAPI(title='JOVI Scan API', version='1.0.0')

# Libera o frontend (React/Vite) a chamar a API de outra origem; sem isso o
# navegador bloqueia as requisições pela política de mesma origem (CORS).
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGENS_PERMITIDAS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(autenticacao.roteador)


@app.get('/', tags=['Status'])
def status_api():
    return {'status': 'ok'}
