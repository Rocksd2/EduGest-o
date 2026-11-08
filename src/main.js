import { createApp } from 'vue'
import App from './App.vue'

// Framework CSS: Bootstrap 5 (componentes, grid e utilitários) + ícones oficiais.
// O main.css é importado depois para que o tema do EduGestão tenha prioridade.
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/main.css'

createApp(App).mount('#app')
