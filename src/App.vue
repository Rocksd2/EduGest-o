<script setup>
import { computed, ref, watch } from 'vue'

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
const busca = ref('')
const buscaNotas = ref('')
const buscaFrequencia = ref('')
const filtroTurma = ref('Todas as turmas')
const turmaFrequencia = ref(turmas[0])
const modalAberto = ref(false)
const alunoEditando = ref(null)
const erroFormulario = ref('')
const formulario = ref({ nome: '', turma: '', email: '', responsavel: '' })
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

const paginas = [
  { id: 'visao-geral', nome: 'Visão geral', icone: '▦' },
  { id: 'alunos', nome: 'Alunos', icone: '♧' },
  { id: 'turmas', nome: 'Turmas', icone: '▤' },
  { id: 'notas', nome: 'Notas', icone: '◷' },
  { id: 'frequencia', nome: 'Frequência', icone: '✓' },
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
const resumoFrequencia = computed(() => {
  const lista = alunos.value.filter((aluno) => aluno.turma === turmaFrequencia.value)
  if (!lista.length) return 0
  const presentes = lista.filter((aluno) => frequencia.value[dataHoje]?.[aluno.id] === true).length
  return Math.round((presentes / lista.length) * 100)
})
const alunosDaTurmaFrequencia = computed(() => alunos.value.filter((aluno) => aluno.turma === turmaFrequencia.value))
const alunosNotasFiltrados = computed(() => alunos.value.filter((aluno) => (
  aluno.turma === filtroTurma.value && correspondeMatricula(aluno, buscaNotas.value)
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

function classeSituacao(aluno) {
  const media = mediaAluno(aluno)
  if (media >= 7) return 'status--aprovado'
  if (media >= 5) return 'status--recuperacao'
  return 'status--atencao'
}

function formatarMedia(aluno) {
  return mediaAluno(aluno).toFixed(1).replace('.', ',')
}

function abrirCadastro(aluno = null) {
  alunoEditando.value = aluno
  formulario.value = aluno
    ? { nome: aluno.nome, turma: aluno.turma, email: aluno.email, responsavel: aluno.responsavel }
    : { nome: '', turma: '', email: '', responsavel: '' }
  erroFormulario.value = ''
  modalAberto.value = true
}

function salvarAluno() {
  const nome = formulario.value.nome.trim()
  if (nome.length < 3 || !formulario.value.turma) {
    erroFormulario.value = 'Informe o nome completo e selecione uma turma.'
    return
  }
  if (alunoEditando.value) {
    Object.assign(alunoEditando.value, { ...formulario.value, nome })
  } else {
    const id = Math.max(0, ...alunos.value.map((aluno) => aluno.id)) + 1
    const matriculasUsadas = new Set(alunos.value.map((aluno) => aluno.matricula))
    alunos.value.push({
      id,
      matricula: gerarMatricula(matriculasUsadas),
      ...formulario.value,
      nome,
      notas: { portugues: 0, matematica: 0, ciencias: 0 },
    })
  }
  modalAberto.value = false
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
}
</script>

<template>
  <div class="layout">
    <aside class="barra-lateral">
      <a class="marca" href="#" @click.prevent="irPara('visao-geral')">
        <span class="marca__simbolo">E</span>
        <span class="marca__texto"><strong>edu</strong>gestão<small>GESTÃO ESCOLAR</small></span>
      </a>

      <p class="menu__rotulo">MENU PRINCIPAL</p>
      <nav class="menu" aria-label="Menu principal">
        <button
          v-for="pagina in paginas"
          :key="pagina.id"
          type="button"
          :class="{ 'menu__item--ativo': paginaAtiva === pagina.id }"
          @click="irPara(pagina.id)"
        >
          <span class="menu__icone" aria-hidden="true">{{ pagina.icone }}</span>
          {{ pagina.nome }}
        </button>
      </nav>

      <div class="escola-card">
        <span class="escola-card__icone">✦</span>
        <div><strong>Escola Horizonte</strong><small>Ano letivo 2025</small></div>
        <span class="escola-card__seta">⌄</span>
      </div>
      <div class="perfil">
        <div class="perfil__avatar">AD</div>
        <div><strong>Administração</strong><small>Coordenação</small></div>
        <span class="perfil__mais">···</span>
      </div>
    </aside>

    <main class="conteudo">
      <header class="cabecalho">
        <div class="cabecalho__titulo">
          <p class="data-atual">{{ hojeFormatado }}</p>
          <h1>{{ tituloPagina }}</h1>
        </div>
        <div class="cabecalho__acoes">
          <label class="busca-global">
            <span aria-hidden="true">⌕</span>
            <input v-model="busca" type="search" inputmode="numeric" placeholder="Buscar matrícula..." aria-label="Buscar por matrícula" @focus="paginaAtiva = 'alunos'" />
            <kbd>⌘ K</kbd>
          </label>
          <button class="botao-icone" type="button" aria-label="Notificações">♧<i></i></button>
          <button class="avatar avatar--cabecalho" type="button" aria-label="Perfil da administração">AD</button>
        </div>
      </header>

      <section v-if="paginaAtiva === 'visao-geral'" class="painel">
        <div class="boas-vindas">
          <div>
            <p class="sobretitulo">PAINEL DA ESCOLA</p>
            <h2>Bom dia, equipe! <span>✦</span></h2>
            <p>Acompanhe o que está acontecendo na sua escola hoje.</p>
          </div>
          <button class="botao botao--primario" type="button" @click="abrirCadastro()">＋ <span>Novo aluno</span></button>
        </div>

        <div class="cartoes-resumo">
          <article class="cartao-resumo">
            <div class="cartao-resumo__topo"><span>Total de alunos</span><span class="cartao-icone cartao-icone--lilas">♧</span></div>
            <strong>{{ alunos.length }}</strong><small><b>↑ {{ turmas.length }} turmas</b> cadastradas</small>
            <div class="mini-barras" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </article>
          <article class="cartao-resumo">
            <div class="cartao-resumo__topo"><span>Média geral</span><span class="cartao-icone cartao-icone--azul">◷</span></div>
            <strong>{{ mediaEscola }}<small class="nota-total">/10</small></strong><small><b class="texto-verde">Desempenho acadêmico</b></small>
            <div class="barra-progresso"><i :style="{ width: `${Number(mediaEscola.replace(',', '.')) * 10}%` }"></i></div>
          </article>
          <article class="cartao-resumo">
            <div class="cartao-resumo__topo"><span>Frequência hoje</span><span class="cartao-icone cartao-icone--verde">✓</span></div>
            <strong>{{ resumoFrequencia }}<small class="nota-total">%</small></strong><small><b class="texto-verde">Na turma {{ turmaFrequencia }}</b></small>
            <div class="barra-progresso barra-progresso--verde"><i :style="{ width: `${resumoFrequencia}%` }"></i></div>
          </article>
          <article class="cartao-resumo">
            <div class="cartao-resumo__topo"><span>Alunos aprovados</span><span class="cartao-icone cartao-icone--laranja">✧</span></div>
            <strong>{{ quantidadeAprovados }}<small class="nota-total">/{{ alunos.length }}</small></strong><small><b>Com média a partir de 7,0</b></small>
            <div class="barra-progresso barra-progresso--laranja"><i :style="{ width: `${alunos.length ? quantidadeAprovados / alunos.length * 100 : 0}%` }"></i></div>
          </article>
        </div>

        <div class="grade-painel">
          <section class="bloco">
            <div class="bloco__cabecalho">
              <div><h3>Alunos recentes</h3><p>Visão rápida dos estudantes cadastrados</p></div>
              <button class="link-acao" type="button" @click="irPara('alunos')">Ver todos <span>→</span></button>
            </div>
            <div class="tabela-wrap">
              <table>
                <thead><tr><th>MATRÍCULA</th><th>ALUNO</th><th>TURMA</th><th>MÉDIA</th><th>SITUAÇÃO</th></tr></thead>
                <tbody>
                  <tr v-for="aluno in alunos.slice(0, 5)" :key="aluno.id">
                    <td><span class="matricula">{{ aluno.matricula }}</span></td>
                    <td><div class="aluno-identidade"><span class="avatar" :class="`avatar--${aluno.id % 4}`">{{ aluno.nome.split(' ').map((parte) => parte[0]).slice(0, 2).join('') }}</span><strong>{{ aluno.nome }}</strong></div></td>
                    <td><span class="tag-turma">{{ aluno.turma }}</span></td>
                    <td><strong>{{ formatarMedia(aluno) }}</strong></td>
                    <td><span class="status" :class="classeSituacao(aluno)">{{ situacaoAluno(aluno) }}</span></td>
                  </tr>
                  <tr v-if="!alunos.length"><td colspan="5" class="vazio">Cadastre o primeiro aluno para começar.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section class="bloco turmas-bloco">
            <div class="bloco__cabecalho"><div><h3>Turmas</h3><p>Resumo por sala</p></div><button class="link-acao" type="button" @click="irPara('turmas')">Ver todas <span>→</span></button></div>
            <button v-for="turma in turmasResumo" :key="turma.nome" class="linha-turma" type="button" @click="filtroTurma = turma.nome; irPara('alunos')">
              <span class="turma-mini">{{ turma.nome }}</span>
              <span class="linha-turma__texto"><strong>{{ turma.nome }}</strong><small>{{ turma.estudantes.length }} alunos</small></span>
              <span class="linha-turma__media">{{ turma.media }}<small>média</small></span>
              <span class="linha-turma__seta">→</span>
            </button>
          </section>
        </div>
      </section>

      <section v-else-if="paginaAtiva === 'alunos'" class="painel">
        <div class="pagina-intro">
          <div><p class="sobretitulo">CADASTRO ACADÊMICO</p><h2>Alunos</h2><p>Gerencie os estudantes e seus dados escolares.</p></div>
          <button class="botao botao--primario" type="button" @click="abrirCadastro()">＋ <span>Novo aluno</span></button>
        </div>
        <section class="bloco">
          <div class="filtros">
            <label class="busca-tabela"><span aria-hidden="true">⌕</span><input v-model="busca" type="search" inputmode="numeric" placeholder="Buscar por matrícula..." aria-label="Buscar aluno pela matrícula" /></label>
            <select v-model="filtroTurma" aria-label="Filtrar por turma"><option>Todas as turmas</option><option v-for="turma in turmas" :key="turma">{{ turma }}</option></select>
            <span class="total-registros">{{ alunosFiltrados.length }} aluno(s)</span>
          </div>
          <div class="tabela-wrap">
            <table>
              <thead><tr><th>MATRÍCULA</th><th>ALUNO</th><th>TURMA</th><th>RESPONSÁVEL</th><th>MÉDIA</th><th>SITUAÇÃO</th><th>AÇÕES</th></tr></thead>
              <tbody>
                <tr v-for="aluno in alunosFiltrados" :key="aluno.id">
                  <td><span class="matricula">{{ aluno.matricula }}</span></td>
                  <td><div class="aluno-identidade"><span class="avatar" :class="`avatar--${aluno.id % 4}`">{{ aluno.nome.split(' ').map((parte) => parte[0]).slice(0, 2).join('') }}</span><span><strong>{{ aluno.nome }}</strong><small>{{ aluno.email || 'E-mail não informado' }}</small></span></div></td>
                  <td><span class="tag-turma">{{ aluno.turma }}</span></td>
                  <td>{{ aluno.responsavel || '—' }}</td>
                  <td><strong>{{ formatarMedia(aluno) }}</strong></td>
                  <td><span class="status" :class="classeSituacao(aluno)">{{ situacaoAluno(aluno) }}</span></td>
                  <td><div class="acoes-linha"><button type="button" @click="abrirCadastro(aluno)">Editar</button><button class="acao-remover" type="button" @click="removerAluno(aluno)">Remover</button></div></td>
                </tr>
                <tr v-if="!alunosFiltrados.length"><td colspan="7" class="vazio">Nenhum aluno encontrado para esta matrícula. Confira os dígitos e tente novamente.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section v-else-if="paginaAtiva === 'turmas'" class="painel">
        <div class="pagina-intro"><div><p class="sobretitulo">ORGANIZAÇÃO ESCOLAR</p><h2>Turmas</h2><p>Acompanhe alunos e desempenho de cada turma.</p></div></div>
        <div class="cartoes-turmas">
          <article v-for="turma in turmasResumo" :key="turma.nome" class="bloco cartao-turma">
            <div class="cartao-turma__topo"><span class="turma-mini">{{ turma.nome }}</span><span class="tag-turma">{{ turma.codigo }}</span></div>
            <h3>Turma {{ turma.nome }}</h3><p>Ensino fundamental</p>
            <div class="cartao-turma__dados"><div><strong>{{ turma.estudantes.length }}</strong><small>alunos</small></div><div><strong>{{ turma.media }}</strong><small>média geral</small></div></div>
            <button class="link-acao" type="button" @click="filtroTurma = turma.nome; irPara('alunos')">Ver estudantes <span>→</span></button>
          </article>
        </div>
      </section>

      <section v-else-if="paginaAtiva === 'notas'" class="painel">
        <div class="pagina-intro"><div><p class="sobretitulo">ACOMPANHAMENTO PEDAGÓGICO</p><h2>Notas e desempenho</h2><p>Registre as notas por disciplina. As médias são atualizadas automaticamente.</p></div></div>
        <section class="bloco">
          <div class="bloco__cabecalho notas-cabecalho"><div><h3>Boletim da turma</h3><p>Notas de 0 a 10 · situação calculada pela média</p></div><select v-model="filtroTurma" aria-label="Selecionar turma"><option v-for="turma in turmas" :key="turma">{{ turma }}</option></select></div>
          <div class="filtros filtro-matricula"><label class="busca-tabela"><span aria-hidden="true">⌕</span><input v-model="buscaNotas" type="search" inputmode="numeric" placeholder="Localizar aluno pela matrícula..." aria-label="Localizar aluno pela matrícula" /></label><span class="total-registros">{{ alunosNotasFiltrados.length }} aluno(s)</span></div>
          <div class="tabela-wrap">
            <table class="tabela-notas">
              <thead><tr><th>MATRÍCULA</th><th>ALUNO</th><th v-for="disciplina in disciplinas" :key="disciplina.chave">{{ disciplina.nome.toUpperCase() }}</th><th>MÉDIA</th><th>SITUAÇÃO</th></tr></thead>
              <tbody>
                <tr v-for="aluno in alunosNotasFiltrados" :key="aluno.id">
                  <td><span class="matricula">{{ aluno.matricula }}</span></td>
                  <td><strong>{{ aluno.nome }}</strong></td>
                  <td v-for="disciplina in disciplinas" :key="disciplina.chave"><input v-model.number="aluno.notas[disciplina.chave]" type="number" min="0" max="10" step="0.1" :aria-label="`${disciplina.nome} - ${aluno.nome}`" /></td>
                  <td><strong>{{ formatarMedia(aluno) }}</strong></td><td><span class="status" :class="classeSituacao(aluno)">{{ situacaoAluno(aluno) }}</span></td>
                </tr>
                <tr v-if="!alunosNotasFiltrados.length"><td colspan="7" class="vazio">{{ buscaNotas ? 'Nenhum aluno encontrado para esta matrícula nesta turma.' : 'Ainda não há alunos nesta turma.' }}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <section v-else class="painel">
        <div class="pagina-intro"><div><p class="sobretitulo">ROTINA ESCOLAR</p><h2>Frequência</h2><p>Registre a presença dos alunos para {{ hojeFormatado }}.</p></div></div>
        <section class="bloco">
          <div class="bloco__cabecalho frequencia-cabecalho">
            <div><h3>Chamada diária</h3><p>{{ alunosDaTurmaFrequencia.length }} alunos na turma · {{ resumoFrequencia }}% presentes</p></div>
            <select v-model="turmaFrequencia" aria-label="Selecionar turma para chamada"><option v-for="turma in turmas" :key="turma">{{ turma }}</option></select>
          </div>
          <div class="filtros filtro-matricula"><label class="busca-tabela"><span aria-hidden="true">⌕</span><input v-model="buscaFrequencia" type="search" inputmode="numeric" placeholder="Localizar aluno pela matrícula..." aria-label="Localizar aluno pela matrícula" /></label><span class="total-registros">{{ alunosFrequenciaFiltrados.length }} aluno(s)</span></div>
          <div class="tabela-wrap">
            <table>
              <thead><tr><th>MATRÍCULA</th><th>ALUNO</th><th>TURMA</th><th>STATUS DE HOJE</th><th>REGISTRO</th></tr></thead>
              <tbody>
                <tr v-for="aluno in alunosFrequenciaFiltrados" :key="aluno.id">
                  <td><span class="matricula">{{ aluno.matricula }}</span></td>
                  <td><div class="aluno-identidade"><span class="avatar" :class="`avatar--${aluno.id % 4}`">{{ aluno.nome.split(' ').map((parte) => parte[0]).slice(0, 2).join('') }}</span><strong>{{ aluno.nome }}</strong></div></td>
                  <td><span class="tag-turma">{{ aluno.turma }}</span></td>
                  <td><span class="status" :class="frequencia[dataHoje]?.[aluno.id] === true ? 'status--aprovado' : frequencia[dataHoje]?.[aluno.id] === false ? 'status--atencao' : 'status--pendente'">{{ frequencia[dataHoje]?.[aluno.id] === true ? 'Presente' : frequencia[dataHoje]?.[aluno.id] === false ? 'Ausente' : 'Não registrado' }}</span></td>
                  <td><button class="botao-presenca" :class="{ 'botao-presenca--marcado': frequencia[dataHoje]?.[aluno.id] === true }" type="button" @click="alternarPresenca(aluno)">{{ frequencia[dataHoje]?.[aluno.id] === true ? 'Marcar ausência' : frequencia[dataHoje]?.[aluno.id] === false ? '＋ Marcar presença' : '＋ Registrar presença' }}</button></td>
                </tr>
                <tr v-if="!alunosFrequenciaFiltrados.length"><td colspan="5" class="vazio">{{ buscaFrequencia ? 'Nenhum aluno encontrado para esta matrícula nesta turma.' : 'Não há alunos cadastrados nesta turma.' }}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </section>

      <footer class="rodape"><span>© 2025 EduGestão</span><span>Gestão escolar mais simples e próxima.</span></footer>
    </main>

    <div v-if="modalAberto" class="modal-fundo" @click.self="modalAberto = false">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal">
        <div class="modal__cabecalho"><div><p class="sobretitulo">CADASTRO ACADÊMICO</p><h2 id="titulo-modal">{{ alunoEditando ? 'Editar aluno' : 'Novo aluno' }}</h2></div><button class="botao-fechar" type="button" aria-label="Fechar" @click="modalAberto = false">×</button></div>
        <form class="form-aluno" @submit.prevent="salvarAluno">
          <div class="campo-matricula"><span>Matrícula</span><strong>{{ alunoEditando ? alunoEditando.matricula : 'Gerada automaticamente ao cadastrar' }}</strong><small>Número único de até 6 dígitos, sem usar dados pessoais.</small></div>
          <label>Nome completo<input v-model="formulario.nome" autofocus required minlength="3" placeholder="Ex.: Marina Oliveira" /></label>
          <label>Turma<select v-model="formulario.turma" required><option value="" disabled>Selecione uma turma</option><option v-for="turma in turmas" :key="turma">{{ turma }}</option></select></label>
          <label>E-mail do aluno<input v-model="formulario.email" type="email" placeholder="aluno@escola.edu.br" /></label>
          <label>Responsável<input v-model="formulario.responsavel" placeholder="Nome do responsável" /></label>
          <p v-if="erroFormulario" class="erro-formulario" role="alert">{{ erroFormulario }}</p>
          <div class="modal__acoes"><button class="botao botao--secundario" type="button" @click="modalAberto = false">Cancelar</button><button class="botao botao--primario" type="submit">{{ alunoEditando ? 'Salvar alterações' : 'Cadastrar aluno' }}</button></div>
        </form>
      </section>
    </div>
  </div>
</template>
