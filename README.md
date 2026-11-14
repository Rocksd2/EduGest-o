# 🎓 EduGestão

Painel responsivo de gestão acadêmica escolar para professores e coordenação, construído com **Vue 3**, **Vite** e **Bootstrap 5**. Permite cadastrar alunos, lançar notas, registrar frequência e acompanhar indicadores por turma.

[![Vue.js](https://img.shields.io/badge/Vue_3-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Status](https://img.shields.io/badge/status-SPA%20com%20Vue%20Router-yellow?style=for-the-badge)](#-navegação-spa-com-vue-router)
[![Persistência](https://img.shields.io/badge/persistência-localStorage-4B5563?style=for-the-badge)](#-limitações-conhecidas)

---

## 📊 Apresentação

- **[Deck navegável](apresentacao/index.html)** — apresentação atualizada sobre Vue Router. Use `↑`/`↓` para navegar e `F` para tela cheia.
- **[Roteiro de 5 minutos](apresentacao/roteiro.md)** — conteúdo e ordem da apresentação.

[![Capa da apresentação do EduGestão](docs/apresentacao.png)](apresentacao/index.html)

---

## 🖼️ Telas

**Visão geral** — indicadores de matrículas, média escolar, aprovações e frequência do dia.

[![Painel do EduGestão com indicadores de matrículas, média escolar, aprovações e frequência](docs/preview.png)](docs/preview.png)

| Alunos | Turmas |
| --- | --- |
| [![Tela de alunos com busca por matrícula, filtro por turma e ações de editar/remover](docs/alunos.png)](docs/alunos.png) | [![Tela de turmas com quantidade de alunos e média geral de cada turma](docs/turmas.png)](docs/turmas.png) |

| Notas | Frequência |
| --- | --- |
| [![Lançamento de notas de Português, Matemática e Ciências com média e situação calculadas](docs/notas.png)](docs/notas.png) | [![Chamada diária com registro de presença dos alunos da turma](docs/frequencia.png)](docs/frequencia.png) |

| Modal de cadastro | Mobile |
| --- | --- |
| [![Modal de cadastro de aluno](docs/modal.png)](docs/modal.png) | [![Menu de navegação do EduGestão em tela mobile](docs/mobile-menu.png)](docs/mobile-menu.png) |

### Antes e depois

As capturas da primeira versão foram preservadas para comparação:

| Antes (1ª avaliação) | Depois (Bootstrap 5) |
| --- | --- |
| [![Visão geral antes do Bootstrap](docs/antes-visao-geral.png)](docs/antes-visao-geral.png) | [![Visão geral depois do Bootstrap](docs/preview.png)](docs/preview.png) |
| [![Alunos antes do Bootstrap](docs/antes-alunos.png)](docs/antes-alunos.png) | [![Alunos depois do Bootstrap](docs/alunos.png)](docs/alunos.png) |
| [![Notas antes do Bootstrap](docs/antes-notas.png)](docs/antes-notas.png) | [![Notas depois do Bootstrap](docs/notas.png)](docs/notas.png) |

---

## 📌 Sobre o projeto

Sistema criado a partir de uma necessidade real de sala de aula: professores e coordenadores precisam consultar e editar notas e informações dos alunos de forma simples. O EduGestão reúne essas tarefas em um painel único, com navegação por telas e indicadores calculados automaticamente.

É um **protótipo de interface**: funciona no navegador, sem API ou banco de dados. O Bootstrap 5 continua instalado como framework CSS, com Bootstrap Icons, enquanto as páginas mantêm o tema próprio do EduGestão.

---

## ✨ Funcionalidades

**Visão geral**

- Painel com indicadores de matrículas, média escolar, aprovações e frequência.
- Cards responsivos com barras de progresso reativas.

**Alunos**

- Cadastro, edição e remoção de alunos.
- Busca por matrícula e filtro por turma.
- Matrícula numérica única de seis dígitos, gerada automaticamente.
- A matrícula **não** é derivada de CPF, CEP ou data de nascimento.

**Turmas**

- Consulta do número de estudantes e da média de cada turma.

**Notas**

- Lançamento de notas de Português, Matemática e Ciências.
- Cálculo automático da média e da situação do aluno (aprovado, recuperação ou atenção).
- Filtro por turma independente do filtro da tela de alunos.

**Frequência**

- Chamada diária com registro de presença ou ausência por aluno.
- Selos de status para presença, ausência e pendências.

**Geral**

- Persistência local dos cadastros, notas e registros de frequência no navegador.
- Layout responsivo (desktop, tablet e celular), com menu horizontal no mobile.
- Navegação SPA com Vue Router, URLs próprias, histórico do navegador e fallback 404.

## 🧭 Navegação SPA com Vue Router

O Vue Router exibe cada página dentro de `RouterView`. Os links do menu usam
`RouterLink`, então a URL e o histórico do navegador são atualizados sem
recarregar o documento. O estado compartilhado em `src/dados/escola.js` mantém
alunos, notas e frequência ao navegar entre páginas.

| Rota | Página |
| --- | --- |
| `/` | Visão geral |
| `/alunos` | Cadastro, busca e ações dos alunos |
| `/alunos/:id` | Detalhes, boletim e frequência individual |
| `/turmas` | Resumo das turmas |
| `/notas` | Lançamento de notas |
| `/frequencia` | Chamada diária |
| `/sobre` | Sobre o projeto e a navegação SPA |
| Demais caminhos | Página 404 |

O roteiro atualizado dos quatro slides da atividade está em
[docs/apresentacao.md](docs/apresentacao.md). A demonstração pode ser feita
localmente com `npm run dev`, incluindo a navegação entre rotas, a URL dinâmica
de um aluno e a página 404.

---

## 🎨 Framework CSS: Bootstrap 5

### Como o Bootstrap é usado nesta versão

- Bootstrap 5 e Bootstrap Icons são dependências npm versionadas.
- `table-responsive` fornece rolagem horizontal nas tabelas em telas menores.
- Bootstrap Icons é usado nos ícones do menu.
- O layout e os componentes visuais mantêm o CSS próprio do EduGestão; os
  estados, formulários e a navegação ficam sob controle do Vue.

### Como foi integrado

Instalação via npm (recomendado em projetos Vite):

```bash
npm install bootstrap bootstrap-icons
```

Importação em `src/main.js`, **antes** do CSS do projeto:

```js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/main.css'
```

O Bootstrap e os ícones são importados em `src/main.js` antes do CSS do
EduGestão, que mantém a identidade visual da aplicação. Os controles
interativos (navegação, formulário e modal) continuam sob controle do Vue,
sem inicializar um segundo framework JavaScript.

---

## 🧩 Organização Vue

- `src/App.vue` mantém o layout compartilhado, o menu com `RouterLink`, o
  cabeçalho, o modal de cadastro e o `RouterView`.
- `src/router/index.js` associa cada URL ao componente da página e configura o
  histórico, o título e a página 404.
- `src/views/` contém as páginas da visão geral, alunos, detalhes do aluno,
  turmas, notas, frequência, sobre e 404.
- `src/dados/escola.js` centraliza os dados reativos, as regras de negócio e a
  persistência no `localStorage`, compartilhados por todas as rotas.
- `src/components/` preserva os componentes Vue da etapa anterior; os que não
  integram o layout atual continuam como legado.

---

## 📱 Responsividade

- **Desktop:** menu lateral fixo e painel responsivo em colunas.
- **Telas menores (≤ 820px):** menu lateral passa para o topo e pode rolar
  horizontalmente; o conteúdo usa a largura disponível.
- **Celular (≤ 560px):** busca do cabeçalho compacta, cards e filtros se adaptam
  à largura e as tabelas mantêm rolagem horizontal.
- **Acessibilidade:** foco visível, rótulos ARIA nos controles e navegação por
  links semânticos.

---

## 🚀 Como executar

### Pré-requisitos

- **Node.js 18+** instalado

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/Rocksd2/EduGest-o.git

# 2. Entre na pasta
cd EduGest-o

# 3. Instale as dependências
npm install

# 4. Rode em modo de desenvolvimento
npm run dev
```

O Vite abre o projeto em `http://localhost:5173`.

Para gerar a versão de produção:

```bash
npm run build     # gera a pasta dist/
npm run preview   # serve a build localmente
```

---

## 🗂️ Estrutura do projeto

```
EduGest-o/
├── .github/workflows/deploy.yml   # publicação automática no GitHub Pages
├── apresentacao/                  # slides (HTML navegável, PDF e roteiro)
├── docs/                          # capturas de tela (antes e depois)
├── public/
│   └── favicon.svg
├── index.html                     # ponto de entrada + fontes
├── vite.config.js
├── package.json
└── src/
    ├── App.vue                    # layout compartilhado, modal e RouterView
    ├── main.js                    # Bootstrap + Vue + Vue Router
    ├── router/index.js            # rotas SPA
    ├── dados/escola.js            # estado e regras compartilhados
    ├── views/                     # páginas por rota
    ├── assets/
    │   └── main.css               # identidade visual do EduGestão
    └── components/
        ├── AppSidebar.vue
        ├── AppHeader.vue
        ├── ResumoCard.vue
        ├── StatusBadge.vue
        ├── FormAluno.vue
        ├── AppFooter.vue
        ├── ListaAlunos.vue        # legado (não usado)
        └── MembroEquipe.vue       # legado (não usado)
```

---

## 🌐 Publicação no GitHub Pages

O projeto inclui o workflow `.github/workflows/deploy.yml`. Para publicar:

1. No GitHub, abra **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Envie a branch `main`; o workflow faz o build e publica a pasta `dist`.
4. A aplicação fica disponível em `https://<usuario>.github.io/EduGest-o/`.

No GitHub Actions, o `vite.config.js` define `/EduGest-o/` como base de
publicação. O workflow também copia `index.html` para `404.html`, permitindo
que caminhos como `/EduGest-o/alunos/1` carreguem a SPA quando acessados
diretamente ou atualizados. Fora do Actions, o app usa `/` como base local.

---

## 🧠 O que foi praticado

- **Vue 3 com Composition API**: `ref`, `computed`, `watch`, `defineModel` e `nextTick`.
- **Estado derivado**: indicadores, médias e situações são calculados por `computed`, nunca armazenados duplicados.
- **Persistência no cliente**: serialização em JSON no `localStorage`, com `watch` de profundidade (`deep: true`) para salvar automaticamente.
- **Componentização**: divisão do `App.vue` em componentes com props, emits, `v-model` e slots.
- **Vue Router**: mapeamento de URLs para páginas, navegação com `RouterLink`,
  exibição com `RouterView`, rota dinâmica e página 404.
- **SPA em hospedagem estática**: configuração de base para GitHub Pages e
  fallback de navegação direta para rotas internas.
- **Framework CSS**: Bootstrap 5 e Bootstrap Icons instalados por npm, com
  utilitário `table-responsive`; estilos específicos preservam o tema do painel.
- **Responsividade**: breakpoints do CSS do projeto para o layout do painel.
- **Acessibilidade**: foco visível, rótulos ARIA e estados semânticos.

---

## ⚠️ Limitações conhecidas

- **Sem back-end**: não há API, autenticação ou banco de dados. Os dados ficam no `localStorage` do navegador e **não são compartilhados** entre dispositivos ou usuários.
- **Dados de demonstração**: a lista inicial é composta por alunos fictícios.
- **Sem controle de acesso**: qualquer pessoa com acesso ao navegador vê e edita tudo.
- **Sem histórico consolidado**: a chamada é registrada por dia, mas não há relatório de faltas por período.

Para uso real por uma escola, seria necessário integrar autenticação, servidor e armazenamento persistente.

---

## 🛣️ Próximos passos

- Criar API com autenticação de professor e coordenação.
- Migrar os dados do `localStorage` para banco de dados.
- Adicionar relatório de faltas e boletim por bimestre.
- Exportar boletim em PDF.
- Escrever testes unitários dos cálculos de média e situação.

---

## 👤 Autor

**Alexander Protasio**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/alexander-protasio-26a84222a/)
[![GitHub](https://img.shields.io/badge/GitHub-121011?style=flat-square&logo=github&logoColor=white)](https://github.com/Rocksd2)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:alexanderprotasio@gmail.com)
