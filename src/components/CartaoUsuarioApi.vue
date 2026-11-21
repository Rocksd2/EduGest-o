<script setup>
import { ref } from 'vue'

defineProps({
  usuario: { type: Object, required: true },
  importado: { type: Boolean, default: false },
})

const emit = defineEmits(['importar'])
const expandido = ref(false)
</script>

<template>
  <article class="usuario-card d-flex flex-column gap-2 p-3 rounded-3 bg-white">
    <div class="d-flex align-items-center gap-3">
      <img class="usuario-card__foto" :src="usuario.image" :alt="`Foto de ${usuario.firstName} ${usuario.lastName}`" width="48" height="48" loading="lazy" />
      <div class="usuario-card__identidade">
        <strong>{{ usuario.firstName }} {{ usuario.lastName }}</strong>
        <small class="text-muted">{{ usuario.email }}</small>
      </div>
    </div>

    <button class="usuario-card__detalhe" type="button" :aria-expanded="expandido" @click="expandido = !expandido">
      {{ expandido ? 'Ocultar detalhes' : 'Ver detalhes' }} <span aria-hidden="true">{{ expandido ? '−' : '+' }}</span>
    </button>

    <dl v-if="expandido" class="usuario-card__info">
      <div><dt>Telefone</dt><dd>{{ usuario.phone || '—' }}</dd></div>
      <div><dt>Cargo</dt><dd>{{ usuario.company?.title || '—' }}</dd></div>
      <div><dt>Cidade</dt><dd>{{ usuario.address?.city || '—' }}</dd></div>
    </dl>

    <button class="botao botao--secundario usuario-card__acao" type="button" :disabled="importado" @click="emit('importar', usuario)">
      {{ importado ? '✓ Já importado' : '＋ Importar aluno' }}
    </button>
  </article>
</template>

<style scoped>
.usuario-card {
  border: 1px solid var(--line);
  box-shadow: 0 6px 14px rgba(28, 28, 48, 0.04);
}

.usuario-card__foto {
  width: 48px;
  height: 48px;
  flex: none;
  border-radius: 50%;
  background: #f1efff;
  object-fit: cover;
}

.usuario-card__identidade {
  display: grid;
  min-width: 0;
}

.usuario-card__identidade strong {
  font-size: 14px;
}

.usuario-card__identidade small {
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
}

.usuario-card__detalhe {
  align-self: start;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--purple);
  font-size: 11px;
  font-weight: 700;
}

.usuario-card__info {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 10px;
  border-radius: 8px;
  background: #faf9ff;
  font-size: 11px;
}

.usuario-card__info div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.usuario-card__info dt {
  color: var(--muted);
}

.usuario-card__info dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.usuario-card__acao {
  width: 100%;
  justify-content: center;
  margin-top: auto;
  font-size: 12px;
}

.usuario-card :disabled {
  cursor: default;
  opacity: .65;
}
</style>
