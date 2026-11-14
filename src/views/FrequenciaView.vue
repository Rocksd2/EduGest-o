<script setup>
import { computed, ref } from 'vue'
import {
  alternarPresenca,
  alunos,
  correspondeMatricula,
  dataHoje,
  frequencia,
  hojeFormatado,
  iniciaisAluno,
  turmas,
} from '../dados/escola.js'

const turmaFrequencia = ref(turmas[0])
const buscaFrequencia = ref('')

const alunosDaTurma = computed(() => alunos.value.filter((aluno) => aluno.turma === turmaFrequencia.value))
const alunosFiltrados = computed(() => alunosDaTurma.value.filter((aluno) => correspondeMatricula(aluno, buscaFrequencia.value)))
const percentualPresentes = computed(() => {
  if (!alunosDaTurma.value.length) return 0
  const presentes = alunosDaTurma.value.filter((aluno) => frequencia.value[dataHoje]?.[aluno.id] === true).length
  return Math.round((presentes / alunosDaTurma.value.length) * 100)
})
</script>

<template>
  <section class="painel">
    <div class="pagina-intro"><div><p class="sobretitulo">ROTINA ESCOLAR</p><h2>Frequência</h2><p>Registre a presença dos alunos para {{ hojeFormatado }}.</p></div></div>
    <section class="bloco">
      <div class="bloco__cabecalho frequencia-cabecalho">
        <div><h3>Chamada diária</h3><p>{{ alunosDaTurma.length }} alunos na turma · {{ percentualPresentes }}% presentes</p></div>
        <select v-model="turmaFrequencia" aria-label="Selecionar turma para chamada"><option v-for="turma in turmas" :key="turma">{{ turma }}</option></select>
      </div>
      <div class="filtros filtro-matricula"><label class="busca-tabela"><span aria-hidden="true">⌕</span><input v-model="buscaFrequencia" type="search" inputmode="numeric" placeholder="Localizar aluno pela matrícula..." aria-label="Localizar aluno pela matrícula" /></label><span class="total-registros">{{ alunosFiltrados.length }} aluno(s)</span></div>
      <div class="tabela-wrap table-responsive">
        <table>
          <thead><tr><th>MATRÍCULA</th><th>ALUNO</th><th>TURMA</th><th>STATUS DE HOJE</th><th>REGISTRO</th></tr></thead>
          <tbody>
            <tr v-for="aluno in alunosFiltrados" :key="aluno.id">
              <td><span class="matricula">{{ aluno.matricula }}</span></td>
              <td><div class="aluno-identidade"><span class="avatar" :class="`avatar--${aluno.id % 4}`">{{ iniciaisAluno(aluno) }}</span><strong>{{ aluno.nome }}</strong></div></td>
              <td><span class="tag-turma">{{ aluno.turma }}</span></td>
              <td><span class="status" :class="frequencia[dataHoje]?.[aluno.id] === true ? 'status--aprovado' : frequencia[dataHoje]?.[aluno.id] === false ? 'status--atencao' : 'status--pendente'">{{ frequencia[dataHoje]?.[aluno.id] === true ? 'Presente' : frequencia[dataHoje]?.[aluno.id] === false ? 'Ausente' : 'Não registrado' }}</span></td>
              <td><button class="botao-presenca" :class="{ 'botao-presenca--marcado': frequencia[dataHoje]?.[aluno.id] === true }" type="button" @click="alternarPresenca(aluno)">{{ frequencia[dataHoje]?.[aluno.id] === true ? 'Marcar ausência' : frequencia[dataHoje]?.[aluno.id] === false ? '＋ Marcar presença' : '＋ Registrar presença' }}</button></td>
            </tr>
            <tr v-if="!alunosFiltrados.length"><td colspan="5" class="vazio">{{ buscaFrequencia ? 'Nenhum aluno encontrado para esta matrícula nesta turma.' : 'Não há alunos cadastrados nesta turma.' }}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
