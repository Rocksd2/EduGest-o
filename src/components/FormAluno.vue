<script setup>
import { ref } from 'vue'

// Prop: lista de turmas disponíveis, vinda do App.vue
defineProps({
  turmas: Array,
})

// Evento: envia o aluno cadastrado para o App.vue
const emit = defineEmits(['salvar'])

// Variáveis reativas ligadas aos campos com v-model
const nome = ref('')
const turma = ref('')
const nota = ref(null)
const erro = ref('')

function salvar() {
  if (nome.value.trim().length < 3) {
    erro.value = 'Digite o nome completo do aluno (mínimo 3 letras).'
    return
  }
  if (turma.value === '') {
    erro.value = 'Escolha a turma do aluno.'
    return
  }
  if (nota.value === null || nota.value === '' || nota.value < 0 || nota.value > 10) {
    erro.value = 'A nota precisa estar entre 0 e 10.'
    return
  }

  emit('salvar', {
    nome: nome.value.trim(),
    turma: turma.value,
    nota: Number(nota.value),
  })

  // Limpa o formulário para o próximo cadastro
  nome.value = ''
  turma.value = ''
  nota.value = null
  erro.value = ''
}
</script>

<template>
  <form class="form" @submit.prevent="salvar">
    <h3>Cadastrar aluno</h3>

    <label>
      Nome do aluno
      <input v-model="nome" type="text" placeholder="Ex.: Maria Souza" />
    </label>

    <label>
      Turma
      <select v-model="turma">
        <option value="" disabled>Selecione</option>
        <option v-for="t in turmas" :key="t" :value="t">{{ t }}</option>
      </select>
    </label>

    <label>
      Nota final
      <input v-model.number="nota" type="number" min="0" max="10" step="0.1" placeholder="0 a 10" />
    </label>

    <p v-if="erro" class="form__erro" role="alert">{{ erro }}</p>

    <button type="submit">Salvar aluno</button>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  gap: 0.9rem;
  background: var(--papel);
  border: 1px solid var(--linha);
  border-radius: var(--raio);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.form label {
  display: grid;
  gap: 0.3rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.form input,
.form select {
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--linha);
  border-radius: 8px;
  background: #fff;
  color: var(--tinta);
}

.form__erro {
  margin: 0;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: #fbe9e8;
  color: var(--reprovado);
  font-size: 0.9rem;
}

.form button {
  justify-self: start;
  background: var(--tinta);
  color: #fff;
  border: none;
  border-radius: var(--raio);
  padding: 0.6rem 1.25rem;
  font-weight: 700;
  cursor: pointer;
}

.form button:hover {
  background: #2a3f6b;
}

@media (min-width: 720px) {
  .form {
    grid-template-columns: 2fr 1fr 1fr;
    align-items: end;
  }
  .form h3,
  .form__erro,
  .form button {
    grid-column: 1 / -1;
  }
}
</style>
