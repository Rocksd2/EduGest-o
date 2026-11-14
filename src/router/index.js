import { createRouter, createWebHistory } from 'vue-router'
import VisaoGeralView from '../views/VisaoGeralView.vue'
import AlunosView from '../views/AlunosView.vue'
import AlunoDetalheView from '../views/AlunoDetalheView.vue'
import TurmasView from '../views/TurmasView.vue'
import NotasView from '../views/NotasView.vue'
import FrequenciaView from '../views/FrequenciaView.vue'
import SobreView from '../views/SobreView.vue'
import NaoEncontradaView from '../views/NaoEncontradaView.vue'

const rotas = [
  { path: '/', name: 'visao-geral', component: VisaoGeralView, meta: { titulo: 'Visão geral' } },
  { path: '/alunos', name: 'alunos', component: AlunosView, meta: { titulo: 'Alunos' } },
  // Rota dinâmica: o :id vira route.params.id e é repassado como prop
  { path: '/alunos/:id', name: 'aluno', component: AlunoDetalheView, props: true, meta: { titulo: 'Detalhes do aluno' } },
  { path: '/turmas', name: 'turmas', component: TurmasView, meta: { titulo: 'Turmas' } },
  { path: '/notas', name: 'notas', component: NotasView, meta: { titulo: 'Notas' } },
  { path: '/frequencia', name: 'frequencia', component: FrequenciaView, meta: { titulo: 'Frequência' } },
  { path: '/sobre', name: 'sobre', component: SobreView, meta: { titulo: 'Sobre o projeto' } },
  { path: '/:pathMatch(.*)*', name: 'nao-encontrada', component: NaoEncontradaView, meta: { titulo: 'Página não encontrada' } },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: rotas,
  scrollBehavior: () => ({ top: 0 }),
})
