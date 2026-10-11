<script setup>
defineProps({
  nome: String,
  disciplina: String,
})
</script>

<template>
  <footer class="rodape">
    <p>
      <strong>{{ nome }}</strong> — projeto da disciplina {{ disciplina }}.
    </p>
    <p>Aplicação feita com Vue.js, sem bibliotecas externas.</p>
  </footer>
</template>

<style scoped>
.rodape {
  margin-top: 3rem;
  padding: 1.5rem clamp(1rem, 4vw, 3rem);
  background: var(--tinta);
  color: #c4cfe3;
  font-size: 0.9rem;
}

.rodape p {
  margin: 0.15rem 0;
}

.rodape strong {
  color: #fff;
}
</style>
