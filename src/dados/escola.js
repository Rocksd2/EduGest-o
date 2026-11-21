// Estado compartilhado da escola. Fica fora dos componentes para que todas as
// rotas leiam e alterem os mesmos alunos, notas e registros de frequência.
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'edugestao-dados-v1'
const PRIMEIRA_MATRICULA = 100000
const QUANTIDADE_MATRICULAS = 900000

export const turmas = ['6º A', '7º B', '8º A', '9º B']
export const disciplinas = [
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

function migrarNotas(aluno) {
  const notas = Object.fromEntries(disciplinas.map(({ chave }) => {
    const valor = Number(aluno.notas?.[chave])
    const nota = Number.isFinite(valor) ? Math.min(10, Math.max(0, valor)) : 0
    return [chave, nota]
  }))

  return { ...aluno, notas }
}

function carregarDados() {
  const salvo = localStorage.getItem(STORAGE_KEY)
  if (!salvo) return { alunos: migrarMatriculas(alunosIniciais), frequencia: {} }

  try {
    const dados = JSON.parse(salvo)
    if (Array.isArray(dados.alunos) && dados.frequencia && typeof dados.frequencia === 'object') {
      return { ...dados, alunos: migrarMatriculas(dados.alunos).map(migrarNotas) }
    }
    console.error('Os dados locais do EduGestão estão em um formato inválido; usando os dados iniciais.')
  } catch (erro) {
    console.error('Não foi possível ler os dados locais do EduGestão; usando os dados iniciais.', erro)
  }
  return { alunos: migrarMatriculas(alunosIniciais), frequencia: {} }
}

const dadosIniciais = carregarDados()

export const alunos = ref(dadosIniciais.alunos)
export const frequencia = ref(dadosIniciais.frequencia)

// Busca por matrícula e filtro de turma compartilhados: a busca do cabeçalho e os
// atalhos da visão geral precisam chegar já preenchidos na página de alunos.
export const busca = ref('')
export const filtroTurma = ref('Todas as turmas')

const agora = new Date()
export const dataHoje = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')}`
export const hojeFormatado = new Intl.DateTimeFormat('pt-BR', {
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

export function mediaAluno(aluno) {
  const valores = disciplinas.map(({ chave }) => Number(aluno.notas?.[chave] ?? 0))
  return valores.reduce((soma, nota) => soma + nota, 0) / valores.length
}

export function correspondeMatricula(aluno, consulta) {
  const texto = consulta.trim()
  if (!texto) return true
  const digitos = texto.replace(/\D/g, '')
  return digitos.length > 0 && aluno.matricula.includes(digitos)
}

export function situacaoAluno(aluno) {
  const media = mediaAluno(aluno)
  if (media >= 7) return 'Aprovado'
  if (media >= 5) return 'Em recuperação'
  return 'Atenção'
}

export function classeSituacao(aluno) {
  const media = mediaAluno(aluno)
  if (media >= 7) return 'status--aprovado'
  if (media >= 5) return 'status--recuperacao'
  return 'status--atencao'
}

export function formatarMedia(aluno) {
  return mediaAluno(aluno).toFixed(1).replace('.', ',')
}

export function normalizarNota(valor) {
  const nota = Number(valor)
  if (!Number.isFinite(nota)) return 0
  return Math.round(Math.min(10, Math.max(0, nota)) * 10) / 10
}

export function iniciaisAluno(aluno) {
  return aluno.nome.split(' ').map((parte) => parte[0]).slice(0, 2).join('')
}

export const quantidadeAprovados = computed(() => alunos.value.filter((aluno) => mediaAluno(aluno) >= 7).length)

export const mediaEscola = computed(() => {
  if (!alunos.value.length) return '0,0'
  return (alunos.value.reduce((soma, aluno) => soma + mediaAluno(aluno), 0) / alunos.value.length).toFixed(1).replace('.', ',')
})

export const turmasResumo = computed(() => turmas.map((nome, indice) => {
  const estudantes = alunos.value.filter((aluno) => aluno.turma === nome)
  const media = estudantes.length
    ? (estudantes.reduce((soma, aluno) => soma + mediaAluno(aluno), 0) / estudantes.length).toFixed(1).replace('.', ',')
    : '—'
  return { nome, codigo: `TUR-${String(indice + 1).padStart(3, '0')}`, estudantes, media }
}))

// Formulário de cadastro/edição: o modal fica no App.vue, então o estado mora aqui
// para qualquer rota conseguir abri-lo.
export const modalAberto = ref(false)
export const alunoEditando = ref(null)
export const erroFormulario = ref('')
export const formulario = ref({ nome: '', turma: '', email: '', responsavel: '' })

export function abrirCadastro(aluno = null) {
  alunoEditando.value = aluno
  formulario.value = aluno
    ? { nome: aluno.nome, turma: aluno.turma, email: aluno.email, responsavel: aluno.responsavel }
    : { nome: '', turma: '', email: '', responsavel: '' }
  erroFormulario.value = ''
  modalAberto.value = true
}

// Usado pelo cadastro manual e pela importação da API: a mesma regra de matrícula única.
export function adicionarAluno(dados) {
  const id = Math.max(0, ...alunos.value.map((aluno) => aluno.id)) + 1
  const matriculasUsadas = new Set(alunos.value.map((aluno) => aluno.matricula))
  const aluno = {
    id,
    matricula: gerarMatricula(matriculasUsadas),
    ...dados,
    notas: { portugues: 0, matematica: 0, ciencias: 0 },
  }
  alunos.value.push(aluno)
  return aluno
}

export function salvarAluno() {
  const nome = formulario.value.nome.trim()
  if (nome.length < 3 || !formulario.value.turma) {
    erroFormulario.value = 'Informe o nome completo e selecione uma turma.'
    return
  }
  if (alunoEditando.value) {
    Object.assign(alunoEditando.value, { ...formulario.value, nome })
  } else {
    adicionarAluno({ ...formulario.value, nome })
  }
  modalAberto.value = false
}

export function removerAluno(aluno) {
  if (!window.confirm(`Deseja remover ${aluno.nome} do cadastro?`)) return
  alunos.value = alunos.value.filter((item) => item.id !== aluno.id)
  for (const registros of Object.values(frequencia.value)) {
    delete registros[aluno.id]
  }
}

export function alternarPresenca(aluno) {
  if (!frequencia.value[dataHoje]) frequencia.value[dataHoje] = {}
  const presencaAtual = frequencia.value[dataHoje][aluno.id]
  frequencia.value[dataHoje][aluno.id] = presencaAtual === undefined || presencaAtual === false
}

export function frequenciaDoAluno(alunoId) {
  const dias = Object.entries(frequencia.value).filter(([, registros]) => registros[alunoId] !== undefined)
  const presentes = dias.filter(([, registros]) => registros[alunoId] === true).length
  return { dias: dias.length, presentes, percentual: dias.length ? Math.round((presentes / dias.length) * 100) : 0 }
}
