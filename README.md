# QuizMaster

App de Quizzes inteligentes para estudo, com suporte a **Android (APK)** e **Web** via Expo.

## Stack

| Camada   | Tecnologia                                                   |
| -------- | ------------------------------------------------------------ |
| Frontend | Expo 54 · React Native · Expo Router · NativeWind (Tailwind) |
| Auth     | Firebase Authentication                                      |
| Database | Firebase Firestore                                           |

## Funcionalidades

### Autenticação

- Login, cadastro e redefinição de senha via Firebase Auth
- Toggle de visibilidade da senha
- Sessão persistida automaticamente pelo Firebase

### Interface

- Dark mode automático (segue preferência do sistema)
- Navegação por gestos (swipe back) em todas as telas
- Tab bar fixa na web com 4 abas: Início, Cards, Criar, Progresso
- Home com resumo geral

## Estrutura do projeto

```
app/                → Telas (Expo Router file-based routing)
  (tabs)/           → Abas: Início, Cards, Criar, Progresso
  ready/            → Estudo e pesquisa por tema
  login.tsx         → Login / Cadastro / Redefinir senha
components/         → Componentes reutilizáveis
constants/          → Tema de cores
hooks/              → Hooks customizados (color scheme, theme color)
lib/                → Firebase config e API (placeholder)
providers/          → AuthProvider (contexto global de autenticação)
```

## Como rodar

```bash
npm install
npm run start
```

- Android: `a` | iOS: `i` | Web: `w`

## Exportar banks para JSON e enviar ao Firestore

1. Configure as dependências:

```bash
npm install
```

2. Exporte os arquivos de bank para JSON:

```bash
npm run banks:export-json
```

3. Configure as credenciais do Firestore:

```bash
export FIREBASE_SERVICE_ACCOUNT=./service-account.json
export FIREBASE_PROJECT_ID=cardmaster-934d5
```

4. Envie os cards para o Firestore:

```bash
npm run banks:upload
```

5. Opções úteis de envio:

```bash
# limpa a coleção antes de enviar
npm run banks:upload:clean

# salva cada trilha em coleção separada (cards_cloud, cards_desenvolvimento, ...)
npm run banks:upload:split

# trilha separada + limpeza prévia
npm run banks:upload:split:clean
```

Opcional: executar tudo em sequência:

```bash
npm run banks:sync
```

Opcional (export + upload com limpeza):

```bash
npm run banks:sync:clean
```

- JSON gerado em `data/cards/json`
- Coleção padrão no Firestore: `cards`
- Para trocar a coleção: `set BANKS_COLLECTION=minha_colecao`
- Também é possível usar flags diretas: `--clean`, `--split-by-track`, `--dry-run`

## Build e deploy

### APK Android (EAS Build)

```bash
npx eas-cli build --profile preview --platform android
```

### Web (GitHub Pages)

```bash
npm run web:build:ghpages
```
