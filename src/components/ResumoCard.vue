<script setup>
// Componente reutilizado 4 vezes no App.vue, cada vez com props diferentes
defineProps({
  titulo: String,
  valor: String,
  detalhe: String,
  cor: {
    type: String,
    default: 'azul',
  },
})
</script>

<template>
  <article class="card" :class="cor">
    <h3>{{ titulo }}</h3>
    <p class="card__valor">{{ valor }}</p>
    <p class="card__detalhe">{{ detalhe }}</p>
  </article>
</template>

<style scoped>
.card {
  background: var(--papel);
  border: 1px solid var(--linha);
  border-left: 8px solid var(--cor-destaque);
  border-radius: var(--raio);
  padding: 1rem 1.25rem;
}

.azul {
  --cor-destaque: var(--tinta);
}
.verde {
  --cor-destaque: var(--aprovado);
}
.amarelo {
  --cor-destaque: var(--lapis);
}
.vermelho {
  --cor-destaque: var(--reprovado);
}

.card h3 {
  font-size: 1rem;
  font-family: system-ui, sans-serif;
  font-weight: 600;
  color: var(--tinta-clara);
}

.card__valor {
  margin: 0.35rem 0 0;
  font-family: Georgia, serif;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1;
}

.card__detalhe {
  margin: 0.4rem 0 0;
  font-size: 0.85rem;
  color: var(--tinta-clara);
}
</style>
