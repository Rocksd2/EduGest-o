<script setup>
import { computed } from 'vue'
import {
  alunos,
  classeSituacao,
  disciplinas,
  formatarMedia,
  frequenciaDoAluno,
  iniciaisAluno,
  situacaoAluno,
} from '../dados/escola.js'

const props = defineProps({
  id: { type: String, required: true },
})

const aluno = computed(() => alunos.value.find((item) => String(item.id) === props.id))
const resumoPresenca = computed(() => frequenciaDoAluno(Number(props.id)))
</script>

<template>
  <section class="painel">
    <RouterLink class="link-voltar" :to="{ name: 'alunos' }">← Voltar para alunos</RouterLink>

    <template v-if="aluno">
      <div class="pagina-intro detalhe-identidade">
        <span class="avatar avatar--grande" :class="`avatar--${aluno.id % 4}`">{{ iniciaisAluno(aluno) }}</span>
        <div>
          <p class="sobretitulo">FICHA DO ALUNO</p>
          <h2>{{ aluno.nome }}</h2>
          <p>Matrícula {{ aluno.matricula }} · Turma {{ aluno.turma }}</p>
        </div>
        <span class="status" :class="classeSituacao(aluno)">{{ situacaoAluno(aluno) }}</span>
      </div>

      <div class="cartoes-resumo">
        <article class="cartao-resumo">
          <div class="cartao-resumo__topo"><span>Média geral</span><span class="cartao-icone cartao-icone--azul">◷</span></div>
          <strong>{{ formatarMedia(aluno) }}<small class="nota-total">/10</small></strong>
          <div class="barra-progresso"><i :style="{ width: `${Number(formatarMedia(aluno).replace(',', '.')) * 10}%` }"></i></div>
        </article>
        <article class="cartao-resumo">
          <div class="cartao-resumo__topo"><span>Presenças registradas</span><span class="cartao-icone cartao-icone--verde">✓</span></div>
          <strong>{{ resumoPresenca.percentual }}<small class="nota-total">%</small></strong>
          <small><b>{{ resumoPresenca.presentes }} de {{ resumoPresenca.dias }} dia(s)</b> com registro</small>
          <div class="barra-progresso barra-progresso--verde"><i :style="{ width: `${resumoPresenca.percentual}%` }"></i></div>
        </article>
        <article class="cartao-resumo">
          <div class="cartao-resumo__topo"><span>Responsável</span><span class="cartao-icone cartao-icone--laranja">♧</span></div>
          <strong class="detalhe-responsavel">{{ aluno.responsavel || '—' }}</strong>
          <small><b>Contato</b> {{ aluno.email || 'E-mail não informado' }}</small>
        </article>
      </div>

      <section class="bloco detalhe-boletim">
        <div class="bloco__cabecalho"><div><h3>Boletim</h3><p>Notas lançadas por disciplina</p></div></div>
        <div class="tabela-wrap table-responsive">
          <table>
            <thead><tr><th>DISCIPLINA</th><th>NOTA</th></tr></thead>
            <tbody>
              <tr v-for="disciplina in disciplinas" :key="disciplina.chave">
                <td>{{ disciplina.nome }}</td>
                <td><strong>{{ Number(aluno.notas?.[disciplina.chave] ?? 0).toFixed(1).replace('.', ',') }}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <div v-else class="bloco vazio">
      <p>Não encontramos um aluno com este identificador.</p>
      <RouterLink class="link-acao" :to="{ name: 'alunos' }">Ver todos os alunos <span>→</span></RouterLink>
    </div>
  </section>
</template>
