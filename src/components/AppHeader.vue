<script setup>
// Props: nome e subtítulo do sistema, enviados pelo App.vue
defineProps({
  nome: String,
  subtitulo: String,
})

// Evento: avisa o App.vue que o usuário quer abrir o formulário
const emit = defineEmits(['novo-aluno'])
</script>

<template>
  <header class="topo">
    <div class="topo__marca">
      <h1>{{ nome }}</h1>
      <p>{{ subtitulo }}</p>
    </div>

    <nav class="topo__menu" aria-label="Seções da página">
      <a href="#resumo">Resumo</a>
      <a href="#alunos">Alunos</a>
      <a href="#equipe">Equipe</a>
      <button type="button" @click="emit('novo-aluno')">Novo aluno</button>
    </nav>
  </header>
</template>

<style scoped>
.topo {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 2rem;
  padding: 0.9rem clamp(1rem, 4vw, 3rem);
  background: var(--tinta);
  color: #fff;
  border-bottom: 4px solid var(--lapis);
}

.topo__marca h1 {
  font-size: 1.6rem;
}

.topo__marca p {
  margin: 0;
  font-size: 0.9rem;
  color: #c4cfe3;
}

.topo__menu {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1.25rem;
}

.topo__menu a {
  color: #fff;
  text-decoration: none;
  padding: 0.25rem 0;
  border-bottom: 2px solid transparent;
}

.topo__menu a:hover {
  border-bottom-color: var(--lapis);
}

.topo__menu button {
  background: var(--lapis);
  color: var(--tinta);
  border: none;
  border-radius: var(--raio);
  padding: 0.5rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.topo__menu button:hover {
  filter: brightness(1.08);
}
</style>
