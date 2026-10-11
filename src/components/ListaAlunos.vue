<script setup>
import { ref } from 'vue'

// Prop: lista de alunos recebida do App.vue
const props = defineProps({
  alunos: Array,
})

// Evento: pede ao App.vue para remover um aluno
const emit = defineEmits(['remover'])

// Variável reativa ligada ao campo de busca (v-model)
const busca = ref('')

// Filtra a lista conforme o texto digitado
function alunosFiltrados() {
  const texto = busca.value.trim().toLowerCase()
  return props.alunos.filter((aluno) => aluno.nome.toLowerCase().includes(texto))
}

function situacao(nota) {
  if (nota >= 7) return 'Aprovado'
  if (nota >= 5) return 'Recuperação'
  return 'Reprovado'
}

function classeSituacao(nota) {
  if (nota >= 7) return 'aprovado'
  if (nota >= 5) return 'recuperacao'
  return 'reprovado'
}

function formatarNota(nota) {
  return nota.toFixed(1).replace('.', ',')
}
</script>

<template>
  <div class="lista">
    <label class="lista__busca">
      Buscar aluno
      <input v-model="busca" type="search" placeholder="Digite parte do nome" />
    </label>

    <p v-if="alunosFiltrados().length === 0" class="lista__vazio">
      Nenhum aluno encontrado. Cadastre um aluno em "Novo aluno" ou limpe a busca.
    </p>

    <div v-else class="lista__tabela">
      <table>
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Turma</th>
            <th>Nota</th>
            <th>Situação</th>
            <th><span class="sr-only">Ações</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aluno in alunosFiltrados()" :key="aluno.id">
            <td>{{ aluno.nome }}</td>
            <td>{{ aluno.turma }}</td>
            <td>{{ formatarNota(aluno.nota) }}</td>
            <td>
              <span class="selo" :class="classeSituacao(aluno.nota)">
                {{ situacao(aluno.nota) }}
              </span>
            </td>
            <td>
              <button type="button" class="remover" @click="emit('remover', aluno.id)">
                Remover
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.lista__busca {
  display: grid;
  gap: 0.3rem;
  max-width: 24rem;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.lista__busca input {
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--linha);
  border-radius: 8px;
  background: #fff;
  color: var(--tinta);
}

.lista__vazio {
  padding: 1.25rem;
  background: var(--papel);
  border: 1px dashed var(--linha);
  border-radius: var(--raio);
  color: var(--tinta-clara);
}

.lista__tabela {
  overflow-x: auto;
  background: var(--papel);
  border: 1px solid var(--linha);
  border-radius: var(--raio);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 36rem;
}

th,
td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--linha);
}

th {
  font-size: 0.85rem;
  color: var(--tinta-clara);
  background: #f6f8fb;
}

tbody tr:last-child td {
  border-bottom: none;
}

.selo {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

.aprovado {
  background: var(--aprovado);
}
.recuperacao {
  background: var(--recuperacao);
}
.reprovado {
  background: var(--reprovado);
}

.remover {
  background: transparent;
  color: var(--reprovado);
  border: 1px solid var(--reprovado);
  border-radius: 8px;
  padding: 0.25rem 0.7rem;
  cursor: pointer;
}

.remover:hover {
  background: var(--reprovado);
  color: #fff;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
