from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from config import PASTA_UPLOADS, TAMANHO_MAXIMO_IMAGEM

EXTENSOES_POR_TIPO = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
}


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

    PASTA_UPLOADS.mkdir(parents=True, exist_ok=True)
    nome_arquivo = f'{documento_id}{extensao}'
    (PASTA_UPLOADS / nome_arquivo).write_bytes(conteudo)

    return nome_arquivo


def caminho_imagem(nome_arquivo: str) -> Path:
    return PASTA_UPLOADS / nome_arquivo


def apagar_imagem(nome_arquivo: str | None) -> None:
    if nome_arquivo:
        caminho_imagem(nome_arquivo).unlink(missing_ok=True)
