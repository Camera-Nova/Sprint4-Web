from fastapi import APIRouter, Depends

from banco import banco
from dependencias import obter_usuario_atual
from modelos.base import MensagemSaida
from modelos.senha_privada import SenhaPrivadaEntrada, SenhaPrivadaStatus
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
    banco.atualizar(
        'usuarios',
        {'senha_privada_hash': gerar_hash_senha(dados.senha)},
        id=usuario['id'],
    )
    return MensagemSaida(mensagem='Senha privada salva.')
