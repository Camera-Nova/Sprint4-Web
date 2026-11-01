from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status

from banco import banco
from dependencias import obter_token, obter_usuario_atual
from modelos.autenticacao import LoginEntrada, LoginSaida, MensagemSaida, UsuarioSaida
from seguranca import gerar_token, verificar_senha
from tentativas import limpar_tentativas, registrar_falha, verificar_bloqueio

roteador = APIRouter(prefix='/auth', tags=['Autenticação'])


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

    entrou_em = datetime.now(timezone.utc)
    token = gerar_token()

    banco.inserir(
        'sessoes',
        {
            'token': token,
            'usuario_id': usuario['id'],
            'entrou_em': entrou_em.isoformat(),
        },
    )

    return LoginSaida(
        token=token,
        usuario=UsuarioSaida(**usuario),
        entrou_em=entrou_em,
    )


@roteador.get('/me', response_model=UsuarioSaida)
def usuario_logado(usuario: dict = Depends(obter_usuario_atual)):
    return UsuarioSaida(**usuario)


@roteador.post('/logout', response_model=MensagemSaida)
def sair(token: str = Depends(obter_token)):
    banco.remover('sessoes', token=token)
    return MensagemSaida(mensagem='Sessão encerrada.')
