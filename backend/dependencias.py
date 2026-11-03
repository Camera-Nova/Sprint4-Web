import jwt
from fastapi import Depends, HTTPException, Query, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from banco import banco
from seguranca import ler_token_sessao

esquema_bearer = HTTPBearer(auto_error=False)


def obter_token(
    credenciais: HTTPAuthorizationCredentials | None = Depends(esquema_bearer),
) -> str:
    if not credenciais:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Token não informado.')

    return credenciais.credentials


def buscar_usuario_por_token(token: str) -> dict:
    try:
        dados = ler_token_sessao(token)
        usuario_id = int(dados['sub'])
    except jwt.ExpiredSignatureError as erro:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            'Sessão expirada. Entre novamente.',
        ) from erro
    except (jwt.InvalidTokenError, ValueError) as erro:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            'Sessão inválida ou expirada.',
        ) from erro

    usuario = banco.buscar('usuarios', id=usuario_id, email=dados['email'])

    if not usuario:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Usuário não encontrado.')

    return usuario


def obter_usuario_atual(token: str = Depends(obter_token)) -> dict:
    return buscar_usuario_por_token(token)


def obter_usuario_da_imagem(
    credenciais: HTTPAuthorizationCredentials | None = Depends(esquema_bearer),
    token: str | None = Query(default=None),
) -> dict:
    token_informado = credenciais.credentials if credenciais else token

    if not token_informado:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Token não informado.')

    return buscar_usuario_por_token(token_informado)
