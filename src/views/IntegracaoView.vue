<script setup>
import { computed, onMounted, ref } from 'vue'
import CartaoUsuarioApi from '../components/CartaoUsuarioApi.vue'
import { buscarUsuarios } from '../dados/api.js'
import { adicionarAluno, alunos, turmas } from '../dados/escola.js'

const termo = ref('')
const turmaImportacao = ref(turmas[0])
const usuarios = ref([])
const carregando = ref(false)
const erro = ref('')
const feedback = ref('')

// apiId distingue os alunos vindos da API para evitar importação duplicada.
const importados = computed(() => new Set(alunos.value.filter((aluno) => aluno.apiId).map((aluno) => aluno.apiId)))

async function consultar() {
  carregando.value = true
  erro.value = ''
  feedback.value = ''
  try {
    usuarios.value = await buscarUsuarios(termo.value)
  } catch (falha) {
    usuarios.value = []
    erro.value = `Não foi possível consultar a API. ${falha.message} Verifique a conexão e tente novamente.`
  } finally {
    carregando.value = false
  }
}

function importar(usuario) {
  adicionarAluno({
    nome: `${usuario.firstName} ${usuario.lastName}`,
    email: usuario.email,
    turma: turmaImportacao.value,
    apiId: usuario.id,
  })
  feedback.value = `${usuario.firstName} ${usuario.lastName} entrou na turma ${turmaImportacao.value} com matrícula gerada.`
}

onMounted(consultar)
</script>

<template>
  <section class="painel">
    <div class="pagina-intro">
      <div>
        <p class="sobretitulo">INTEGRAÇÃO FRONT-END × BACK-END</p>
        <h2>API de estudantes</h2>
        <p>Busque pessoas na API pública DummyJSON e importe os resultados para o cadastro da escola.</p>
      </div>
      <span class="api-endpoint">GET&nbsp; https://dummyjson.com/users</span>
    </div>

    <section class="bloco">
      <form class="filtros d-flex flex-wrap align-items-center gap-2" @submit.prevent="consultar">
        <label class="busca-tabela"><span aria-hidden="true">⌕</span><input v-model="termo" type="search" placeholder="Digite um nome (ex.: Emily)" aria-label="Buscar usuários na API" /></label>
        <select v-model="turmaImportacao" aria-label="Turma dos alunos importados"><option v-for="turma in turmas" :key="turma">{{ turma }}</option></select>
        <button class="botao botao--primario" type="submit" :disabled="carregando">{{ carregando ? 'Buscando…' : 'Buscar na API' }}</button>
      </form>

      <p v-if="carregando" class="api-estado" role="status">⏳ Carregando dados da API…</p>
      <p v-else-if="erro" class="api-estado api-estado--erro" role="alert">
        ⚠ {{ erro }}
        <button class="api-tentar" type="button" @click="consultar">Tentar novamente</button>
      </p>
      <template v-else>
        <p class="api-contador">{{ usuarios.length }} usuário(s) recebido(s) em JSON · turma de destino: {{ turmaImportacao }}</p>
        <div class="api-grade">
          <CartaoUsuarioApi
            v-for="usuario in usuarios"
            :key="usuario.id"
            :usuario="usuario"
            :importado="importados.has(usuario.id)"
            @importar="importar"
          />
        </div>
        <p v-if="!usuarios.length" class="vazio">Nenhum usuário encontrado para este nome. Tente outra busca.</p>
      </template>

      <div v-if="feedback" class="api-feedback d-flex flex-wrap align-items-center gap-2" role="status">
        <span>✓ {{ feedback }}</span>
        <RouterLink class="link-acao" :to="{ name: 'alunos' }">Ver no cadastro <span>→</span></RouterLink>
      </div>
    </section>

    <section class="bloco api-como">
      <div class="bloco__cabecalho"><div><h3>Recursos usados nesta tela</h3><p>O mesmo fluxo serve para qualquer API JSON</p></div></div>
      <ul>
        <li><code>ref()</code> guarda termo, usuários, carregando e erro; <code>computed()</code> acompanha o que já foi importado.</li>
        <li><code>fetch()</code> faz o GET e <code>response.json()</code> entrega os dados; <code>v-for</code> desenha os cartões.</li>
        <li><code>v-if</code> mostra carregamento, erro, resultados e confirmação; <code>v-model</code> lê o que o usuário digitou.</li>
        <li><code>CartaoUsuarioApi</code> recebe props e emite o evento <code>importar</code> para a página.</li>
      </ul>
    </section>
  </section>
</template>

<style scoped>
.api-endpoint {
  align-self: center;
  padding: 8px 12px;
  border: 1px solid #e6e1ff;
  border-radius: 999px;
  background: #f7f5ff;
  color: #5e4ec6;
  font-family: monospace;
  font-size: 11px;
  white-space: nowrap;
}

.busca-tabela {
  flex: 1 1 260px;
}

.api-estado {
  margin: 16px 18px;
  padding: 14px;
  border-radius: 10px;
  background: #f7f5ff;
  color: #5e4ec6;
  font-size: 13px;
  font-weight: 600;
}

.api-estado--erro {
  background: #fdeceb;
  color: #b25046;
}

.api-tentar {
  margin-left: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-weight: 800;
  text-decoration: underline;
}

.api-contador {
  margin: 16px 18px 10px;
  color: var(--muted);
  font-size: 11px;
}

.api-grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  padding: 0 18px 18px;
}

.api-feedback {
  margin: 0 18px 18px;
  padding: 12px 14px;
  border: 1px solid #d8f0e2;
  border-radius: 10px;
  background: #f0fbf4;
  color: #2f7d56;
  font-size: 12px;
  font-weight: 600;
}

.api-como ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0 18px 18px;
  list-style: none;
  color: #626275;
  font-size: 12px;
  line-height: 1.5;
}

.api-como li::before {
  content: '▸ ';
  color: var(--purple);
  font-weight: 800;
}

@media (max-width: 720px) {
  .api-endpoint {
    font-size: 9px;
    white-space: normal;
  }
}
</style>
