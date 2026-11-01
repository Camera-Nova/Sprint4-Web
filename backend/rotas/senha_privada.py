from fastapi import APIRouter, Depends, HTTPException, status

from banco import banco
from dependencias import obter_usuario_atual
from modelos.base import MensagemSaida
from modelos.senha_privada import SenhaPrivadaEntrada, SenhaPrivadaStatus
from liberacoes import conferir_senha_privada
from seguranca import gerar_hash_senha

roteador = APIRouter(prefix='/usuarios/me/senha-privada', tags=['Senha privada'])


@roteador.get('', response_model=SenhaPrivadaStatus)
def consultar_senha_privada(usuario: dict = Depends(obter_usuario_atual)):
    return SenhaPrivadaStatus(configurada=bool(usuario.get('senha_privada_hash')))


@roteador.put('', response_model=MensagemSaida)
def salvar_senha_privada(
    dados: SenhaPrivadaEntrada,
    usuario: dict = Depends(obter_usuario_atual),
):
    if usuario.get('senha_privada_hash'):
        if not dados.senha_atual:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                'Informe a senha atual para trocar a senha privada.',
            )

        conferir_senha_privada(usuario, dados.senha_atual, 'Senha atual incorreta.')

    banco.atualizar(
        'usuarios',
        {'senha_privada_hash': gerar_hash_senha(dados.senha)},
        id=usuario['id'],
    )
    return MensagemSaida(mensagem='Senha privada salva.')
