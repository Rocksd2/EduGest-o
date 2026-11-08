<script setup>
defineProps({
  ano: { type: Number, default: new Date().getFullYear() },
})
</script>

<template>
  <footer class="rodape d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
    <span>© {{ ano }} EduGestão</span>
    <span>Gestão escolar mais simples e próxima.</span>
  </footer>
</template>
