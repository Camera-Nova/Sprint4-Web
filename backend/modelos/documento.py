from datetime import date, datetime
from typing import Literal

from pydantic import Field, field_validator

from modelos.base import ModeloBase

TipoDocumento = Literal['Documento', 'RG / CNH', 'Manuscrito', 'Tradução']
Visibilidade = Literal['privado', 'publico']


def limpar_nome(valor: str | None) -> str:
    nome = (valor or '').strip()

    if not nome:
        raise ValueError('O nome do documento é obrigatório.')

    return nome


def converter_validade_vazia(valor):
    return None if valor == '' else valor


class DocumentoCriacao(ModeloBase):
    tipo: TipoDocumento
    nome: str = Field(max_length=120)
    validade: date | None = None
    visibilidade: Visibilidade = 'privado'

    _limpar_nome = field_validator('nome')(limpar_nome)
    _validade_vazia = field_validator('validade', mode='before')(converter_validade_vazia)


class DocumentoEdicao(ModeloBase):
    nome: str | None = Field(default=None, max_length=120)
    validade: date | None = None
    visibilidade: Visibilidade | None = None

    _limpar_nome = field_validator('nome')(limpar_nome)
    _validade_vazia = field_validator('validade', mode='before')(converter_validade_vazia)


class DocumentoSaida(ModeloBase):
    id: str
    tipo: TipoDocumento
    nome: str
    validade: date | None
    visibilidade: Visibilidade
    qualidade: int
    data: datetime
    excluido_em: datetime | None = None
