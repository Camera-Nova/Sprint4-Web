from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ModeloBase(BaseModel):
    # Campos em snake_case no Python e camelCase no JSON (ex.: entrou_em -> entrouEm).
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class MensagemSaida(ModeloBase):
    mensagem: str
