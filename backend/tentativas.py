import math
import threading
from datetime import datetime, timedelta, timezone
from typing import NoReturn

from fastapi import HTTPException, status

LIMITE_TENTATIVAS = 5
TEMPO_BLOQUEIO = timedelta(minutes=5)

tentativas: dict[str, dict] = {}
trava = threading.Lock()


def erro_bloqueio(bloqueado_ate: datetime, momento: datetime) -> HTTPException:
    segundos = max(1, math.ceil((bloqueado_ate - momento).total_seconds()))
    minutos = math.ceil(segundos / 60)

    return HTTPException(
        status.HTTP_429_TOO_MANY_REQUESTS,
        f'Muitas tentativas incorretas. Tente novamente em {minutos} minuto(s).',
        headers={'Retry-After': str(segundos)},
    )


def verificar_bloqueio(chave: str) -> None:
    momento = datetime.now(timezone.utc)

    with trava:
        registro = tentativas.get(chave)

        if not registro or not registro['bloqueado_ate']:
            return

        if registro['bloqueado_ate'] <= momento:
            del tentativas[chave]
            return

        bloqueado_ate = registro['bloqueado_ate']

    raise erro_bloqueio(bloqueado_ate, momento)


def registrar_falha(chave: str, codigo_status: int, mensagem: str) -> NoReturn:
    momento = datetime.now(timezone.utc)

    with trava:
        registro = tentativas.setdefault(chave, {'falhas': 0, 'bloqueado_ate': None})
        registro['falhas'] += 1
        restantes = LIMITE_TENTATIVAS - registro['falhas']

        if restantes <= 0:
            registro['falhas'] = 0
            registro['bloqueado_ate'] = momento + TEMPO_BLOQUEIO
            raise erro_bloqueio(registro['bloqueado_ate'], momento)

    raise HTTPException(codigo_status, f'{mensagem} Restam {restantes} tentativa(s).')


def limpar_tentativas(chave: str) -> None:
    with trava:
        tentativas.pop(chave, None)
