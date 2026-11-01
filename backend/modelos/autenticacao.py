import re
from datetime import datetime

from pydantic import Field, field_validator, model_validator

from modelos.base import MensagemSaida, ModeloBase

PADRAO_EMAIL = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


def normalizar_email(valor: str) -> str:
    email = valor.strip().lower()

    if not PADRAO_EMAIL.match(email):
        raise ValueError('E-mail inválido.')

    return email


class LoginEntrada(ModeloBase):
    email: str = Field(max_length=254, examples=['admin@jovi.com'])
    senha: str = Field(min_length=1, max_length=128, examples=['Admin123'])
    lembrar: bool = False

    _normalizar_email = field_validator('email')(normalizar_email)

    @field_validator('senha')
    @classmethod
    def limpar_senha(cls, valor: str) -> str:
        senha = valor.strip()

        if not senha:
            raise ValueError('A senha é obrigatória.')

        return senha


class CadastroEntrada(ModeloBase):
    nome: str = Field(max_length=80, examples=['Maria Silva'])
    email: str = Field(max_length=254, examples=['maria@email.com'])
    senha: str = Field(max_length=128, examples=['Senha123'])
    confirmacao: str = Field(max_length=128, examples=['Senha123'])

    _normalizar_email = field_validator('email')(normalizar_email)

    @field_validator('nome')
    @classmethod
    def validar_nome(cls, valor: str) -> str:
        nome = ' '.join(valor.split())

        if len(nome) < 2:
            raise ValueError('Informe seu nome.')

        return nome

    @field_validator('senha')
    @classmethod
    def validar_senha(cls, valor: str) -> str:
        if len(valor) < 8:
            raise ValueError('A senha deve ter pelo menos 8 caracteres.')

        if not re.search(r'[A-Za-z]', valor) or not re.search(r'\d', valor):
            raise ValueError('A senha deve ter letras e números.')

        return valor

    @model_validator(mode='after')
    def validar_confirmacao(self):
        if self.senha != self.confirmacao:
            raise ValueError('A confirmação de senha não é igual.')

        return self


class UsuarioSaida(ModeloBase):
    id: int
    nome: str
    email: str


class LoginSaida(ModeloBase):
    token: str
    usuario: UsuarioSaida
    entrou_em: datetime
    expira_em: datetime


__all__ = ['CadastroEntrada', 'LoginEntrada', 'LoginSaida', 'MensagemSaida', 'UsuarioSaida']
