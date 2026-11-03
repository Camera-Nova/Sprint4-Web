import os
import sys
from pathlib import Path

from fastapi import FastAPI

if not os.getenv('JWT_SECRET'):
    raise RuntimeError('Defina a variável de ambiente JWT_SECRET no projeto da Vercel.')

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'backend'))

from main import app as api  # noqa: E402

app = FastAPI()
app.mount('/api', api)
