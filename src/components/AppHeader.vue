<script setup>
// Cabeçalho da aplicação. O campo de busca usa defineModel (v-model do Vue 3)
// e o botão hambúrguer só aparece em telas menores que 992px.
const busca = defineModel({ type: String, default: '' })

defineProps({
  titulo: { type: String, required: true },
  data: { type: String, required: true },
  menuAberto: { type: Boolean, default: false },
})

const emit = defineEmits(['abrir-menu', 'buscar'])
</script>

<template>
  <header class="cabecalho">
    <div class="cabecalho__esquerda">
      <button
        class="btn btn-light botao-menu d-lg-none"
        type="button"
        aria-label="Abrir menu"
        :aria-expanded="menuAberto"
        aria-controls="menu-principal"
        @click="emit('abrir-menu')"
      >
        <i class="bi bi-list"></i>
      </button>

      <div class="cabecalho__titulo">
        <p class="data-atual">{{ data }}</p>
        <h1>{{ titulo }}</h1>
      </div>
    </div>

    <div class="cabecalho__acoes">
      <label class="busca-global d-none d-md-flex">
        <i class="bi bi-search" aria-hidden="true"></i>
        <input
          v-model="busca"
          type="search"
          inputmode="numeric"
          placeholder="Buscar matrícula..."
          aria-label="Buscar por matrícula"
          @focus="emit('buscar')"
        />
        <kbd>⌘ K</kbd>
      </label>

      <button class="btn botao-icone" type="button" aria-label="Notificações">
        <i class="bi bi-bell"></i>
        <i class="ponto-notificacao" aria-hidden="true"></i>
      </button>

      <button class="avatar avatar--cabecalho" type="button" aria-label="Perfil da administração">
        AD
      </button>
    </div>
  </header>
</template>
