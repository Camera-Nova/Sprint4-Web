import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel

PADRAO_EMAIL = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


class ModeloBase(BaseModel):
    # Campos em snake_case no Python e camelCase no JSON (ex.: entrou_em -> entrouEm).
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class LoginEntrada(ModeloBase):
    email: str = Field(max_length=254, examples=['admin@jovi.com'])
    senha: str = Field(min_length=1, max_length=128, examples=['Admin123'])

    @field_validator('email')
    @classmethod
    def validar_email(cls, valor: str) -> str:
        email = valor.strip().lower()

        if not PADRAO_EMAIL.match(email):
            raise ValueError('E-mail inválido.')

        return email

    @field_validator('senha')
    @classmethod
    def limpar_senha(cls, valor: str) -> str:
        senha = valor.strip()

        if not senha:
            raise ValueError('A senha é obrigatória.')

        return senha


class UsuarioSaida(ModeloBase):
    id: int
    nome: str
    email: str


class LoginSaida(ModeloBase):
    token: str
    usuario: UsuarioSaida
    entrou_em: datetime


class MensagemSaida(ModeloBase):
    mensagem: str
