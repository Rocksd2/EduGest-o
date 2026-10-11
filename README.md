# EduGestão

Painel responsivo de gestão acadêmica escolar, construído com Vue 3 e Vite.

## Funcionalidades

- Painel com indicadores de matrículas, média escolar, aprovações e frequência.
- Cadastro, edição, busca por matrícula, filtro por turma e remoção de alunos.
- Matrícula numérica única de seis dígitos gerada automaticamente; os dados de matrícula não são derivados de CPF, CEP nem data de nascimento.
- Consulta do número de estudantes e da média de cada turma.
- Lançamento de notas de Português, Matemática e Ciências, com cálculo automático da média e situação.
- Chamada diária com registro de presença ou ausência.
- Persistência local dos cadastros, notas e registros de frequência no navegador.
- Busca de estudantes por matrícula nas telas de alunos, notas e frequência.

## Executar

Requer Node.js instalado.

```bash
npm install
npm run dev
```

Para gerar os arquivos de produção:

```bash
npm run build
```

## Observação sobre dados

Esta versão é um protótipo de interface sem API ou banco de dados. Os dados são salvos no `localStorage` do navegador e não são compartilhados entre dispositivos ou usuários. A lista inicial é composta por dados demonstrativos; para uso real pela escola, será necessário integrar autenticação, servidor e armazenamento persistente. Matrículas existentes sem número recebem um identificador ao abrir a aplicação; a geração não solicita nem usa dados pessoais.

## Estrutura

- `src/App.vue`: navegação, dados de demonstração, telas e ações do painel.
- `src/assets/main.css`: estilos responsivos e componentes visuais.
- `src/main.js`: inicialização da aplicação Vue.
