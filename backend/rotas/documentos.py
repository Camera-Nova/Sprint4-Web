import random
import uuid
from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse
from pydantic import ValidationError

from armazenamento import apagar_imagem, caminho_imagem, salvar_imagem
from banco import banco
from dependencias import obter_usuario_atual, obter_usuario_da_imagem
from modelos.documento import DocumentoCriacao, DocumentoEdicao, DocumentoSaida

roteador = APIRouter(prefix='/documentos', tags=['Documentos'])


def agora() -> str:
    return datetime.now(timezone.utc).isoformat()


def buscar_documento_do_usuario(documento_id: str, usuario: dict, excluido: bool) -> dict:
    documento = banco.buscar('documentos', id=documento_id, usuario_id=usuario['id'])

    if not documento or (documento['excluido_em'] is not None) != excluido:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Documento não encontrado.')

    return documento


def ordenar_por_insercao(documentos: list[dict]) -> list[dict]:
    # Documentos novos ou restaurados aparecem primeiro.
    return sorted(documentos, key=lambda documento: documento['inserido_em'], reverse=True)


def obter_dados_documento(
    tipo: Annotated[str, Form()],
    nome: Annotated[str, Form()],
    validade: Annotated[str, Form()] = '',
    visibilidade: Annotated[str, Form()] = 'privado',
) -> DocumentoCriacao:
    # Os campos chegam como formulário (por causa da imagem) e são validados pelo Pydantic.
    try:
        return DocumentoCriacao(
            tipo=tipo,
            nome=nome,
            validade=validade,
            visibilidade=visibilidade,
        )
    except ValidationError as erro:
        raise RequestValidationError(
            [{**detalhe, 'loc': ('body', *detalhe['loc'])} for detalhe in erro.errors(include_url=False)]
        ) from erro


@roteador.get('', response_model=list[DocumentoSaida])
def listar_documentos(usuario: dict = Depends(obter_usuario_atual)):
    documentos = banco.filtrar('documentos', usuario_id=usuario['id'], excluido_em=None)
    return ordenar_por_insercao(documentos)


@roteador.post('', response_model=DocumentoSaida, status_code=status.HTTP_201_CREATED)
async def criar_documento(
    dados: Annotated[DocumentoCriacao, Depends(obter_dados_documento)],
    imagem: Annotated[UploadFile, File()],
    usuario: dict = Depends(obter_usuario_atual),
):
    documento_id = uuid.uuid4().hex
    nome_arquivo = await salvar_imagem(imagem, documento_id)
    data = agora()

    documento = {
        'id': documento_id,
        'usuario_id': usuario['id'],
        'tipo': dados.tipo,
        'nome': dados.nome,
        'validade': dados.validade.isoformat() if dados.validade else None,
        'visibilidade': dados.visibilidade,
        # Qualidade simulada da digitalização.
        'qualidade': random.randint(85, 100),
        'data': data,
        'inserido_em': data,
        'excluido_em': None,
        'arquivo': nome_arquivo,
    }

    banco.inserir('documentos', documento)
    return documento


@roteador.patch('/{documento_id}', response_model=DocumentoSaida)
def editar_documento(
    documento_id: str,
    dados: DocumentoEdicao,
    usuario: dict = Depends(obter_usuario_atual),
):
    buscar_documento_do_usuario(documento_id, usuario, excluido=False)

    campos = dados.model_dump(exclude_unset=True)

    if campos.get('visibilidade', '') is None:
        del campos['visibilidade']

    if 'validade' in campos:
        campos['validade'] = campos['validade'].isoformat() if campos['validade'] else None

    if not campos:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, 'Nenhum campo para atualizar.')

    [documento] = banco.atualizar('documentos', campos, id=documento_id)
    return documento


@roteador.delete('/{documento_id}', response_model=DocumentoSaida)
def mover_para_lixeira(documento_id: str, usuario: dict = Depends(obter_usuario_atual)):
    buscar_documento_do_usuario(documento_id, usuario, excluido=False)

    [documento] = banco.atualizar('documentos', {'excluido_em': agora()}, id=documento_id)
    return documento


@roteador.delete('', response_model=list[DocumentoSaida])
def mover_todos_para_lixeira(usuario: dict = Depends(obter_usuario_atual)):
    documentos = banco.atualizar(
        'documentos',
        {'excluido_em': agora()},
        usuario_id=usuario['id'],
        excluido_em=None,
    )
    return ordenar_por_insercao(documentos)


@roteador.get('/{documento_id}/imagem', response_class=FileResponse)
def obter_imagem(documento_id: str, usuario: dict = Depends(obter_usuario_da_imagem)):
    documento = banco.buscar('documentos', id=documento_id, usuario_id=usuario['id'])

    if not documento:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Documento não encontrado.')

    caminho = caminho_imagem(documento['arquivo'])

    if not caminho.exists():
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Imagem não encontrada.')

    return FileResponse(caminho)


def apagar_documentos(documentos: list[dict]) -> None:
    for documento in documentos:
        banco.remover('documentos', id=documento['id'])
        apagar_imagem(documento['arquivo'])
