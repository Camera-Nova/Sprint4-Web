from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ORIGENS_PERMITIDAS
from rotas import autenticacao, documentos, lixeira, senha_privada

app = FastAPI(title='JOVI Scan API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGENS_PERMITIDAS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(autenticacao.roteador)
app.include_router(documentos.roteador)
app.include_router(lixeira.roteador)
app.include_router(senha_privada.roteador)


@app.get('/', tags=['Status'])
def status_api():
    return {'status': 'ok'}
