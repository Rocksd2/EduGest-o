<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  alunos,
  abrirCadastro,
  classeSituacao,
  dataHoje,
  filtroTurma,
  formatarMedia,
  frequencia,
  iniciaisAluno,
  mediaEscola,
  quantidadeAprovados,
  situacaoAluno,
  turmas,
  turmasResumo,
} from '../dados/escola.js'

const router = useRouter()
const turmaFrequencia = ref(turmas[0])

const resumoFrequencia = computed(() => {
  const lista = alunos.value.filter((aluno) => aluno.turma === turmaFrequencia.value)
  if (!lista.length) return 0
  const presentes = lista.filter((aluno) => frequencia.value[dataHoje]?.[aluno.id] === true).length
  return Math.round((presentes / lista.length) * 100)
})

function verTurma(nome) {
  filtroTurma.value = nome
  router.push({ name: 'alunos' })
}
</script>

<template>
  <section class="painel">
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
          <RouterLink class="link-acao" :to="{ name: 'alunos' }">Ver todos <span>→</span></RouterLink>
        </div>
        <div class="tabela-wrap table-responsive">
          <table>
            <thead><tr><th>MATRÍCULA</th><th>ALUNO</th><th>TURMA</th><th>MÉDIA</th><th>SITUAÇÃO</th></tr></thead>
            <tbody>
              <tr v-for="aluno in alunos.slice(0, 5)" :key="aluno.id">
                <td><span class="matricula">{{ aluno.matricula }}</span></td>
                <td><RouterLink class="aluno-identidade aluno-link" :to="{ name: 'aluno', params: { id: aluno.id } }"><span class="avatar" :class="`avatar--${aluno.id % 4}`">{{ iniciaisAluno(aluno) }}</span><strong>{{ aluno.nome }}</strong></RouterLink></td>
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
        <div class="bloco__cabecalho"><div><h3>Turmas</h3><p>Resumo por sala</p></div><RouterLink class="link-acao" :to="{ name: 'turmas' }">Ver todas <span>→</span></RouterLink></div>
        <button v-for="turma in turmasResumo" :key="turma.nome" class="linha-turma" type="button" @click="verTurma(turma.nome)">
          <span class="turma-mini">{{ turma.nome }}</span>
          <span class="linha-turma__texto"><strong>{{ turma.nome }}</strong><small>{{ turma.estudantes.length }} alunos</small></span>
          <span class="linha-turma__media">{{ turma.media }}<small>média</small></span>
          <span class="linha-turma__seta">→</span>
        </button>
      </section>
    </div>
  </section>
</template>
