import threading
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status

from seguranca import gerar_token, verificar_senha
from tentativas import limpar_tentativas, registrar_falha, verificar_bloqueio

DURACAO_LIBERACAO = timedelta(minutes=5)

liberacoes: dict[str, dict] = {}
trava = threading.Lock()


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


def remover_expiradas(momento: datetime) -> None:
    for chave in [chave for chave, item in liberacoes.items() if item['expira_em'] <= momento]:
        del liberacoes[chave]


def criar_liberacao(usuario_id: int, documento_ids: set[str] | None) -> dict:
    momento = datetime.now(timezone.utc)
    chave = gerar_token()
    expira_em = momento + DURACAO_LIBERACAO

    with trava:
        remover_expiradas(momento)
        liberacoes[chave] = {
            'usuario_id': usuario_id,
            'documento_ids': documento_ids,
            'expira_em': expira_em,
        }

    return {'chave': chave, 'expira_em': expira_em}


def liberacao_valida(chave: str | None, usuario_id: int, documento_id: str) -> bool:
    if not chave:
        return False

    with trava:
        remover_expiradas(datetime.now(timezone.utc))
        liberacao = liberacoes.get(chave)

    if not liberacao or liberacao['usuario_id'] != usuario_id:
        return False

    return liberacao['documento_ids'] is None or documento_id in liberacao['documento_ids']
