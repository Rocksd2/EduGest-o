<script setup>
import { computed } from 'vue'
import {
  abrirCadastro,
  alunos,
  busca,
  classeSituacao,
  correspondeMatricula,
  filtroTurma,
  formatarMedia,
  iniciaisAluno,
  removerAluno,
  situacaoAluno,
  turmas,
} from '../dados/escola.js'

const alunosFiltrados = computed(() => alunos.value.filter((aluno) => {
  const correspondeBusca = correspondeMatricula(aluno, busca.value)
  return correspondeBusca && (filtroTurma.value === 'Todas as turmas' || aluno.turma === filtroTurma.value)
}))
</script>

<template>
  <section class="painel">
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
      <div class="tabela-wrap table-responsive">
        <table>
          <thead><tr><th>MATRÍCULA</th><th>ALUNO</th><th>TURMA</th><th>RESPONSÁVEL</th><th>MÉDIA</th><th>SITUAÇÃO</th><th>AÇÕES</th></tr></thead>
          <tbody>
            <tr v-for="aluno in alunosFiltrados" :key="aluno.id">
              <td><span class="matricula">{{ aluno.matricula }}</span></td>
              <td><RouterLink class="aluno-identidade aluno-link" :to="{ name: 'aluno', params: { id: aluno.id } }"><span class="avatar" :class="`avatar--${aluno.id % 4}`">{{ iniciaisAluno(aluno) }}</span><span><strong>{{ aluno.nome }}</strong><small>{{ aluno.email || 'E-mail não informado' }}</small></span></RouterLink></td>
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
</template>
