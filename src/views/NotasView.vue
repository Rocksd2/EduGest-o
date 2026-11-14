<script setup>
import { computed, ref } from 'vue'
import {
  alunos,
  classeSituacao,
  correspondeMatricula,
  disciplinas,
  formatarMedia,
  normalizarNota,
  situacaoAluno,
  turmas,
} from '../dados/escola.js'

const turmaNotas = ref(turmas[0])
const buscaNotas = ref('')

const alunosNotasFiltrados = computed(() => alunos.value.filter((aluno) => (
  aluno.turma === turmaNotas.value && correspondeMatricula(aluno, buscaNotas.value)
)))
</script>

<template>
  <section class="painel">
    <div class="pagina-intro"><div><p class="sobretitulo">ACOMPANHAMENTO PEDAGÓGICO</p><h2>Notas e desempenho</h2><p>Registre as notas por disciplina. As médias são atualizadas automaticamente.</p></div></div>
    <section class="bloco">
      <div class="bloco__cabecalho notas-cabecalho"><div><h3>Boletim da turma</h3><p>Notas de 0 a 10 · situação calculada pela média</p></div><select v-model="turmaNotas" aria-label="Selecionar turma"><option v-for="turma in turmas" :key="turma">{{ turma }}</option></select></div>
      <div class="filtros filtro-matricula"><label class="busca-tabela"><span aria-hidden="true">⌕</span><input v-model="buscaNotas" type="search" inputmode="numeric" placeholder="Localizar aluno pela matrícula..." aria-label="Localizar aluno pela matrícula" /></label><span class="total-registros">{{ alunosNotasFiltrados.length }} aluno(s)</span></div>
      <div class="tabela-wrap table-responsive">
        <table class="tabela-notas">
          <thead><tr><th>MATRÍCULA</th><th>ALUNO</th><th v-for="disciplina in disciplinas" :key="disciplina.chave">{{ disciplina.nome.toUpperCase() }}</th><th>MÉDIA</th><th>SITUAÇÃO</th></tr></thead>
          <tbody>
            <tr v-for="aluno in alunosNotasFiltrados" :key="aluno.id">
              <td><span class="matricula">{{ aluno.matricula }}</span></td>
              <td><RouterLink class="aluno-link" :to="{ name: 'aluno', params: { id: aluno.id } }"><strong>{{ aluno.nome }}</strong></RouterLink></td>
              <td v-for="disciplina in disciplinas" :key="disciplina.chave"><input v-model.number="aluno.notas[disciplina.chave]" type="number" min="0" max="10" step="0.1" :aria-label="`${disciplina.nome} - ${aluno.nome}`" @change="aluno.notas[disciplina.chave] = normalizarNota(aluno.notas[disciplina.chave])" /></td>
              <td><strong>{{ formatarMedia(aluno) }}</strong></td><td><span class="status" :class="classeSituacao(aluno)">{{ situacaoAluno(aluno) }}</span></td>
            </tr>
            <tr v-if="!alunosNotasFiltrados.length"><td colspan="7" class="vazio">{{ buscaNotas ? 'Nenhum aluno encontrado para esta matrícula nesta turma.' : 'Ainda não há alunos nesta turma.' }}</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
