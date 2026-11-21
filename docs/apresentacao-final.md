---
marp: true
theme: default
paginate: true
size: 16:9
html: true
title: EduGestão — Apresentação final
description: Pitch, demonstração e defesa técnica da integração Front-End × Back-End
---

<!-- _class: lead -->
<!-- _paginate: false -->

# EduGestão

### Gestão escolar simples, conectada e pronta para usar

**Integrantes:** Alexander Protasio de Brito · Iarley Couto Mesquita · Igor Carvalho Lira · Joaquim Rodrigues Conceição · Marlon Carneiro Oliveira · Moisés de Aviz Lopes

Disciplina de Front-End Frameworks — apresentação final (7 minutos)

<!--
Falar em ~1 minuto. Abrir com a promessa: "Em sete minutos mostramos um painel que organiza a vida escolar e que já conversa com o mundo externo." Apresentar rapidamente os integrantes e seguir para o problema.
-->

---

# 1. O produto

**Problema:** secretarias e coordenação ainda controlam alunos, notas e frequência em planilhas soltas — dados duplicados, busca lenta e ninguém sabe a situação real da turma.

**Público-alvo:** coordenação pedagógica, professores e secretaria de escolas de ensino fundamental.

**Por que usar:** uma única tela responde "quantos alunos?", "quem está em recuperação?" e "quem faltou hoje?", com cadastro, boletim e chamada no mesmo lugar.

**Diferencial:** além de salvar tudo no navegador, o EduGestão **consome uma API real**: traz pessoas de fora e as transforma em alunos com matrícula gerada, sem digitar planilha.

> Não é uma maquete: é uma SPA com rotas, dados reativos e integração HTTP funcionando.

<!--
Tom de venda: "Estamos oferecendo uma ferramenta que reduz o trabalho burocrático da coordenação e ainda conecta a escola a dados externos." Destacar o diferencial da API — é o que separa esta entrega das anteriores.
-->

---

# 2. Funcionalidades & demonstração

**Jornada de 2 minutos (clique por clique):**

1. Abrir `/` — indicadores, alunos recentes e resumo das turmas (dados vindo do estado compartilhado).
2. Menu lateral → **Alunos**: a URL muda e a página **não recarrega** (Vue Router).
3. Buscar uma matrícula no cabeçalho; abrir o detalhe `/alunos/:id` — rota dinâmica com boletim e frequência.
4. **Notas**: mudar uma nota → média e situação mudam na hora (reatividade).
5. **Frequência**: registrar presença → percentual da turma atualiza.
6. **API** → digitar "Emily" → **Buscar na API** → cartões com foto, e-mail e detalhes do JSON.
7. Clicar em **Importar aluno** → aluno aparece em **Alunos** com matrícula nova; recarregar a página e mostrar que permaneceu.

<!--
Demonstrar sem pausas longas: cada passo tem uma reação visível. No passo 6, mostrar a URL do endpoint na própria tela. No passo 7, enfatizar que o dado veio de outro servidor e virou dado local — esse é o momento "uau" da apresentação.
-->

---

# 3. Tecnologias & integração com API

<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:20px">

<div>

**Arquitetura em componentes**
- `src/views/` = uma página por rota
- `src/components/CartaoUsuarioApi.vue` = props `usuario`/`importado` + evento `importar`
- `src/dados/escola.js` = estado compartilhado

**Reatividade**
```js
const usuarios = ref([])      // dados da API
const carregando = ref(false) // spinner
const erro = ref('')          // falha
const importados = computed(...)
```

**CSS + Router**
- Bootstrap 5 (componentes, grid, utilitários e ícones) + tema próprio em `main.css`
- `createWebHistory` + `RouterLink`/`RouterView`

</div>

<div>

**API integrada — DummyJSON**
- Base: `https://dummyjson.com`
- `GET /users?limit=8` (lista inicial)
- `GET /users/search?q=<nome>&limit=8` (busca)
- Resposta: JSON `{ users: [...], total, skip, limit }`

**Requisição (src/dados/api.js)**
```js
const resposta = await fetch(
  `${BASE_URL}${caminho}`
)
if (!resposta.ok) throw new Error(...)
const dados = await resposta.json()
return dados.users ?? []
```

**Estados:** `v-if` para carregando/erro/resultado; `role="alert"` + botão "Tentar novamente"; `finally` sempre libera o botão.

</div>

</div>

<!--
Defesa técnica (2 min): mostrar os trechos, não decorar. Pontos a reforçar: (1) ref() dispara a atualização do template; (2) computed evita importar o mesmo usuário duas vezes; (3) o filho só emite o evento, quem decide o que fazer é a página; (4) normalizei a resposta com Array.isArray antes de usar; (5) response.ok cobre 404/500 e o try/catch cobre queda de rede. O Bootstrap e os ícones são importados antes do CSS do projeto, que mantém o tema do EduGestão.
-->

---

# 4. Evolução & aprendizados

| Etapa | Antes | Depois |
| --- | --- | --- |
| Telas | Uma página, variável `paginaAtiva` | Rotas com `RouterView` e URLs próprias |
| Navegação | Recarregava e perdia contexto | SPA com botão voltar e links compartilháveis |
| Dados | Só `localStorage` | `localStorage` **+ API DummyJSON via HTTP** |
| Código | Lógica acoplada | `views`, `components`, `dados/api.js`, `dados/escola.js` |
| Erros | Sem feedback | Carregando, alerta e nova tentativa |

**Dificuldades:** separar o estado do componente único; manter busca/filtro entre rotas; configurar fallback de SPA no servidor.

**Desafio da API:** resposta diferente do esperado e falhas de rede → solução com validação de `ok`, normalização do JSON e estados explícitos de erro.

**Maior aprendizado:** frontend moderno é composição — rota, componente, reatividade e HTTP trabalhando juntos.

<!--
Falar em 1 minuto. Usar as capturas em public/antes.png e public/depois.png se quiser ilustrar a mudança visual da etapa de rotas. Reforçar que a API não substituiu o localStorage: ela complementa, trazendo dados de fora para dentro do cadastro.
-->

---

<!-- _class: lead -->

# 5. Por que adotar o EduGestão?

- **Menos burocracia:** cadastro, notas e frequência em uma só ferramenta responsiva.
- **Decisão rápida:** indicadores e situações calculados automaticamente.
- **Conectado:** a integração com API mostra que o painel pode crescer e receber dados de qualquer serviço JSON.
- **Pronto para evoluir:** autenticação, API própria com POST/PUT/DELETE, relatórios e notificações são os próximos passos naturais.

## Uma escola organizada começa com informação confiável — o EduGestão entrega isso hoje e já está preparado para o amanhã.

**Repositório:** https://github.com/Rocksd2/EduGest-o · **Aplicação:** https://rocksd2.github.io/EduGest-o/ · **API:** https://dummyjson.com

<!--
Encerrar como venda, não com "obrigado". Sugestão de fala final: "Não estamos entregando só um trabalho de faculdade. Estamos entregando uma ferramenta que a coordenação usa no primeiro dia e que a escola pode conectar ao seu próprio sistema amanhã. Queremos mostrar na prática: é só abrir o link e clicar em API."
-->
