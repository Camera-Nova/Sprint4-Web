import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

PASTA_BACKEND = Path(__file__).resolve().parent

load_dotenv(PASTA_BACKEND / '.env')

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

SUPABASE_BUCKET = os.getenv('SUPABASE_BUCKET', 'documentos')

TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024

DURACAO_SESSAO = timedelta(hours=int(os.getenv('DURACAO_SESSAO_HORAS', 24)))

DURACAO_SESSAO_LEMBRAR = timedelta(days=int(os.getenv('DURACAO_SESSAO_LEMBRAR_DIAS', 30)))

JWT_SECRET = os.getenv('JWT_SECRET', 'jovi-scan-segredo-local-apenas-para-dev')

ORIGENS_PERMITIDAS = [
    origem.strip()
    for origem in os.getenv(
        'ORIGENS_PERMITIDAS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if origem.strip()
]
