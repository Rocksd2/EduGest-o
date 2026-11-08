<script setup>
// Menu lateral. No desktop fica fixo; abaixo de 992px vira um offcanvas
// do Bootstrap controlado pelo estado `aberta` (Vue), sem precisar de JS externo.
defineProps({
  paginas: { type: Array, required: true },
  paginaAtiva: { type: String, required: true },
  aberta: { type: Boolean, default: false },
})

const emit = defineEmits(['navegar', 'fechar'])
</script>

<template>
  <div
    v-if="aberta"
    class="offcanvas-backdrop fade show d-lg-none"
    @click="emit('fechar')"
  ></div>

  <aside
    id="menu-principal"
    class="offcanvas-lg offcanvas-start barra-lateral"
    :class="{ show: aberta }"
    tabindex="-1"
    aria-label="Menu principal"
  >
    <div class="offcanvas-header d-lg-none">
      <a class="marca m-0" href="#" @click.prevent="emit('navegar', 'visao-geral')">
        <span class="marca__simbolo"><i class="bi bi-mortarboard-fill"></i></span>
        <span class="marca__texto"><strong>edu</strong>gestão<small>GESTÃO ESCOLAR</small></span>
      </a>
      <button
        class="btn btn-light botao-fechar-menu"
        type="button"
        aria-label="Fechar menu"
        @click="emit('fechar')"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="offcanvas-body">
      <a class="marca d-none d-lg-flex" href="#" @click.prevent="emit('navegar', 'visao-geral')">
        <span class="marca__simbolo"><i class="bi bi-mortarboard-fill"></i></span>
        <span class="marca__texto"><strong>edu</strong>gestão<small>GESTÃO ESCOLAR</small></span>
      </a>

      <p class="menu__rotulo">MENU PRINCIPAL</p>
      <nav class="menu" aria-label="Seções do sistema">
        <button
          v-for="pagina in paginas"
          :key="pagina.id"
          type="button"
          :class="{ 'menu__item--ativo': paginaAtiva === pagina.id }"
          :aria-current="paginaAtiva === pagina.id ? 'page' : undefined"
          @click="emit('navegar', pagina.id)"
        >
          <span class="menu__icone" aria-hidden="true"><i class="bi" :class="pagina.icone"></i></span>
          {{ pagina.nome }}
        </button>
      </nav>

      <div class="escola-card">
        <span class="escola-card__icone"><i class="bi bi-building"></i></span>
        <div><strong>Escola Horizonte</strong><small>Ano letivo 2025</small></div>
        <span class="escola-card__seta"><i class="bi bi-chevron-down"></i></span>
      </div>

      <div class="perfil">
        <div class="perfil__avatar">AD</div>
        <div><strong>Administração</strong><small>Coordenação</small></div>
        <span class="perfil__mais"><i class="bi bi-three-dots"></i></span>
      </div>
    </div>
  </aside>
</template>
