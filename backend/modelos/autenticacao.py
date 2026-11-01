import re
from datetime import datetime

from pydantic import Field, field_validator

from modelos.base import MensagemSaida, ModeloBase

PADRAO_EMAIL = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


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


__all__ = ['LoginEntrada', 'LoginSaida', 'MensagemSaida', 'UsuarioSaida']
