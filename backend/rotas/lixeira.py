from fastapi import APIRouter, Depends

from banco import banco
from dependencias import obter_usuario_atual
from modelos.base import MensagemSaida
from modelos.documento import DocumentoSaida
from rotas.documentos import agora, apagar_documentos, buscar_documento_do_usuario

roteador = APIRouter(prefix='/lixeira', tags=['Lixeira'])


def listar_excluidos(usuario: dict) -> list[dict]:
    return [
        documento
        for documento in banco.filtrar('documentos', usuario_id=usuario['id'])
        if documento['excluido_em'] is not None
    ]


@roteador.get('', response_model=list[DocumentoSaida])
def listar_lixeira(usuario: dict = Depends(obter_usuario_atual)):
    documentos = listar_excluidos(usuario)
    return sorted(documentos, key=lambda documento: documento['excluido_em'], reverse=True)


@roteador.post('/{documento_id}/restaurar', response_model=DocumentoSaida)
def restaurar_documento(documento_id: str, usuario: dict = Depends(obter_usuario_atual)):
    buscar_documento_do_usuario(documento_id, usuario, excluido=True)

    # Volta para o topo do histórico.
    [documento] = banco.atualizar(
        'documentos',
        {'excluido_em': None, 'inserido_em': agora()},
        id=documento_id,
    )
    return documento


@roteador.delete('/{documento_id}', response_model=MensagemSaida)
def excluir_definitivamente(documento_id: str, usuario: dict = Depends(obter_usuario_atual)):
    documento = buscar_documento_do_usuario(documento_id, usuario, excluido=True)
    apagar_documentos([documento])
    return MensagemSaida(mensagem='Documento excluído permanentemente.')


@roteador.delete('', response_model=MensagemSaida)
def esvaziar_lixeira(usuario: dict = Depends(obter_usuario_atual)):
    documentos = listar_excluidos(usuario)
    apagar_documentos(documentos)
    return MensagemSaida(mensagem=f'{len(documentos)} documento(s) excluído(s) permanentemente.')
