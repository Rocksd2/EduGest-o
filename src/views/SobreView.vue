<script setup>
import MembroEquipe from '../components/MembroEquipe.vue'
import { disciplinas, turmas } from '../dados/escola.js'

const rotas = [
  { caminho: '/', nome: 'Visão geral', descricao: 'Indicadores, alunos recentes e resumo das turmas.' },
  { caminho: '/alunos', nome: 'Alunos', descricao: 'Cadastro, busca por matrícula, edição e remoção.' },
  { caminho: '/alunos/:id', nome: 'Detalhes do aluno', descricao: 'Rota dinâmica com boletim e frequência individual.' },
  { caminho: '/turmas', nome: 'Turmas', descricao: 'Quantidade de alunos e média de cada sala.' },
  { caminho: '/notas', nome: 'Notas', descricao: 'Lançamento das notas por disciplina.' },
  { caminho: '/frequencia', nome: 'Frequência', descricao: 'Chamada diária por turma.' },
]

const membros = [
  { nome: 'Alexander Protasio de Brito', matricula: '04205254' },
  { nome: 'Iarley Couto Mesquita', matricula: '0423707' },
  { nome: 'Igor Carvalho Lira', matricula: '04202039' },
  { nome: 'Joaquim Rodrigues Conceição', matricula: '04212732' },
  { nome: 'Marlon Carneiro Oliveira', matricula: '04211625' },
  { nome: 'Moisés de Aviz Lopes', matricula: '04026375' },
]
</script>

<template>
  <section class="painel">
    <div class="pagina-intro">
      <div>
        <p class="sobretitulo">SOBRE O PROJETO</p>
        <h2>Sobre o EduGestão</h2>
        <p>Painel escolar feito com Vue.js para a disciplina de Front-End Frameworks.</p>
      </div>
    </div>

    <div class="grade-painel sobre-grade">
      <section class="bloco sobre-bloco">
        <div class="bloco__cabecalho"><div><h3>O que é o projeto</h3><p>Gestão escolar em uma única página</p></div></div>
        <div class="sobre-texto">
          <p>O EduGestão organiza <strong>alunos, turmas, notas e frequência</strong> de uma escola fictícia. Os dados ficam salvos no <code>localStorage</code> do navegador, então continuam disponíveis depois de recarregar a página.</p>
          <p>Nesta etapa o projeto ganhou <strong>Vue Router</strong>: cada tela virou um componente próprio em <code>src/views</code> e a navegação acontece por rotas, sem recarregar a aplicação.</p>
          <p>Funcionalidades mantidas: cadastro com matrícula única de seis dígitos, busca por matrícula, filtro por turma, lançamento de notas das disciplinas {{ disciplinas.map((d) => d.nome).join(', ') }}, chamada diária e as {{ turmas.length }} turmas.</p>
        </div>
      </section>

      <section class="bloco sobre-bloco">
        <div class="bloco__cabecalho"><div><h3>Como a SPA funciona</h3><p>Vue Router em três passos</p></div></div>
        <ol class="sobre-passos">
          <li><strong>RouterLink</strong> gera um link que troca a rota sem baixar outra página do servidor.</li>
          <li><strong>RouterView</strong> marca onde o componente da rota atual é renderizado.</li>
          <li><strong>createRouter</strong> liga cada caminho (<code>path</code>) a um componente e ao histórico do navegador, então voltar e avançar funcionam.</li>
        </ol>
      </section>
    </div>

    <section class="bloco sobre-equipe">
      <div class="bloco__cabecalho"><div><h3>Equipe</h3><p>Integrantes do projeto</p></div></div>
      <ul class="equipe-lista">
        <MembroEquipe
          v-for="membro in membros"
          :key="membro.matricula"
          :nome="membro.nome"
          :matricula="membro.matricula"
        />
      </ul>
    </section>

    <section class="bloco sobre-rotas">
      <div class="bloco__cabecalho"><div><h3>Rotas implementadas</h3><p>Clique para navegar entre elas</p></div></div>
      <div class="rotas-lista">
        <RouterLink v-for="rota in rotas" :key="rota.caminho" class="rota-item" :to="rota.caminho">
          <code>{{ rota.caminho }}</code>
          <span class="rota-item__texto"><strong>{{ rota.nome }}</strong><small>{{ rota.descricao }}</small></span>
          <span class="rota-item__seta">→</span>
        </RouterLink>
      </div>
    </section>
  </section>
</template>

<style scoped>
.sobre-equipe {
  margin-top: 16px;
}

.equipe-lista {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 8px;
  margin: 0;
  padding: 0 18px 16px;
  list-style: none;
}
</style>
