<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import ResumoCard from './components/ResumoCard.vue'
import StatusBadge from './components/StatusBadge.vue'
import FormAluno from './components/FormAluno.vue'
import AppFooter from './components/AppFooter.vue'

const STORAGE_KEY = 'edugestao-dados-v1'
const PRIMEIRA_MATRICULA = 100000
const QUANTIDADE_MATRICULAS = 900000
const turmas = ['6º A', '7º B', '8º A', '9º B']
const disciplinas = [
  { chave: 'portugues', nome: 'Português' },
  { chave: 'matematica', nome: 'Matemática' },
  { chave: 'ciencias', nome: 'Ciências' },
]
const alunosIniciais = [
  { id: 1, matricula: '104682', nome: 'Ana Beatriz Lima', turma: '6º A', email: 'ana.lima@escola.edu.br', responsavel: 'Mariana Lima', notas: { portugues: 9.2, matematica: 8.5, ciencias: 9.0 } },
  { id: 2, matricula: '286415', nome: 'Bruno Carvalho', turma: '7º B', email: 'bruno.carvalho@escola.edu.br', responsavel: 'Paulo Carvalho', notas: { portugues: 6.4, matematica: 5.8, ciencias: 6.7 } },
  { id: 3, matricula: '350927', nome: 'Camila Ferreira', turma: '8º A', email: 'camila.ferreira@escola.edu.br', responsavel: 'Renata Ferreira', notas: { portugues: 7.8, matematica: 8.1, ciencias: 7.5 } },
  { id: 4, matricula: '472163', nome: 'Diego Nascimento', turma: '9º B', email: 'diego.nascimento@escola.edu.br', responsavel: 'Carlos Nascimento', notas: { portugues: 4.5, matematica: 5.2, ciencias: 4.8 } },
  { id: 5, matricula: '583014', nome: 'Eduarda Santos', turma: '6º A', email: 'eduarda.santos@escola.edu.br', responsavel: 'Luciana Santos', notas: { portugues: 8.1, matematica: 9.0, ciencias: 8.4 } },
  { id: 6, matricula: '691258', nome: 'Felipe Moreira', turma: '7º B', email: 'felipe.moreira@escola.edu.br', responsavel: 'Roberto Moreira', notas: { portugues: 5.9, matematica: 6.2, ciencias: 5.6 } },
]

function gerarMatricula(matriculasUsadas) {
  if (matriculasUsadas.size >= QUANTIDADE_MATRICULAS) {
    throw new Error('Não há mais matrículas de seis dígitos disponíveis.')
  }

  const inicio = Math.floor(Math.random() * QUANTIDADE_MATRICULAS)
  for (let tentativa = 0; tentativa < QUANTIDADE_MATRICULAS; tentativa++) {
    const matricula = String(PRIMEIRA_MATRICULA + ((inicio + tentativa) % QUANTIDADE_MATRICULAS))
    if (!matriculasUsadas.has(matricula)) {
      matriculasUsadas.add(matricula)
      return matricula
    }
  }

  throw new Error('Não foi possível gerar uma matrícula única.')
}

function migrarMatriculas(lista) {
  const matriculasUsadas = new Set()
  const alunosMigrados = lista.map((aluno) => {
    const matricula = String(aluno.matricula ?? '').trim()
    if (/^\d{1,6}$/.test(matricula) && !matriculasUsadas.has(matricula)) {
      matriculasUsadas.add(matricula)
      return { ...aluno, matricula }
    }
    return { ...aluno, matricula: '' }
  })

  return alunosMigrados.map((aluno) => ({
    ...aluno,
    matricula: aluno.matricula || gerarMatricula(matriculasUsadas),
  }))
}

function carregarDados() {
  const salvo = localStorage.getItem(STORAGE_KEY)
  if (!salvo) return { alunos: migrarMatriculas(alunosIniciais), frequencia: {} }

  try {
    const dados = JSON.parse(salvo)
    if (Array.isArray(dados.alunos) && dados.frequencia && typeof dados.frequencia === 'object') {
      return { ...dados, alunos: migrarMatriculas(dados.alunos) }
    }
    console.error('Os dados locais do EduGestão estão em um formato inválido; usando os dados iniciais.')
  } catch (erro) {
    console.error('Não foi possível ler os dados locais do EduGestão; usando os dados iniciais.', erro)
  }
  return { alunos: migrarMatriculas(alunosIniciais), frequencia: {} }
}

const dadosIniciais = carregarDados()
const alunos = ref(dadosIniciais.alunos)
const frequencia = ref(dadosIniciais.frequencia)
const paginaAtiva = ref('visao-geral')
const menuAberto = ref(false)
const busca = ref('')
const buscaNotas = ref('')
const buscaFrequencia = ref('')
const filtroTurma = ref('Todas as turmas')
const filtroTurmaNotas = ref(turmas[0])
const turmaFrequencia = ref(turmas[0])
const modalAberto = ref(false)
const alunoEditando = ref(null)
const agora = new Date()
const dataHoje = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`
const hojeFormatado = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(agora)

watch([alunos, frequencia], ([lista, registros]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ alunos: lista, frequencia: registros }))
  } catch (erro) {
    console.error('Não foi possível salvar os dados do EduGestão neste navegador.', erro)
  }
}, { deep: true })

// Impede a rolagem do fundo enquanto o modal estiver aberto (classe do Bootstrap).
watch(modalAberto, (aberto) => {
  document.body.classList.toggle('modal-open', aberto)
})

onBeforeUnmount(() => {
  document.body.classList.remove('modal-open')
})

const paginas = [
  { id: 'visao-geral', nome: 'Visão geral', icone: 'bi-grid-1x2' },
  { id: 'alunos', nome: 'Alunos', icone: 'bi-people' },
  { id: 'turmas', nome: 'Turmas', icone: 'bi-diagram-3' },
  { id: 'notas', nome: 'Notas', icone: 'bi-clipboard-data' },
  { id: 'frequencia', nome: 'Frequência', icone: 'bi-check2-square' },
]

const tituloPagina = computed(() => paginas.find((pagina) => pagina.id === paginaAtiva.value)?.nome ?? 'Visão geral')

const alunosFiltrados = computed(() => alunos.value.filter((aluno) => {
  const correspondeBusca = correspondeMatricula(aluno, busca.value)
  return correspondeBusca && (filtroTurma.value === 'Todas as turmas' || aluno.turma === filtroTurma.value)
}))

const quantidadeAprovados = computed(() => alunos.value.filter((aluno) => mediaAluno(aluno) >= 7).length)

const mediaEscola = computed(() => {
  if (!alunos.value.length) return '0,0'
  return (alunos.value.reduce((soma, aluno) => soma + mediaAluno(aluno), 0) / alunos.value.length).toFixed(1).replace('.', ',')
})

const progressoMedia = computed(() => Number(mediaEscola.value.replace(',', '.')) * 10)
const percentualAprovados = computed(() => (
  alunos.value.length ? Math.round((quantidadeAprovados.value / alunos.value.length) * 100) : 0
))

const resumoFrequencia = computed(() => {
  const lista = alunos.value.filter((aluno) => aluno.turma === turmaFrequencia.value)
  if (!lista.length) return 0
  const presentes = lista.filter((aluno) => frequencia.value[dataHoje]?.[aluno.id] === true).length
  return Math.round((presentes / lista.length) * 100)
})

const alunosDaTurmaFrequencia = computed(() => alunos.value.filter((aluno) => aluno.turma === turmaFrequencia.value))

const alunosNotasFiltrados = computed(() => alunos.value.filter((aluno) => (
  aluno.turma === filtroTurmaNotas.value && correspondeMatricula(aluno, buscaNotas.value)
)))

const alunosFrequenciaFiltrados = computed(() => alunosDaTurmaFrequencia.value.filter((aluno) => (
  correspondeMatricula(aluno, buscaFrequencia.value)
)))

const turmasResumo = computed(() => turmas.map((nome, indice) => {
  const estudantes = alunos.value.filter((aluno) => aluno.turma === nome)
  const media = estudantes.length
    ? (estudantes.reduce((soma, aluno) => soma + mediaAluno(aluno), 0) / estudantes.length).toFixed(1).replace('.', ',')
    : '—'
  return { nome, codigo: `TUR-${String(indice + 1).padStart(3, '0')}`, estudantes, media }
}))

function mediaAluno(aluno) {
  const valores = disciplinas.map(({ chave }) => Number(aluno.notas?.[chave] ?? 0))
  return valores.reduce((soma, nota) => soma + nota, 0) / valores.length
}

function correspondeMatricula(aluno, consulta) {
  const texto = consulta.trim()
  if (!texto) return true
  const digitos = texto.replace(/\D/g, '')
  return digitos.length > 0 && aluno.matricula.includes(digitos)
}

function situacaoAluno(aluno) {
  const media = mediaAluno(aluno)
  if (media >= 7) return 'Aprovado'
  if (media >= 5) return 'Em recuperação'
  return 'Atenção'
}

function tipoSituacao(aluno) {
  const media = mediaAluno(aluno)
  if (media >= 7) return 'aprovado'
  if (media >= 5) return 'recuperacao'
  return 'atencao'
}

function formatarMedia(aluno) {
  return mediaAluno(aluno).toFixed(1).replace('.', ',')
}

function textoFrequencia(aluno) {
  const registro = frequencia.value[dataHoje]?.[aluno.id]
  if (registro === true) return 'Presente'
  if (registro === false) return 'Ausente'
  return 'Não registrado'
}

function tipoFrequencia(aluno) {
  const registro = frequencia.value[dataHoje]?.[aluno.id]
  if (registro === true) return 'aprovado'
  if (registro === false) return 'atencao'
  return 'pendente'
}

function abrirCadastro(aluno = null) {
  alunoEditando.value = aluno
  modalAberto.value = true
}

function fecharModal() {
  modalAberto.value = false
  alunoEditando.value = null
}

function salvarAluno(dados) {
  if (alunoEditando.value) {
    Object.assign(alunoEditando.value, dados)
  } else {
    const id = Math.max(0, ...alunos.value.map((aluno) => aluno.id)) + 1
    const matriculasUsadas = new Set(alunos.value.map((aluno) => aluno.matricula))
    alunos.value.push({
      id,
      matricula: gerarMatricula(matriculasUsadas),
      ...dados,
      notas: { portugues: 0, matematica: 0, ciencias: 0 },
    })
  }

  fecharModal()
}

function removerAluno(aluno) {
  if (!window.confirm(`Deseja remover ${aluno.nome} do cadastro?`)) return
  alunos.value = alunos.value.filter((item) => item.id !== aluno.id)
  for (const registros of Object.values(frequencia.value)) {
    delete registros[aluno.id]
  }
}

function alternarPresenca(aluno) {
  if (!frequencia.value[dataHoje]) frequencia.value[dataHoje] = {}
  const presencaAtual = frequencia.value[dataHoje][aluno.id]
  frequencia.value[dataHoje][aluno.id] = presencaAtual === undefined || presencaAtual === false
}

function irPara(pagina) {
  paginaAtiva.value = pagina
  busca.value = ''
  menuAberto.value = false
}
</script>

<template>
  <div class="layout">
    <AppSidebar
      :paginas="paginas"
      :pagina-ativa="paginaAtiva"
      :aberta="menuAberto"
      @navegar="irPara"
      @fechar="menuAberto = false"
    />

    <main class="conteudo">
      <AppHeader
        v-model="busca"
        :titulo="tituloPagina"
        :data="hojeFormatado"
        :menu-aberto="menuAberto"
        @abrir-menu="menuAberto = true"
        @buscar="paginaAtiva = 'alunos'"
      />

      <section v-if="paginaAtiva === 'visao-geral'" class="painel">
        <div class="boas-vindas d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
          <div>
            <p class="sobretitulo">PAINEL DA ESCOLA</p>
            <h2>Bom dia, equipe! <span>✦</span></h2>
            <p>Acompanhe o que está acontecendo na sua escola hoje.</p>
          </div>
          <button class="btn btn-primary botao-novo" type="button" @click="abrirCadastro()">
            <i class="bi bi-plus-lg me-1"></i>Novo aluno
          </button>
        </div>

        <div class="cartoes-resumo">
          <div class="row row-cols-2 row-cols-xl-4 g-3">
            <div class="col">
              <ResumoCard
                titulo="Total de alunos"
                :valor="alunos.length"
                icone="bi-people"
                cor="lilas"
                :mini-barras="true"
              >
                <template #detalhe><b>↑ {{ turmas.length }} turmas</b> cadastradas</template>
              </ResumoCard>
            </div>

            <div class="col">
              <ResumoCard
                titulo="Média geral"
                :valor="mediaEscola"
                sufixo="/10"
                icone="bi-graph-up-arrow"
                cor="azul"
                :progresso="progressoMedia"
                cor-progresso="roxo"
              >
                <template #detalhe><b class="texto-verde">Desempenho acadêmico</b></template>
              </ResumoCard>
            </div>

            <div class="col">
              <ResumoCard
                titulo="Frequência hoje"
                :valor="resumoFrequencia"
                sufixo="%"
                icone="bi-calendar-check"
                cor="verde"
                :progresso="resumoFrequencia"
                cor-progresso="verde"
              >
                <template #detalhe><b class="texto-verde">Na turma {{ turmaFrequencia }}</b></template>
              </ResumoCard>
            </div>

            <div class="col">
              <ResumoCard
                titulo="Alunos aprovados"
                :valor="quantidadeAprovados"
                :sufixo="`/${alunos.length}`"
                icone="bi-award"
                cor="laranja"
                :progresso="percentualAprovados"
                cor-progresso="laranja"
              >
                <template #detalhe><b>Com média a partir de 7,0</b></template>
              </ResumoCard>
            </div>
          </div>
        </div>

        <div class="grade-painel">
          <div class="row g-3">
            <div class="col-12 col-xl-8">
              <section class="bloco h-100">
                <div class="bloco__cabecalho">
                  <div><h3>Alunos recentes</h3><p>Visão rápida dos estudantes cadastrados</p></div>
                  <button class="link-acao" type="button" @click="irPara('alunos')">
                    Ver todos <i class="bi bi-arrow-right"></i>
                  </button>
                </div>

                <div class="table-responsive tabela-wrap">
                  <table class="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th>MATRÍCULA</th>
                        <th>ALUNO</th>
                        <th>TURMA</th>
                        <th>MÉDIA</th>
                        <th>SITUAÇÃO</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="aluno in alunos.slice(0, 5)" :key="aluno.id">
                        <td><span class="matricula">{{ aluno.matricula }}</span></td>
                        <td>
                          <div class="aluno-identidade">
                            <span class="avatar" :class="`avatar--${aluno.id % 4}`">
                              {{ aluno.nome.split(' ').map((parte) => parte[0]).slice(0, 2).join('') }}
                            </span>
                            <strong>{{ aluno.nome }}</strong>
                          </div>
                        </td>
                        <td><span class="tag-turma">{{ aluno.turma }}</span></td>
                        <td><strong>{{ formatarMedia(aluno) }}</strong></td>
                        <td><StatusBadge :texto="situacaoAluno(aluno)" :tipo="tipoSituacao(aluno)" /></td>
                      </tr>
                      <tr v-if="!alunos.length">
                        <td colspan="5" class="vazio">Cadastre o primeiro aluno para começar.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <div class="col-12 col-xl-4">
              <section class="bloco turmas-bloco h-100">
                <div class="bloco__cabecalho">
                  <div><h3>Turmas</h3><p>Resumo por sala</p></div>
                  <button class="link-acao" type="button" @click="irPara('turmas')">
                    Ver todas <i class="bi bi-arrow-right"></i>
                  </button>
                </div>

                <button
                  v-for="turma in turmasResumo"
                  :key="turma.nome"
                  class="linha-turma"
                  type="button"
                  @click="filtroTurma = turma.nome; irPara('alunos')"
                >
                  <span class="turma-mini">{{ turma.nome }}</span>
                  <span class="linha-turma__texto"><strong>{{ turma.nome }}</strong><small>{{ turma.estudantes.length }} alunos</small></span>
                  <span class="linha-turma__media">{{ turma.media }}<small>média</small></span>
                  <span class="linha-turma__seta"><i class="bi bi-arrow-right"></i></span>
                </button>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section v-else-if="paginaAtiva === 'alunos'" class="painel">
        <div class="pagina-intro d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
          <div>
            <p class="sobretitulo">CADASTRO ACADÊMICO</p>
            <h2>Alunos</h2>
            <p>Gerencie os estudantes e seus dados escolares.</p>
          </div>
          <button class="btn btn-primary botao-novo" type="button" @click="abrirCadastro()">
            <i class="bi bi-plus-lg me-1"></i>Novo aluno
          </button>
        </div>

        <section class="bloco">
          <div class="filtros">
            <label class="busca-tabela">
              <i class="bi bi-search" aria-hidden="true"></i>
              <input
                v-model="busca"
                type="search"
                inputmode="numeric"
                placeholder="Buscar por matrícula..."
                aria-label="Buscar aluno pela matrícula"
              />
            </label>

            <select v-model="filtroTurma" class="form-select form-select-sm filtro-select" aria-label="Filtrar por turma">
              <option>Todas as turmas</option>
              <option v-for="turma in turmas" :key="turma">{{ turma }}</option>
            </select>

            <span class="total-registros">{{ alunosFiltrados.length }} aluno(s)</span>
          </div>

          <div class="table-responsive tabela-wrap">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>MATRÍCULA</th>
                  <th>ALUNO</th>
                  <th>TURMA</th>
                  <th>RESPONSÁVEL</th>
                  <th>MÉDIA</th>
                  <th>SITUAÇÃO</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aluno in alunosFiltrados" :key="aluno.id">
                  <td><span class="matricula">{{ aluno.matricula }}</span></td>
                  <td>
                    <div class="aluno-identidade">
                      <span class="avatar" :class="`avatar--${aluno.id % 4}`">
                        {{ aluno.nome.split(' ').map((parte) => parte[0]).slice(0, 2).join('') }}
                      </span>
                      <span>
                        <strong>{{ aluno.nome }}</strong>
                        <small>{{ aluno.email || 'E-mail não informado' }}</small>
                      </span>
                    </div>
                  </td>
                  <td><span class="tag-turma">{{ aluno.turma }}</span></td>
                  <td>{{ aluno.responsavel || '—' }}</td>
                  <td><strong>{{ formatarMedia(aluno) }}</strong></td>
                  <td><StatusBadge :texto="situacaoAluno(aluno)" :tipo="tipoSituacao(aluno)" /></td>
                  <td>
                    <div class="acoes-linha">
                      <button class="btn btn-sm btn-outline-primary" type="button" @click="abrirCadastro(aluno)">
                        <i class="bi bi-pencil-square"></i><span class="d-none d-xl-inline ms-1">Editar</span>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" type="button" @click="removerAluno(aluno)">
                        <i class="bi bi-trash"></i><span class="d-none d-xl-inline ms-1">Remover</span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!alunosFiltrados.length">
                  <td colspan="7" class="vazio">Nenhum aluno encontrado para esta matrícula. Confira os dígitos e tente novamente.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section v-else-if="paginaAtiva === 'turmas'" class="painel">
        <div class="pagina-intro">
          <div>
            <p class="sobretitulo">ORGANIZAÇÃO ESCOLAR</p>
            <h2>Turmas</h2>
            <p>Acompanhe alunos e desempenho de cada turma.</p>
          </div>
        </div>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-3 cartoes-turmas">
          <div v-for="turma in turmasResumo" :key="turma.nome" class="col">
            <article class="card cartao-turma h-100">
              <div class="card-body">
                <div class="cartao-turma__topo">
                  <span class="turma-mini">{{ turma.nome }}</span>
                  <span class="tag-turma">{{ turma.codigo }}</span>
                </div>
                <h3>Turma {{ turma.nome }}</h3>
                <p>Ensino fundamental</p>
                <div class="cartao-turma__dados">
                  <div><strong>{{ turma.estudantes.length }}</strong><small>alunos</small></div>
                  <div><strong>{{ turma.media }}</strong><small>média geral</small></div>
                </div>
                <button class="link-acao" type="button" @click="filtroTurma = turma.nome; irPara('alunos')">
                  Ver estudantes <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section v-else-if="paginaAtiva === 'notas'" class="painel">
        <div class="pagina-intro">
          <div>
            <p class="sobretitulo">ACOMPANHAMENTO PEDAGÓGICO</p>
            <h2>Notas e desempenho</h2>
            <p>Registre as notas por disciplina. As médias são atualizadas automaticamente.</p>
          </div>
        </div>

        <section class="bloco">
          <div class="bloco__cabecalho notas-cabecalho">
            <div><h3>Boletim da turma</h3><p>Notas de 0 a 10 · situação calculada pela média</p></div>
            <select v-model="filtroTurmaNotas" class="form-select form-select-sm filtro-select" aria-label="Selecionar turma">
              <option v-for="turma in turmas" :key="turma">{{ turma }}</option>
            </select>
          </div>

          <div class="filtros filtro-matricula">
            <label class="busca-tabela">
              <i class="bi bi-search" aria-hidden="true"></i>
              <input
                v-model="buscaNotas"
                type="search"
                inputmode="numeric"
                placeholder="Localizar aluno pela matrícula..."
                aria-label="Localizar aluno pela matrícula"
              />
            </label>
            <span class="total-registros">{{ alunosNotasFiltrados.length }} aluno(s)</span>
          </div>

          <div class="table-responsive tabela-wrap">
            <table class="table table-hover align-middle mb-0 tabela-notas">
              <thead>
                <tr>
                  <th>MATRÍCULA</th>
                  <th>ALUNO</th>
                  <th v-for="disciplina in disciplinas" :key="disciplina.chave">{{ disciplina.nome.toUpperCase() }}</th>
                  <th>MÉDIA</th>
                  <th>SITUAÇÃO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aluno in alunosNotasFiltrados" :key="aluno.id">
                  <td><span class="matricula">{{ aluno.matricula }}</span></td>
                  <td><strong>{{ aluno.nome }}</strong></td>
                  <td v-for="disciplina in disciplinas" :key="disciplina.chave">
                    <input
                      v-model.number="aluno.notas[disciplina.chave]"
                      class="form-control form-control-sm nota-input"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      :aria-label="`${disciplina.nome} - ${aluno.nome}`"
                    />
                  </td>
                  <td><strong>{{ formatarMedia(aluno) }}</strong></td>
                  <td><StatusBadge :texto="situacaoAluno(aluno)" :tipo="tipoSituacao(aluno)" /></td>
                </tr>
                <tr v-if="!alunosNotasFiltrados.length">
                  <td :colspan="disciplinas.length + 4" class="vazio">
                    {{ buscaNotas ? 'Nenhum aluno encontrado para esta matrícula nesta turma.' : 'Ainda não há alunos nesta turma.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section v-else class="painel">
        <div class="pagina-intro">
          <div>
            <p class="sobretitulo">ROTINA ESCOLAR</p>
            <h2>Frequência</h2>
            <p>Registre a presença dos alunos para {{ hojeFormatado }}.</p>
          </div>
        </div>

        <section class="bloco">
          <div class="bloco__cabecalho frequencia-cabecalho">
            <div>
              <h3>Chamada diária</h3>
              <p>{{ alunosDaTurmaFrequencia.length }} alunos na turma · {{ resumoFrequencia }}% presentes</p>
            </div>
            <select v-model="turmaFrequencia" class="form-select form-select-sm filtro-select" aria-label="Selecionar turma para chamada">
              <option v-for="turma in turmas" :key="turma">{{ turma }}</option>
            </select>
          </div>

          <div class="filtros filtro-matricula">
            <label class="busca-tabela">
              <i class="bi bi-search" aria-hidden="true"></i>
              <input
                v-model="buscaFrequencia"
                type="search"
                inputmode="numeric"
                placeholder="Localizar aluno pela matrícula..."
                aria-label="Localizar aluno pela matrícula"
              />
            </label>
            <span class="total-registros">{{ alunosFrequenciaFiltrados.length }} aluno(s)</span>
          </div>

          <div class="table-responsive tabela-wrap">
            <table class="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>MATRÍCULA</th>
                  <th>ALUNO</th>
                  <th>TURMA</th>
                  <th>STATUS DE HOJE</th>
                  <th>REGISTRO</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aluno in alunosFrequenciaFiltrados" :key="aluno.id">
                  <td><span class="matricula">{{ aluno.matricula }}</span></td>
                  <td>
                    <div class="aluno-identidade">
                      <span class="avatar" :class="`avatar--${aluno.id % 4}`">
                        {{ aluno.nome.split(' ').map((parte) => parte[0]).slice(0, 2).join('') }}
                      </span>
                      <strong>{{ aluno.nome }}</strong>
                    </div>
                  </td>
                  <td><span class="tag-turma">{{ aluno.turma }}</span></td>
                  <td><StatusBadge :texto="textoFrequencia(aluno)" :tipo="tipoFrequencia(aluno)" /></td>
                  <td>
                    <button
                      class="btn btn-sm botao-presenca"
                      :class="frequencia[dataHoje]?.[aluno.id] === true
                        ? 'botao-presenca--presente'
                        : frequencia[dataHoje]?.[aluno.id] === false
                          ? 'botao-presenca--ausente'
                          : 'botao-presenca--neutro'"
                      type="button"
                      @click="alternarPresenca(aluno)"
                    >
                      <i class="bi" :class="frequencia[dataHoje]?.[aluno.id] === true ? 'bi-x-lg' : 'bi-check-lg'"></i>
                      <span class="ms-1">
                        {{ frequencia[dataHoje]?.[aluno.id] === true
                          ? 'Marcar ausência'
                          : frequencia[dataHoje]?.[aluno.id] === false
                            ? 'Marcar presença'
                            : 'Registrar presença' }}
                      </span>
                    </button>
                  </td>
                </tr>
                <tr v-if="!alunosFrequenciaFiltrados.length">
                  <td colspan="5" class="vazio">
                    {{ buscaFrequencia ? 'Nenhum aluno encontrado para esta matrícula nesta turma.' : 'Não há alunos cadastrados nesta turma.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <AppFooter :ano="2025" />
    </main>

    <FormAluno
      :aberto="modalAberto"
      :aluno="alunoEditando"
      :turmas="turmas"
      @salvar="salvarAluno"
      @fechar="fecharModal"
    />
  </div>
</template>
