from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException, status

from seguranca import gerar_token_liberacao, ler_token_liberacao, verificar_senha
from tentativas import limpar_tentativas, registrar_falha, verificar_bloqueio

DURACAO_LIBERACAO = timedelta(minutes=5)


def conferir_senha_privada(
    usuario: dict,
    senha: str,
    mensagem_erro: str = 'Senha incorreta.',
) -> None:
    senha_privada_hash = usuario.get('senha_privada_hash')

    if not senha_privada_hash:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            'Defina a senha padrão antes de acessar documentos privados.',
        )

    chave_tentativas = f"senha-privada:{usuario['id']}"
    verificar_bloqueio(chave_tentativas)

    if not verificar_senha(senha, senha_privada_hash):
        registrar_falha(chave_tentativas, status.HTTP_403_FORBIDDEN, mensagem_erro)

    limpar_tentativas(chave_tentativas)


def criar_liberacao(usuario_id: int, documento_ids: set[str] | None) -> dict:
    expira_em = datetime.now(timezone.utc) + DURACAO_LIBERACAO

    return {
        'chave': gerar_token_liberacao(usuario_id, documento_ids, expira_em),
        'expira_em': expira_em,
    }


def liberacao_valida(chave: str | None, usuario_id: int, documento_id: str) -> bool:
    if not chave:
        return False

    try:
        dados = ler_token_liberacao(chave)
    except jwt.InvalidTokenError:
        return False

    if dados['tipo'] != 'liberacao' or dados['sub'] != str(usuario_id):
        return False

    return dados['documentos'] is None or documento_id in dados['documentos']
