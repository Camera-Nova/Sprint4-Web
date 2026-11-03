from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from banco import banco
from config import DURACAO_SESSAO, DURACAO_SESSAO_LEMBRAR
from dependencias import obter_token, obter_usuario_atual
from modelos.autenticacao import (
    CadastroEntrada,
    LoginEntrada,
    LoginSaida,
    MensagemSaida,
    UsuarioSaida,
)
from seguranca import gerar_hash_senha, gerar_token_sessao, verificar_senha
from tentativas import limpar_tentativas, registrar_falha, verificar_bloqueio

roteador = APIRouter(prefix='/auth', tags=['Autenticação'])


def criar_sessao(usuario: dict, lembrar: bool) -> LoginSaida:
    entrou_em = datetime.now(timezone.utc)
    expira_em = entrou_em + (DURACAO_SESSAO_LEMBRAR if lembrar else DURACAO_SESSAO)

    return LoginSaida(
        token=gerar_token_sessao(usuario, expira_em),
        usuario=UsuarioSaida(**usuario),
        entrou_em=entrou_em,
        expira_em=expira_em,
    )


@roteador.post('/login', response_model=LoginSaida)
def entrar(dados: LoginEntrada):
    chave_tentativas = f'login:{dados.email}'
    verificar_bloqueio(chave_tentativas)

    usuario = banco.buscar('usuarios', email=dados.email)

    if not usuario or not verificar_senha(dados.senha, usuario['senha_hash']):
        registrar_falha(
            chave_tentativas,
            status.HTTP_401_UNAUTHORIZED,
            'E-mail ou senha inválidos.',
        )

    limpar_tentativas(chave_tentativas)

    return criar_sessao(usuario, dados.lembrar)


@roteador.post('/cadastro', response_model=LoginSaida, status_code=status.HTTP_201_CREATED)
def cadastrar(dados: CadastroEntrada):
    if banco.buscar('usuarios', email=dados.email):
        raise HTTPException(status.HTTP_409_CONFLICT, 'Já existe uma conta com este e-mail.')

    usuario = banco.inserir(
        'usuarios',
        {
            'nome': dados.nome,
            'email': dados.email,
            'senha_hash': gerar_hash_senha(dados.senha),
        },
    )

    return criar_sessao(usuario, lembrar=False)


@roteador.get('/me', response_model=UsuarioSaida)
def usuario_logado(usuario: dict = Depends(obter_usuario_atual)):
    return UsuarioSaida(**usuario)


@roteador.post('/logout', response_model=MensagemSaida, dependencies=[Depends(obter_token)])
def sair():
    return MensagemSaida(mensagem='Sessão encerrada.')
