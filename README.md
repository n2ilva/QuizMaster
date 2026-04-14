# QuizMaster

Instruções para executar o projeto localmente.

### Pré-requisitos
- Node.js instalado
- Expo CLI (ou utilize via npx)

### Estrutura do Projeto

```text
app/                 → Roteamento principal (Expo Router)
  (features)/        → Funcionalidades e módulos do sistema
    (main)/          → Layout principal com navegação lateral/tabs
    coding-practice/ → Prática de código interativa
    quiz/            → Sistema de simulados e questões
    ...              → Outros módulos (estatísticas, temas, etc)
components/          → Componentes reutilizáveis (UI/Botões/Cards)
constants/           → Configurações de tema, cores e padrões
hooks/               → Hooks customizados (autenticação, tema, dados)
lib/                 → Configurações externas (Firebase, APIs)
providers/           → Contextos globais (Auth e Estados)
```

### Instalação e Execução

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npm run start
   ```

3. Escolha a plataforma desejada no terminal:
   - Pressione `w` para abrir na **Web**
   - Pressione `a` para abrir no emulador **Android**
   - Pressione `i` para abrir no simulador **iOS**

---

### Scripts Adicionais

- **Build Web:**
  ```bash
  npm run web:build:ghpages
  ```

- **Build APK (Android):**
  ```bash
  npx eas-cli build --profile preview --platform android
  ```
