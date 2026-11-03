from supabase import create_client

from config import SUPABASE_SERVICE_KEY, SUPABASE_URL

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise RuntimeError('Defina as variáveis de ambiente SUPABASE_URL e SUPABASE_SERVICE_KEY.')

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def aplicar_filtros(consulta, filtros: dict):
    for campo, valor in filtros.items():
        consulta = consulta.is_(campo, 'null') if valor is None else consulta.eq(campo, valor)

    return consulta


class BancoSupabase:
    def filtrar(self, colecao: str, **filtros) -> list[dict]:
        consulta = supabase.table(colecao).select('*')
        return aplicar_filtros(consulta, filtros).execute().data

    def buscar(self, colecao: str, **filtros) -> dict | None:
        consulta = supabase.table(colecao).select('*')
        itens = aplicar_filtros(consulta, filtros).limit(1).execute().data
        return itens[0] if itens else None

    def inserir(self, colecao: str, item: dict) -> dict:
        return supabase.table(colecao).insert(item).execute().data[0]

    def atualizar(self, colecao: str, campos: dict, **filtros) -> list[dict]:
        consulta = supabase.table(colecao).update(campos)
        return aplicar_filtros(consulta, filtros).execute().data

    def remover(self, colecao: str, **filtros) -> int:
        consulta = supabase.table(colecao).delete()
        return len(aplicar_filtros(consulta, filtros).execute().data)


banco = BancoSupabase()
