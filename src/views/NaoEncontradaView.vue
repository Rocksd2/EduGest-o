<template>
  <section class="painel">
    <div class="bloco pagina-404">
      <p class="sobretitulo">ERRO 404</p>
      <h2>Página não encontrada</h2>
      <p>O endereço acessado não existe no EduGestão. Ele pode ter sido digitado errado ou removido.</p>
      <RouterLink class="botao botao--primario" :to="{ name: 'visao-geral' }">Voltar para a visão geral</RouterLink>
    </div>
  </section>
</template>
