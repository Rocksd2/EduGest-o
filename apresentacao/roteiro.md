# Apresentação — Vue Router no EduGestão

Roteiro dos 4 slides obrigatórios (até 5 minutos). Cada bloco corresponde a um slide;
as capturas devem ser feitas com `npm run dev` aberto.

## Slide 1 — Projeto e conceito de SPA

- **EduGestão**: painel de gestão escolar (alunos, turmas, notas, frequência), feito com Vue 3 + Vite.
- **Equipe:** Alexander Protasio de Brito, Iarley Couto Mesquita, Igor Carvalho Lira, Joaquim Rodrigues Conceição, Marlon Carneiro Oliveira e Moisés de Aviz Lopes.
- Antes: uma página só, trocando telas por uma variável `paginaAtiva`.
- Agora: cada tela tem **endereço próprio** e é um componente separado.
- **SPA (Single Page Application)**: o navegador carrega o HTML e o JavaScript uma vez; a troca de páginas acontece no cliente, sem recarregar o documento.
- Diferença da aplicação tradicional: no modelo tradicional cada clique em um link pede uma página nova ao servidor e o navegador reconstrói a tela.

**Captura sugerida:** visão geral (`/`) com o menu lateral e a URL visível.

## Slide 2 — Integração e configuração do Vue Router

1. Dependência: `npm install vue-router@4`.
2. `src/router/index.js`: `createRouter` recebe `history` e a lista de `routes`.
3. `createWebHistory` usa a API de histórico do navegador, então URLs limpas (`/alunos`) e o botão voltar funcionam.
4. `src/main.js`: `createApp(App).use(router)`.
5. `App.vue`: `RouterView` marca onde a página é renderizada; `RouterLink` substitui os links comuns no menu.

```js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'visao-geral', component: VisaoGeralView, meta: { titulo: 'Visão geral' } },
    { path: '/alunos', name: 'alunos', component: AlunosView, meta: { titulo: 'Alunos' } },
    { path: '/alunos/:id', name: 'aluno', component: AlunoDetalheView, props: true },
    { path: '/:caminho(.*)*', name: 'nao-encontrada', component: NaoEncontradaView },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
```

**Captura sugerida:** trecho de `src/router/index.js`.

## Slide 3 — Antes e depois: telas e navegação

- **Antes:** uma tela controlada pelo estado local, sem URL própria para cada página.
- **Depois:** Vue Router associa cada caminho a um componente e atualiza o histórico sem recarregar a aplicação.
- **Melhorias:** links compartilháveis, navegação voltar/avançar, páginas modulares e fallback 404.

- Navegação organizada no menu lateral com `RouterLink`; o item ativo recebe a classe `router-link-active`.
- O título do cabeçalho vem de `route.meta.titulo`.
- `RouterView` exibe o componente da rota atual, mantendo menu, cabeçalho e rodapé fixos.
- Estado compartilhado em `src/dados/escola.js`: as rotas leem e alteram os mesmos alunos e registros (por isso a média muda na visão geral ao editar uma nota).
- Rota dinâmica: `/alunos/:id` usa `props: true` para receber o `id` como prop; o link é montado com `:to="{ name: 'aluno', params: { id: aluno.id } }"`.

**Capturas do slide:** `docs/antes-visao-geral.png` e `docs/preview.png` mostram a mesma visão geral antes e depois; os destaques identificam a navegação por URL e os ganhos de organização.

## Slide 4 — Demonstração e conclusão

Roteiro da demonstração (≈2 min):

1. Abrir em `/` e clicar em **Alunos** pelo menu — a URL muda e a página não recarrega.
2. Buscar uma matrícula; abrir o **detalhe** de um aluno pela tabela.
3. Usar o **voltar** do navegador e depois **atualizar** a página para mostrar que a rota continua na mesma tela.
4. Lançar uma nota em `/notas` e voltar à visão geral para ver a média atualizada.
5. Acessar um endereço inexistente (`/qualquer-coisa`) e cair na página 404.
6. Recarregar e mostrar que os dados continuam salvos (`localStorage`).

**Vantagens**

- URL por tela: links compartilháveis, favoritos e botão voltar funcionando.
- Código dividido em `views`, mais fácil de entender e evoluir.
- Menu e layout únicos, sem duplicar HTML entre telas.
- Navegação instantânea, sem recarregar a aplicação.

**Dificuldades**

- Separar o estado que estava todo no `App.vue` para um módulo compartilhado (`src/dados/escola.js`).
- Manter busca e filtro por turma funcionando entre telas.
- Configurar o servidor de hospedagem para devolver `index.html` em qualquer rota (ou usar histórico em hash).
- Detalhe com `id` inexistente precisou de mensagem própria, além da 404.

**O que aprendemos**

- Rotas mapeiam caminho → componente; `RouterLink` e `RouterView` são as duas peças da navegação.
- Parâmetros de rota permitem páginas reutilizáveis (`/alunos/:id`).
- Em SPA o servidor entrega o app uma vez e o roteamento acontece no cliente.
- Estado compartilhado precisa viver fora das páginas para não se perder ao trocar de rota.
