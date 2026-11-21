<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  alunoEditando,
  busca,
  erroFormulario,
  formulario,
  hojeFormatado,
  modalAberto,
  salvarAluno,
  turmas,
} from './dados/escola.js'

const route = useRoute()
const router = useRouter()

const paginas = [
  { rota: 'visao-geral', nome: 'Visão geral', icone: 'bi-grid-1x2' },
  { rota: 'alunos', nome: 'Alunos', icone: 'bi-people' },
  { rota: 'turmas', nome: 'Turmas', icone: 'bi-diagram-3' },
  { rota: 'notas', nome: 'Notas', icone: 'bi-clipboard-data' },
  { rota: 'frequencia', nome: 'Frequência', icone: 'bi-check2-square' },
  { rota: 'integracao', nome: 'API', icone: 'bi-cloud-arrow-down' },
  { rota: 'sobre', nome: 'Sobre', icone: 'bi-info-circle' },
]

const tituloPagina = computed(() => route.meta.titulo ?? 'EduGestão')

// A busca do cabeçalho filtra a página de alunos; se estiver em outra rota, navega até ela.
function buscarAlunos() {
  if (route.name !== 'alunos') router.push({ name: 'alunos' })
}
</script>

<template>
  <div class="layout">
    <aside class="barra-lateral">
      <RouterLink class="marca" :to="{ name: 'visao-geral' }">
        <span class="marca__simbolo">E</span>
        <span class="marca__texto"><strong>edu</strong>gestão<small>GESTÃO ESCOLAR</small></span>
      </RouterLink>

      <p class="menu__rotulo">MENU PRINCIPAL</p>
      <nav class="menu" aria-label="Menu principal">
        <RouterLink
          v-for="pagina in paginas"
          :key="pagina.rota"
          :to="{ name: pagina.rota }"
          class="menu__item"
          :class="{ 'router-link-active': pagina.rota === 'alunos' && route.name === 'aluno' }"
        >
          <span class="menu__icone" aria-hidden="true"><i class="bi" :class="pagina.icone"></i></span>
          {{ pagina.nome }}
        </RouterLink>
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
            <input v-model="busca" type="search" inputmode="numeric" placeholder="Buscar matrícula..." aria-label="Buscar por matrícula" @focus="buscarAlunos" @input="buscarAlunos" />
            <kbd>⌘ K</kbd>
          </label>
          <button class="botao-icone" type="button" aria-label="Notificações">♧<i></i></button>
          <button class="avatar avatar--cabecalho" type="button" aria-label="Perfil da administração">AD</button>
        </div>
      </header>

      <RouterView />

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
