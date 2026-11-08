<script setup>
// Card de indicador reutilizado 4 vezes na Visão geral.
// Usa as classes `card`, `card-body` e `progress` do Bootstrap e recebe
// os dados por props; o texto de detalhe pode ser customizado via slot.
defineProps({
  titulo: { type: String, required: true },
  valor: { type: [String, Number], required: true },
  sufixo: { type: String, default: '' },
  icone: { type: String, required: true },
  cor: { type: String, default: 'lilas' },
  progresso: { type: Number, default: null },
  corProgresso: { type: String, default: 'roxo' },
  miniBarras: { type: Boolean, default: false },
})
</script>

<template>
  <article class="card cartao-resumo h-100">
    <div class="card-body">
      <div class="cartao-resumo__topo">
        <span>{{ titulo }}</span>
        <span class="cartao-icone" :class="`cartao-icone--${cor}`">
          <i class="bi" :class="icone" aria-hidden="true"></i>
        </span>
      </div>

      <strong>{{ valor }}<small v-if="sufixo" class="nota-total">{{ sufixo }}</small></strong>

      <small class="cartao-resumo__detalhe">
        <slot name="detalhe" />
      </small>

      <div
        v-if="progresso !== null"
        class="progress barra-progresso"
        role="progressbar"
        :aria-valuenow="progresso"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          class="progress-bar"
          :class="`barra-progresso--${corProgresso}`"
          :style="{ width: `${Math.min(100, Math.max(0, progresso))}%` }"
        ></div>
      </div>

      <div v-if="miniBarras" class="mini-barras" aria-hidden="true">
        <i v-for="n in 12" :key="n"></i>
      </div>
    </div>
  </article>
</template>
