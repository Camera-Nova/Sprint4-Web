from datetime import datetime

from pydantic import Field, model_validator

from modelos.base import ModeloBase


class SenhaPrivadaEntrada(ModeloBase):
    senha: str = Field(max_length=128)
    confirmacao: str = Field(max_length=128)

    @model_validator(mode='after')
    def validar_senha(self):
        if len(self.senha.strip()) < 4:
            raise ValueError('A senha deve ter pelo menos 4 caracteres.')

        if self.senha != self.confirmacao:
            raise ValueError('A confirmação de senha não é igual.')

        return self


class SenhaPrivadaStatus(ModeloBase):
    configurada: bool


class SenhaPrivadaVerificacao(ModeloBase):
    senha: str = Field(min_length=1, max_length=128)


class LiberacaoSaida(ModeloBase):
    chave: str
    expira_em: datetime
