# Roteiro da apresentação — EduGestão × Bootstrap 5

**Duração máxima:** 5 minutos · **Formato:** 6 telas (4 obrigatórias + capa e encerramento)
**Arquivos:** `apresentacao/index.html` (deck navegável) e `apresentacao/EduGestao-Bootstrap5.pdf` (entrega)

---

## Antes de apresentar (checklist de 2 minutos)

- [ ] Abrir `apresentacao/index.html` no navegador e pressionar **F** para tela cheia.
- [ ] Testar as setas **↑ / ↓** e a tecla **F** (tela cheia).
- [ ] Abrir a aplicação em outra aba: `npm run dev` ou o link do GitHub Pages.
- [ ] Deixar a aba da aplicação já na tela **Visão geral**, com os dados de exemplo.
- [ ] Conferir se o slide 1 tem o nome de **todos os integrantes** (linha “Integrantes”).
- [ ] Se a internet falhar, usar o PDF: ele contém as mesmas 6 telas.

---

## Roteiro falado (5 min)

### 0:00 – 0:30 · Capa
> “Boa tarde. Somos o grupo do EduGestão, um painel de gestão escolar feito em Vue 3.
> Nesta atividade evoluímos o projeto da primeira avaliação com um framework CSS:
> o Bootstrap 5. Em cinco minutos vamos mostrar por que escolhemos, como integramos,
> o antes e depois e o que aprendemos.”

### 0:30 – 1:30 · Slide 1 — Projeto e framework
> “O EduGestão resolve uma necessidade de sala de aula: reunir alunos, turmas, notas
> e frequência em um só lugar. A versão da primeira avaliação já tinha CRUD, cálculo
> de médias, chamada e persistência no navegador — tudo em Vue 3 com Vite.
>
> Para a segunda avaliação, o requisito era evoluir sem reconstruir. Escolhemos o
> **Bootstrap 5** por três motivos: primeiro, ele já oferece os componentes que o
> projeto usava — card, tabela, modal, botão, formulário e badge. Segundo, o grid e
> os utilitários responsivos resolvem desktop, tablet e celular com classes
> declarativas. Terceiro, é fácil de explicar e manter, porque os nomes das classes
> dizem o que elas fazem.
>
> Consideramos Tailwind, mas teríamos que reescrever muito CSS; e Bulma tem um
> ecossistema menor de componentes prontos.”

### 1:30 – 2:45 · Slide 2 — Integração e classes
> “A integração foi via **npm**, não CDN: `npm install bootstrap bootstrap-icons`.
> No `main.js`, importamos o CSS do Bootstrap, depois os ícones e, por último, o
> `main.css` do projeto. Essa ordem é importante: o tema do EduGestão precisa vir
> depois para sobrescrever cores, fontes e espaçamentos.
>
> A customização usa as variáveis do próprio Bootstrap — `--bs-primary`,
> `--bs-body-font-family`, `--bs-btn-bg` — então a paleta lilás continua, sem
> duplicar CSS.
>
> Seis recursos aparecem na interface:
> 1. `offcanvas-lg`: o menu é fixo no desktop e vira gaveta abaixo de 992px.
> 2. `row`, `col-*` e `row-cols-xl-4`: dois cards no celular, quatro no desktop.
> 3. `card`, `card-body` e `h-100`: estrutura e altura iguais entre os cards.
> 4. `table-hover` e `table-responsive`: padrão visual e rolagem horizontal no celular.
> 5. `modal`, `form-control` e `is-invalid`: cadastro e validação com feedback visual.
> 6. `badge`, `rounded-pill` e `progress`: status e barras dos indicadores.
>
> Detalhe importante: o modal e o menu são controlados pelo **estado do Vue**, não
> pelo JavaScript do Bootstrap. O framework entra como CSS e estrutura; a
> reatividade continua sendo do Vue.”

### 2:45 – 3:45 · Slide 3 — Evolução visual
> “Aqui está o antes e o depois. Na primeira versão, o CSS era artesanal: cabeçalho
> escuro, cards com borda grossa e tabela muito compacta. Depois do Bootstrap,
> ganhamos menu lateral, cards com ícones e barras de progresso, badges de situação
> e um modal de cadastro consistente.
>
> Três elementos principais mudaram: **cabeçalho e menu**, **cards e indicadores** e
> **tabelas, modal e rodapé**.
>
> Na responsividade: acima de 1200px são quatro cards e menu fixo; entre 768 e 1199,
> dois cards e painel empilhado; abaixo de 768, menu offcanvas, busca oculta e ações
> só com ícone. Validamos com 35 verificações automatizadas em seis larguras, de
> 1440 até 390 pixels — sem rolagem horizontal e sem erro no console.”

### 3:45 – 4:45 · Slide 4 — Demonstração e conclusão
> “Vou fazer uma demonstração rápida.”
>
> **Demo (60–75 s):**
> 1. Visão geral: os indicadores vêm de `computed`.
> 2. Alunos: buscar por matrícula, abrir o modal e mostrar a validação com `is-invalid`.
> 3. Notas: alterar uma nota e mostrar a média e o badge mudando na hora.
> 4. Frequência: registrar presença e ver o percentual subir.
> 5. Reduzir a janela ou abrir no celular e mostrar o menu offcanvas.
>
> “Como vantagens: velocidade com componentes prontos, consistência visual e
> responsividade com pouco CSS. Como dificuldades: o CSS completo é pesado, houve
> conflito de estilos até ajustarmos a ordem de importação, e optamos por não usar o
> JS do Bootstrap para não misturar dois controles de estado.
>
> O principal aprendizado foi que framework não substitui CSS nem entendimento:
> ele acelera o que já sabemos explicar.”

### 4:45 – 5:00 · Encerramento
> “O repositório e a aplicação publicada estão nos links. Obrigado — estamos à
> disposição para perguntas.”

---

## Perguntas prováveis (respostas curtas)

**Por que Bootstrap e não Tailwind?**
Tailwind é excelente para criar um design do zero, mas exige escrever utilitários em
cada elemento. Como o projeto já tinha CSS e componentes bem definidos, o Bootstrap
entregou card, tabela, modal e grid prontos com menos reescrita.

**Por que npm e não CDN?**
O npm versiona a dependência no `package.json`, o Vite faz o bundle e otimiza o CSS,
e o build funciona offline. Com CDN, a versão dependeria de um link externo.

**O que `offcanvas-lg` faz exatamente?**
É um componente responsivo do Bootstrap. Abaixo do breakpoint `lg` (992px), ele se
comporta como uma gaveta fora da tela e usa a classe `show` para aparecer. A partir de
992px, o CSS do Bootstrap o devolve ao fluxo normal, como menu fixo. Quem controla
`show` é o estado `menuAberto` do Vue.

**Como o menu abre sem o JavaScript do Bootstrap?**
O `App.vue` guarda `menuAberto` em um `ref`. O botão hambúrguer emite um evento, o
estado muda para `true`, e o `:class="{ show: aberta }"` adiciona a classe. O
`offcanvas-backdrop` também é renderizado por `v-if`. É reatividade do Vue controlando
a classe CSS do Bootstrap.

**O que `row-cols-xl-4` faz?**
Define quantas colunas a linha tem a partir do breakpoint `xl` (1200px). Antes disso,
`row-cols-2` mantém dois cards por linha. O `g-3` aplica o espaçamento (gutter) do grid.

**Para que serve `h-100`?**
Faz o card ocupar 100% da altura da coluna. Assim, cards vizinhos ficam com a mesma
altura, mesmo com textos de tamanhos diferentes.

**O que `table-responsive` resolve?**
Coloca a tabela dentro de um contêiner com rolagem horizontal em telas pequenas, em
vez de esmagar as colunas ou estourar a página.

**O que é `is-invalid`?**
Uma classe de validação do Bootstrap que deixa a borda e o foco do campo vermelhos.
Usamos junto com `novalidate` no formulário para exibir a mensagem customizada do Vue
em vez do balão nativo do navegador.

**Como vocês customizaram as cores?**
Sobrescrevendo as variáveis CSS do Bootstrap no `:root` do `main.css`
(`--bs-primary`, `--bs-primary-rgb`, `--bs-body-font-family`, `--bs-border-radius`) e
as variáveis internas dos componentes (`--bs-btn-bg`, `--bs-progress-bar-bg`).

**O que acontece se o `main.css` for importado antes do Bootstrap?**
O Bootstrap sobrescreveria o tema, porque as regras têm especificidade parecida e a
última folha vence. Por isso a ordem é Bootstrap → ícones → `main.css`.

**Por que não usar o JavaScript do Bootstrap para o modal?**
Porque o modal já era controlado por `v-if` e por um `ref` do Vue. Misturar os dois
geraria dois donos do mesmo estado. Usamos apenas as classes visuais (`modal`,
`modal-backdrop`, `modal-open`) e mantemos a lógica no Vue.

**O que foi feito para acessibilidade?**
`aria-label` nos botões e campos, `aria-current` no item ativo do menu,
`role="progressbar"` com `aria-valuenow`, foco visível e contraste de texto. Os ícones
decorativos têm `aria-hidden="true"`.

**Quais foram os testes?**
Uma suíte com Puppeteer/Edge que abre a aplicação e verifica layout, breakpoints,
abertura do offcanvas, modal, validação, cadastro, edição, persistência, recálculo de
média, presença, busca e erros de console. Resultado: **35/35**.

---

## Divisão sugerida da fala (se forem 3–4 integrantes)

| Momento | Fala |
| --- | --- |
| Integrante 1 | Capa + slide 1 (projeto e justificativa) |
| Integrante 2 | Slide 2 (npm, ordem de importação e classes) |
| Integrante 3 | Slide 3 (antes/depois e responsividade) |
| Integrante 4 | Slide 4 (demo) + conclusão; os demais respondem perguntas |

Se o grupo tiver menos integrantes, o roteiro acima já está sequenciado para uma
pessoa só.

---

## Plano B

- **Sem internet:** use o PDF (`EduGestao-Bootstrap5.pdf`) e o build local da aplicação
  (`npm run preview`). As fontes do deck vêm do Google Fonts; sem rede, o navegador usa
  DM Sans/Manrope se estiverem instaladas ou a fonte padrão — o layout não quebra.
- **Sem projetor:** o deck foi desenhado para 1280×720 e 1440×900; abra em tela cheia.
- **Aplicação não abre:** mostre as capturas em `docs/` — todas são reais.

---

## Onde editar

- **Integrantes:** em `apresentacao/index.html`, procure o comentário
  `<!-- EDITE AQUI: acrescente os demais integrantes do grupo -->` e adicione os nomes
  na mesma linha.
- **Links:** procure `github.com/Rocksd2/EduGest-o` e `rocksd2.github.io/EduGest-o` no
  HTML. Se o usuário do GitHub Pages mudar, atualize os dois lugares (slide 4 e
  encerramento).
- **PDF:** depois de editar o HTML, rode:
  `node C:\Users\Latitude\AppData\Local\Temp\opencode\e2e\deck-pdf.mjs`
  ou imprima o HTML com “Salvar como PDF”, paisagem, margens zero.
