import hashlib
import hmac
import secrets
from datetime import datetime

import jwt

from config import JWT_SECRET

ALGORITMO_JWT = 'HS256'

ITERACOES = 200_000


def gerar_hash_senha(senha: str) -> str:
    sal = secrets.token_hex(16)
    hash_senha = hashlib.pbkdf2_hmac('sha256', senha.encode(), bytes.fromhex(sal), ITERACOES)
    return f'{sal}${hash_senha.hex()}'


def verificar_senha(senha: str, hash_salvo: str) -> bool:
    sal, hash_esperado = hash_salvo.split('$')
    hash_senha = hashlib.pbkdf2_hmac('sha256', senha.encode(), bytes.fromhex(sal), ITERACOES)
    return hmac.compare_digest(hash_senha.hex(), hash_esperado)


def gerar_token() -> str:
    return secrets.token_urlsafe(32)


def gerar_token_sessao(usuario: dict, expira_em: datetime) -> str:
    return jwt.encode(
        {'sub': str(usuario['id']), 'email': usuario['email'], 'exp': expira_em},
        JWT_SECRET,
        algorithm=ALGORITMO_JWT,
    )


def ler_token_sessao(token: str) -> dict:
    return jwt.decode(
        token,
        JWT_SECRET,
        algorithms=[ALGORITMO_JWT],
        options={'require': ['exp', 'sub', 'email']},
    )
