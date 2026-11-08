<script setup>
import { nextTick, ref, watch } from 'vue'

// Modal de cadastro/edição usando as classes `modal`, `form-control`,
// `form-select`, `btn` e `alert` do Bootstrap. A abertura continua sendo
// controlada pela reatividade do Vue (v-if), sem depender do JS do Bootstrap.
const props = defineProps({
  aberto: { type: Boolean, default: false },
  aluno: { type: Object, default: null },
  turmas: { type: Array, required: true },
})

const emit = defineEmits(['salvar', 'fechar'])

const formulario = ref({ nome: '', turma: '', email: '', responsavel: '' })
const erro = ref('')
const campoNome = ref(null)

// Sempre que o modal abre, copia os dados do aluno (edição) ou limpa o formulário.
watch(
  () => props.aberto,
  async (aberto) => {
    if (!aberto) return

    formulario.value = props.aluno
      ? {
          nome: props.aluno.nome ?? '',
          turma: props.aluno.turma ?? '',
          email: props.aluno.email ?? '',
          responsavel: props.aluno.responsavel ?? '',
        }
      : { nome: '', turma: '', email: '', responsavel: '' }

    erro.value = ''
    await nextTick()
    campoNome.value?.focus()
  },
  { immediate: true },
)

function enviar() {
  const nome = formulario.value.nome.trim()

  if (nome.length < 3) {
    erro.value = 'Informe o nome completo do aluno (mínimo 3 letras).'
    return
  }

  if (!formulario.value.turma) {
    erro.value = 'Selecione uma turma para o aluno.'
    return
  }

  emit('salvar', { ...formulario.value, nome })
}
</script>

<template>
  <div
    v-if="aberto"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-labelledby="titulo-modal"
    @click.self="emit('fechar')"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <p class="sobretitulo">CADASTRO ACADÊMICO</p>
            <h2 id="titulo-modal" class="modal-title">
              {{ aluno ? 'Editar aluno' : 'Novo aluno' }}
            </h2>
          </div>
          <button type="button" class="btn-close" aria-label="Fechar" @click="emit('fechar')"></button>
        </div>

        <form novalidate @submit.prevent="enviar">
          <div class="modal-body">
            <div class="campo-matricula">
              <span>Matrícula</span>
              <strong>{{ aluno ? aluno.matricula : 'Gerada automaticamente ao cadastrar' }}</strong>
              <small>Número único de até 6 dígitos, sem usar dados pessoais.</small>
            </div>

            <div class="mb-3">
              <label for="aluno-nome" class="form-label">Nome completo</label>
              <input
                id="aluno-nome"
                ref="campoNome"
                v-model="formulario.nome"
                type="text"
                class="form-control"
                required
                minlength="3"
                placeholder="Ex.: Marina Oliveira"
                :class="{ 'is-invalid': erro && formulario.nome.trim().length < 3 }"
              />
            </div>

            <div class="mb-3">
              <label for="aluno-turma" class="form-label">Turma</label>
              <select
                id="aluno-turma"
                v-model="formulario.turma"
                class="form-select"
                required
                :class="{ 'is-invalid': erro && !formulario.turma }"
              >
                <option value="" disabled>Selecione uma turma</option>
                <option v-for="turma in turmas" :key="turma" :value="turma">{{ turma }}</option>
              </select>
            </div>

            <div class="row g-3">
              <div class="col-12 col-sm-6">
                <label for="aluno-email" class="form-label">E-mail do aluno</label>
                <input
                  id="aluno-email"
                  v-model="formulario.email"
                  type="email"
                  class="form-control"
                  placeholder="aluno@escola.edu.br"
                />
              </div>

              <div class="col-12 col-sm-6">
                <label for="aluno-responsavel" class="form-label">Responsável</label>
                <input
                  id="aluno-responsavel"
                  v-model="formulario.responsavel"
                  type="text"
                  class="form-control"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            <div v-if="erro" class="alert alert-danger py-2 px-3 mt-3 mb-0" role="alert">
              <i class="bi bi-exclamation-triangle me-1"></i>{{ erro }}
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="emit('fechar')">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-check-lg me-1"></i>
              {{ aluno ? 'Salvar alterações' : 'Cadastrar aluno' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-if="aberto" class="modal-backdrop fade show"></div>
</template>
