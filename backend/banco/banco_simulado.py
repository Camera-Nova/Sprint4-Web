import json
import threading
from copy import deepcopy
from pathlib import Path

from config import CAMINHO_DADOS
from seguranca import gerar_hash_senha


def criar_dados_iniciais() -> dict:
    return {
        'usuarios': [
            {
                'id': 1,
                'nome': 'Administrador',
                'email': 'admin@jovi.com',
                'senha_hash': gerar_hash_senha('Admin123'),
            }
        ],
        'sessoes': [],
        'documentos': [],
    }


class BancoSimulado:
    def __init__(self, caminho: Path):
        self.caminho = caminho
        self.trava = threading.Lock()
        self.dados = self.carregar()

    def carregar(self) -> dict:
        if self.caminho.exists():
            with open(self.caminho, encoding='utf-8') as arquivo:
                return json.load(arquivo)

        dados = criar_dados_iniciais()
        self.salvar(dados)
        return dados

    def salvar(self, dados: dict | None = None) -> None:
        self.caminho.parent.mkdir(parents=True, exist_ok=True)
        temporario = self.caminho.with_suffix('.tmp')

        with open(temporario, 'w', encoding='utf-8') as arquivo:
            json.dump(dados if dados is not None else self.dados, arquivo, ensure_ascii=False, indent=2)

        temporario.replace(self.caminho)

    def listar(self, colecao: str) -> list[dict]:
        with self.trava:
            return deepcopy(self.dados.get(colecao, []))

    def filtrar(self, colecao: str, **filtros) -> list[dict]:
        with self.trava:
            return [
                deepcopy(item)
                for item in self.dados.get(colecao, [])
                if all(item.get(campo) == valor for campo, valor in filtros.items())
            ]

    def buscar(self, colecao: str, **filtros) -> dict | None:
        with self.trava:
            for item in self.dados.get(colecao, []):
                if all(item.get(campo) == valor for campo, valor in filtros.items()):
                    return deepcopy(item)
        return None

    def inserir(self, colecao: str, item: dict) -> dict:
        with self.trava:
            self.dados.setdefault(colecao, []).append(deepcopy(item))
            self.salvar()
        return item

    def atualizar(self, colecao: str, campos: dict, **filtros) -> list[dict]:
        atualizados = []

        with self.trava:
            for item in self.dados.get(colecao, []):
                if all(item.get(campo) == valor for campo, valor in filtros.items()):
                    item.update(deepcopy(campos))
                    atualizados.append(deepcopy(item))

            if atualizados:
                self.salvar()

        return atualizados

    def remover(self, colecao: str, **filtros) -> int:
        with self.trava:
            itens = self.dados.get(colecao, [])
            restantes = [
                item for item in itens
                if not all(item.get(campo) == valor for campo, valor in filtros.items())
            ]
            removidos = len(itens) - len(restantes)
            self.dados[colecao] = restantes

            if removidos:
                self.salvar()

        return removidos


banco = BancoSimulado(CAMINHO_DADOS)
