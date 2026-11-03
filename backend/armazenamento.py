from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from storage3.exceptions import StorageApiError

from banco import supabase
from config import SUPABASE_BUCKET, TAMANHO_MAXIMO_IMAGEM

EXTENSOES_POR_TIPO = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
}
TIPOS_POR_EXTENSAO = {extensao: tipo for tipo, extensao in EXTENSOES_POR_TIPO.items()}


async def salvar_imagem(imagem: UploadFile, documento_id: str) -> str:
    extensao = EXTENSOES_POR_TIPO.get(imagem.content_type)

    if not extensao:
        raise HTTPException(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            'A imagem deve ser JPEG, PNG ou WEBP.',
        )

    conteudo = await imagem.read()

    if not conteudo:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, 'A imagem está vazia.')

    if len(conteudo) > TAMANHO_MAXIMO_IMAGEM:
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            'A imagem deve ter no máximo 5 MB.',
        )

    nome_arquivo = f'{documento_id}{extensao}'
    supabase.storage.from_(SUPABASE_BUCKET).upload(
        nome_arquivo,
        conteudo,
        {'content-type': imagem.content_type},
    )

    return nome_arquivo


def baixar_imagem(nome_arquivo: str) -> bytes | None:
    try:
        return supabase.storage.from_(SUPABASE_BUCKET).download(nome_arquivo)
    except StorageApiError:
        return None


def tipo_imagem(nome_arquivo: str) -> str:
    return TIPOS_POR_EXTENSAO[Path(nome_arquivo).suffix]


def apagar_imagem(nome_arquivo: str | None) -> None:
    if nome_arquivo:
        supabase.storage.from_(SUPABASE_BUCKET).remove([nome_arquivo])
