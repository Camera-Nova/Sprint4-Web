import os
from pathlib import Path

PASTA_BACKEND = Path(__file__).resolve().parent

CAMINHO_DADOS = Path(os.getenv('CAMINHO_DADOS', PASTA_BACKEND / 'banco' / 'dados.json'))

PASTA_UPLOADS = Path(os.getenv('PASTA_UPLOADS', PASTA_BACKEND / 'uploads'))

TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024

ORIGENS_PERMITIDAS = [
    origem.strip()
    for origem in os.getenv(
        'ORIGENS_PERMITIDAS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origem.strip()
]
