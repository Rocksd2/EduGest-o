// Integração com a API pública DummyJSON: não exige chave, token nem cadastro.
const BASE_URL = 'https://dummyjson.com'

export async function buscarUsuarios(termo = '') {
  const consulta = termo.trim()
  const caminho = consulta
    ? `/users/search?q=${encodeURIComponent(consulta)}&limit=8`
    : '/users?limit=8'

  const resposta = await fetch(`${BASE_URL}${caminho}`)
  if (!resposta.ok) {
    throw new Error(`A API respondeu com o status ${resposta.status}.`)
  }

  const dados = await resposta.json()
  return Array.isArray(dados.users) ? dados.users : []
}
