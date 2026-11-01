import os
import sys
from pathlib import Path

from fastapi import FastAPI

# Na Vercel só /tmp aceita escrita: o banco simulado e as imagens ficam lá
# (os dados podem sumir quando a função reinicia).
os.environ.setdefault('CAMINHO_DADOS', '/tmp/jovi/dados.json')
os.environ.setdefault('PASTA_UPLOADS', '/tmp/jovi/uploads')

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'backend'))

from main import app as api  # noqa: E402

app = FastAPI()
app.mount('/api', api)
