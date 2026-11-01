import os
from datetime import timedelta
from pathlib import Path

PASTA_BACKEND = Path(__file__).resolve().parent

CAMINHO_DADOS = Path(os.getenv('CAMINHO_DADOS', PASTA_BACKEND / 'banco' / 'dados.json'))

PASTA_UPLOADS = Path(os.getenv('PASTA_UPLOADS', PASTA_BACKEND / 'uploads'))

TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024

DURACAO_SESSAO = timedelta(hours=int(os.getenv('DURACAO_SESSAO_HORAS', 24)))

DURACAO_SESSAO_LEMBRAR = timedelta(days=int(os.getenv('DURACAO_SESSAO_LEMBRAR_DIAS', 30)))

ORIGENS_PERMITIDAS = [
    origem.strip()
    for origem in os.getenv(
        'ORIGENS_PERMITIDAS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origem.strip()
]
