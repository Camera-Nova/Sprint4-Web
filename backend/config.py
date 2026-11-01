import os
from pathlib import Path

PASTA_BACKEND = Path(__file__).resolve().parent

# Arquivo onde o banco simulado é persistido.
CAMINHO_DADOS = Path(os.getenv('CAMINHO_DADOS', PASTA_BACKEND / 'banco' / 'dados.json'))

# Pasta onde as imagens dos documentos são salvas.
PASTA_UPLOADS = Path(os.getenv('PASTA_UPLOADS', PASTA_BACKEND / 'uploads'))

# Tamanho máximo de cada imagem enviada (5 MB).
TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024

# Origens do frontend que podem chamar a API (separadas por vírgula).
ORIGENS_PERMITIDAS = [
    origem.strip()
    for origem in os.getenv(
        'ORIGENS_PERMITIDAS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origem.strip()
]
