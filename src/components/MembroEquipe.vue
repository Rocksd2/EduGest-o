<script setup>
// Componente reutilizado para cada integrante da equipe
defineProps({
  nome: String,
  matricula: String,
})
</script>

<template>
  <li class="membro">
    <span class="membro__inicial" aria-hidden="true">{{ nome.charAt(0) }}</span>
    <div>
      <strong>{{ nome }}</strong>
      <p>Matrícula: {{ matricula }}</p>
    </div>
  </li>
</template>

<style scoped>
.membro {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  background: var(--papel);
  border: 1px solid var(--linha);
  border-radius: var(--raio);
  list-style: none;
}

.membro__inicial {
  flex: none;
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  background: var(--lapis);
  color: var(--tinta);
  font-family: Georgia, serif;
  font-size: 1.2rem;
  font-weight: 700;
}

.membro p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--tinta-clara);
}
</style>
