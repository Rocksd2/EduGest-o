<script setup>
defineProps({
  nome: { type: String, required: true },
  matricula: { type: String, required: true },
})
</script>

<template>
  <li class="membro">
    <span class="membro__inicial" aria-hidden="true">{{ nome.charAt(0) }}</span>
    <div class="membro__dados">
      <strong>{{ nome }}</strong>
      <p>Matrícula: {{ matricula }}</p>
    </div>
  </li>
</template>

<style scoped>
.membro {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  padding: 0.55rem 0.65rem;
  border: 1px solid #efeff4;
  border-radius: 10px;
  background: #fff;
  list-style: none;
}

.membro__inicial {
  flex: none;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #f0edff;
  color: #6859c6;
  font-family: Manrope, sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
}

.membro__dados {
  display: grid;
  min-width: 0;
  gap: 0.1rem;
}

.membro strong {
  overflow: hidden;
  color: #37374b;
  font-size: 0.78rem;
  line-height: 1.35;
  text-overflow: ellipsis;
}

.membro p {
  margin: 0;
  color: #9696a6;
  font-size: 0.68rem;
}
</style>
