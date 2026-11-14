<script setup>
import { useRouter } from 'vue-router'
import { filtroTurma, turmasResumo } from '../dados/escola.js'

const router = useRouter()

function verEstudantes(nome) {
  filtroTurma.value = nome
  router.push({ name: 'alunos' })
}
</script>

<template>
  <section class="painel">
    <div class="pagina-intro"><div><p class="sobretitulo">ORGANIZAÇÃO ESCOLAR</p><h2>Turmas</h2><p>Acompanhe alunos e desempenho de cada turma.</p></div></div>
    <div class="cartoes-turmas">
      <article v-for="turma in turmasResumo" :key="turma.nome" class="bloco cartao-turma">
        <div class="cartao-turma__topo"><span class="turma-mini">{{ turma.nome }}</span><span class="tag-turma">{{ turma.codigo }}</span></div>
        <h3>Turma {{ turma.nome }}</h3><p>Ensino fundamental</p>
        <div class="cartao-turma__dados"><div><strong>{{ turma.estudantes.length }}</strong><small>alunos</small></div><div><strong>{{ turma.media }}</strong><small>média geral</small></div></div>
        <button class="link-acao" type="button" @click="verEstudantes(turma.nome)">Ver estudantes <span>→</span></button>
      </article>
    </div>
  </section>
</template>
