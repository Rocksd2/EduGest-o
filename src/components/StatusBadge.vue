<script setup>
// Selo de situação do aluno usando `badge rounded-pill` do Bootstrap.
defineProps({
  texto: { type: String, required: true },
  tipo: { type: String, default: 'pendente' },
})

const classes = {
  aprovado: 'status--aprovado',
  recuperacao: 'status--recuperacao',
  atencao: 'status--atencao',
  pendente: 'status--pendente',
}
</script>

<template>
  <span class="badge rounded-pill status" :class="classes[tipo] ?? classes.pendente">
    {{ texto }}
  </span>
</template>
