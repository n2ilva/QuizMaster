/**
 * Documentação detalhada por categoria.
 * Baseada nos temas das questões existentes para auxiliar o usuário antes/durante os estudos.
 */

export type CategoryDocumentation = {
  title: string;
  introduction: string;
  sections: {
    heading: string;
    content: string;
  }[];
  keyTopics: string[];
};

export type TrackDocumentation = {
  [category: string]: CategoryDocumentation;
};

export const documentation: Record<string, TrackDocumentation> = {
  "engenharia-de-software": {
    "Algoritmos e Estruturas de Dados": {
      title: "Algoritmos e Estruturas de Dados",
      introduction:
        "Algoritmos e Estruturas de Dados formam a base fundamental da ciência da computação e do desenvolvimento de software. Um algoritmo é uma sequência finita de instruções bem definidas para resolver um problema, enquanto estruturas de dados são formas organizadas de armazenar e manipular informações na memória do computador. Dominar esses conceitos é essencial para escrever código eficiente, passar em entrevistas técnicas e resolver problemas complexos de forma elegante.",
      sections: [
        {
          heading: "Estruturas de Dados Fundamentais",
          content:
            "As estruturas de dados mais importantes incluem Arrays (acesso O(1) por índice), Listas Ligadas (inserção/remoção O(1) no início), Pilhas (LIFO - último a entrar, primeiro a sair), Filas (FIFO - primeiro a entrar, primeiro a sair), Hash Tables (busca O(1) em média), Árvores Binárias de Busca (operações O(log n) quando balanceadas) e Grafos (modelam relações entre entidades). Cada estrutura tem trade-offs específicos: arrays são ótimos para acesso aleatório mas ruins para inserções no meio; listas ligadas são o oposto. A escolha correta depende do padrão de uso da sua aplicação.",
        },
        {
          heading: "Análise de Complexidade (Big O)",
          content:
            "A notação Big O descreve o comportamento assintótico de um algoritmo conforme o tamanho da entrada cresce. O(1) significa tempo constante (acesso a array), O(log n) é logarítmico (busca binária), O(n) é linear (percorrer lista), O(n log n) é linearítmico (merge sort), O(n²) é quadrático (bubble sort). Entender complexidade permite prever performance: um algoritmo O(n²) com 1 milhão de itens executa 1 trilhão de operações, enquanto O(n log n) executa apenas ~20 milhões. Sempre analise o pior caso, caso médio e melhor caso.",
        },
        {
          heading: "Algoritmos de Ordenação e Busca",
          content:
            "Algoritmos de ordenação organizam dados em ordem específica. Bubble Sort e Selection Sort são O(n²) e servem apenas para fins didáticos. Merge Sort e Quick Sort são O(n log n) e são usados na prática. Para busca, a Busca Linear é O(n) e funciona em qualquer coleção, enquanto a Busca Binária é O(log n) mas requer dados ordenados. Conhecer esses algoritmos e quando aplicá-los é crucial: use sort() nativo para casos gerais, mas implemente soluções customizadas quando performance for crítica.",
        },
      ],
      keyTopics: [
        "Pilha (Stack) e Fila (Queue)",
        "Arrays e Listas Ligadas",
        "Árvores Binárias e BST",
        "Hash Tables",
        "Grafos e Travessias",
        "Notação Big O",
        "Busca Binária",
        "Algoritmos de Ordenação",
      ],
    },
    "APIs REST e GraphQL": {
      title: "APIs REST e GraphQL",
      introduction:
        "APIs (Application Programming Interfaces) são contratos que permitem a comunicação entre diferentes sistemas de software. REST (Representational State Transfer) é um estilo arquitetural que utiliza os métodos HTTP para operações CRUD, enquanto GraphQL é uma linguagem de consulta que permite ao cliente especificar exatamente quais dados precisa. Entender APIs é fundamental para desenvolvimento web moderno, integração de sistemas e arquiteturas de microsserviços.",
      sections: [
        {
          heading: "REST: Princípios e Boas Práticas",
          content:
            "REST utiliza recursos identificados por URLs e métodos HTTP: GET (leitura), POST (criação), PUT/PATCH (atualização) e DELETE (remoção). Códigos de status indicam o resultado: 2xx (sucesso), 4xx (erro do cliente), 5xx (erro do servidor). Boas práticas incluem: URLs no plural (/users), versionamento (/v1/users), HATEOAS para navegabilidade, paginação para listas grandes, e uso correto de query params vs path params. Idempotência é crucial: GET, PUT e DELETE devem produzir o mesmo resultado se chamados múltiplas vezes.",
        },
        {
          heading: "GraphQL: Consultas Flexíveis",
          content:
            "GraphQL resolve o problema de over-fetching (dados demais) e under-fetching (dados de menos) do REST. O cliente define exatamente os campos necessários em uma query. Mutations alteram dados, subscriptions permitem real-time. O schema define tipos e relações, servindo como contrato e documentação. Resolvers implementam a lógica de busca. Ferramentas como Apollo Client/Server simplificam a implementação. Trade-off: mais complexidade inicial, mas maior flexibilidade para frontends diversos.",
        },
        {
          heading: "Autenticação e Segurança em APIs",
          content:
            "APIs precisam de autenticação (quem é você) e autorização (o que pode fazer). JWT (JSON Web Tokens) é popular: token assinado contendo claims do usuário, enviado no header Authorization. OAuth 2.0 permite login com terceiros (Google, GitHub). API Keys identificam aplicações. Rate limiting previne abusos. CORS controla quais origens podem acessar a API. Sempre use HTTPS, valide inputs, e nunca exponha dados sensíveis em logs ou respostas de erro.",
        },
      ],
      keyTopics: [
        "Métodos HTTP (GET, POST, PUT, DELETE)",
        "Códigos de Status HTTP",
        "REST vs GraphQL",
        "JWT e Autenticação",
        "Versionamento de API",
        "Rate Limiting",
        "CORS",
        "Paginação e Filtros",
      ],
    },
    "Arquitetura de Software": {
      title: "Arquitetura de Software",
      introduction:
        "Arquitetura de Software define a estrutura fundamental de um sistema, incluindo componentes, suas relações e princípios que guiam o design. Uma boa arquitetura facilita manutenção, escalabilidade e evolução do software. Decisões arquiteturais são difíceis de reverter e impactam diretamente a qualidade do produto, o custo de desenvolvimento e a capacidade de atender requisitos futuros.",
      sections: [
        {
          heading: "Padrões Arquiteturais",
          content:
            "Cliente-Servidor: separa quem solicita (cliente) de quem processa (servidor), base da web. Monolito: aplicação única, simples para começar mas difícil de escalar. Microsserviços: serviços independentes comunicando via APIs, escaláveis mas complexos. MVC (Model-View-Controller): separa dados (Model), apresentação (View) e lógica (Controller). Camadas (Layered): apresentação → negócio → dados, cada camada só conhece a inferior. Clean Architecture: camadas concêntricas com dependências apontando para dentro. Event-Driven: componentes reagem a eventos, desacoplados e escaláveis.",
        },
        {
          heading: "Princípios SOLID",
          content:
            "SOLID são cinco princípios para código orientado a objetos manutenível. Single Responsibility: classe tem uma razão para mudar. Open/Closed: aberto para extensão, fechado para modificação. Liskov Substitution: subtipos substituem tipos base sem quebrar. Interface Segregation: interfaces específicas são melhores que uma genérica. Dependency Inversion: dependa de abstrações, não implementações. Aplicar SOLID resulta em código modular, testável e fácil de evoluir.",
        },
        {
          heading: "Escalabilidade e Resiliência",
          content:
            "Escalabilidade vertical (mais recursos) vs horizontal (mais instâncias). Load balancers distribuem tráfego. Caching (Redis, CDN) reduz latência. Filas (RabbitMQ, SQS) desacoplam produtores e consumidores. Circuit breakers previnem falhas em cascata. Retries com backoff exponencial tratam falhas transientes. Database sharding distribui dados. Replicação garante disponibilidade. Observabilidade (logs, métricas, traces) é essencial para diagnosticar problemas em sistemas distribuídos.",
        },
      ],
      keyTopics: [
        "Monolito vs Microsserviços",
        "Clean Architecture",
        "Princípios SOLID",
        "MVC e Camadas",
        "Event-Driven Architecture",
        "Escalabilidade Horizontal",
        "Circuit Breaker",
        "CQRS e Event Sourcing",
      ],
    },
    "Design Patterns": {
      title: "Design Patterns",
      introduction:
        "Design Patterns são soluções reutilizáveis para problemas comuns no desenvolvimento de software. Catalogados pelo Gang of Four (GoF), os padrões fornecem vocabulário comum entre desenvolvedores e evitam reinventar a roda. São divididos em três categorias: criacionais (como criar objetos), estruturais (como compor objetos) e comportamentais (como objetos interagem). Conhecer patterns acelera o design e melhora a comunicação técnica.",
      sections: [
        {
          heading: "Padrões Criacionais",
          content:
            "Singleton: garante uma única instância global (ex: conexão de banco). Factory Method: delega criação para subclasses, permitindo extensibilidade. Abstract Factory: cria famílias de objetos relacionados (ex: UI themes). Builder: constrói objetos complexos passo a passo, útil quando há muitos parâmetros opcionais. Prototype: clona objetos existentes em vez de criar do zero. Use criacionais quando a lógica de instanciação é complexa ou precisa ser flexível.",
        },
        {
          heading: "Padrões Estruturais",
          content:
            "Adapter: converte interface incompatível para uma esperada (ex: integrar biblioteca legada). Decorator: adiciona comportamento dinamicamente sem alterar a classe (ex: middleware). Facade: simplifica interface de um subsistema complexo. Proxy: controla acesso a objeto (ex: lazy loading, cache). Composite: trata objetos individuais e composições uniformemente (ex: árvore de componentes). Bridge: separa abstração de implementação. Estruturais ajudam a compor objetos de forma flexível.",
        },
        {
          heading: "Padrões Comportamentais",
          content:
            "Observer: notifica múltiplos objetos sobre mudanças (ex: eventos de UI). Strategy: encapsula algoritmos intercambiáveis (ex: diferentes formas de pagamento). Command: encapsula requisição como objeto (ex: undo/redo). State: altera comportamento baseado em estado interno. Template Method: define esqueleto de algoritmo, subclasses implementam passos. Iterator: percorre coleção sem expor estrutura interna. Chain of Responsibility: passa requisição por cadeia de handlers (ex: middlewares).",
        },
      ],
      keyTopics: [
        "Singleton",
        "Factory e Abstract Factory",
        "Observer",
        "Strategy",
        "Decorator",
        "Adapter",
        "Facade",
        "Command",
      ],
    },
    "Programação Orientada a Objetos": {
      title: "Programação Orientada a Objetos",
      introduction:
        "Programação Orientada a Objetos (POO) é um paradigma que organiza código em torno de objetos que combinam dados (atributos) e comportamentos (métodos). Os quatro pilares da POO — encapsulamento, herança, polimorfismo e abstração — permitem criar sistemas modulares, reutilizáveis e fáceis de manter. POO é dominante em linguagens como Java, C#, Python e TypeScript, sendo essencial para desenvolvimento profissional.",
      sections: [
        {
          heading: "Classes, Objetos e Encapsulamento",
          content:
            "Classe é um modelo (blueprint) que define atributos e métodos. Objeto é uma instância de classe com valores específicos. O construtor é um método especial chamado automaticamente ao criar um objeto, usado para inicializar atributos. Encapsulamento esconde detalhes internos, expondo apenas interface pública via modificadores de acesso: public (todos acessam), private (só a classe), protected (classe e filhas). Getters e setters controlam acesso a atributos. Métodos estáticos pertencem à classe (não ao objeto) e são chamados sem instanciar: Math.random(), Array.isArray(). Use estáticos para utilitários que não dependem de estado do objeto.",
        },
        {
          heading: "Herança e Composição",
          content:
            "Herança permite criar classes derivadas que herdam atributos e métodos da classe base, promovendo reutilização. Porém, herança profunda cria acoplamento forte. 'Favor composition over inheritance': composição (ter um objeto) é mais flexível que herança (ser um tipo). Use herança para relações 'é um' genuínas (Cachorro é Animal), composição para 'tem um' (Carro tem Motor). Interfaces definem contratos sem implementação, permitindo polimorfismo sem herança.",
        },
        {
          heading: "Polimorfismo e Abstração",
          content:
            "Polimorfismo permite tratar objetos de tipos diferentes através de interface comum. Sobrescrita (override): subclasse redefine método da classe pai. Sobrecarga (overload): mesmo método com parâmetros diferentes. Abstração esconde complexidade, expondo apenas o essencial. Classes abstratas têm métodos abstratos (sem implementação) que subclasses devem implementar. Interfaces são 100% abstratas. Polimorfismo + abstração = código extensível: adicione novos tipos sem modificar código existente.",
        },
      ],
      keyTopics: [
        "Classes e Objetos",
        "Encapsulamento",
        "Herança",
        "Polimorfismo",
        "Abstração",
        "Interfaces",
        "Construtores",
        "Métodos Estáticos vs Instância",
      ],
    },
    "Clean Code e Boas Práticas": {
      title: "Clean Code e Boas Práticas",
      introduction:
        "Clean Code é código que é fácil de ler, entender e modificar. Código é lido muito mais do que escrito, então clareza é crucial. Robert C. Martin (Uncle Bob) popularizou princípios de código limpo que reduzem bugs, facilitam manutenção e melhoram colaboração em equipe. Boas práticas incluem nomenclatura significativa, funções pequenas, evitar repetição e escrever testes. Código limpo não é luxo, é profissionalismo.",
      sections: [
        {
          heading: "Nomenclatura e Legibilidade",
          content:
            "Nomes devem revelar intenção: 'diasDesdeModificacao' é melhor que 'd'. Use convenções da linguagem (camelCase, snake_case). Evite abreviações obscuras e prefixos desnecessários. Funções devem fazer UMA coisa e ser pequenas (idealmente < 20 linhas). Extraia código em funções nomeadas em vez de comentários explicativos. Evite magic numbers: use constantes nomeadas (MAX_TENTATIVAS = 3). Use Early Return para reduzir aninhamento: em vez de if-else profundo, retorne cedo nos casos de erro. Código legível é documentação viva que nunca fica desatualizada.",
        },
        {
          heading: "Princípios DRY, KISS e YAGNI",
          content:
            "DRY (Don't Repeat Yourself): evite duplicação, extraia código comum. Repetição significa bugs duplicados e manutenção multiplicada. KISS (Keep It Simple, Stupid): soluções simples são mais fáceis de entender e menos propensas a bugs. YAGNI (You Ain't Gonna Need It): não implemente funcionalidade especulativa. Código não escrito não tem bugs. Balance: abstração prematura também é ruim. Refatore quando padrão se confirmar (Rule of Three).",
        },
        {
          heading: "Refatoração e Code Smells",
          content:
            "Code smells são sintomas de problemas: funções longas, classes grandes (God Class), muitos parâmetros, comentários compensando código ruim, código duplicado, feature envy (método usa mais dados de outra classe). Refatoração melhora estrutura sem alterar comportamento. Técnicas: Extract Method, Rename, Move Method, Replace Conditional with Polymorphism. Sempre refatore com testes verdes — nunca mude comportamento e estrutura juntos.",
        },
      ],
      keyTopics: [
        "Nomenclatura Significativa",
        "Funções Pequenas",
        "DRY, KISS, YAGNI",
        "Code Smells",
        "Refatoração",
        "Early Return",
        "Magic Numbers",
        "Single Responsibility",
      ],
    },
    "Testes de Software": {
      title: "Testes de Software",
      introduction:
        "Testes de software são práticas essenciais para garantir que o código funciona conforme esperado e continua funcionando após mudanças. Testes automatizados detectam bugs cedo, servem como documentação viva e dão confiança para refatorar. A pirâmide de testes guia a estratégia: muitos testes unitários (rápidos e baratos), alguns de integração, poucos end-to-end. Investir em testes é investir em qualidade e velocidade a longo prazo.",
      sections: [
        {
          heading: "Testes Unitários",
          content:
            "Testes unitários verificam unidades isoladas de código (funções, classes) sem dependências externas. São rápidos (milissegundos), determinísticos e devem cobrir casos de sucesso, erro e edge cases. Use mocks/stubs para isolar a unidade de dependências (banco, APIs). Frameworks populares: Jest (JavaScript), JUnit (Java), pytest (Python). Escreva testes pequenos e focados: um assert por teste idealmente. Siga o padrão AAA: Arrange (setup), Act (executa), Assert (verifica).",
        },
        {
          heading: "Testes de Integração e E2E",
          content:
            "Testes de integração verificam se componentes funcionam juntos: API + banco, serviço A + serviço B. São mais lentos que unitários mas detectam problemas de interface. Testes end-to-end (E2E) simulam o usuário real: abrem navegador, clicam botões, verificam telas. Ferramentas: Cypress, Playwright, Selenium. E2E são lentos e frágeis, use com moderação para fluxos críticos (login, checkout). A pirâmide de testes: 70% unitários, 20% integração, 10% E2E.",
        },
        {
          heading: "TDD e Cobertura de Código",
          content:
            "TDD (Test-Driven Development): escreva o teste antes do código. Ciclo Red-Green-Refactor: teste falha (red), implemente mínimo para passar (green), melhore o código (refactor). TDD força design modular e testável. Cobertura de código mede % de linhas/branches executadas pelos testes. 80% é meta comum, mas cobertura alta não garante qualidade — testes ruins podem cobrir muito sem verificar nada. Foque em testar comportamentos, não implementação.",
        },
      ],
      keyTopics: [
        "Testes Unitários",
        "Testes de Integração",
        "Testes End-to-End (E2E)",
        "Pirâmide de Testes",
        "Jest e Frameworks",
        "Mocks e Stubs",
        "TDD",
        "Cobertura de Código",
      ],
    },
    "Git e Versionamento": {
      title: "Git e Versionamento",
      introduction:
        "Git é o sistema de controle de versão mais usado no mundo, permitindo rastrear mudanças no código, colaborar em equipe e reverter erros. Criado por Linus Torvalds para o kernel Linux, Git é distribuído: cada desenvolvedor tem cópia completa do histórico. Dominar Git é habilidade essencial — comandos básicos são simples, mas entender branches, merges e resolução de conflitos diferencia profissionais.",
      sections: [
        {
          heading: "Comandos Fundamentais",
          content:
            "git clone: copia repositório remoto para máquina local. git add: move arquivos para staging area (preparados para commit). git commit: salva snapshot do staging no histórico local. git push: envia commits locais para repositório remoto. git pull: baixa e integra mudanças do remoto. git status: mostra estado atual (modificados, staged). git log: exibe histórico de commits. git diff: mostra diferenças entre versões. Working directory → staging area (add) → repository (commit) → remote (push).",
        },
        {
          heading: "Branches e Merge",
          content:
            "Branches são linhas paralelas de desenvolvimento. git branch nome: cria branch. git checkout -b nome: cria e muda para branch. git merge: integra branch na atual. git rebase: reaplica commits sobre outra base (histórico linear). Merge cria commit de merge; rebase reescreve histórico. Conflitos ocorrem quando mesma linha foi alterada em ambas branches — resolva manualmente editando os marcadores <<<<<<<. Estratégias: Git Flow (feature/develop/main), GitHub Flow (main + feature branches).",
        },
        {
          heading: "Boas Práticas",
          content:
            "Commits pequenos e frequentes com mensagens descritivas: 'feat: adiciona validação de email' (Conventional Commits). .gitignore: lista arquivos que Git deve ignorar (node_modules, .env, builds). Nunca commite segredos (senhas, API keys). Pull request/merge request: revisão de código antes de integrar. Proteja branch main: exija reviews e CI verde. git stash: salva mudanças temporariamente sem commitar. git reset/revert: desfaz commits (reset reescreve histórico, revert cria novo commit).",
        },
      ],
      keyTopics: [
        "clone, add, commit, push, pull",
        "Branches e Checkout",
        "Merge vs Rebase",
        "Resolução de Conflitos",
        ".gitignore",
        "Git Flow / GitHub Flow",
        "Pull Requests",
        "Conventional Commits",
      ],
    },
    "Docker e Containers": {
      title: "Docker e Containers",
      introduction:
        "Docker é uma plataforma que permite empacotar aplicações e suas dependências em containers — ambientes isolados, leves e portáteis. Diferente de máquinas virtuais que virtualizam hardware, containers compartilham o kernel do host, sendo muito mais eficientes. Docker resolve o problema 'funciona na minha máquina' garantindo que o ambiente seja idêntico em desenvolvimento, teste e produção.",
      sections: [
        {
          heading: "Containers vs Máquinas Virtuais",
          content:
            "VMs virtualizam hardware completo, cada uma com seu próprio OS — pesadas (GBs), lentas para iniciar (minutos). Containers compartilham o kernel do host, isolando apenas processos e filesystem — leves (MBs), iniciam em segundos. Docker usa namespaces (isolamento) e cgroups (limites de recursos) do Linux. Containers são efêmeros por design: dados são perdidos ao remover o container. Use volumes para persistir dados fora do container.",
        },
        {
          heading: "Dockerfile e Imagens",
          content:
            "Dockerfile é uma receita textual para construir uma imagem. Instruções principais: FROM (imagem base), COPY/ADD (copia arquivos), RUN (executa comandos), WORKDIR (define diretório), EXPOSE (documenta porta), CMD/ENTRYPOINT (comando ao iniciar). docker build -t nome:tag . cria imagem. Imagens são camadas imutáveis empilhadas — camadas em cache aceleram builds. docker pull baixa imagem do registry (Docker Hub). docker run cria e executa container a partir da imagem.",
        },
        {
          heading: "Docker Compose e Orquestração",
          content:
            "Docker Compose define aplicações multi-container em docker-compose.yml: serviços, redes, volumes. docker-compose up inicia toda a stack (app + banco + cache). Ideal para desenvolvimento local. Para produção, orquestradores como Kubernetes gerenciam containers em escala: auto-scaling, self-healing, rolling updates. Comandos essenciais: docker ps (lista containers), docker logs (saída), docker exec -it bash (terminal no container), docker stop/rm (para/remove).",
        },
      ],
      keyTopics: [
        "Containers vs VMs",
        "Dockerfile",
        "Imagens e Layers",
        "docker run, build, ps",
        "Volumes e Persistência",
        "Docker Compose",
        "Networking",
        "Docker Hub",
      ],
    },
    "CI/CD e DevOps": {
      title: "CI/CD e DevOps",
      introduction:
        "CI/CD (Continuous Integration / Continuous Delivery) são práticas que automatizam o processo de integração, teste e entrega de software. DevOps é a cultura que une desenvolvimento e operações, quebrando silos e acelerando entregas. Juntos, CI/CD e DevOps permitem deploy frequente, confiável e com menos riscos. Empresas modernas fazem dezenas de deploys por dia graças a essas práticas.",
      sections: [
        {
          heading: "Continuous Integration (CI)",
          content:
            "CI integra código de múltiplos desenvolvedores frequentemente (várias vezes ao dia). A cada push, o pipeline executa automaticamente: build, testes unitários, linters, análise estática. Se algo falha, o time é notificado imediatamente. CI detecta problemas de integração cedo, quando são baratos de corrigir. Ferramentas: GitHub Actions, GitLab CI, Jenkins, CircleCI. Regra de ouro: branch main sempre deve estar verde (deployável).",
        },
        {
          heading: "Continuous Delivery vs Deployment",
          content:
            "Continuous Delivery: código está sempre pronto para deploy, mas há aprovação manual para produção. Continuous Deployment: cada commit que passa no pipeline vai automaticamente para produção. A maioria das empresas usa Delivery (deploy é decisão de negócio). Pipeline típico: build → testes unitários → testes integração → deploy staging → testes E2E → aprovação → deploy produção. Feature flags permitem deploy de código inativo, ativando features gradualmente.",
        },
        {
          heading: "Cultura DevOps",
          content:
            "DevOps não é ferramenta, é cultura de colaboração entre Dev e Ops. Pilares: automação (infraestrutura como código), medição (métricas de performance), compartilhamento (conhecimento entre times), feedback rápido (monitoramento, alertas). Infrastructure as Code (IaC): Terraform, Ansible definem infraestrutura em arquivos versionados. GitOps: estado desejado da infraestrutura vive no Git. Observabilidade: logs, métricas, traces para entender o sistema em produção.",
        },
      ],
      keyTopics: [
        "Continuous Integration",
        "Continuous Delivery",
        "Continuous Deployment",
        "GitHub Actions",
        "Pipeline Stages",
        "Cultura DevOps",
        "Infrastructure as Code",
        "Feature Flags",
      ],
    },
    "System Design": {
      title: "System Design",
      introduction:
        "System Design é a arte de projetar sistemas de software escaláveis, confiáveis e eficientes. Envolve decisões sobre arquitetura, bancos de dados, caching, comunicação entre serviços e muito mais. É tema central em entrevistas para posições sênior em empresas de tecnologia. Bom system design equilibra trade-offs: consistência vs disponibilidade, latência vs throughput, simplicidade vs flexibilidade.",
      sections: [
        {
          heading: "Escalabilidade e Performance",
          content:
            "Escalabilidade vertical (scale up): adicionar mais CPU/RAM a uma máquina — simples mas tem limite físico. Escalabilidade horizontal (scale out): adicionar mais máquinas — complexo mas ilimitado. Load balancers distribuem requisições entre servidores (Round Robin, Least Connections, IP Hash). CDNs servem conteúdo estático próximo ao usuário, reduzindo latência. Latência é tempo de resposta individual; throughput é quantidade de requisições por segundo. Otimize gargalos: banco lento? Cache. Rede lenta? CDN.",
        },
        {
          heading: "Caching e Bancos de Dados",
          content:
            "Cache armazena dados frequentemente acessados em memória rápida. Redis e Memcached são populares. Estratégias: Cache-Aside (app gerencia), Write-Through (escreve cache+DB), Write-Behind (escreve cache, DB assíncrono). Invalidação de cache é um dos problemas mais difíceis. Bancos SQL (PostgreSQL, MySQL): ACID, relações, joins. Bancos NoSQL (MongoDB, DynamoDB): esquema flexível, escalabilidade horizontal. CAP Theorem: escolha 2 de 3 — Consistência, Disponibilidade, Tolerância a Partições.",
        },
        {
          heading: "Comunicação e Resiliência",
          content:
            "Comunicação síncrona (REST, gRPC): cliente espera resposta. Assíncrona (filas, eventos): desacoplada, mais resiliente. API Gateway centraliza autenticação, rate limiting, roteamento. Service mesh (Istio) gerencia comunicação entre microsserviços. Padrões de resiliência: Circuit Breaker (evita chamadas a serviço falho), Retry com backoff exponencial, Timeout adequado, Fallback (resposta alternativa). Idempotência: requisição repetida produz mesmo resultado — essencial para retries seguros.",
        },
      ],
      keyTopics: [
        "Escalabilidade Horizontal/Vertical",
        "Load Balancer",
        "Caching (Redis)",
        "CDN",
        "SQL vs NoSQL",
        "CAP Theorem",
        "Latência vs Throughput",
        "Circuit Breaker",
      ],
    },
    "Autenticação e Autorização": {
      title: "Autenticação e Autorização",
      introduction:
        "Autenticação verifica quem você é; autorização determina o que você pode fazer. São pilares fundamentais de segurança em qualquer aplicação. Implementar corretamente protege dados de usuários e evita brechas de segurança. Com APIs e microsserviços, autenticação baseada em tokens (JWT) e protocolos como OAuth 2.0 se tornaram padrão da indústria.",
      sections: [
        {
          heading: "Autenticação: Sessão vs Token",
          content:
            "Autenticação baseada em sessão: servidor armazena estado da sessão, cliente recebe cookie com session ID. Simples, mas não escala bem (sessão fica em um servidor). Autenticação baseada em token (JWT): servidor gera token assinado contendo claims do usuário, cliente envia em cada requisição via header Authorization. Stateless: qualquer servidor pode validar. JWT tem 3 partes: header.payload.signature. Cuidado: JWT não é criptografado por padrão, apenas assinado — não coloque dados sensíveis.",
        },
        {
          heading: "OAuth 2.0 e MFA",
          content:
            "OAuth 2.0 é protocolo de autorização delegada: permite login com Google, GitHub etc. sem compartilhar senha. Fluxos: Authorization Code (apps server-side), Implicit (SPAs legacy), Client Credentials (machine-to-machine). OpenID Connect adiciona camada de identidade sobre OAuth. MFA (Multi-Factor Authentication) exige 2+ fatores: algo que sabe (senha), algo que tem (celular), algo que é (biometria). MFA bloqueia 99.9% dos ataques de conta comprometida. Sempre ofereça MFA para usuários.",
        },
        {
          heading: "Boas Práticas de Segurança",
          content:
            "Hash de senhas com bcrypt/Argon2 (nunca MD5/SHA1). Salt único por usuário evita rainbow tables. Rate limiting em login previne brute force. Tokens de refresh permitem access tokens curtos (15min) com refresh tokens longos (7d). Revogue tokens em logout/mudança de senha. HTTPS sempre — tokens em HTTP são roubáveis. CORS restringe origens que podem chamar sua API. Armazene tokens em httpOnly cookies (XSS-safe) ou memória (não localStorage para tokens sensíveis).",
        },
      ],
      keyTopics: [
        "Autenticação vs Autorização",
        "JWT (JSON Web Token)",
        "Sessão vs Token",
        "OAuth 2.0",
        "OpenID Connect",
        "MFA/2FA",
        "Hash de Senhas (bcrypt)",
        "Refresh Tokens",
      ],
    },
    "Mensageria e Filas": {
      title: "Mensageria e Filas",
      introduction:
        "Mensageria é comunicação assíncrona entre sistemas através de mensagens. Filas desacoplam produtores de consumidores, permitindo que trabalhem em ritmos diferentes. Isso aumenta resiliência (se consumidor cai, mensagens são preservadas), escalabilidade (adicione mais consumidores) e flexibilidade (novos consumidores sem mudar produtor). É essencial em arquiteturas de microsserviços e sistemas distribuídos.",
      sections: [
        {
          heading: "Filas (Queue) vs Pub/Sub",
          content:
            "Queue (fila): cada mensagem é consumida por um único consumidor. Útil para distribuir trabalho: 100 emails para enviar, 5 workers processam 20 cada. Se worker falha, mensagem volta para fila (at-least-once delivery). Pub/Sub (publicação/assinatura): mensagem é entregue a todos os assinantes do tópico. Útil para eventos: 'pedido criado' notifica estoque, faturamento, email — todos recebem. RabbitMQ suporta ambos; Kafka é otimizado para streaming de eventos em alta escala.",
        },
        {
          heading: "Ferramentas e Casos de Uso",
          content:
            "RabbitMQ: message broker versátil, bom para filas tradicionais, suporta múltiplos protocolos (AMQP). Apache Kafka: log distribuído, alta throughput, retenção de mensagens, ideal para event sourcing e streaming. Amazon SQS: fila gerenciada, zero manutenção, integra com Lambda. Redis Pub/Sub: simples, em memória, sem persistência. Casos de uso: processamento de background (envio de email), comunicação entre microsserviços, buffer para picos de tráfego, event sourcing, ingestão de dados.",
        },
        {
          heading: "Garantias de Entrega",
          content:
            "At-most-once: mensagem pode ser perdida, nunca duplicada (fire-and-forget). At-least-once: mensagem é entregue, pode duplicar se consumer crashar antes de ack — consumer deve ser idempotente. Exactly-once: mais difícil, requer coordenação (Kafka Transactions). Dead Letter Queue (DLQ): mensagens que falham após N tentativas vão para fila separada para análise. Acknowledge (ack): consumer confirma processamento, só então mensagem é removida. Prefetch: quantas mensagens consumer pega de uma vez.",
        },
      ],
      keyTopics: [
        "Filas (Queue)",
        "Pub/Sub",
        "RabbitMQ",
        "Apache Kafka",
        "Amazon SQS",
        "Dead Letter Queue",
        "At-least-once Delivery",
        "Idempotência",
      ],
    },
    "Metodologias Ágeis": {
      title: "Metodologias Ágeis",
      introduction:
        "Metodologias ágeis são abordagens de desenvolvimento que priorizam entrega incremental, colaboração e adaptação a mudanças. O Manifesto Ágil (2001) estabeleceu valores: indivíduos sobre processos, software funcionando sobre documentação, colaboração sobre contratos, responder a mudanças sobre seguir planos. Scrum e Kanban são os frameworks mais populares. Agilidade não é sobre velocidade, é sobre aprender rápido e entregar valor continuamente.",
      sections: [
        {
          heading: "Scrum: Papéis e Cerimônias",
          content:
            "Scrum organiza trabalho em Sprints (1-4 semanas). Três papéis: Product Owner (prioriza backlog, representa negócio), Scrum Master (facilita processo, remove impedimentos), Dev Team (executa). Cerimônias: Sprint Planning (planeja o que fazer), Daily Standup (15min, sincroniza time), Sprint Review (demo para stakeholders), Sprint Retrospective (melhoria contínua). Artefatos: Product Backlog (lista priorizada de features), Sprint Backlog (seleção da sprint), Incremento (produto potencialmente entregável).",
        },
        {
          heading: "Kanban e Fluxo Contínuo",
          content:
            "Kanban visualiza trabalho em quadro com colunas (To Do, Doing, Done). Limite de WIP (Work in Progress) evita sobrecarga — se coluna 'Doing' está cheia, termine antes de puxar mais. Foco em fluxo contínuo, não sprints fixas. Métricas: Lead Time (ideia → produção), Cycle Time (início → fim do trabalho). Kanban é mais flexível que Scrum, bom para times de suporte ou trabalho imprevisível. Pode ser combinado com Scrum (Scrumban).",
        },
        {
          heading: "User Stories e Estimativas",
          content:
            "User Story formato: 'Como [persona], quero [ação] para [benefício]'. Critérios de aceite definem quando está pronta. INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable. Estimativas em Story Points (complexidade relativa) são mais confiáveis que horas. Planning Poker: time vota simultaneamente para evitar ancoragem. Velocity: média de pontos entregues por sprint, usada para planejamento. Definition of Done: checklist que define quando feature está completa (testado, revisado, deployed).",
        },
      ],
      keyTopics: [
        "Manifesto Ágil",
        "Scrum",
        "Kanban",
        "Sprint",
        "Product Owner / Scrum Master",
        "User Stories",
        "Story Points",
        "Daily Standup",
      ],
    },
    "Segurança no Desenvolvimento": {
      title: "Segurança no Desenvolvimento",
      introduction:
        "Segurança no desenvolvimento (DevSecOps) integra práticas de segurança em todo o ciclo de desenvolvimento, não apenas no final. O OWASP Top 10 lista as vulnerabilidades mais críticas em aplicações web. Ataques como SQL Injection e XSS ainda são comuns porque desenvolvedores não seguem práticas básicas. Segurança é responsabilidade de todos — um único input não validado pode comprometer todo o sistema.",
      sections: [
        {
          heading: "OWASP Top 10 e Vulnerabilidades Comuns",
          content:
            "OWASP Top 10 (2021): 1. Broken Access Control, 2. Cryptographic Failures, 3. Injection (SQL, NoSQL, OS), 4. Insecure Design, 5. Security Misconfiguration, 6. Vulnerable Components, 7. Authentication Failures, 8. Data Integrity Failures, 9. Logging Failures, 10. SSRF. SQL Injection: input malicioso manipula queries (' OR 1=1 --). Prevenção: prepared statements/parameterized queries SEMPRE. XSS: script malicioso executa no browser da vítima. Prevenção: escape output, Content-Security-Policy.",
        },
        {
          heading: "HTTPS, CORS e Headers de Segurança",
          content:
            "HTTPS criptografa comunicação, previne man-in-the-middle. Use sempre, até em desenvolvimento. Certificados gratuitos com Let's Encrypt. CORS (Cross-Origin Resource Sharing): controla quais domínios podem chamar sua API — configure Allow-Origin estritamente. Headers de segurança: Content-Security-Policy (previne XSS), X-Frame-Options (previne clickjacking), Strict-Transport-Security (força HTTPS), X-Content-Type-Options (previne MIME sniffing). Teste com securityheaders.com.",
        },
        {
          heading: "Práticas de Código Seguro",
          content:
            "Validação de input: nunca confie em dados do usuário. Whitelist (aceite apenas esperado) > blacklist. Princípio do menor privilégio: dê apenas permissões necessárias. Não commite secrets (senhas, API keys) — use variáveis de ambiente ou vault (HashiCorp Vault). Dependências: mantenha atualizadas, use npm audit/Dependabot. Logging: registre ações de segurança mas nunca senhas/tokens. Testes de segurança: SAST (análise estática), DAST (análise dinâmica), penetration testing.",
        },
      ],
      keyTopics: [
        "OWASP Top 10",
        "SQL Injection",
        "XSS (Cross-Site Scripting)",
        "HTTPS/TLS",
        "CORS",
        "Prepared Statements",
        "Validação de Input",
        "Content-Security-Policy",
      ],
    },
  },

  // ===========================================
  // CLOUD
  // ===========================================
  cloud: {
    "Fundamentos de Cloud": {
      title: "Fundamentos de Cloud Computing",
      introduction:
        "Cloud computing revolucionou a forma como empresas consomem recursos de TI. Em vez de comprar e manter servidores físicos, você aluga capacidade computacional sob demanda, pagando apenas pelo que usa. Essa mudança fundamental permite escalar rapidamente, experimentar sem grandes investimentos iniciais e focar no negócio em vez da infraestrutura.",
      sections: [
        {
          heading: "Modelos de Serviço: IaaS, PaaS e SaaS",
          content:
            "IaaS (Infrastructure as a Service) fornece infraestrutura virtualizada — servidores, rede, armazenamento — onde você controla do SO para cima. Exemplos: EC2, Azure VMs. PaaS (Platform as a Service) abstrai a infraestrutura: você faz deploy do código e a plataforma gerencia SO, patches, escalabilidade. Exemplos: Heroku, AWS Elastic Beanstalk, Azure App Service. SaaS (Software as a Service) entrega aplicações prontas via browser. Exemplos: Gmail, Salesforce, Office 365. FaaS (Functions as a Service) é o extremo serverless: execute funções individuais sem gerenciar nada.",
        },
        {
          heading:
            "Modelos de Implantação: Pública, Privada, Híbrida e Multi-cloud",
          content:
            "Nuvem pública: recursos compartilhados entre múltiplos clientes (AWS, Azure, GCP). Custo baixo, escala infinita. Nuvem privada: infraestrutura dedicada a uma organização, on-premises ou hospedada. Maior controle e compliance. Nuvem híbrida: combina pública com privada/on-premises, conectadas via VPN ou Direct Connect. Dados sensíveis ficam local, workloads de pico vão para a nuvem. Multi-cloud: usar múltiplos provedores (AWS + Azure + GCP) para evitar vendor lock-in e usar o melhor de cada um.",
        },
        {
          heading: "Conceitos Essenciais e Padrões de Resiliência",
          content:
            "Regiões e Availability Zones: regiões são localizações geográficas (us-east-1, Brazil South) com múltiplas AZs — datacenters independentes para alta disponibilidade. Distribua recursos em múltiplas AZs. RTO (Recovery Time Objective): tempo máximo aceitável de indisponibilidade. RPO (Recovery Point Objective): perda máxima de dados aceitável. Padrão Bulkhead: isola componentes para que falha de um não derrube outros. CAP Theorem: sistemas distribuídos escolhem entre Consistência, Disponibilidade e Tolerância a Partição — você só pode garantir 2 dos 3.",
        },
      ],
      keyTopics: [
        "IaaS, PaaS, SaaS, FaaS",
        "Nuvem Pública, Privada, Híbrida",
        "Multi-cloud e Vendor Lock-in",
        "Regiões e Availability Zones",
        "RTO e RPO",
        "CAP Theorem",
        "Padrão Bulkhead",
      ],
    },

    "Arquitetura Cloud": {
      title: "Arquitetura Cloud e Design de Sistemas Distribuídos",
      introduction:
        "Projetar para a nuvem requer pensar em escala, resiliência e custos desde o início. Arquiteturas cloud-native aproveitam elasticidade, serviços gerenciados e automação para criar sistemas que se adaptam à demanda, se recuperam de falhas automaticamente e otimizam custos continuamente.",
      sections: [
        {
          heading: "Escalabilidade: Vertical vs Horizontal",
          content:
            "Escalabilidade vertical (scale up/down): aumentar CPU, RAM ou disco de uma única instância. Limitada pelo hardware máximo disponível. Escalabilidade horizontal (scale out/in): adicionar ou remover instâncias. Preferida na nuvem por ser virtualmente ilimitada e permitir alta disponibilidade. Auto-scaling monitora métricas (CPU, requisições) e ajusta automaticamente o número de instâncias. Aplicações stateless (sem estado local) escalam horizontalmente com facilidade — qualquer instância pode atender qualquer requisição.",
        },
        {
          heading:
            "Componentes de Arquitetura: Load Balancer, CDN, API Gateway",
          content:
            "Load Balancer distribui tráfego entre instâncias, remove instâncias não saudáveis (health checks). Tipos: L4 (TCP/UDP) e L7 (HTTP, pode rotear por URL, header). CDN (Content Delivery Network) cacheia conteúdo em edge locations globais, reduzindo latência e protegendo contra DDoS. API Gateway é ponto único de entrada para microsserviços, centralizando autenticação, rate limiting, roteamento e observabilidade. Service Mesh (Istio, Linkerd) adiciona observabilidade, mTLS e circuit breakers entre microsserviços sem alterar código.",
        },
        {
          heading: "Padrões de Resiliência e Comunicação",
          content:
            "Circuit Breaker: após falhas consecutivas, bloqueia chamadas a um serviço instável, evitando cascata de erros. Estados: Closed → Open → Half-Open. Saga Pattern: gerencia transações distribuídas com sequência de transações locais e compensações em caso de falha. Consistência eventual: em sistemas distribuídos globais, aceitar pequeno delay na propagação de dados em troca de disponibilidade e escala. Filas assíncronas (SQS, RabbitMQ) desacoplam serviços: produtor publica rapidamente, consumidor processa no próprio ritmo.",
        },
        {
          heading: "Alta Disponibilidade e Disaster Recovery",
          content:
            "Multi-AZ: distribua recursos em múltiplas Availability Zones para sobreviver à falha de um datacenter. Multi-region: replique em regiões geográficas distintas para menor latência global e DR. Active-active: tráfego atendido simultaneamente em múltiplas regiões, failover quase imediato. Active-passive: região secundária em standby, failover mais lento mas mais barato. Estratégias de DR: Backup & Restore (RTO alto, barato), Pilot Light, Warm Standby, Multi-site (RTO baixo, caro).",
        },
      ],
      keyTopics: [
        "Escalabilidade Vertical vs Horizontal",
        "Auto-scaling",
        "Load Balancer (L4/L7)",
        "CDN e Edge Locations",
        "API Gateway",
        "Circuit Breaker",
        "Saga Pattern",
        "Multi-AZ e Multi-region",
        "Active-Active vs Active-Passive",
      ],
    },

    "AWS Fundamentos": {
      title: "AWS Fundamentos e Serviços Essenciais",
      introduction:
        "Amazon Web Services é o maior provedor de nuvem do mundo, com centenas de serviços. Dominar os fundamentos — EC2, RDS, S3, IAM — é essencial antes de explorar serviços especializados. A AWS segue o modelo de responsabilidade compartilhada: a AWS protege a infraestrutura, você protege suas aplicações e dados.",
      sections: [
        {
          heading: "Computação e Banco de Dados Gerenciado",
          content:
            "Amazon EC2 (Elastic Compute Cloud) fornece servidores virtuais com SO, CPU, RAM e storage personalizáveis. Modelos de preço: On-Demand (paga por hora), Reserved Instances (1-3 anos, até 72% desconto), Spot (capacidade ociosa, até 90% desconto, pode ser interrompido). Amazon RDS (Relational Database Service) gerencia MySQL, PostgreSQL, MariaDB, Oracle, SQL Server. A AWS cuida de backups, patches, failover Multi-AZ e read replicas. DynamoDB é NoSQL serverless de chave-valor/documento com latência de milissegundos em qualquer escala.",
        },
        {
          heading: "Armazenamento e Secrets",
          content:
            "Amazon S3 (Simple Storage Service) armazena objetos com durabilidade de 11 noves (99,999999999%). Classes de storage: Standard (acesso frequente), Standard-IA (infrequente, recuperação instantânea), Glacier (arquivamento, recuperação em minutos/horas). EBS (Elastic Block Store) fornece volumes de bloco persistentes para EC2. AWS Secrets Manager armazena credenciais com criptografia, controle de acesso IAM e rotação automática — nunca hardcode senhas no código.",
        },
        {
          heading: "Otimização de Custos e Well-Architected",
          content:
            "Reserved Instances e Savings Plans oferecem descontos de até 72% para workloads previsíveis. Spot Instances são ideais para batch processing, CI/CD e ML training — tolerantes a interrupção. Cost Explorer visualiza gastos, identifica recursos ociosos e recomenda rightsizing. AWS Well-Architected Framework: 6 pilares — Excelência Operacional, Segurança, Confiabilidade, Eficiência de Performance, Otimização de Custos e Sustentabilidade. Use o Well-Architected Tool para reviews.",
        },
        {
          heading: "Governança e Multi-Account",
          content:
            "AWS Organizations gerencia múltiplas contas com billing consolidado e SCPs (Service Control Policies). SCPs definem o TETO de permissões para contas/OUs — não concedem acesso, apenas limitam. Separar contas de segurança, produção e desenvolvimento isola blast radius e facilita governança. AWS Control Tower automatiza criação de landing zone seguro com guardrails. STS AssumeRole fornece credenciais temporárias, reduzindo uso de chaves de longo prazo.",
        },
      ],
      keyTopics: [
        "EC2 (On-Demand, Reserved, Spot)",
        "RDS e DynamoDB",
        "S3 (Standard, IA, Glacier)",
        "EBS",
        "AWS Secrets Manager",
        "Cost Explorer",
        "Well-Architected Framework",
        "AWS Organizations e SCPs",
        "STS AssumeRole",
      ],
    },

    "Containers e Kubernetes": {
      title: "Containers, Docker e Kubernetes",
      introduction:
        "Containers revolucionaram o deploy de aplicações ao empacotar código, dependências e configuração em unidades portáteis e leves. Docker popularizou containers; Kubernetes se tornou o padrão para orquestração em produção. Juntos, permitem deploy consistente do laptop à produção, escalabilidade automática e auto-recuperação.",
      sections: [
        {
          heading: "Docker: Imagens, Containers e Dockerfile",
          content:
            "Container vs VM: containers compartilham o kernel do host, são leves (MBs) e iniciam em segundos. VMs virtualizam hardware completo, são pesadas (GBs). Dockerfile define como construir uma imagem: FROM (imagem base), COPY (arquivos), RUN (comandos), EXPOSE (portas), CMD (comando padrão). docker build -t app:1.0 . cria a imagem. docker run inicia um container. Build multi-stage separa compilação da imagem final, reduzindo tamanho e superfície de ataque. Use imagens base mínimas (Alpine, distroless).",
        },
        {
          heading: "Docker Compose, Volumes e Registry",
          content:
            "Docker Compose define múltiplos containers em um docker-compose.yml — ideal para desenvolvimento local com app + banco + cache. Docker volumes persistem dados além do ciclo de vida do container: named volumes (gerenciados pelo Docker), bind mounts (diretório do host). Sem volume, dados são perdidos quando o container é removido. Container Registry armazena imagens versionadas: Docker Hub (público), ECR (AWS), ACR (Azure), Artifact Registry (GCP). CI/CD faz build → push → deploy.",
        },
        {
          heading: "Kubernetes: Pods, ReplicaSets e Deployments",
          content:
            "Pod é a menor unidade deployável no Kubernetes — encapsula um ou mais containers com rede e storage compartilhados. Pods são efêmeros e não sobrevivem a falhas. ReplicaSet garante que N réplicas de um Pod estejam sempre rodando — se um Pod falhar, cria outro. Deployment gerencia ReplicaSets e permite rolling updates, rollbacks e declaração do estado desejado. kubectl get pods lista pods; kubectl apply -f deployment.yaml aplica configuração.",
        },
        {
          heading: "Services, Namespaces e Ecossistema Kubernetes",
          content:
            "Service expõe Pods na rede: ClusterIP (interno), NodePort (porta do nó), LoadBalancer (LB externo cloud). Namespaces isolam recursos logicamente (dev, staging, prod). Kubernetes gerenciado: EKS (AWS), AKS (Azure), GKE (GCP) — o cloud gerencia o control plane, você gerencia os workers. Fargate/Cloud Run permitem rodar containers serverless sem gerenciar nós. Helm é o package manager do K8s para instalar charts (Prometheus, Grafana, Nginx Ingress).",
        },
      ],
      keyTopics: [
        "Docker vs VMs",
        "Dockerfile e Multi-stage Build",
        "Docker Compose",
        "Volumes e Persistência",
        "Container Registry",
        "Pods e ReplicaSets",
        "Deployments e Rolling Updates",
        "Services (ClusterIP, NodePort, LoadBalancer)",
        "EKS, AKS, GKE",
        "kubectl",
      ],
    },

    Serverless: {
      title: "Arquitetura Serverless e Functions as a Service",
      introduction:
        "Serverless elimina a necessidade de gerenciar servidores. Você escreve código, faz deploy, e o provedor cuida de provisionamento, escalabilidade e disponibilidade. Pague apenas pelo tempo de execução. É o próximo nível de abstração após containers, ideal para cargas intermitentes e orientadas a eventos.",
      sections: [
        {
          heading: "Functions as a Service (FaaS)",
          content:
            "AWS Lambda, Azure Functions e Cloud Functions executam código em resposta a eventos: HTTP (API Gateway), upload de arquivo (S3), mensagem em fila (SQS), schedule (cron). Pague por execução (ms) e memória alocada. Timeout máximo geralmente 15 minutos. Cold start: primeira execução pode ter latência extra para provisionar o ambiente. Mitigações: provisioned concurrency, keep-alive requests, imagens menores.",
        },
        {
          heading: "Design Stateless e Idempotência",
          content:
            "Aplicações serverless devem ser stateless: não armazene estado local entre invocações. Use banco de dados, cache distribuído (Redis/ElastiCache) ou storage (S3) para estado. Idempotência é crítica: como há retries automáticos em caso de falha, a mesma operação executada múltiplas vezes deve produzir o mesmo resultado. Use idempotency keys para evitar cobranças ou envios duplicados.",
        },
        {
          heading: "Padrões e Ecossistema Serverless",
          content:
            "Event-driven architecture: conecte funções via eventos (SNS, EventBridge, Kinesis). Step Functions orquestra workflows complexos com estados, retries e compensações (Saga pattern). API Gateway + Lambda é o padrão para APIs REST serverless. DynamoDB é o banco nativo serverless da AWS. Frameworks: Serverless Framework, AWS SAM, Architect facilitam deploy e IaC. Containers serverless: Fargate (AWS), Cloud Run (GCP), Container Apps (Azure) — escala a zero, paga por uso.",
        },
      ],
      keyTopics: [
        "AWS Lambda, Azure Functions, Cloud Functions",
        "Cold Start",
        "Stateless Design",
        "Idempotência",
        "Event-driven Architecture",
        "Step Functions",
        "API Gateway + Lambda",
        "Fargate e Cloud Run",
      ],
    },

    Observabilidade: {
      title: "Observabilidade, Monitoramento e SRE",
      introduction:
        "Em sistemas distribuídos, você não pode debugar localmente. Observabilidade permite entender o comportamento interno do sistema através de outputs externos: métricas, logs e traces. É a base para SRE (Site Reliability Engineering), permitindo detectar problemas antes dos usuários, entender causas-raiz e melhorar continuamente.",
      sections: [
        {
          heading: "Os Três Pilares: Métricas, Logs e Traces",
          content:
            "Métricas são valores numéricos agregados ao longo do tempo: CPU, latência p99, requests/segundo, error rate. Ideais para alertas e dashboards. Logs são registros textuais de eventos com timestamp. Estruture como JSON para queries eficientes. Traces rastreiam uma requisição através de múltiplos serviços distribuídos, mostrando onde o tempo é gasto. OpenTelemetry é o padrão open-source para instrumentação de métricas, logs e traces.",
        },
        {
          heading: "SLI, SLO e SLA",
          content:
            "SLI (Service Level Indicator): métrica que mede qualidade do serviço — latência, disponibilidade, error rate. SLO (Service Level Objective): meta interna para o SLI — 'latência p99 < 200ms', 'disponibilidade 99,9%'. SLA (Service Level Agreement): compromisso contratual com cliente, geralmente menos agressivo que SLO. Error budget: quanto você pode falhar antes de violar o SLO. 99,99% de uptime permite apenas 52 minutos de downtime por ano.",
        },
        {
          heading: "Ferramentas e Práticas",
          content:
            "CloudWatch (AWS), Azure Monitor, Cloud Monitoring (GCP) coletam métricas e logs nativos. Prometheus + Grafana é o stack open-source dominante para métricas. ELK/OpenSearch para logs. Jaeger, Zipkin para traces distribuídos. Datadog, New Relic, Splunk são soluções SaaS completas. Health checks e load balancers detectam instâncias não saudáveis. Alertas devem ser acionáveis: se não exige ação, não é alerta, é log.",
        },
      ],
      keyTopics: [
        "Métricas, Logs e Traces",
        "OpenTelemetry",
        "SLI, SLO, SLA",
        "Error Budget",
        "CloudWatch, Prometheus, Grafana",
        "ELK/OpenSearch",
        "Jaeger e Tracing Distribuído",
        "Health Checks",
      ],
    },

    "DevOps e CI/CD": {
      title: "DevOps, CI/CD e Automação de Deploy",
      introduction:
        "DevOps é a cultura e práticas que unem desenvolvimento e operações para entregar software mais rápido e com mais qualidade. CI/CD (Continuous Integration/Continuous Delivery) automatiza build, teste e deploy, permitindo releases frequentes, confiáveis e reversíveis. Infraestrutura como código trata infra como software versionável.",
      sections: [
        {
          heading: "Continuous Integration",
          content:
            "CI integra código de múltiplos desenvolvedores frequentemente (várias vezes ao dia). A cada push/merge, um pipeline automatizado executa: build, lint, testes unitários, testes de integração, análise estática de código (SAST). Falha rápida: se qualquer etapa falhar, o pipeline para e notifica o dev. Artefatos: imagens Docker, JARs, bundles são versionados e armazenados. Ferramentas: GitHub Actions, GitLab CI, Jenkins, CircleCI.",
        },
        {
          heading: "Continuous Delivery e Deployment",
          content:
            "Continuous Delivery: cada commit que passa no pipeline está pronto para produção, mas o deploy é manual (um clique). Continuous Deployment: deploy automático para produção após todos os testes. Estratégias de deploy: Rolling update (gradual), Blue-Green (duas versões, switch instantâneo), Canary (% pequeno recebe nova versão, monitora, depois expande). Feature flags permitem deploy de código inativo, ativado gradualmente.",
        },
        {
          heading: "Infrastructure as Code e GitOps",
          content:
            "IaC trata infraestrutura como código versionável e revisável: Terraform, CloudFormation, Pulumi, Bicep. Declarativo: você descreve o estado desejado, a ferramenta aplica as mudanças. GitOps: o repositório Git é a fonte de verdade para infra e aplicações. ArgoCD, Flux monitoram o repo e aplicam mudanças automaticamente no cluster. Benefícios: auditoria, rollback, reprodutibilidade, disaster recovery automatizado.",
        },
      ],
      keyTopics: [
        "Continuous Integration",
        "Continuous Delivery vs Deployment",
        "GitHub Actions, GitLab CI, Jenkins",
        "Rolling Update, Blue-Green, Canary",
        "Feature Flags",
        "Infrastructure as Code",
        "Terraform, CloudFormation",
        "GitOps, ArgoCD",
      ],
    },

    "Segurança em Cloud": {
      title: "Segurança em Cloud e Zero Trust",
      introduction:
        "Segurança na nuvem segue o modelo de responsabilidade compartilhada: o provedor protege a infraestrutura física e serviços gerenciados, você protege suas aplicações, dados, configurações e acesso. Erros de configuração são a causa mais comum de breaches em cloud. Zero Trust assume que nenhum ator é confiável por padrão.",
      sections: [
        {
          heading: "Identity and Access Management (IAM)",
          content:
            "IAM controla QUEM pode fazer O QUÊ. Princípio do menor privilégio: dê apenas permissões necessárias. Componentes: Users (pessoas), Groups (conjuntos), Roles (assumidas por serviços), Policies (JSON de permissões). Explicit Deny sempre prevalece sobre Allow. Use MFA para todas as contas, especialmente root/admin. Credenciais temporárias (STS AssumeRole) são preferíveis a access keys de longo prazo. Revise permissões regularmente.",
        },
        {
          heading: "Segurança de Rede: VPC, Security Groups, WAF",
          content:
            "VPC isola sua rede logicamente. Sub-redes públicas (com Internet Gateway) para load balancers; privadas para bancos e aplicações. Security Groups (stateful, por instância) permitem apenas Allow rules. NACLs (stateless, por sub-rede) permitem Allow e Deny. WAF (Web Application Firewall) protege contra OWASP Top 10: SQL injection, XSS, etc. DDoS protection: AWS Shield, Azure DDoS Protection. Private endpoints conectam a serviços sem passar pela internet pública.",
        },
        {
          heading: "Encryption, Secrets e Compliance",
          content:
            "Criptografia em repouso: S3 com SSE, EBS encrypted, RDS encryption. Criptografia em trânsito: TLS para todas as comunicações. KMS (Key Management Service) gerencia chaves de criptografia com rotação e auditoria. Secrets Manager / Key Vault armazenam credenciais com rotação automática — nunca hardcode secrets. Compliance: SOC 2, HIPAA, PCI-DSS, GDPR. Use AWS Config, Azure Policy para detectar e remediar violações de compliance automaticamente.",
        },
      ],
      keyTopics: [
        "Responsabilidade Compartilhada",
        "IAM e Menor Privilégio",
        "MFA e Credenciais Temporárias",
        "VPC, Security Groups, NACLs",
        "WAF e DDoS Protection",
        "Encryption at Rest e in Transit",
        "KMS e Secrets Manager",
        "Compliance (SOC 2, HIPAA, GDPR)",
      ],
    },

    "Infrastructure as Code": {
      title: "Infrastructure as Code (IaC)",
      introduction:
        "Infrastructure as Code trata infraestrutura como software: versionável, testável, revisável e reproduzível. Em vez de clicar em consoles e criar recursos manualmente, você declara o estado desejado em código e ferramentas aplicam as mudanças. Elimina drift, permite disaster recovery rápido e habilita práticas DevOps maduras.",
      sections: [
        {
          heading: "Ferramentas Declarativas: Terraform, CloudFormation, Bicep",
          content:
            "Terraform (HashiCorp) é multi-cloud, usa HCL, mantém state file com o estado atual. terraform plan mostra mudanças, terraform apply executa. Modules permitem reutilização. CloudFormation (AWS) usa YAML/JSON, integração nativa. Bicep (Azure) é DSL que compila para ARM templates. Pulumi permite IaC em linguagens de programação (TypeScript, Python, Go). Declarativo: você descreve O QUÊ quer, a ferramenta calcula COMO chegar lá.",
        },
        {
          heading: "State Management e Boas Práticas",
          content:
            "State file armazena mapeamento entre código e recursos reais. Guarde em backend remoto (S3 + DynamoDB, Terraform Cloud) — nunca em Git. State locking evita conflitos de execução concorrente. Módulos encapsulam padrões reutilizáveis (módulo VPC, módulo EKS). Environments (dev, staging, prod) com workspaces ou estrutura de diretórios. Code review para mudanças de infra. Testes de IaC: Terratest, checkov para policy compliance.",
        },
        {
          heading: "GitOps e Automação",
          content:
            "GitOps: Git é a fonte de verdade. Mudanças em infra passam por PR, review, merge → pipeline aplica automaticamente. ArgoCD (Kubernetes), Atlantis (Terraform) monitoram repo e executam. Benefícios: auditoria completa (quem mudou o quê, quando), rollback com git revert, reprodutibilidade (re-criar ambiente do zero). Drift detection: compare estado real com código e alerte sobre mudanças manuais não autorizadas.",
        },
      ],
      keyTopics: [
        "Terraform e HCL",
        "CloudFormation",
        "Bicep e ARM",
        "Pulumi",
        "State Management",
        "Modules e Reutilização",
        "GitOps e Atlantis",
        "Drift Detection",
        "Terratest e Policy as Code",
      ],
    },

    "AWS Storage": {
      title: "AWS Storage: S3, EBS e Glacier",
      introduction:
        "A AWS oferece múltiplas opções de armazenamento para diferentes casos de uso: S3 para objetos, EBS para blocos em EC2, EFS para file systems compartilhados, Glacier para arquivamento de longo prazo. Entender as características de cada um permite otimizar custo e performance.",
      sections: [
        {
          heading: "Amazon S3: Armazenamento de Objetos",
          content:
            "S3 (Simple Storage Service) armazena objetos em buckets com durabilidade de 11 noves (99,999999999%). Casos de uso: websites estáticos, data lakes, backups, logs. Classes de storage: Standard (acesso frequente), Standard-IA (infrequente, recuperação instantânea), One Zone-IA (menor custo, menor durabilidade), Glacier (arquivamento, recuperação em minutos/horas), Glacier Deep Archive (menor custo, recuperação em 12h). Lifecycle policies movem objetos automaticamente entre classes.",
        },
        {
          heading: "S3 Features: Versionamento, Pre-signed URLs, Replicação",
          content:
            "Versionamento mantém todas as versões de um objeto, protegendo contra deleções acidentais. MFA Delete adiciona camada de proteção. Pre-signed URLs concedem acesso temporário sem expor credenciais — ideal para upload/download direto pelo cliente. Cross-Region Replication replica objetos para outra região automaticamente (DR, compliance). S3 Transfer Acceleration usa CDN para uploads mais rápidos. Server-side encryption (SSE-S3, SSE-KMS, SSE-C) criptografa em repouso.",
        },
        {
          heading: "EBS e Instance Store",
          content:
            "EBS (Elastic Block Store) fornece volumes de bloco persistentes para EC2. Tipos: gp3/gp2 (SSD uso geral), io2 (SSD alta performance), st1 (HDD throughput), sc1 (HDD cold). EBS persiste além do ciclo da instância e permite snapshots para backup. Instance Store usa discos locais do host físico — dados perdidos quando instância para. Use Instance Store para cache/temp; EBS para dados persistentes.",
        },
      ],
      keyTopics: [
        "S3 e Classes de Storage",
        "Durabilidade 11 Noves",
        "Lifecycle Policies",
        "Pre-signed URLs",
        "Versionamento e MFA Delete",
        "Cross-Region Replication",
        "EBS (gp3, io2, st1)",
        "Instance Store vs EBS",
      ],
    },

    "AWS Networking": {
      title: "AWS Networking: VPC, Route 53 e CloudFront",
      introduction:
        "Networking na AWS permite criar redes virtuais isoladas (VPC), conectar à internet ou on-premises, distribuir conteúdo globalmente (CloudFront) e gerenciar DNS (Route 53). Uma arquitetura de rede bem projetada é fundamental para segurança, performance e alta disponibilidade.",
      sections: [
        {
          heading: "VPC: Virtual Private Cloud",
          content:
            "VPC cria rede virtual isolada com controle sobre faixas IP (CIDR), sub-redes, route tables e gateways. Sub-redes públicas têm Internet Gateway para acesso à internet; privadas não. NAT Gateway permite que instâncias em sub-redes privadas acessem internet (saída) sem serem acessíveis (entrada). VPC Peering conecta VPCs diferentes. Transit Gateway centraliza conectividade entre múltiplas VPCs e on-premises. VPC Flow Logs registram tráfego para auditoria.",
        },
        {
          heading: "Route 53: DNS Gerenciado",
          content:
            "Route 53 é DNS escalável com SLA 100%. Funcionalidades: registro de domínios, resolução DNS, health checks. Políticas de roteamento: Simple (um registro), Weighted (distribuição %), Latency (menor latência), Geolocation (por país/continente), Failover (primário/secundário com health check). Health checks monitoram endpoints e removem do DNS se unhealthy. Alias records apontam para recursos AWS (ALB, CloudFront, S3) sem custo de query.",
        },
        {
          heading: "CloudFront e Aceleração",
          content:
            "CloudFront é CDN com 400+ edge locations globais. Cacheia conteúdo estático (S3) e dinâmico (APIs) próximo ao usuário. Lambda@Edge executa código nas edges para personalização. Integra com WAF para proteção. Origin pode ser S3, ALB, EC2, ou qualquer HTTP server. Cache invalidation limpa cache quando conteúdo muda. Global Accelerator roteia tráfego pela rede global AWS para menor latência (diferente de CDN, não cacheia).",
        },
      ],
      keyTopics: [
        "VPC e CIDR",
        "Sub-redes Públicas e Privadas",
        "Internet Gateway e NAT Gateway",
        "VPC Peering e Transit Gateway",
        "Route 53 e Políticas de Roteamento",
        "Health Checks e Failover",
        "CloudFront",
        "Lambda@Edge",
        "Global Accelerator",
      ],
    },

    "AWS Security": {
      title: "AWS Security: IAM, KMS e Auditoria",
      introduction:
        "Segurança na AWS é responsabilidade compartilhada. IAM controla acesso, KMS gerencia criptografia, CloudTrail audita ações, e Security Hub centraliza findings. Configuração incorreta de permissões é a causa mais comum de breaches — siga o princípio do menor privilégio.",
      sections: [
        {
          heading: "IAM: Identity and Access Management",
          content:
            "IAM é gratuito e controla QUEM pode fazer O QUÊ. Users são identidades para pessoas; Roles são assumidas por serviços ou cross-account. Groups agrupam users com mesmas permissões. Policies são documentos JSON com Effect (Allow/Deny), Action, Resource, Condition. Explicit Deny sempre prevalece. Use IAM Roles para EC2, Lambda (não access keys). MFA obrigatório para root e admins. Access Analyzer identifica recursos expostos externamente.",
        },
        {
          heading: "KMS e Encryption",
          content:
            "KMS (Key Management Service) gerencia customer master keys (CMKs) para criptografia. Integra nativamente com S3, EBS, RDS, etc. Tipos: AWS managed keys (automáticas), Customer managed keys (você controla rotação, policies). Envelope encryption: KMS criptografa data keys, data keys criptografam dados. CloudHSM para requisitos de compliance que exigem HSM dedicado. Secrets Manager e SSM Parameter Store armazenam credenciais com rotação automática.",
        },
        {
          heading: "Auditoria e Compliance",
          content:
            "CloudTrail registra todas as chamadas de API — quem, quando, de onde, o quê. Essencial para investigação de incidentes e compliance. Guarde logs em S3 com lock (WORM) para imutabilidade. AWS Config monitora estado dos recursos e avalia compliance rules. Security Hub agrega findings de GuardDuty (threat detection), Inspector (vulnerabilidades), Macie (PII em S3). AWS Organizations com SCPs impõe guardrails em múltiplas contas.",
        },
      ],
      keyTopics: [
        "IAM Users, Roles, Groups, Policies",
        "Explicit Deny e Menor Privilégio",
        "MFA e Access Analyzer",
        "KMS e CMKs",
        "Envelope Encryption",
        "Secrets Manager",
        "CloudTrail",
        "AWS Config",
        "Security Hub e GuardDuty",
      ],
    },

    "AWS Compute": {
      title: "AWS Compute: EC2, Lambda e Containers",
      introduction:
        "AWS oferece compute para todos os casos de uso: EC2 para controle total sobre VMs, Lambda para serverless, ECS/EKS para containers. A escolha depende de requisitos de controle, escala, custo e tempo de execução.",
      sections: [
        {
          heading: "Amazon EC2",
          content:
            "EC2 fornece VMs (instâncias) com SO, CPU, RAM e storage personalizáveis. Famílias: General Purpose (M/T), Compute Optimized (C), Memory Optimized (R/X), Storage Optimized (I/D), Accelerated (P/G - GPU). Modelos de preço: On-Demand (hora/segundo), Reserved (1-3 anos, até 72% desconto), Spot (até 90% desconto, pode ser interrompido), Savings Plans (flexível). Launch Templates definem configuração padrão. User Data executa scripts no boot.",
        },
        {
          heading: "AWS Lambda",
          content:
            "Lambda executa código sem gerenciar servidores, em resposta a eventos (API Gateway, S3, SQS, EventBridge). Pague por ms de execução e memória. Timeout máximo: 15 min. Memória: 128MB a 10GB. Cold start na primeira invocação; mitigar com Provisioned Concurrency. Layers permitem compartilhar dependências. Lambda@Edge executa em edge locations do CloudFront. Step Functions orquestra workflows com múltiplas Lambdas.",
        },
        {
          heading: "Containers: ECS e EKS",
          content:
            "ECS (Elastic Container Service) é orquestrador nativo AWS. Task Definitions definem containers; Services garantem réplicas rodando. Launch types: EC2 (você gerencia instâncias) ou Fargate (serverless, pague por vCPU/memória). EKS (Elastic Kubernetes Service) é Kubernetes gerenciado — AWS gerencia control plane, você gerencia nodes ou usa Fargate. ECR (Elastic Container Registry) armazena imagens Docker. App Runner é PaaS simples para containers web.",
        },
      ],
      keyTopics: [
        "EC2 Instance Types",
        "On-Demand, Reserved, Spot, Savings Plans",
        "Auto Scaling Groups",
        "AWS Lambda",
        "Cold Start e Provisioned Concurrency",
        "Step Functions",
        "ECS (EC2 e Fargate)",
        "EKS",
        "ECR",
      ],
    },

    "AWS Database": {
      title: "AWS Database: RDS, DynamoDB e Aurora",
      introduction:
        "AWS oferece bancos gerenciados para diferentes modelos de dados: RDS para relacional, DynamoDB para NoSQL chave-valor, ElastiCache para cache, Redshift para data warehouse. Bancos gerenciados eliminam overhead operacional de backups, patches e failover.",
      sections: [
        {
          heading: "Amazon RDS",
          content:
            "RDS gerencia MySQL, PostgreSQL, MariaDB, Oracle, SQL Server. Multi-AZ: standby síncrono em outra AZ com failover automático (~60s). Read Replicas: cópias assíncronas para escalar leituras. Backups automáticos com retenção configurável e snapshots manuais. Performance Insights diagnostica queries lentas. RDS Proxy gerencia connection pooling e failover mais rápido para Lambda.",
        },
        {
          heading: "Amazon Aurora e DynamoDB",
          content:
            "Aurora é MySQL/PostgreSQL compatível, 5x mais rápido que RDS padrão. Storage auto-scaling até 128TB, 6 cópias em 3 AZs. Aurora Serverless escala compute automaticamente, paga por ACU-segundo — ideal para cargas variáveis. DynamoDB é NoSQL serverless com latência de milissegundos em qualquer escala. Modelo chave-valor/documento. Global Tables replica entre regiões. DAX adiciona cache in-memory (<1ms). Streams captura mudanças para processamento.",
        },
        {
          heading: "ElastiCache e Redshift",
          content:
            "ElastiCache oferece Redis e Memcached gerenciados para cache em memória. Redis: persistência, pub/sub, tipos complexos. Memcached: simples, multi-thread. Use para sessions, queries frequentes, leaderboards. Redshift é data warehouse colunar para analytics em petabytes. Massively Parallel Processing (MPP). Redshift Spectrum consulta dados no S3 sem importar. Redshift Serverless escala automaticamente.",
        },
      ],
      keyTopics: [
        "RDS Multi-AZ e Read Replicas",
        "Aurora e Aurora Serverless",
        "DynamoDB",
        "Global Tables",
        "DynamoDB Streams e DAX",
        "ElastiCache (Redis, Memcached)",
        "Redshift",
        "Redshift Spectrum",
      ],
    },

    "AWS Messaging": {
      title: "AWS Messaging: SQS, SNS e EventBridge",
      introduction:
        "Mensageria desacopla componentes e absorve picos de tráfego. SQS é fila point-to-point, SNS é pub/sub para fan-out, EventBridge é event bus para arquiteturas orientadas a eventos, Kinesis processa streams em tempo real.",
      sections: [
        {
          heading: "SQS: Simple Queue Service",
          content:
            "SQS é fila gerenciada para desacoplar producers e consumers. Standard: throughput ilimitado, entrega at-least-once, ordem não garantida. FIFO: ordem exata, exactly-once, até 3000 msg/s com batching. Visibility timeout: tempo que mensagem fica invisível enquanto processada. Dead Letter Queue (DLQ) captura mensagens que falham repetidamente. Long polling reduz requisições vazias. Lambda integra nativamente como consumer.",
        },
        {
          heading: "SNS: Simple Notification Service",
          content:
            "SNS é pub/sub: uma mensagem publicada em topic vai para TODOS os assinantes simultaneamente. Assinantes: Lambda, SQS, HTTP, email, SMS, mobile push. Padrão fan-out: SNS → múltiplas filas SQS, cada uma processa independentemente. Message filtering: assinantes recebem apenas mensagens que correspondem a filtros. FIFO topics mantêm ordem. Integra com CloudWatch Alarms para notificações.",
        },
        {
          heading: "EventBridge e Kinesis",
          content:
            "EventBridge é event bus serverless que roteia eventos por regras de pattern matching. Fontes: serviços AWS (EC2, S3), SaaS (Zendesk, Datadog), eventos customizados. Targets: Lambda, Step Functions, SQS, API destinations. Event patterns filtram por atributos JSON. Kinesis Data Streams processa streams de alta vazão em tempo real com múltiplos consumers. Kinesis Firehose entrega streams para S3/Redshift/OpenSearch sem código.",
        },
      ],
      keyTopics: [
        "SQS Standard vs FIFO",
        "Visibility Timeout",
        "Dead Letter Queue",
        "SNS e Fan-out",
        "Message Filtering",
        "EventBridge",
        "Event Patterns e Rules",
        "Kinesis Data Streams",
        "Kinesis Firehose",
      ],
    },

    "AWS Monitoring": {
      title: "AWS Monitoring: CloudWatch, X-Ray e CloudTrail",
      introduction:
        "Monitoramento na AWS combina métricas (CloudWatch), traces (X-Ray), logs (CloudWatch Logs) e auditoria (CloudTrail). Juntos, fornecem visibilidade completa sobre performance, comportamento e segurança das aplicações.",
      sections: [
        {
          heading: "Amazon CloudWatch",
          content:
            "CloudWatch coleta métricas de todos os serviços AWS automaticamente e custom metrics de suas aplicações. Dashboards visualizam métricas em tempo real. Alarms disparam ações quando métricas ultrapassam thresholds: notificar via SNS, escalar com Auto Scaling, executar Lambda. CloudWatch Logs armazena e pesquisa logs. Logs Insights permite queries SQL-like. Metric filters extraem métricas de logs (ex: contar erros).",
        },
        {
          heading: "AWS X-Ray e Observabilidade",
          content:
            "X-Ray faz tracing distribuído: rastreia requisições através de Lambda, API Gateway, EC2, ECS, mostrando latência em cada serviço. Service map visualiza fluxo e bottlenecks. Anotações e metadata enriquecem traces. CloudWatch ServiceLens combina métricas, logs e traces em uma view. CloudWatch Synthetics executa canaries que testam endpoints periodicamente, detectando problemas antes dos usuários.",
        },
        {
          heading: "CloudTrail e AWS Config",
          content:
            "CloudTrail audita TODAS as chamadas de API: quem, quando, de onde, o quê. Essencial para segurança e compliance. Management events (console, CLI, SDK) e data events (S3 GetObject, Lambda Invoke). Armazene em S3 com Object Lock para imutabilidade. AWS Config monitora estado dos recursos ao longo do tempo. Config Rules avaliam compliance (ex: 'S3 buckets devem ter encryption'). Remediation actions corrigem violações automaticamente.",
        },
      ],
      keyTopics: [
        "CloudWatch Metrics e Dashboards",
        "CloudWatch Alarms",
        "CloudWatch Logs e Insights",
        "AWS X-Ray",
        "Tracing Distribuído",
        "CloudWatch Synthetics",
        "CloudTrail",
        "AWS Config e Config Rules",
      ],
    },

    // --- AZURE ---
    "Azure Fundamentos": {
      title: "Azure Fundamentos e Serviços Essenciais",
      introduction:
        "Microsoft Azure é o segundo maior provedor de nuvem, com forte integração com produtos Microsoft (Office 365, Active Directory, Windows Server). Suas abstrações — Resource Groups, Subscriptions, Availability Zones — e serviços gerenciados permitem construir arquiteturas enterprise-grade com governança robusta.",
      sections: [
        {
          heading:
            "Estrutura Organizacional: Subscriptions, Resource Groups, Regions",
          content:
            "Subscription é a unidade de billing e isolamento de recursos. Management Groups agrupam subscriptions para aplicar policies. Resource Group é contêiner lógico que agrupa recursos relacionados (VM + banco + rede de um projeto) — facilita permissões, tags e exclusão em massa. Regions são localizações geográficas (Brazil South, East US). Availability Zones são datacenters independentes dentro de uma região para HA.",
        },
        {
          heading: "Armazenamento: Blob Storage e Managed Disks",
          content:
            "Azure Blob Storage é o equivalente ao S3 — armazenamento de objetos em containers dentro de Storage Accounts. Tiers: Hot (acesso frequente), Cool (esporádico), Archive (arquivamento). Azure Files oferece file share SMB/NFS. Managed Disks são volumes de bloco para VMs (Standard HDD, Standard SSD, Premium SSD, Ultra Disk). Azure Data Lake Storage Gen2 combina Blob Storage com sistema de arquivos hierárquico para big data.",
        },
        {
          heading: "Networking e NSGs",
          content:
            "VNet (Virtual Network) cria rede isolada com subnets. NSG (Network Security Group) contém regras Allow/Deny com prioridade numérica, filtrando por IP, porta e protocolo. Application Security Groups simplificam regras por grupo de VMs. Azure Firewall é firewall gerenciado L3-L7. VNet Peering conecta VNets. ExpressRoute conecta on-premises via link dedicado. Azure Front Door é CDN + WAF + load balancing global.",
        },
      ],
      keyTopics: [
        "Subscriptions e Resource Groups",
        "Regions e Availability Zones",
        "Azure Blob Storage",
        "Storage Tiers (Hot, Cool, Archive)",
        "Managed Disks",
        "VNet e Subnets",
        "NSG e Firewall Rules",
        "Azure DevOps",
      ],
    },

    "Azure Compute": {
      title: "Azure Compute: VMs, App Service e Functions",
      introduction:
        "Azure oferece compute para todos os níveis de abstração: Virtual Machines (IaaS) para controle total, App Service (PaaS) para web apps sem gerenciar servidores, Azure Functions (FaaS) para serverless, e AKS para containers Kubernetes.",
      sections: [
        {
          heading: "Azure Virtual Machines",
          content:
            "VMs são o serviço IaaS fundamental. Séries: B (burstable, econômicas), D (uso geral), E (memory-optimized), F (compute-optimized), N (GPU). Availability Sets distribuem VMs em fault/update domains. Scale Sets escalam automaticamente. Spot VMs oferecem até 90% de desconto, mas podem ser evicted. Reserved Instances (1-3 anos) economizam até 72%.",
        },
        {
          heading: "Azure App Service",
          content:
            "App Service é PaaS para web apps, APIs e backends móveis. Suporta .NET, Java, Node.js, Python, PHP. Features: auto-scaling, deployment slots (staging/prod swap), SSL gerenciado, custom domains, CI/CD integrado. App Service Plans definem capacidade (Free, Shared, Basic, Standard, Premium). Deployment slots permitem testar em staging e trocar para production com zero downtime.",
        },
        {
          heading: "Azure Functions e Container Services",
          content:
            "Azure Functions é FaaS: executa código em resposta a triggers (HTTP, Timer, Blob, Queue, Event Hub). Consumption Plan cobra por execução. Premium Plan para enterprise (VNET, sem cold start). Azure Container Instances (ACI) roda containers individuais sem orquestração — ideal para tarefas simples. Azure Kubernetes Service (AKS) é Kubernetes gerenciado; Azure gerencia control plane gratuitamente.",
        },
      ],
      keyTopics: [
        "VM Series (B, D, E, F, N)",
        "Availability Sets e Scale Sets",
        "Spot VMs e Reserved Instances",
        "App Service e Deployment Slots",
        "Azure Functions",
        "Consumption vs Premium Plan",
        "ACI e AKS",
      ],
    },

    "Azure Database": {
      title: "Azure Database: SQL, Cosmos DB e Cache",
      introduction:
        "Azure oferece bancos gerenciados relacionais (Azure SQL, PostgreSQL, MySQL) e NoSQL (Cosmos DB). Cosmos DB se destaca pela distribuição global com múltiplos modelos de consistência. Azure Cache for Redis acelera aplicações com cache em memória.",
      sections: [
        {
          heading: "Azure SQL Database",
          content:
            "Azure SQL Database é PaaS baseado em SQL Server. Modelos: vCore (CPU/RAM configurável) ou DTU (bundle de recursos). Serverless: auto-pause quando ocioso, paga por segundo quando ativo — ideal para cargas variáveis. Elastic Pools compartilham recursos entre múltiplos bancos. Geo-replication replica para outras regiões. Auto-failover groups permitem failover automático.",
        },
        {
          heading: "Azure Cosmos DB",
          content:
            "Cosmos DB é NoSQL distribuído globalmente com SLA de 99,999%. Multi-modelo: document (MongoDB API), key-value, graph (Gremlin), column-family (Cassandra), table. 5 níveis de consistência: Strong, Bounded Staleness, Session, Consistent Prefix, Eventual. Global distribution replica em qualquer região Azure. Request Units (RU) são a unidade de throughput. Serverless e provisioned capacity modes.",
        },
        {
          heading: "Azure Cache for Redis e Data Services",
          content:
            "Azure Cache for Redis oferece cache em memória gerenciado. Tiers: Basic (dev), Standard (HA), Premium (clustering, VNET). Use para sessions, caching de queries, pub/sub. Azure Synapse Analytics unifica data warehouse + big data: SQL pools (dedicado/serverless), Spark pools, pipelines de integração. Power BI integra para visualização.",
        },
      ],
      keyTopics: [
        "Azure SQL Database",
        "vCore vs DTU",
        "Serverless SQL",
        "Geo-replication",
        "Cosmos DB",
        "Consistency Levels",
        "Request Units (RU)",
        "Azure Cache for Redis",
        "Azure Synapse Analytics",
      ],
    },

    "Azure Security": {
      title: "Azure Security: Entra ID, Key Vault e Defender",
      introduction:
        "Segurança no Azure combina identidade (Entra ID / Azure AD), segredos (Key Vault), proteção de rede (NSG, Firewall, Private Link), e monitoramento (Defender for Cloud). O modelo zero trust assume que nenhum ator é confiável por padrão.",
      sections: [
        {
          heading: "Microsoft Entra ID (Azure AD)",
          content:
            "Entra ID (antigo Azure AD) é o serviço de identidade na nuvem. Gerencia autenticação SSO, MFA e acesso condicional. Integra com Microsoft 365, Azure e milhares de apps SaaS via OAuth 2.0/SAML/OpenID Connect. Managed Identities permitem que recursos Azure (VMs, App Service, Functions) autentiquem em outros recursos sem gerenciar credenciais.",
        },
        {
          heading: "Azure Key Vault",
          content:
            "Key Vault armazena segredos (connection strings, API keys), chaves criptográficas e certificados TLS/SSL. Integra com Azure RBAC para controle de acesso granular. Soft-delete e purge protection protegem contra deleções acidentais. Rotação de segredos automatizada. HSM-backed keys para compliance rigoroso. Apps acessam via SDK ou referência direta no App Service.",
        },
        {
          heading: "Network Security e Defender for Cloud",
          content:
            "Azure Policy define e aplica regras de compliance em escala (ex: 'toda storage account deve ter encryption'). Azure Blueprints empacotam policies, RBAC e templates para ambientes padronizados. Private Link conecta a serviços Azure via endpoint privado, sem tráfego na internet pública. Defender for Cloud centraliza security posture: vulnerabilidades, compliance, threat detection. Azure Arc extende gerenciamento para recursos on-prem e multi-cloud.",
        },
      ],
      keyTopics: [
        "Microsoft Entra ID (Azure AD)",
        "SSO e MFA",
        "Managed Identities",
        "Conditional Access",
        "Azure Key Vault",
        "Azure Policy e Blueprints",
        "Private Link",
        "Defender for Cloud",
        "Azure Arc",
      ],
    },

    "Azure Monitoring": {
      title: "Azure Monitoring: Monitor, Log Analytics e Insights",
      introduction:
        "Azure Monitor é a plataforma unificada de observabilidade: coleta métricas e logs de todos os recursos Azure e aplicações. Application Insights fornece APM (Application Performance Monitoring). Log Analytics permite queries avançadas com KQL (Kusto Query Language).",
      sections: [
        {
          heading: "Azure Monitor e Métricas",
          content:
            "Azure Monitor coleta métricas (CPU, memória, requests) automaticamente de recursos Azure. Metrics Explorer visualiza em gráficos. Alertas disparam ações quando métricas ultrapassam thresholds: email, SMS, webhook, Azure Functions, runbooks. Autoscale ajusta capacidade baseado em métricas. Diagnostic settings enviam métricas e logs para Log Analytics, Storage ou Event Hubs.",
        },
        {
          heading: "Log Analytics e KQL",
          content:
            "Log Analytics Workspace armazena logs de múltiplas fontes. Kusto Query Language (KQL) permite queries poderosas: AzureActivity | where OperationName contains 'Delete' | summarize count() by Resource. Workbooks combinam queries, visualizações e texto em dashboards interativos. Integra com Azure Sentinel (SIEM) para security analytics.",
        },
        {
          heading: "Application Insights",
          content:
            "Application Insights é APM para monitorar aplicações web: requests, dependencies, exceptions, traces, custom events. Auto-instrumentação para .NET, Java, Node.js, Python. Live Metrics Stream mostra dados em tempo real. Application Map visualiza dependências entre componentes. Smart Detection alerta anomalias automaticamente. Distributed tracing rastreia requisições entre microsserviços.",
        },
      ],
      keyTopics: [
        "Azure Monitor",
        "Metrics Explorer e Alertas",
        "Log Analytics Workspace",
        "KQL (Kusto Query Language)",
        "Application Insights",
        "Live Metrics e Application Map",
        "Distributed Tracing",
        "Azure Sentinel",
      ],
    },

    "Azure Networking": {
      title: "Azure Networking: VNet, Load Balancer e Front Door",
      introduction:
        "Networking no Azure conecta recursos com segurança e alta disponibilidade. VNets isolam redes, Load Balancers distribuem tráfego, Application Gateway é L7 com WAF, e Front Door fornece CDN e balanceamento global.",
      sections: [
        {
          heading: "Virtual Networks e Subnets",
          content:
            "VNet cria rede isolada com range CIDR. Subnets dividem a VNet para isolamento (web-subnet, db-subnet). Service Endpoints conectam a serviços Azure (Storage, SQL) via backbone Microsoft. Private Endpoints trazem IPs privados para serviços PaaS. VNet Peering conecta VNets regionais ou globais. Hub-and-spoke topology centraliza serviços compartilhados (firewall, gateway) no hub.",
        },
        {
          heading: "Load Balancing",
          content:
            "Azure Load Balancer é L4 (TCP/UDP), distribui tráfego por hash de 5-tuple. Public LB para internet, Internal LB para tráfego interno. Application Gateway é L7 (HTTP/HTTPS) com WAF, SSL termination, URL-based routing, session affinity. Traffic Manager é DNS-based para distribuição global. Azure Front Door combina CDN + WAF + load balancing global com failover em segundos.",
        },
        {
          heading: "Conectividade Híbrida",
          content:
            "VPN Gateway conecta on-premises via IPsec sobre internet. ExpressRoute fornece conexão privada dedicada com maior largura de banda e menor latência. Azure Virtual WAN simplifica topologias hub-and-spoke em escala. Azure Bastion permite RDP/SSH em VMs via portal, sem IP público exposto. Azure DNS gerencia zonas DNS públicas e privadas.",
        },
      ],
      keyTopics: [
        "VNet e Subnets",
        "Service Endpoints e Private Endpoints",
        "VNet Peering",
        "Azure Load Balancer (L4)",
        "Application Gateway (L7) e WAF",
        "Traffic Manager",
        "Azure Front Door",
        "VPN Gateway e ExpressRoute",
        "Azure Bastion",
      ],
    },

    "Azure IaC": {
      title: "Azure Infrastructure as Code: ARM, Bicep e Terraform",
      introduction:
        "Infrastructure as Code no Azure usa ARM Templates (JSON), Bicep (DSL que compila para ARM), ou Terraform (multi-cloud). Azure Resource Manager é a camada que processa todos os deployments, garantindo idempotência e transações.",
      sections: [
        {
          heading: "ARM Templates",
          content:
            "ARM Templates são JSON declarativo que define recursos Azure. Seções: parameters (inputs), variables, resources, outputs. Template spec armazena templates versionados no Azure. Linked templates permitem composição modular. What-if mostra preview das mudanças antes de aplicar. Deployment modes: Incremental (adiciona/atualiza) vs Complete (remove recursos não declarados).",
        },
        {
          heading: "Bicep",
          content:
            "Bicep é DSL (Domain Specific Language) que compila para ARM JSON. Sintaxe mais limpa e menos verbosa que JSON. Modules permitem reutilização. Registry armazena módulos compartilhados. Decompile converte ARM JSON existente para Bicep. VS Code extension com IntelliSense, validação e snippets. az deployment group create --template-file main.bicep deploya a infraestrutura.",
        },
        {
          heading: "Terraform no Azure",
          content:
            "Terraform (HashiCorp) é multi-cloud, usa HCL. AzureRM provider para recursos Azure, AzureAD provider para identidade. State pode ser armazenado no Azure Blob Storage com state locking via blob lease. Terraform Cloud oferece gestão colaborativa. Use Terraform quando multi-cloud ou quando equipe já domina. Use Bicep quando 100% Azure e quer integração nativa.",
        },
      ],
      keyTopics: [
        "ARM Templates",
        "Template Specs",
        "Bicep",
        "Modules e Registry",
        "Terraform AzureRM Provider",
        "State no Blob Storage",
        "What-if Preview",
        "Incremental vs Complete Mode",
      ],
    },

    // --- GCP ---
    "GCP Fundamentos": {
      title: "GCP Fundamentos e Serviços Essenciais",
      introduction:
        "Google Cloud Platform se destaca em big data (BigQuery), machine learning (Vertex AI), e infraestrutura de rede global. Seus serviços serverless (Cloud Run, Cloud Functions) e a integração com Firebase tornam-no popular para aplicações web modernas e mobile.",
      sections: [
        {
          heading: "Estrutura: Projects, Folders, Organization",
          content:
            "Project é a unidade fundamental de organização e billing. Folders agrupam projects. Organization é o nível raiz (requer Google Workspace ou Cloud Identity). IAM policies podem ser aplicadas em qualquer nível e são herdadas. Resource Hierarchy: Organization → Folders → Projects → Resources. Labels (tags) organizam recursos para billing e gestão.",
        },
        {
          heading: "Compute Engine e Networking",
          content:
            "Compute Engine é IaaS de VMs. Machine types: predefinidos (n1, e2, c2) ou customizados (vCPUs + RAM específicos). Preemptible VMs (agora Spot VMs) oferecem até 91% de desconto, mas podem ser terminadas. Committed use discounts (1-3 anos) economizam até 57%. VPC no GCP é global por padrão; subnets são regionais. Firewall rules aplicam-se à VPC. Cloud NAT para saída de VMs privadas.",
        },
        {
          heading: "Cloud Storage e Secrets",
          content:
            "Cloud Storage é o equivalente ao S3 — armazenamento de objetos com 11 noves de durabilidade. Classes: Standard (acesso frequente), Nearline (mensal), Coldline (trimestral), Archive (anual). Lifecycle policies automatizam transições. Secret Manager armazena segredos com versionamento, IAM e auditoria. Cloud KMS gerencia chaves de criptografia.",
        },
      ],
      keyTopics: [
        "Projects, Folders, Organization",
        "Resource Hierarchy",
        "Compute Engine",
        "Machine Types e Spot VMs",
        "VPC Global e Subnets",
        "Cloud Storage (Standard, Nearline, Coldline, Archive)",
        "Secret Manager",
        "Cloud KMS",
      ],
    },

    "GCP Compute": {
      title: "GCP Compute: Compute Engine, Cloud Run e Functions",
      introduction:
        "GCP oferece compute em todos os níveis: Compute Engine (VMs), GKE (Kubernetes gerenciado), Cloud Run (containers serverless), e Cloud Functions (FaaS). Cloud Run se destaca por executar qualquer container com scale-to-zero.",
      sections: [
        {
          heading: "Compute Engine",
          content:
            "Compute Engine fornece VMs com controle total. Famílias: E2 (econômicas), N2/N2D (uso geral), C2/C2D (compute-optimized), M2/M1 (memory-optimized). Sole-tenant nodes para compliance que exige isolamento. Instance Templates definem configuração padrão. Managed Instance Groups escalam automaticamente com health checks. Live migration move VMs entre hosts sem downtime durante manutenção.",
        },
        {
          heading: "Cloud Run",
          content:
            "Cloud Run executa containers stateless de forma serverless. Qualquer linguagem/framework desde que escute HTTP na porta configurada. Escala de 0 a milhares de instâncias automaticamente. Pay-per-request (CPU, memória, requests). Min instances evitam cold starts. Cloud Run Jobs para tarefas batch. Integra com Cloud Build para CI/CD. Domain mapping para custom domains com SSL automático.",
        },
        {
          heading: "Cloud Functions e GKE",
          content:
            "Cloud Functions é FaaS: executa funções em resposta a triggers (HTTP, Pub/Sub, Cloud Storage, Firestore). 1st gen: Node, Python, Go. 2nd gen: mais runtimes, mais memória, Cloud Run internamente. Google Kubernetes Engine (GKE) é Kubernetes gerenciado. Autopilot mode gerencia nodes automaticamente. Anthos estende GKE para on-prem e multi-cloud.",
        },
      ],
      keyTopics: [
        "Compute Engine (E2, N2, C2, M2)",
        "Instance Groups e Auto-scaling",
        "Cloud Run",
        "Scale-to-zero",
        "Cloud Functions (1st/2nd gen)",
        "GKE",
        "GKE Autopilot",
        "Anthos",
      ],
    },

    "GCP Database": {
      title: "GCP Database: Cloud SQL, Spanner e Firestore",
      introduction:
        "GCP oferece bancos relacionais (Cloud SQL, Cloud Spanner), NoSQL (Firestore, Bigtable), e data warehouse (BigQuery). Cloud Spanner é único: banco relacional distribuído globalmente com consistência forte. BigQuery é o serviço de analytics flagship.",
      sections: [
        {
          heading: "Cloud SQL",
          content:
            "Cloud SQL é PaaS para MySQL, PostgreSQL e SQL Server. HA com failover automático em segundos. Read replicas para escalar leituras. Backups automáticos e point-in-time recovery. Private IP para conexão via VPC. Cloud SQL Proxy simplifica conexão segura de apps externos. Integra com Cloud IAM para autenticação sem senha.",
        },
        {
          heading: "Cloud Spanner e Firestore",
          content:
            "Cloud Spanner é banco relacional distribuído globalmente com transações ACID e consistência forte — escala horizontal infinita. Ideal para workloads financeiras globais. Preço premium. Firestore é NoSQL document database serverless. Real-time listeners para apps mobile/web. Integra com Firebase. Security Rules definem acesso. Datastore mode para backend apenas.",
        },
        {
          heading: "BigQuery e Bigtable",
          content:
            "BigQuery é data warehouse serverless para analytics em petabytes. SQL standard, paga por query (dados scanned) ou flat-rate. Streaming inserts para dados real-time. ML integrado (BigQuery ML). Bigtable é NoSQL wide-column para alta throughput (IoT, time-series, analytics). Mesma API do HBase. Memorystore oferece Redis e Memcached gerenciados.",
        },
      ],
      keyTopics: [
        "Cloud SQL (MySQL, PostgreSQL)",
        "Cloud SQL Proxy",
        "Cloud Spanner",
        "Consistência Forte Global",
        "Firestore",
        "Real-time Listeners",
        "BigQuery",
        "BigQuery ML",
        "Bigtable",
      ],
    },

    "GCP Messaging": {
      title: "GCP Messaging: Pub/Sub e Dataflow",
      introduction:
        "Cloud Pub/Sub é o serviço de mensageria assíncrona do GCP para desacoplar serviços e processar eventos. Dataflow processa streams e batches em escala com Apache Beam. Juntos, formam a base de arquiteturas event-driven e pipelines de dados.",
      sections: [
        {
          heading: "Cloud Pub/Sub",
          content:
            "Pub/Sub é mensageria serverless at-scale. Publishers enviam mensagens para Topics. Subscriptions recebem cópias das mensagens. Modos: Pull (consumer busca) ou Push (webhook). At-least-once delivery com ack deadline configurável. Dead-letter topics capturam mensagens não processadas. Ordering keys garantem ordem para mensagens relacionadas. BigQuery subscription escreve diretamente no warehouse.",
        },
        {
          heading: "Dataflow e Apache Beam",
          content:
            "Dataflow é serviço gerenciado para pipelines de dados usando Apache Beam. Unifica batch e stream processing com o mesmo código. Auto-scaling e serverless operations. Templates permitem executar pipelines parametrizados. Casos de uso: ETL, analytics em tempo real, ML feature engineering. Flex Templates para dependências customizadas.",
        },
        {
          heading: "Eventarc e Workflows",
          content:
            "Eventarc roteia eventos entre serviços GCP e Cloud Run/Functions. Eventos de mais de 90 serviços GCP (Storage, BigQuery, etc.) disparam processamento. Cloud Scheduler é cron gerenciado para triggers periódicos. Workflows orquestra chamadas a APIs e serviços GCP em sequência, com retries e condicionais — alternativa serverless a Airflow para alguns casos.",
        },
      ],
      keyTopics: [
        "Cloud Pub/Sub",
        "Topics e Subscriptions",
        "Pull vs Push",
        "Dead-letter Topics",
        "Ordering Keys",
        "Dataflow",
        "Apache Beam",
        "Eventarc",
        "Cloud Workflows",
      ],
    },

    "GCP Storage": {
      title: "GCP Storage: Cloud Storage e Filestore",
      introduction:
        "Cloud Storage é o serviço de armazenamento de objetos do GCP, com classes otimizadas para diferentes padrões de acesso. Filestore oferece file systems NFS gerenciados. Persistent Disk fornece armazenamento em bloco para VMs Compute Engine.",
      sections: [
        {
          heading: "Cloud Storage",
          content:
            "Cloud Storage armazena objetos em buckets com durabilidade de 11 noves. Classes: Standard (acesso frequente, maior custo por GB), Nearline (acesso mensal), Coldline (acesso trimestral), Archive (acesso anual, menor custo). Autoclass muda classes automaticamente baseado em padrão de acesso. Object Lifecycle Management automatiza deleção/transição. Signed URLs para acesso temporário. Transfer Service para migrações de grande escala.",
        },
        {
          heading: "Filestore e Persistent Disk",
          content:
            "Filestore é NFS gerenciado para workloads que precisam de file system compartilhado (GKE, VMs). Tiers: Basic HDD/SSD e Enterprise (zonal e regional). Persistent Disk são volumes de bloco para VMs. Tipos: Standard (HDD), Balanced (SSD econômico), SSD, Extreme (IOPS alto). Regional PD replica em 2 zonas. Snapshots para backup incremental.",
        },
        {
          heading: "Firebase Storage e Data Transfer",
          content:
            "Firebase Cloud Storage (mesmo backend do GCS) tem SDKs mobile/web com security rules integradas — ideal para apps que precisam de upload direto do cliente. Storage Transfer Service agenda transferências de outros clouds (AWS S3, Azure Blob) ou on-premises. Transfer Appliance para migrações offline de petabytes.",
        },
      ],
      keyTopics: [
        "Cloud Storage Classes",
        "Autoclass",
        "Object Lifecycle Management",
        "Signed URLs",
        "Filestore",
        "Persistent Disk (Standard, SSD, Extreme)",
        "Regional Persistent Disk",
        "Firebase Cloud Storage",
        "Storage Transfer Service",
      ],
    },
  },

  // ===========================================
  // MACHINE LEARNING E IA
  // ===========================================
  "machine-learning-e-ia": {
    "Algoritmos de Classificação": {
      title: "Algoritmos de Classificação",
      introduction:
        "Classificação é uma tarefa de aprendizado supervisionado onde o modelo aprende a categorizar dados em classes discretas. Desde algoritmos simples como KNN até métodos sofisticados como SVM e ensembles, cada técnica tem seus pontos fortes dependendo do tipo e volume de dados.",
      sections: [
        {
          heading: "K-Nearest Neighbors (KNN) e Naive Bayes",
          content:
            "KNN é um algoritmo 'lazy learning' que classifica novos pontos pela maioria dos K vizinhos mais próximos. Requer normalização das features e é sensível à escolha de K. Naive Bayes aplica o teorema de Bayes assumindo independência entre features — 'ingênuo' mas surpreendentemente eficaz para texto e spam. P(classe|features) ∝ P(classe) × ∏P(featureᵢ|classe).",
        },
        {
          heading: "Árvores de Decisão e Regressão Logística",
          content:
            "Árvores de Decisão criam regras sequenciais testando condições sobre features. São interpretáveis mas propensas a overfitting. Regressão Logística usa a função sigmoid para estimar probabilidades entre 0 e 1: σ(z) = 1/(1+e^-z). Apesar do nome, é usada para classificação. Para multi-classe, usa-se Softmax ou estratégia One-vs-All.",
        },
        {
          heading: "Métricas de Classificação",
          content:
            "Accuracy (previsões corretas / total) é enganosa em classes desbalanceadas. Precision (dos previstos positivos, quantos corretos?) e Recall (dos reais positivos, quantos capturados?) são complementares. F1-Score é a média harmônica entre precision e recall. AUC-ROC mede a capacidade de distinguir classes em diferentes thresholds. Matriz de Confusão mostra TP, TN, FP, FN.",
        },
      ],
      keyTopics: [
        "KNN e Distância Euclidiana",
        "Naive Bayes e Teorema de Bayes",
        "Árvore de Decisão",
        "Regressão Logística e Sigmoid",
        "Classificação Binária vs Multi-classe",
        "Train/Test Split",
        "Precision, Recall, F1-Score",
        "AUC-ROC e Matriz de Confusão",
      ],
    },

    "Algoritmos de Regressão": {
      title: "Algoritmos de Regressão",
      introduction:
        "Regressão é a tarefa de prever valores contínuos (preço de casa, temperatura, vendas). Desde a Regressão Linear clássica até Random Forest e Gradient Boosting, cada algoritmo equilibra interpretabilidade, capacidade de capturar não-linearidades e risco de overfitting.",
      sections: [
        {
          heading: "Regressão Linear e Regularização",
          content:
            "Regressão Linear modela y = wx + b minimizando o erro quadrático médio (MSE). Simples e interpretável, mas limitada a relações lineares. Regularização controla overfitting: Ridge (L2) penaliza coeficientes grandes com λΣw²; Lasso (L1) pode zerar coeficientes (seleção de features); Elastic Net combina ambas.",
        },
        {
          heading: "Regressão Polinomial e Árvores",
          content:
            "Regressão Polinomial adiciona termos de grau superior (x², x³) para capturar não-linearidades. Risco de overfitting com grau alto. Árvores de Decisão para regressão preveem a média dos valores nas folhas. Random Forest combina múltiplas árvores para reduzir variância. Gradient Boosting (XGBoost, LightGBM) treina árvores sequencialmente corrigindo erros anteriores.",
        },
        {
          heading: "Métricas de Regressão",
          content:
            "MSE (Mean Squared Error) penaliza fortemente erros grandes. RMSE é a raiz do MSE, na mesma unidade de y. MAE (Mean Absolute Error) é menos sensível a outliers. R² (coeficiente de determinação) indica quanto da variância é explicada pelo modelo (0 a 1, quanto maior melhor). MAPE (erro percentual médio) é útil para comparar escalas diferentes.",
        },
      ],
      keyTopics: [
        "Regressão Linear",
        "MSE e Gradiente Descendente",
        "Regularização (Ridge, Lasso, Elastic Net)",
        "Regressão Polinomial",
        "Random Forest Regressor",
        "Gradient Boosting (XGBoost, LightGBM)",
        "MSE, RMSE, MAE, R²",
      ],
    },

    "Aprendizado Não Supervisionado": {
      title: "Aprendizado Não Supervisionado e Clustering",
      introduction:
        "No aprendizado não supervisionado, o modelo encontra padrões em dados sem rótulos. Clustering agrupa dados similares; redução de dimensionalidade simplifica dados de alta dimensão; detecção de anomalias identifica outliers. Técnicas fundamentais para exploração de dados e engenharia de features.",
      sections: [
        {
          heading: "Algoritmos de Clustering",
          content:
            "K-Means particiona dados em K clusters minimizando a distância intra-cluster ao centroide. Requer definir K antecipadamente (use Elbow Method ou Silhouette Score). DBSCAN encontra clusters de forma arbitrária baseado em densidade, identificando outliers automaticamente. Clustering Hierárquico constrói dendrograma sem precisar de K a priori.",
        },
        {
          heading: "Redução de Dimensionalidade",
          content:
            "PCA (Principal Component Analysis) projeta dados em componentes principais que maximizam variância, reduzindo dimensões enquanto preserva informação. t-SNE e UMAP são técnicas não-lineares para visualização em 2D/3D, preservando estrutura local. Úteis para dados de alta dimensão (texto, imagens embeddings).",
        },
        {
          heading: "Detecção de Anomalias",
          content:
            "Isolation Forest isola anomalias que requerem menos divisões para separar. One-Class SVM aprende a fronteira do comportamento 'normal'. Autoencoders detectam anomalias pelo erro de reconstrução — dados normais são bem reconstruídos, anomalias não. Aplicações: fraude, falhas de máquinas, intrusão.",
        },
      ],
      keyTopics: [
        "K-Means",
        "Elbow Method e Silhouette Score",
        "DBSCAN",
        "Clustering Hierárquico",
        "PCA",
        "t-SNE e UMAP",
        "Isolation Forest",
        "Detecção de Anomalias",
      ],
    },

    "Deep Learning e Redes Neurais": {
      title: "Deep Learning e Redes Neurais",
      introduction:
        "Deep Learning usa redes neurais com múltiplas camadas para aprender representações hierárquicas de dados. CNNs dominam visão computacional, RNNs/Transformers processam sequências. Frameworks como PyTorch e TensorFlow democratizaram o desenvolvimento, mas fundamentos de arquiteturas e otimização permanecem essenciais.",
      sections: [
        {
          heading: "Fundamentos de Redes Neurais",
          content:
            "Neurônio artificial: soma ponderada das entradas + bias, passada por função de ativação. Funções: ReLU (max(0,x)) resolve vanishing gradients, Sigmoid (0 a 1) para probabilidades, Softmax para multi-classe. Backpropagation calcula gradientes usando regra da cadeia. Optimizers: SGD, Adam (momentum + learning rate adaptativo). Regularização: Dropout desativa neurônios aleatoriamente durante treino.",
        },
        {
          heading: "Arquiteturas: CNN, RNN, Transformer",
          content:
            "CNN (Convolutional Neural Network): convoluções extraem features espaciais (bordas, texturas, objetos). Pooling reduz dimensões. Arquiteturas: VGG, ResNet (skip connections), EfficientNet. RNN/LSTM processam sequências com memória; GRU é LSTM simplificada. Transformers usam Self-Attention para capturar dependências de longo alcance sem recorrência — base de BERT, GPT, Vision Transformers.",
        },
        {
          heading: "Treinamento e Transfer Learning",
          content:
            "Loss functions: Cross-Entropy para classificação, MSE para regressão. Batch size afeta convergência e memória. Learning rate schedule: warmup + decay. Early stopping evita overfitting. Transfer Learning: usar pesos pré-treinados em grandes datasets (ImageNet, Common Crawl) e fine-tunar para tarefa específica. Feature extraction vs fine-tuning de camadas.",
        },
      ],
      keyTopics: [
        "Perceptron e MLP",
        "Funções de Ativação (ReLU, Sigmoid, Softmax)",
        "Backpropagation",
        "Adam e SGD",
        "CNN (Convoluções, Pooling)",
        "RNN, LSTM, GRU",
        "Transformers e Self-Attention",
        "Transfer Learning e Fine-tuning",
        "Dropout e Early Stopping",
      ],
    },

    "Estatística para ML": {
      title: "Estatística e Probabilidade para Machine Learning",
      introduction:
        "Machine Learning é fundamentado em estatística e probabilidade. Entender distribuições, inferência, viés-variância e testes de hipóteses permite construir modelos robustos, interpretar resultados corretamente e evitar armadilhas comuns como data leakage e overfitting.",
      sections: [
        {
          heading: "Distribuições e Probabilidade",
          content:
            "Distribuição Normal é a base de muitos modelos e testes. Teorema de Bayes: P(A|B) = P(B|A)P(A)/P(B) — fundamento de Naive Bayes e inferência bayesiana. Probabilidade condicional e independência são cruciais. Distribuição Binomial para eventos discretos, Poisson para contagens raras.",
        },
        {
          heading: "Viés-Variância e Generalização",
          content:
            "Erro de predição = Viés² + Variância + Erro Irredutível. Alto viés (underfitting): modelo muito simples, não captura padrões. Alta variância (overfitting): modelo muito complexo, memoriza ruído. Regularização, cross-validation e ensemble methods equilibram. Cross-validation (K-Fold) avalia generalização dividindo dados em K partes.",
        },
        {
          heading: "Testes de Hipóteses e Significância",
          content:
            "P-value: probabilidade de observar resultado tão extremo assumindo hipótese nula. P < 0,05 geralmente rejeita H₀. Intervalo de confiança quantifica incerteza. A/B testing compara tratamentos com controle estatístico. Cuidado com múltiplas comparações (correção de Bonferroni). Correlação ≠ causalidade.",
        },
      ],
      keyTopics: [
        "Distribuição Normal",
        "Teorema de Bayes",
        "Probabilidade Condicional",
        "Viés e Variância",
        "Overfitting e Underfitting",
        "Cross-Validation (K-Fold)",
        "P-value e Testes de Hipóteses",
        "Intervalo de Confiança",
      ],
    },

    "Pré-processamento de Dados": {
      title: "Pré-processamento e Feature Engineering",
      introduction:
        "Dados do mundo real são ruidosos, incompletos e em formatos variados. Pré-processamento limpa e transforma dados brutos. Feature engineering cria variáveis que melhoram o modelo. 'Garbage in, garbage out' — qualidade dos dados determina qualidade do modelo.",
      sections: [
        {
          heading: "Limpeza e Tratamento de Dados",
          content:
            "Valores faltantes: remoção (se poucos), imputação (média, mediana, moda, KNN imputation), ou flag indicando missing. Outliers: detectar com IQR ou Z-score, remover ou winsorizar. Duplicatas: identificar e remover. Data types: converter strings para numérico/datetime. Encoding: Label Encoding para ordinais, One-Hot Encoding para categóricos nominais.",
        },
        {
          heading: "Normalização e Feature Engineering",
          content:
            "Normalização (Min-Max): escala para [0,1], sensível a outliers. Standardização (Z-score): média=0, desvio=1, mais robusta. Feature engineering: criar features derivadas (idade a partir de data nascimento, extração de dia da semana), interações (área = largura × altura), transformações (log para distribuições assimétricas). Domain knowledge é crucial.",
        },
        {
          heading: "Seleção de Features e Data Leakage",
          content:
            "Seleção de features: Filter (correlação), Wrapper (RFE busca exaustiva), Embedded (Lasso zera coeficientes, importância de árvores). Maldição da dimensionalidade: muitas features com poucos dados leva a overfitting. Data Leakage: informação do futuro 'vaza' para o treino — normalizar ANTES de split é leakage; normalizar separadamente treino e teste é correto.",
        },
      ],
      keyTopics: [
        "Tratamento de Missing Values",
        "Outlier Detection (IQR, Z-score)",
        "One-Hot Encoding e Label Encoding",
        "Normalização e Standardização",
        "Feature Engineering",
        "Feature Selection (RFE, Lasso)",
        "Data Leakage",
        "Maldição da Dimensionalidade",
      ],
    },

    "Processamento de Linguagem Natural": {
      title: "Processamento de Linguagem Natural (NLP)",
      introduction:
        "NLP permite que máquinas entendam, interpretem e gerem linguagem humana. Desde técnicas clássicas como Bag of Words até Transformers como BERT e GPT, o campo evoluiu enormemente. Aplicações incluem chatbots, tradução, análise de sentimento e search.",
      sections: [
        {
          heading: "Representação de Texto",
          content:
            "Bag of Words (BoW) representa documentos por contagem de palavras, ignorando ordem. TF-IDF pondera pela frequência no documento e raridade no corpus — palavras raras mas presentes são mais importantes. Word Embeddings (Word2Vec, GloVe) capturam significado semântico em vetores densos — palavras similares têm vetores próximos. 'rei' - 'homem' + 'mulher' ≈ 'rainha'.",
        },
        {
          heading: "Modelos de Linguagem e Transformers",
          content:
            "Modelos de linguagem preveem a próxima palavra dado o contexto. BERT (Bidirectional Encoder) pré-treina em masked language modeling — entende contexto bidirecional. GPT (Generative Pre-trained Transformer) é autorregressivo — gera texto sequencialmente. Fine-tuning adapta modelos pré-treinados para tarefas específicas (classificação, NER, QA). Sentence Transformers geram embeddings de frases para similaridade semântica.",
        },
        {
          heading: "Tarefas e Aplicações de NLP",
          content:
            "Classificação de texto: sentimento, spam, categorização. Named Entity Recognition (NER): identificar entidades (pessoas, locais, organizações). Question Answering: extrair resposta de um contexto. Sumarização: extractive (seleciona frases) ou abstractive (gera resumo). Tradução automática: seq2seq com attention. Tokenização para LLMs: BPE, SentencePiece lidam com vocabulário aberto.",
        },
      ],
      keyTopics: [
        "Bag of Words e TF-IDF",
        "Word2Vec e GloVe",
        "Word Embeddings",
        "BERT e GPT",
        "Transformer Architecture",
        "Fine-tuning",
        "Tokenização (BPE, SentencePiece)",
        "NER, Sentiment Analysis, QA",
      ],
    },

    "Visão Computacional": {
      title: "Visão Computacional e Processamento de Imagens",
      introduction:
        "Visão computacional permite que máquinas 'vejam' e interpretem imagens e vídeos. CNNs revolucionaram o campo, alcançando performance sobre-humana em tarefas como classificação de imagens. Aplicações vão de diagnóstico médico a carros autônomos.",
      sections: [
        {
          heading: "Fundamentos e Pré-processamento de Imagens",
          content:
            "Imagens são tensores: altura × largura × canais (RGB=3). Normalização escala pixels para [0,1] ou [-1,1]. Resize padroniza dimensões. Data Augmentation aumenta dataset artificialmente: rotação, flip, crop, color jittering — regulariza e melhora generalização. Detecção de bordas (Sobel, Canny) e filtros foram técnicas clássicas antes de CNNs.",
        },
        {
          heading: "Convolutional Neural Networks (CNNs)",
          content:
            "Camadas convolucionais aplicam filtros que detectam features (bordas, texturas, partes de objetos). Pooling (max, average) reduz dimensões espaciais. Arquiteturas: AlexNet (2012, deep CNNs), VGG (blocos convolucionais profundos), ResNet (skip connections resolvem vanishing gradient), EfficientNet (scaling eficiente). Backbone + head: backbone extrai features, head faz a tarefa específica.",
        },
        {
          heading: "Tarefas de Visão Computacional",
          content:
            "Classificação de imagens: rótulo para imagem inteira. Detecção de objetos (YOLO, Faster R-CNN): localiza e classifica múltiplos objetos com bounding boxes. Segmentação semântica (U-Net): classifica cada pixel. Instance segmentation (Mask R-CNN): segmenta instâncias individuais de objetos. OCR (Optical Character Recognition) extrai texto de imagens. Face recognition compara embeddings faciais.",
        },
      ],
      keyTopics: [
        "Representação de Imagens (Tensores)",
        "Data Augmentation",
        "Convoluções e Pooling",
        "AlexNet, VGG, ResNet, EfficientNet",
        "Transfer Learning em Visão",
        "Classificação de Imagens",
        "Detecção de Objetos (YOLO)",
        "Segmentação (U-Net, Mask R-CNN)",
        "OCR",
      ],
    },

    "IA Generativa e LLMs": {
      title: "IA Generativa e Large Language Models",
      introduction:
        "IA Generativa cria conteúdo novo: texto (LLMs como GPT), imagens (DALL-E, Stable Diffusion), código, áudio. LLMs (Large Language Models) são transformers treinados em trilhões de tokens que emergem com capacidades impressionantes de raciocínio, coding e conversação.",
      sections: [
        {
          heading: "Large Language Models (LLMs)",
          content:
            "LLMs são transformers autorregressivos treinados em prever próximo token. Escala massiva (bilhões de parâmetros, trilhões de tokens) resulta em 'emergent abilities': raciocínio, few-shot learning, chain-of-thought. GPT-4, Claude, Gemini, LLaMA. Contexto limitado (context window): 8K a 128K tokens. Tokenização BPE permite vocabulário aberto.",
        },
        {
          heading: "Prompting e RLHF",
          content:
            "Prompt engineering: instruções claras, exemplos (few-shot), chain-of-thought ('pense passo a passo'). System prompts definem persona e constraints. RLHF (Reinforcement Learning from Human Feedback): treina modelo de recompensa com preferências humanas, depois fine-tuna LLM com PPO. Instruction tuning ensina a seguir instruções. Safety: content moderation, guardrails, red-teaming.",
        },
        {
          heading: "RAG e Aplicações",
          content:
            "RAG (Retrieval-Augmented Generation): busca documentos relevantes em base de conhecimento e injeta no prompt, permitindo que LLM responda com informações atualizadas e específicas do domínio. Vector databases (Pinecone, Weaviate) armazenam embeddings para busca semântica. Aplicações: chatbots, copilots de código, agentes autônomos, sumarização, tradução.",
        },
      ],
      keyTopics: [
        "Large Language Models",
        "GPT, Claude, Gemini, LLaMA",
        "Transformers e Self-Attention",
        "Prompt Engineering",
        "Few-shot e Chain-of-Thought",
        "RLHF e Instruction Tuning",
        "RAG (Retrieval-Augmented Generation)",
        "Vector Databases",
        "Embeddings e Similaridade Semântica",
      ],
    },

    "MLOps e Deploy de Modelos": {
      title: "MLOps e Deploy de Modelos em Produção",
      introduction:
        "MLOps aplica práticas DevOps ao ciclo de vida de ML: versionamento de dados e modelos, automação de pipelines, deploy, monitoramento em produção. O gap entre experimentação em notebooks e sistemas de produção confiáveis requer engenharia robusta.",
      sections: [
        {
          heading: "Ciclo de Vida de ML e Versionamento",
          content:
            "Feature Store centraliza features reutilizáveis e evita discrepância treino/produção. Experiment tracking (MLflow, Weights & Biases): versiona experimentos, hiperparâmetros, métricas, artefatos. Model Registry armazena modelos versionados com metadados e staging (dev → staging → production). DVC (Data Version Control) versiona datasets grandes.",
        },
        {
          heading: "Deploy e Serving de Modelos",
          content:
            "Serving patterns: REST API (FastAPI + Docker), batch inference (Spark, AWS Batch), stream (Kafka + modelo). Containerização com Docker garante reprodutibilidade. Kubernetes escala serving. Model servers: TensorFlow Serving, TorchServe, Triton. Serverless para workloads intermitentes (Lambda + SageMaker). A/B testing e canary deployments testam novas versões gradualmente.",
        },
        {
          heading: "Monitoramento e Data Drift",
          content:
            "Model decay: performance degrada quando dados de produção divergem do treino. Data drift: distribuição de features muda. Concept drift: relação entre features e target muda. Monitoramento: métricas de negócio, latência, throughput, feature distributions. Alertas disparam retraining quando drift excede threshold. CI/CD para ML: trigger de pipeline quando novo dado/modelo é registrado.",
        },
      ],
      keyTopics: [
        "Feature Store",
        "Experiment Tracking (MLflow, W&B)",
        "Model Registry",
        "DVC (Data Version Control)",
        "REST API e Model Serving",
        "Docker e Kubernetes para ML",
        "Data Drift e Concept Drift",
        "Monitoramento de Modelos",
        "CI/CD para ML",
      ],
    },
  },

  // ===========================================
  // LINGUAGENS DE PROGRAMAÇÃO
  // ===========================================
  "linguagens-de-programacao": {
    C: {
      title: "Linguagem C - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe, tipos, operadores e funções da linguagem C. Guia rápido para consulta.",
      sections: [
        {
          heading: "📖 Tipos de Dados",
          content: `**char** /kar/ — caractere ou inteiro pequeno (1 byte, -128 a 127)
  \`char letra = 'A'; char codigo = 65;\`

**int** /int/ — inteiro (tipicamente 4 bytes, -2³¹ a 2³¹-1)
  \`int idade = 25; int negativo = -100;\`

**short** — inteiro curto (2 bytes)
  \`short pequeno = 32000;\`

**long** — inteiro longo (4-8 bytes dependendo do sistema)
  \`long grande = 2147483647L;\`

**float** /flôut/ — ponto flutuante precisão simples (4 bytes, ~7 dígitos)
  \`float preco = 19.99f;\`

**double** /dâbol/ — ponto flutuante precisão dupla (8 bytes, ~15 dígitos)
  \`double pi = 3.14159265358979;\`

**unsigned** — modificador para apenas positivos (dobra o range)
  \`unsigned int positivo = 4000000000;\`

**void** /void/ — sem tipo (usado em funções e ponteiros genéricos)
  \`void funcao(); void *ptr;\`

**sizeof()** — retorna tamanho em bytes
  \`sizeof(int)\` → 4  \`sizeof(char)\` → 1`,
        },
        {
          heading: "📖 Ponteiros e Endereços",
          content: `**&** (address-of) — obtém endereço de memória de uma variável
  \`int x = 10; int *p = &x;\`  // p guarda o endereço de x

***** (dereference) — acessa valor no endereço apontado
  \`*p = 20;\`  // altera x para 20 através do ponteiro

**int *ptr** — declaração de ponteiro para int
  \`int *p = NULL;\`  // inicializa como nulo (boa prática)

**NULL** — constante de ponteiro nulo (endereço 0)
  \`if (ptr != NULL) { *ptr = 5; }\`

**void *** — ponteiro genérico (aceita qualquer tipo)
  \`void *generico = &x;\`  // precisa cast para usar

**Aritmética de ponteiros:**
  \`p++\` avança sizeof(*p) bytes
  \`p + 3\` aponta 3 elementos à frente
  \`p - q\` retorna distância entre ponteiros`,
        },
        {
          heading: "📖 Alocação Dinâmica de Memória",
          content: `**malloc(size)** /máloc/ — aloca size bytes no heap (não inicializa)
  \`int *arr = (int *)malloc(10 * sizeof(int));\`
  Retorna NULL se falhar — sempre verificar!

**calloc(n, size)** /cáloc/ — aloca n elementos de size bytes (inicializa com 0)
  \`int *arr = (int *)calloc(10, sizeof(int));\`

**realloc(ptr, new_size)** — redimensiona bloco alocado
  \`arr = (int *)realloc(arr, 20 * sizeof(int));\`
  Pode mover dados para novo endereço

**free(ptr)** — libera memória alocada (OBRIGATÓRIO para evitar memory leak)
  \`free(arr); arr = NULL;\`  // boa prática: setar NULL após free

**Stack vs Heap:**
  Stack: variáveis locais, automático, ~8MB limite
  Heap: malloc/calloc, manual, maior capacidade`,
        },
        {
          heading: "📖 Structs e Tipos Compostos",
          content: `**struct** — agrupa variáveis de tipos diferentes
  \`struct Pessoa {
      char nome[50];
      int idade;
      float altura;
  };\`

**Declarar variável struct:**
  \`struct Pessoa p1 = {"João", 25, 1.75};\`

**.** (dot) — acessa membro diretamente
  \`p1.idade = 26;\`

**->** (arrow) — acessa membro via ponteiro
  \`struct Pessoa *ptr = &p1; ptr->idade = 27;\`

**typedef** — cria alias para tipo (simplifica sintaxe)
  \`typedef struct { int x, y; } Ponto;\`
  \`Ponto p = {10, 20};\`  // sem precisar escrever "struct"

**union** — membros compartilham mesmo espaço de memória
  \`union Valor { int i; float f; };\`  // tamanho = maior membro

**enum** — constantes inteiras nomeadas
  \`enum Cor { VERMELHO, VERDE, AZUL };\`  // 0, 1, 2`,
        },
        {
          heading: "📖 Arrays e Strings",
          content: `**array** — coleção de elementos do mesmo tipo, tamanho fixo
  \`int nums[5] = {1, 2, 3, 4, 5};\`
  \`int matriz[3][3];\`  // 2D

**Acesso:** índice começa em 0
  \`nums[0]\` → 1  \`nums[4]\` → 5

**String** — array de char terminado em '\\0'
  \`char nome[] = "Ana";\`  // equivale a {'A','n','a','\\0'}
  \`char nome[10] = "Ana";\`  // com espaço extra

**Funções de string (string.h):**
  \`strlen(s)\` — comprimento (sem \\0)
  \`strcpy(dest, src)\` — copia string
  \`strcmp(s1, s2)\` — compara (0=iguais, <0 ou >0)
  \`strcat(dest, src)\` — concatena
  \`strstr(s, sub)\` — busca substring

**Array decai para ponteiro:**
  \`int *p = nums;\`  // p aponta para nums[0]`,
        },
        {
          heading: "📖 Controle de Fluxo",
          content: `**if / else if / else** — condicional
  \`if (x > 0) { ... } else if (x < 0) { ... } else { ... }\`

**switch / case** — múltiplas opções (apenas int/char)
  \`switch (op) { case 1: ...; break; default: ...; }\`

**while** — loop enquanto condição verdadeira
  \`while (x < 10) { x++; }\`

**do-while** — executa ao menos uma vez
  \`do { x++; } while (x < 10);\`

**for** — loop com inicialização, condição, incremento
  \`for (int i = 0; i < 10; i++) { ... }\`

**break** — sai do loop/switch
**continue** — pula para próxima iteração
**goto** — pula para label (evitar usar)
  \`goto fim; ... fim: ...\`

**Operador ternário:**
  \`resultado = (x > 0) ? "positivo" : "negativo";\``,
        },
        {
          heading: "📖 Funções",
          content: `**Declaração/protótipo:**
  \`int soma(int a, int b);\`  // no início do arquivo ou header

**Definição:**
  \`int soma(int a, int b) { return a + b; }\`

**Chamada:**
  \`int resultado = soma(5, 3);\`

**Passagem por valor:** C sempre copia argumentos
  \`void incrementa(int x) { x++; }\`  // não altera original

**Passagem por referência:** usar ponteiros
  \`void incrementa(int *x) { (*x)++; }\`
  \`incrementa(&valor);\`

**return** — retorna valor (void não retorna nada)

**static** — variável persiste entre chamadas
  \`static int contador = 0; contador++;\`

**Recursão:**
  \`int fatorial(int n) { return n <= 1 ? 1 : n * fatorial(n-1); }\``,
        },
        {
          heading: "📖 Preprocessador e Headers",
          content: `**#include** — inclui arquivo (copia textualmente)
  \`#include <stdio.h>\`  // biblioteca padrão
  \`#include "meuarquivo.h"\`  // arquivo local

**#define** — define macro/constante (substituição textual)
  \`#define PI 3.14159\`
  \`#define MAX(a,b) ((a) > (b) ? (a) : (b))\`

**#ifdef / #ifndef / #endif** — compilação condicional
  \`#ifndef HEADER_H
  #define HEADER_H
  ...
  #endif\`

**Headers comuns:**
  \`stdio.h\` — printf, scanf, FILE, fopen
  \`stdlib.h\` — malloc, free, atoi, exit
  \`string.h\` — strlen, strcpy, strcmp
  \`math.h\` — sqrt, pow, sin, cos
  \`ctype.h\` — isalpha, isdigit, toupper`,
        },
        {
          heading: "📖 Entrada e Saída (stdio.h)",
          content: `**printf()** — saída formatada
  \`printf("Valor: %d\\n", x);\`
  Formatos: %d(int) %f(float) %c(char) %s(string) %p(ponteiro) %x(hex)
  Flags: %5d(largura) %.2f(decimais) %-10s(alinhado esquerda)

**scanf()** — entrada formatada (usa &)
  \`scanf("%d", &x);\`
  \`scanf("%s", nome);\`  // string não usa &

**fgets()** — lê linha (mais seguro que scanf para strings)
  \`fgets(buffer, sizeof(buffer), stdin);\`

**FILE *** — ponteiro para arquivo
  \`FILE *f = fopen("dados.txt", "r");\`

**Modos:** "r"(ler) "w"(escrever) "a"(append) "rb"(binário)

**fprintf/fscanf** — printf/scanf para arquivo
  \`fprintf(f, "Valor: %d\\n", x);\`

**fclose()** — fecha arquivo (obrigatório)
  \`fclose(f);\``,
        },
      ],
      keyTopics: [
        "int, char, float, double",
        "ponteiros * e &",
        "malloc, calloc, free",
        "struct e typedef",
        "arrays e strings",
        "#include, #define",
        "printf, scanf",
        "FILE, fopen, fclose",
      ],
    },

    "C++": {
      title: "Linguagem C++ - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe C++. Classes, STL, smart pointers, templates e C++ moderno (11/14/17/20/23).",
      sections: [
        {
          heading: "📖 Classes e Objetos",
          content: `**class** — define tipo com dados e métodos
  \`class Pessoa {
  private:
      string nome;
      int idade;
  public:
      Pessoa(string n, int i) : nome(n), idade(i) {}  // constructor
      string getNome() { return nome; }
  };\`

**public** — acessível de qualquer lugar
**private** — acessível apenas dentro da classe (padrão)
**protected** — acessível na classe e subclasses

**Constructor** — inicializa objeto (mesmo nome da classe)
  \`Pessoa(string n) : nome(n) {}\`  // lista de inicialização (preferido)

**Destructor** — ~Classe(), chamado ao destruir objeto
  \`~Pessoa() { cout << "destruído"; }\`

**this** — ponteiro para instância atual
  \`this->nome = n;\`

**static** — pertence à classe, não à instância
  \`static int contador;\``,
        },
        {
          heading: "📖 Herança e Polimorfismo",
          content: `**Herança** — : public/protected/private Base
  \`class Aluno : public Pessoa {
      int matricula;
  public:
      Aluno(string n, int m) : Pessoa(n, 0), matricula(m) {}
  };\`

**virtual** — permite sobrescrita em classes derivadas
  \`virtual void falar() { cout << "Olá"; }\`

**override** — (C++11) indica sobrescrita explícita
  \`void falar() override { cout << "Oi, sou aluno"; }\`

**= 0** — função virtual pura (classe abstrata)
  \`virtual void desenhar() = 0;\`  // classe não pode ser instanciada

**final** — impede herança ou sobrescrita
  \`class Final final { };\`
  \`void metodo() final;\`

**dynamic_cast** — cast seguro com verificação de tipo
  \`Aluno* a = dynamic_cast<Aluno*>(pessoa);\`
  Retorna nullptr se falhar`,
        },
        {
          heading: "📖 Memória e Smart Pointers",
          content: `**new** — aloca no heap, retorna ponteiro
  \`Pessoa* p = new Pessoa("Ana", 25);\`

**delete** — libera memória (obrigatório para new)
  \`delete p;\`
  \`delete[] arr;\`  // para arrays

**unique_ptr<T>** — (C++11) ownership exclusivo, libera automaticamente
  \`unique_ptr<Pessoa> p = make_unique<Pessoa>("Ana", 25);\`
  Não pode ser copiado, apenas movido

**shared_ptr<T>** — (C++11) múltiplos owners, reference counting
  \`shared_ptr<Pessoa> p1 = make_shared<Pessoa>("Ana", 25);
  shared_ptr<Pessoa> p2 = p1;\`  // ambos apontam, ref count = 2

**weak_ptr<T>** — referência fraca, não incrementa contador
  \`weak_ptr<Pessoa> w = p1;\`  // evita ciclos

**RAII** — Resource Acquisition Is Initialization
  Recursos liberados automaticamente no destrutor`,
        },
        {
          heading: "📖 STL Containers",
          content: `**vector<T>** — array dinâmico (mais usado)
  \`vector<int> v = {1, 2, 3};
  v.push_back(4);     // adiciona no final
  v.pop_back();       // remove do final
  v[0];               // acesso por índice
  v.size();           // tamanho
  v.empty();          // está vazio?\`

**map<K,V>** — dicionário ordenado (árvore red-black)
  \`map<string, int> m;
  m["chave"] = 10;    // inserir/atualizar
  m.find("chave");    // retorna iterator
  m.count("chave");   // 0 ou 1\`

**unordered_map<K,V>** — hash table (O(1) médio)

**set<T>** — conjunto ordenado de valores únicos
  \`set<int> s; s.insert(5); s.count(5);\`

**string** — sequência de caracteres
  \`string s = "hello";
  s.length();  s.substr(0,3);  s.find("ll");\`

**pair<T1,T2>** — par de valores
  \`pair<int,string> p = {1, "um"}; p.first; p.second;\``,
        },
        {
          heading: "📖 Iterators e Algorithms",
          content: `**Iterators** — generalizam acesso a containers
  \`vector<int>::iterator it = v.begin();
  while (it != v.end()) { cout << *it; ++it; }\`

**Range-for** — (C++11) loop simplificado
  \`for (int x : v) { cout << x; }        // cópia
  for (int& x : v) { x *= 2; }           // referência
  for (const auto& x : v) { ... }\`       // auto + const ref

**Algorithms (algorithm):**
  \`sort(v.begin(), v.end());              // ordena
  reverse(v.begin(), v.end());            // inverte
  find(v.begin(), v.end(), 5);            // busca
  count(v.begin(), v.end(), 5);           // conta
  accumulate(v.begin(), v.end(), 0);      // soma (numeric)
  for_each(v.begin(), v.end(), func);     // aplica função\`

**Lambda com algorithms:**
  \`sort(v.begin(), v.end(), [](int a, int b) { return a > b; });\``,
        },
        {
          heading: "📖 Templates e Generics",
          content: `**Function template** — função genérica
  \`template<typename T>
  T maximo(T a, T b) { return (a > b) ? a : b; }
  
  maximo(5, 3);        // T = int (inferido)
  maximo<double>(5.5, 3.2);\`  // explícito

**Class template** — classe genérica
  \`template<typename T>
  class Pilha {
      vector<T> dados;
  public:
      void push(T item) { dados.push_back(item); }
      T pop() { T t = dados.back(); dados.pop_back(); return t; }
  };\`

**Template specialization** — versão específica
  \`template<> class Pilha<bool> { ... };\`

**Variadic templates** — (C++11) número variável de tipos
  \`template<typename... Args> void print(Args... args);\`

**Concepts** — (C++20) restrições em templates
  \`template<typename T> requires integral<T>\``,
        },
        {
          heading: "📖 C++ Moderno (11/14/17/20)",
          content: `**auto** — (C++11) inferência de tipo
  \`auto x = 10;          // int
  auto it = v.begin();   // vector<int>::iterator\`

**nullptr** — (C++11) ponteiro nulo tipado (substitui NULL)

**Lambda** — (C++11) função anônima
  \`auto f = [](int x) { return x * 2; };
  [=]  // captura tudo por valor
  [&]  // captura tudo por referência
  [x, &y]  // x por valor, y por referência\`

**Move semantics** — (C++11) transfere recursos sem copiar
  \`string s2 = move(s1);\`  // s1 fica vazio
  \`&&\` — rvalue reference

**constexpr** — (C++11) executa em tempo de compilação
  \`constexpr int fatorial(int n) { return n <= 1 ? 1 : n * fatorial(n-1); }\`

**structured bindings** — (C++17) desempacota
  \`auto [x, y] = pair<int,int>{1, 2};\`

**optional<T>** — (C++17) valor ou nada
  \`optional<int> buscar(int id);\``,
        },
        {
          heading: "📖 Entrada/Saída e Strings",
          content: `**iostream** — streams de entrada/saída
  \`#include <iostream>
  cout << "Texto" << valor << endl;   // saída
  cin >> variavel;                     // entrada
  cerr << "Erro";                      // erro\`

**fstream** — arquivos
  \`#include <fstream>
  ofstream out("saida.txt");   out << "dados";  out.close();
  ifstream in("entrada.txt");  in >> dados;     in.close();\`

**stringstream** — string como stream
  \`#include <sstream>
  stringstream ss;  ss << 10 << " " << 20;
  string s = ss.str();\`

**Manipuladores:**
  \`setw(10)      // largura
  setprecision(2) // casas decimais
  fixed          // notação fixa
  hex, oct, dec  // bases numéricas\`

**string methods:**
  \`s.length(), s.size(), s.empty()
  s.substr(pos, len), s.find("sub"), s.rfind("sub")
  s.replace(pos, len, "novo"), s.append("mais")
  stoi(s), stod(s), to_string(num)\``,
        },
      ],
      keyTopics: [
        "class, public/private",
        "virtual, override",
        "new, delete",
        "unique_ptr, shared_ptr",
        "vector, map, set",
        "iterators, algorithms",
        "template<typename T>",
        "auto, lambda, move",
      ],
    },

    "C#": {
      title: "C# (.NET) - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe C#. Tipos, classes, LINQ, async/await e features modernas do .NET.",
      sections: [
        {
          heading: "📖 Tipos de Dados",
          content: `**int** — inteiro 32-bit (-2³¹ a 2³¹-1)
  \`int idade = 25;\`

**long** — inteiro 64-bit
  \`long grande = 9223372036854775807L;\`

**float** — ponto flutuante 32-bit (sufixo f)
  \`float preco = 19.99f;\`

**double** — ponto flutuante 64-bit (padrão)
  \`double pi = 3.14159265358979;\`

**decimal** — alta precisão para dinheiro (sufixo m)
  \`decimal valor = 1234.56m;\`

**bool** — true/false
  \`bool ativo = true;\`

**char** — caractere Unicode
  \`char letra = 'A';\`

**string** — texto imutável
  \`string nome = "Ana";\`
  \`string interpolada = $"Olá, {nome}!";\`  // interpolação

**var** — inferência de tipo (compilador deduz)
  \`var lista = new List<int>();\`

**dynamic** — tipo determinado em runtime
  \`dynamic obj = GetObject();\``,
        },
        {
          heading: "📖 Classes e Objetos",
          content: `**class** — tipo por referência (heap)
  \`public class Pessoa {
      public string Nome { get; set; }  // property
      private int idade;
      
      public Pessoa(string nome) {      // constructor
          Nome = nome;
      }
  }\`

**struct** — tipo por valor (stack), geralmente pequeno/imutável
  \`public struct Ponto { public int X, Y; }\`

**record** — (C# 9+) classe imutável com igualdade por valor
  \`public record User(string Name, int Age);\`
  \`record class\` vs \`record struct\`

**new** — instanciar objeto
  \`var p = new Pessoa("Ana");\`
  \`Pessoa p = new("Ana");\`  // target-typed (C# 9+)

**this** — referência à instância atual
**base** — referência à classe base

**static** — pertence à classe, não à instância
  \`public static int Contador;\`
  \`public static void Metodo() { }\``,
        },
        {
          heading: "📖 Properties e Encapsulamento",
          content: `**Property** — encapsula campo com get/set
  \`public string Nome { get; set; }\`  // auto-property

**get** — accessor de leitura
**set** — accessor de escrita
**init** — (C# 9+) set apenas na inicialização
  \`public string Id { get; init; }\`

**Computed property:**
  \`public string NomeCompleto => $"{Nome} {Sobrenome}";\`

**Backing field:**
  \`private string _nome;
  public string Nome {
      get => _nome;
      set => _nome = value ?? throw new ArgumentNullException();
  }\`

**required** — (C# 11+) obrigatório na inicialização
  \`public required string Nome { get; set; }\`

**Access modifiers:**
  \`public\` — acessível de qualquer lugar
  \`private\` — apenas na classe (padrão para membros)
  \`protected\` — classe e derivadas
  \`internal\` — mesmo assembly
  \`protected internal\` — derivadas ou mesmo assembly`,
        },
        {
          heading: "📖 Herança e Interfaces",
          content: `**Herança** — : ClasseBase (apenas uma)
  \`public class Aluno : Pessoa { }\`

**virtual** — permite override em derivadas
  \`public virtual void Falar() { Console.WriteLine("Olá"); }\`

**override** — sobrescreve método virtual
  \`public override void Falar() { Console.WriteLine("Oi!"); }\`

**abstract** — classe/método sem implementação
  \`public abstract class Animal { public abstract void Som(); }\`

**sealed** — impede herança ou override
  \`public sealed class Final { }\`

**interface** — contrato de métodos (múltiplas permitidas)
  \`public interface IAnimal {
      void Falar();
      string Nome { get; }
  }
  public class Cachorro : IAnimal { ... }\`

**is** — verificar tipo
  \`if (obj is Pessoa p) { p.Nome; }\`

**as** — cast seguro (null se falhar)
  \`var p = obj as Pessoa;\`

**pattern matching** — (C# 7+)
  \`obj switch {
      Pessoa p => p.Nome,
      null => "nulo",
      _ => "outro"
  };\``,
        },
        {
          heading: "📖 Collections e Generics",
          content: `**List<T>** — lista dinâmica
  \`var lista = new List<int> { 1, 2, 3 };
  lista.Add(4);
  lista.Remove(2);
  lista[0];
  lista.Count;\`

**Dictionary<TKey, TValue>** — mapa chave-valor
  \`var dict = new Dictionary<string, int>();
  dict["chave"] = 10;
  dict.TryGetValue("chave", out int valor);
  dict.ContainsKey("chave");\`

**HashSet<T>** — conjunto único
  \`var set = new HashSet<int> { 1, 2, 3 };
  set.Add(4);  set.Contains(2);\`

**Queue<T>** — fila (FIFO)
  \`queue.Enqueue(item);  queue.Dequeue();\`

**Stack<T>** — pilha (LIFO)
  \`stack.Push(item);  stack.Pop();\`

**Array** — tamanho fixo
  \`int[] arr = new int[5];
  int[] arr2 = { 1, 2, 3 };\`

**IEnumerable<T>** — interface base para coleções iteráveis`,
        },
        {
          heading: "📖 LINQ (Language Integrated Query)",
          content: `**using System.Linq;** — namespace LINQ

**Where** — filtrar elementos
  \`lista.Where(x => x > 5)\`

**Select** — transformar/mapear
  \`lista.Select(x => x * 2)\`
  \`lista.Select(x => new { Dobro = x * 2 })\`  // anonymous type

**OrderBy / OrderByDescending** — ordenar
  \`lista.OrderBy(x => x.Nome)\`

**First / FirstOrDefault** — primeiro elemento
  \`lista.FirstOrDefault(x => x.Id == 5)\`  // null se não encontrar

**Single / SingleOrDefault** — exatamente um elemento

**Any / All** — verificações booleanas
  \`lista.Any(x => x > 10)\`  // existe algum?
  \`lista.All(x => x > 0)\`   // todos satisfazem?

**Count / Sum / Average / Max / Min** — agregações
  \`lista.Sum(x => x.Valor)\`

**GroupBy** — agrupar
  \`lista.GroupBy(x => x.Categoria)\`

**Join** — combinar coleções
  \`from a in listaA join b in listaB on a.Id equals b.AId\`

**ToList / ToArray / ToDictionary** — materializar
  \`query.ToList()\``,
        },
        {
          heading: "📖 Async/Await e Tasks",
          content: `**async** — marca método como assíncrono
**await** — aguarda operação assíncrona sem bloquear

\`public async Task<string> BuscarDadosAsync() {
    var resultado = await httpClient.GetStringAsync(url);
    return resultado;
}\`

**Task** — representa operação assíncrona sem retorno
**Task<T>** — operação com retorno do tipo T

**ValueTask<T>** — (performance) quando pode completar sincronamente

**Task.WhenAll** — aguarda múltiplas tasks
  \`await Task.WhenAll(task1, task2, task3);\`

**Task.WhenAny** — aguarda a primeira a completar

**ConfigureAwait(false)** — em libraries, evita capturar contexto
  \`await tarefa.ConfigureAwait(false);\`

**CancellationToken** — cancelar operações
  \`public async Task MetodoAsync(CancellationToken ct) {
      ct.ThrowIfCancellationRequested();
  }\`

**async void** — EVITAR! apenas para event handlers`,
        },
        {
          heading: "📖 Null Safety e Operadores",
          content: `**?** — tipo nullable
  \`int? idade = null;\`  // Nullable<int>
  \`idade.HasValue\`  \`idade.Value\`  \`idade.GetValueOrDefault()\`

**?.** — null conditional (elvis operator)
  \`pessoa?.Endereco?.Cidade\`  // null se qualquer parte for null

**??** — null coalescing (valor padrão se null)
  \`string nome = inputNome ?? "Anônimo";\`

**??=** — (C# 8+) atribuir se null
  \`nome ??= "Padrão";\`

**!** — null forgiving (diz ao compilador "não é null")
  \`string s = GetString()!.ToUpper();\`

**Nullable reference types** — (C# 8+) #nullable enable
  \`string?\` pode ser null, \`string\` não deve

**?[]** — null conditional com indexador
  \`array?[0]\`

**?()** — null conditional com invocação
  \`action?.Invoke();\``,
        },
        {
          heading: "📖 Delegates, Events e Lambda",
          content: `**delegate** — ponteiro para método tipado
  \`public delegate int Operacao(int a, int b);\`

**Func<T, TResult>** — delegate genérico com retorno
  \`Func<int, int, int> soma = (a, b) => a + b;\`

**Action<T>** — delegate sem retorno (void)
  \`Action<string> log = msg => Console.WriteLine(msg);\`

**Predicate<T>** — retorna bool
  \`Predicate<int> positivo = x => x > 0;\`

**Lambda** — função anônima
  \`x => x * 2\`  // expression lambda
  \`(a, b) => { return a + b; }\`  // statement lambda

**event** — notificação (observer pattern)
  \`public event EventHandler<EventArgs> Mudou;
  Mudou?.Invoke(this, EventArgs.Empty);\`

**+=** — inscrever no evento
**-=** — cancelar inscrição

**Local function** — (C# 7+)
  \`void Metodo() {
      int Local(int x) => x * 2;
  }\``,
        },
        {
          heading: "📖 Strings e Formatação",
          content: `**Interpolação** — $ antes da string
  \`$"Nome: {pessoa.Nome}, Idade: {pessoa.Idade}"\`
  \`$"Valor: {preco:C2}"\`  // formato moeda, 2 decimais

**Verbatim** — @ ignora escape
  \`@"C:\\Users\\arquivo.txt"\`  // sem duplicar \\

**Raw string** — (C# 11+) múltiplas aspas
  \`"""
  JSON sem escape
  """\`

**string.Format:**
  \`string.Format("Olá, {0}!", nome)\`

**Formatos:** :C(moeda) :N(número) :D(data) :X(hex) :P(percentual)

**Métodos úteis:**
  \`.Length\` \`.ToUpper()\` \`.ToLower()\` \`.Trim()\`
  \`.Split(',')\` \`.Join(", ", array)\`
  \`.Contains("sub")\` \`.StartsWith("pre")\` \`.EndsWith("suf")\`
  \`.Replace("old", "new")\` \`.Substring(start, length)\`
  \`string.IsNullOrEmpty(s)\` \`string.IsNullOrWhiteSpace(s)\``,
        },
      ],
      keyTopics: [
        "class, struct, record",
        "property { get; set; }",
        "interface, abstract",
        "List<T>, Dictionary<K,V>",
        "LINQ (Where, Select)",
        "async/await, Task<T>",
        "?. ?? ??= operators",
        "Func<>, Action<>, lambda",
      ],
    },

    Java: {
      title: "Java - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe Java. Classes, Collections, Streams, OOP e features modernas do JDK.",
      sections: [
        {
          heading: "📖 Tipos de Dados",
          content: `**byte** — inteiro 8-bit (-128 a 127)
  \`byte b = 100;\`

**short** — inteiro 16-bit
  \`short s = 30000;\`

**int** — inteiro 32-bit (-2³¹ a 2³¹-1)
  \`int idade = 25;\`

**long** — inteiro 64-bit (sufixo L)
  \`long grande = 9223372036854775807L;\`

**float** — ponto flutuante 32-bit (sufixo f)
  \`float preco = 19.99f;\`

**double** — ponto flutuante 64-bit (padrão)
  \`double pi = 3.14159265358979;\`

**boolean** — true/false
  \`boolean ativo = true;\`

**char** — caractere Unicode 16-bit
  \`char letra = 'A';\`

**String** — texto imutável (classe, não primitivo)
  \`String nome = "Ana";\`

**var** — (Java 10+) inferência de tipo local
  \`var lista = new ArrayList<String>();\``,
        },
        {
          heading: "📖 Classes e Objetos",
          content: `**class** — definição de classe
  \`public class Pessoa {
      private String nome;   // campo
      
      public Pessoa(String nome) {  // constructor
          this.nome = nome;
      }
      
      public String getNome() { return nome; }  // getter
      public void setNome(String n) { nome = n; }  // setter
  }\`

**new** — instanciar objeto
  \`Pessoa p = new Pessoa("Ana");\`

**this** — referência à instância atual
**super** — referência à classe pai

**static** — pertence à classe, não à instância
  \`public static int contador;\`
  \`public static void main(String[] args) { }\`

**final** — constante (campo) / impede override (método) / impede herança (classe)
  \`public static final int MAX = 100;\`

**Access modifiers:**
  \`public\` — acessível de qualquer lugar
  \`private\` — apenas na classe
  \`protected\` — mesmo pacote + subclasses
  (default) — apenas mesmo pacote`,
        },
        {
          heading: "📖 Herança e Interfaces",
          content: `**extends** — herdar de uma classe
  \`public class Aluno extends Pessoa { }\`

**implements** — implementar interface(s)
  \`public class Cachorro implements Animal, Corredor { }\`

**interface** — contrato de métodos
  \`public interface Animal {
      void fazerSom();
      default void dormir() { System.out.println("Zzz"); }  // default method
  }\`

**abstract** — classe/método sem implementação completa
  \`public abstract class Forma {
      public abstract double area();
  }\`

**@Override** — indica que sobrescreve método da superclasse
  \`@Override
  public void fazerSom() { System.out.println("Au au"); }\`

**instanceof** — verificar tipo em runtime
  \`if (obj instanceof Pessoa p) { p.getNome(); }\`  // pattern matching (Java 16+)

**sealed/permits** — (Java 17+) restringir subclasses
  \`sealed class Shape permits Circle, Square { }\``,
        },
        {
          heading: "📖 Collections Framework",
          content: `**List** — interface de lista ordenada
  \`List<String> lista = new ArrayList<>();
  lista.add("item");
  lista.get(0);
  lista.remove(0);
  lista.size();\`

**ArrayList** — lista com array dinâmico (acesso rápido)
**LinkedList** — lista encadeada (inserção/remoção rápida)

**Set** — conjunto sem duplicatas
  \`Set<Integer> set = new HashSet<>();
  set.add(1);  set.contains(1);\`

**HashSet** — sem ordem garantida
**TreeSet** — ordenado
**LinkedHashSet** — ordem de inserção

**Map** — mapa chave-valor
  \`Map<String, Integer> map = new HashMap<>();
  map.put("chave", 10);
  map.get("chave");
  map.containsKey("chave");
  map.getOrDefault("chave", 0);\`

**Queue** — fila
  \`Queue<String> fila = new LinkedList<>();
  fila.offer("item");  fila.poll();\`

**Deque** — fila dupla (stack/queue)
  \`Deque<Integer> pilha = new ArrayDeque<>();
  pilha.push(1);  pilha.pop();\``,
        },
        {
          heading: "📖 Streams e Processamento",
          content: `**.stream()** — criar stream de coleção
  \`lista.stream()\`

**.filter()** — filtrar elementos
  \`.filter(x -> x > 5)\`

**.map()** — transformar elementos
  \`.map(x -> x * 2)\`
  \`.map(String::toUpperCase)\`  // method reference

**.flatMap()** — achatar stream de streams
  \`.flatMap(lista -> lista.stream())\`

**.sorted()** — ordenar
  \`.sorted()\`
  \`.sorted(Comparator.comparing(Pessoa::getNome))\`

**.distinct()** — remover duplicatas

**.limit()** / **.skip()** — limitar/pular elementos

**.forEach()** — consumir elementos (terminal)
  \`.forEach(System.out::println)\`

**.collect()** — coletar resultado (terminal)
  \`.collect(Collectors.toList())\`
  \`.collect(Collectors.toSet())\`
  \`.collect(Collectors.joining(", "))\`

**.reduce()** — reduzir a um valor
  \`.reduce(0, (a, b) -> a + b)\`

**.findFirst()** / **.findAny()** — encontrar elemento
**.anyMatch()** / **.allMatch()** / **.noneMatch()** — verificações
**.count()** / **.min()** / **.max()** — agregações`,
        },
        {
          heading: "📖 Lambda e Functional Interfaces",
          content: `**->** — operador lambda
  \`(a, b) -> a + b\`  // expression
  \`(x) -> { return x * 2; }\`  // block

**::*** — method reference
  \`String::toUpperCase\`  // instance method
  \`System.out::println\`  // specific object
  \`Pessoa::new\`  // constructor reference

**Function<T, R>** — transforma T em R
  \`Function<String, Integer> len = s -> s.length();\`

**Predicate<T>** — retorna boolean
  \`Predicate<Integer> positivo = x -> x > 0;\`

**Consumer<T>** — consome sem retorno
  \`Consumer<String> print = s -> System.out.println(s);\`

**Supplier<T>** — fornece valor sem input
  \`Supplier<Double> random = () -> Math.random();\`

**BiFunction<T, U, R>** — dois inputs, um output
**BiPredicate<T, U>** — dois inputs, boolean
**BiConsumer<T, U>** — dois inputs, void`,
        },
        {
          heading: "📖 Optional e Null Safety",
          content: `**Optional<T>** — container que pode estar vazio
  \`Optional<String> opt = Optional.ofNullable(valor);\`

**Optional.of()** — cria com valor (não null)
**Optional.ofNullable()** — cria com valor ou empty
**Optional.empty()** — cria vazio

**.isPresent()** / **.isEmpty()** — verificar presença
  \`if (opt.isPresent()) { ... }\`

**.get()** — obter valor (throws se vazio)
**.orElse()** — valor default se vazio
  \`opt.orElse("default")\`

**.orElseGet()** — supplier se vazio (lazy)
  \`opt.orElseGet(() -> computarDefault())\`

**.orElseThrow()** — exception se vazio
  \`opt.orElseThrow(() -> new RuntimeException())\`

**.ifPresent()** — executar se presente
  \`opt.ifPresent(v -> System.out.println(v));\`

**.map()** — transformar se presente
  \`opt.map(String::toUpperCase)\`

**.filter()** — filtrar valor presente
**.flatMap()** — achatar Optional de Optional`,
        },
        {
          heading: "📖 Records e Features Modernas",
          content: `**record** — (Java 14+) classe imutável de dados
  \`public record User(String name, int age) { }
  var u = new User("Ana", 25);
  u.name();  u.age();\`  // getters automáticos

**Text Blocks** — (Java 15+) strings multiline
  \`String json = """
      {
          "name": "Ana",
          "age": 25
      }
      """;\`

**Pattern Matching instanceof** — (Java 16+)
  \`if (obj instanceof String s) {
      s.toUpperCase();
  }\`

**Switch Expressions** — (Java 14+)
  \`int result = switch (day) {
      case MONDAY, FRIDAY -> 1;
      case TUESDAY -> 2;
      default -> 0;
  };\`

**Pattern Matching switch** — (Java 21+)
  \`switch (obj) {
      case Integer i -> "int: " + i;
      case String s -> "string: " + s;
      default -> "outro";
  }\`

**Virtual Threads** — (Java 21+)
  \`Thread.startVirtualThread(() -> tarefa());\``,
        },
        {
          heading: "📖 Exceptions e I/O",
          content: `**try/catch/finally** — tratamento de exceções
  \`try {
      riskyOperation();
  } catch (IOException e) {
      e.printStackTrace();
  } finally {
      cleanup();
  }\`

**throws** — declarar exceção no método
  \`public void read() throws IOException { }\`

**throw** — lançar exceção
  \`throw new IllegalArgumentException("Inválido");\`

**try-with-resources** — (Java 7+) auto-close
  \`try (BufferedReader br = new BufferedReader(new FileReader("f"))) {
      br.readLine();
  }\`

**Files** — API moderna de arquivos (Java 7+)
  \`Files.readString(Path.of("file.txt"));\`
  \`Files.writeString(Path.of("file.txt"), "conteúdo");\`
  \`Files.readAllLines(path);\`
  \`Files.list(dir).forEach(System.out::println);\`

**Checked exceptions** — devem ser tratadas (IOException, SQLException)
**Unchecked exceptions** — RuntimeException (NullPointerException, IllegalArgumentException)`,
        },
      ],
      keyTopics: [
        "class, extends, implements",
        "public/private/protected",
        "ArrayList, HashMap, HashSet",
        "stream().filter().map()",
        "lambda: x -> x * 2",
        "Optional.ofNullable()",
        "record, switch expressions",
        "try-with-resources",
      ],
    },

    Python: {
      title: "Python - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe Python. Tipos, funções, OOP, módulos e features pythônicas.",
      sections: [
        {
          heading: "📖 Tipos de Dados",
          content: `**int** — inteiro de precisão arbitrária
  \`idade = 25\`
  \`grande = 10**100\`  # sem overflow

**float** — ponto flutuante 64-bit
  \`pi = 3.14159\`

**bool** — True/False (capitalizado!)
  \`ativo = True\`

**str** — string imutável
  \`nome = "Ana"\`
  \`multi = """texto
  multiline"""\`
  \`f"Olá, {nome}!"\`  # f-string (Python 3.6+)

**list** — lista mutável (array dinâmico)
  \`nums = [1, 2, 3]\`
  \`nums.append(4)\`  \`nums.pop()\`
  \`nums[0]\`  \`nums[-1]\`  # último

**tuple** — tupla imutável
  \`coords = (10, 20)\`
  \`x, y = coords\`  # unpacking

**dict** — dicionário (hash map)
  \`user = {"nome": "Ana", "idade": 25}\`
  \`user["nome"]\`  \`user.get("email", "N/A")\`

**set** — conjunto sem duplicatas
  \`unicos = {1, 2, 3}\`
  \`unicos.add(4)\`  \`unicos.discard(1)\`

**None** — valor nulo (equivalente a null)
  \`valor = None\``,
        },
        {
          heading: "📖 Slicing e Indexação",
          content: `**[start:end:step]** — slice notation
  \`lista[0]\`  # primeiro
  \`lista[-1]\`  # último
  \`lista[1:4]\`  # índice 1 até 3
  \`lista[:3]\`  # primeiros 3
  \`lista[3:]\`  # do índice 3 em diante
  \`lista[::2]\`  # pula de 2 em 2
  \`lista[::-1]\`  # reverso

**String slicing:**
  \`"Python"[0:3]\`  # "Pyt"
  \`"Python"[::-1]\`  # "nohtyP"

**Unpacking:**
  \`a, b, c = [1, 2, 3]\`
  \`first, *rest = [1, 2, 3, 4]\`  # rest = [2, 3, 4]
  \`*start, last = [1, 2, 3, 4]\`  # start = [1, 2, 3]

**enumerate()** — índice + valor
  \`for i, v in enumerate(lista): print(i, v)\`

**zip()** — combinar iteráveis
  \`for a, b in zip(lista1, lista2): print(a, b)\``,
        },
        {
          heading: "📖 Controle de Fluxo",
          content: `**if/elif/else** — condicional (indentação!)
  \`if x > 0:
      print("positivo")
  elif x < 0:
      print("negativo")
  else:
      print("zero")\`

**for** — iteração sobre iterável
  \`for item in lista:
      print(item)\`
  \`for i in range(10):  # 0 a 9
      print(i)\`
  \`for i in range(1, 11):  # 1 a 10
      print(i)\`

**while** — loop condicional
  \`while x < 10:
      x += 1\`

**break** — sair do loop
**continue** — pular para próxima iteração
**pass** — placeholder (não faz nada)

**Ternary:**
  \`resultado = "par" if x % 2 == 0 else "ímpar"\`

**match/case** — (Python 3.10+) pattern matching
  \`match comando:
      case "start": iniciar()
      case "stop": parar()
      case _: print("desconhecido")\``,
        },
        {
          heading: "📖 Funções",
          content: `**def** — definir função
  \`def soma(a, b):
      return a + b\`

**return** — retornar valor (None se omitido)

**Default arguments:**
  \`def greet(nome, saudacao="Olá"):
      print(f"{saudacao}, {nome}!")\`

***args** — argumentos posicionais variáveis
  \`def soma(*args):
      return sum(args)
  soma(1, 2, 3, 4)\`  # 10

****kwargs** — argumentos nomeados variáveis
  \`def config(**kwargs):
      for k, v in kwargs.items(): print(k, v)
  config(host="localhost", port=8080)\`

**lambda** — função anônima
  \`dobrar = lambda x: x * 2\`
  \`sorted(lista, key=lambda x: x.idade)\`

**Type hints** — (Python 3.5+) anotações de tipo
  \`def soma(a: int, b: int) -> int:
      return a + b\`

**Docstring:**
  \`def funcao():
      """Descrição da função."""
      pass\``,
        },
        {
          heading: "📖 Classes e OOP",
          content: `**class** — definir classe
  \`class Pessoa:
      def __init__(self, nome):  # constructor
          self.nome = nome
      
      def falar(self):
          print(f"Olá, sou {self.nome}")\`

**self** — referência à instância (primeiro parâmetro)

**__init__** — método inicializador (constructor)

**Herança:**
  \`class Aluno(Pessoa):
      def __init__(self, nome, matricula):
          super().__init__(nome)
          self.matricula = matricula\`

**@property** — getter como atributo
  \`@property
  def nome_completo(self):
      return f"{self.nome} {self.sobrenome}"\`

**@staticmethod** — método sem self
**@classmethod** — método com cls (classe)

**Dunder methods:**
  \`__str__\` — representação string
  \`__repr__\` — representação debug
  \`__len__\` — len(obj)
  \`__eq__\` — igualdade (==)
  \`__getitem__\` — obj[key]`,
        },
        {
          heading: "📖 List Comprehensions",
          content: `**List comprehension:**
  \`[x*2 for x in range(10)]\`  # [0, 2, 4, ..., 18]
  \`[x for x in lista if x > 5]\`  # filtrar
  \`[x.upper() for x in palavras]\`  # transformar

**Dict comprehension:**
  \`{k: v*2 for k, v in dict.items()}\`
  \`{x: x**2 for x in range(5)}\`  # {0:0, 1:1, 2:4, 3:9, 4:16}

**Set comprehension:**
  \`{x % 3 for x in range(10)}\`  # {0, 1, 2}

**Generator expression** — lazy evaluation
  \`(x*2 for x in range(1000000))\`  # não aloca memória
  \`sum(x*2 for x in range(10))\`

**Nested comprehension:**
  \`[[j for j in range(3)] for i in range(3)]\`  # matriz 3x3

**Walrus operator** — (Python 3.8+) atribuição em expressão
  \`[y for x in data if (y := process(x)) > 0]\``,
        },
        {
          heading: "📖 Módulos e Imports",
          content: `**import** — importar módulo inteiro
  \`import math
  math.sqrt(16)\`

**from ... import** — importar específico
  \`from math import sqrt, pi
  sqrt(16)\`

**from ... import *** — importar tudo (evitar!)

**as** — alias
  \`import pandas as pd
  from datetime import datetime as dt\`

**if __name__ == "__main__":** — executar apenas se script principal
  \`if __name__ == "__main__":
      main()\`

**pip** — gerenciador de pacotes
  \`pip install requests\`
  \`pip install -r requirements.txt\`

**Módulos úteis:**
  \`os\` — sistema operacional
  \`sys\` — configurações Python
  \`json\` — JSON parsing
  \`datetime\` — data/hora
  \`re\` — regex
  \`pathlib\` — paths modernos`,
        },
        {
          heading: "📖 Context Managers e Exceptions",
          content: `**with** — context manager (auto-cleanup)
  \`with open("file.txt", "r") as f:
      content = f.read()\`

**try/except/finally:**
  \`try:
      resultado = 10 / x
  except ZeroDivisionError:
      print("Divisão por zero!")
  except ValueError as e:
      print(f"Erro: {e}")
  finally:
      print("Sempre executa")\`

**raise** — lançar exceção
  \`raise ValueError("Valor inválido")\`

**assert** — verificação de debug
  \`assert x > 0, "x deve ser positivo"\`

**Custom exception:**
  \`class MeuErro(Exception):
      pass\`

**Context manager personalizado:**
  \`from contextlib import contextmanager
  @contextmanager
  def timer():
      start = time.time()
      yield
      print(f"Elapsed: {time.time() - start}")\``,
        },
        {
          heading: "📖 Features Pythônicas",
          content: `**Truthy/Falsy:**
  Falsy: \`None, False, 0, "", [], {}, set()\`
  \`if lista:\`  # True se não vazia

**Chained comparison:**
  \`1 < x < 10\`  # equivale a 1 < x and x < 10

**in** — verificar pertencimento
  \`if "a" in texto:\`
  \`if key in dict:\`

**is** — identidade (mesmo objeto)
  \`if x is None:\`  # preferir sobre == None

**any() / all():**
  \`any(x > 5 for x in lista)\`  # algum True?
  \`all(x > 0 for x in lista)\`  # todos True?

**sorted() / reversed():**
  \`sorted(lista, key=lambda x: x.nome, reverse=True)\`
  \`list(reversed(lista))\`

**map() / filter():**
  \`list(map(lambda x: x*2, nums))\`
  \`list(filter(lambda x: x > 5, nums))\`

**Unpacking operators:**
  \`merged = {**dict1, **dict2}\`  # merge dicts
  \`combined = [*list1, *list2]\`  # merge lists

**Dataclasses** — (Python 3.7+)
  \`from dataclasses import dataclass
  @dataclass
  class User:
      name: str
      age: int = 0\``,
        },
      ],
      keyTopics: [
        "list, dict, tuple, set",
        "def, lambda, *args, **kwargs",
        "for, while, if/elif/else",
        "class, self, __init__",
        "[x for x in list]",
        "import, from, as",
        "with, try/except",
        "@property, @dataclass",
      ],
    },

    JavaScript: {
      title: "JavaScript - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe JavaScript. Variáveis, funções, arrays, objetos, async e ES6+.",
      sections: [
        {
          heading: "📖 Variáveis e Tipos",
          content: `**let** — variável block-scoped (pode reatribuir)
  \`let idade = 25;
  idade = 26;\`

**const** — constante block-scoped (não pode reatribuir)
  \`const PI = 3.14159;
  const pessoa = { nome: "Ana" };  // objeto mutável, referência fixa\`

**var** — function-scoped (evitar! hoisting problemático)
  \`var x = 10;\`

**string:**
  \`"texto"\` ou \`'texto'\` ou \`\\\`template\\\`\`

**number** — inteiro e float são o mesmo tipo
  \`let n = 42;  let f = 3.14;\`

**boolean:**
  \`true\` / \`false\`

**null** — ausência intencional de valor
**undefined** — variável não inicializada

**typeof** — verificar tipo
  \`typeof x\`  // "string", "number", "object", etc.

**NaN** — Not a Number
  \`isNaN(valor)\`  \`Number.isNaN(valor)\`  // mais preciso`,
        },
        {
          heading: "📖 Arrays",
          content: `**Criar:**
  \`const arr = [1, 2, 3];\`
  \`const arr = new Array(5);\`  // 5 vazios
  \`Array.from({ length: 5 }, (_, i) => i);\`  // [0,1,2,3,4]

**Acesso:**
  \`arr[0]\`  \`arr.at(-1)\`  // último (ES2022)

**Mutators (modificam array):**
  \`.push(item)\` — adicionar no final
  \`.pop()\` — remover do final
  \`.unshift(item)\` — adicionar no início
  \`.shift()\` — remover do início
  \`.splice(start, count, ...items)\` — inserir/remover
  \`.sort()\`  \`.reverse()\`

**Não-mutators (retornam novo):**
  \`.slice(start, end)\` — sub-array
  \`.concat(arr2)\` — juntar arrays
  \`.flat(depth)\` — achatar arrays aninhados

**Iteração:**
  \`.forEach((item, i) => { })\`
  \`.map(x => x * 2)\` — transformar
  \`.filter(x => x > 5)\` — filtrar
  \`.reduce((acc, x) => acc + x, 0)\` — reduzir
  \`.find(x => x.id === 5)\` — primeiro que satisfaz
  \`.findIndex(x => x > 5)\` — índice do primeiro
  \`.some(x => x > 5)\` — algum satisfaz?
  \`.every(x => x > 0)\` — todos satisfazem?`,
        },
        {
          heading: "📖 Objetos",
          content: `**Object literal:**
  \`const pessoa = {
      nome: "Ana",
      idade: 25,
      falar() { console.log("Olá"); }
  };\`

**Acesso:**
  \`pessoa.nome\`  // dot notation
  \`pessoa["nome"]\`  // bracket notation
  \`pessoa?.endereco?.cidade\`  // optional chaining

**Spread/Rest:**
  \`const copia = { ...pessoa };\`  // shallow copy
  \`const merged = { ...obj1, ...obj2 };\`
  \`const { nome, ...resto } = pessoa;\`  // destructuring + rest

**Destructuring:**
  \`const { nome, idade } = pessoa;\`
  \`const { nome: n, idade: i } = pessoa;\`  // renomear
  \`const { x = 10 } = obj;\`  // default value

**Shorthand:**
  \`const nome = "Ana";
  const obj = { nome };\`  // equivale a { nome: nome }

**Métodos úteis:**
  \`Object.keys(obj)\`  // ["nome", "idade"]
  \`Object.values(obj)\`  // ["Ana", 25]
  \`Object.entries(obj)\`  // [["nome","Ana"], ["idade",25]]
  \`Object.assign(target, source)\`  // merge`,
        },
        {
          heading: "📖 Funções",
          content: `**Function declaration:**
  \`function soma(a, b) {
      return a + b;
  }\`

**Function expression:**
  \`const soma = function(a, b) { return a + b; };\`

**Arrow function:**
  \`const soma = (a, b) => a + b;\`  // implicit return
  \`const soma = (a, b) => { return a + b; };\`  // block body
  \`const dobrar = x => x * 2;\`  // um parâmetro sem ()

**Default parameters:**
  \`function greet(nome = "visitante") { }\`

**Rest parameters:**
  \`function soma(...nums) {
      return nums.reduce((a, b) => a + b, 0);
  }\`

**Callback:**
  \`arr.forEach(item => console.log(item));\`

**IIFE** — Immediately Invoked Function Expression
  \`(function() { console.log("imediato"); })();\`

**this em arrow function:** herda do escopo pai
**this em function:** depende de como é chamada

**bind/call/apply:**
  \`func.bind(context)\`  // retorna nova função
  \`func.call(context, arg1, arg2)\`  // chama com args
  \`func.apply(context, [args])\`  // chama com array`,
        },
        {
          heading: "📖 Controle de Fluxo",
          content: `**if/else:**
  \`if (x > 0) {
      // positivo
  } else if (x < 0) {
      // negativo
  } else {
      // zero
  }\`

**Ternary:**
  \`const resultado = x > 0 ? "positivo" : "não positivo";\`

**switch:**
  \`switch (valor) {
      case 1: console.log("um"); break;
      case 2: console.log("dois"); break;
      default: console.log("outro");
  }\`

**for:**
  \`for (let i = 0; i < 10; i++) { }\`

**for...of** — iterar valores
  \`for (const item of array) { }\`

**for...in** — iterar keys (evitar em arrays)
  \`for (const key in objeto) { }\`

**while / do...while:**
  \`while (cond) { }\`
  \`do { } while (cond);\`

**break** — sair do loop
**continue** — pular para próxima iteração

**Falsy values:** \`false, 0, "", null, undefined, NaN\`
**Truthy:** todo o resto`,
        },
        {
          heading: "📖 Strings e Template Literals",
          content: `**Template literals:**
  \`\\\`Olá, \${nome}!\\\`\`  // interpolação
  \`\\\`Multi
  line\\\`\`  // multiline

**Métodos úteis:**
  \`.length\` — tamanho
  \`.toUpperCase()\` / \`.toLowerCase()\`
  \`.trim()\` / \`.trimStart()\` / \`.trimEnd()\`
  \`.split(separador)\` — string → array
  \`.slice(start, end)\` — substring
  \`.substring(start, end)\` — similar ao slice
  \`.includes("sub")\` — contém?
  \`.startsWith("pre")\` / \`.endsWith("suf")\`
  \`.indexOf("sub")\` — posição (-1 se não encontrar)
  \`.replace("old", "new")\` — primeira ocorrência
  \`.replaceAll("old", "new")\` — todas ocorrências
  \`.repeat(n)\` — repetir n vezes
  \`.padStart(len, char)\` / \`.padEnd(len, char)\`

**String → Number:**
  \`Number("42")\`  \`parseInt("42")\`  \`parseFloat("3.14")\`
  \`+"42"\`  // unary plus

**Number → String:**
  \`String(42)\`  \`(42).toString()\``,
        },
        {
          heading: "📖 Promises e Async/Await",
          content: `**Promise:**
  \`const promise = new Promise((resolve, reject) => {
      if (sucesso) resolve(valor);
      else reject(erro);
  });\`

**.then()/.catch()/.finally():**
  \`fetch(url)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err))
      .finally(() => console.log("done"));\`

**Promise.all()** — aguarda todas (falha se uma falhar)
  \`await Promise.all([p1, p2, p3]);\`

**Promise.allSettled()** — aguarda todas (nunca falha)
**Promise.race()** — primeira a resolver/rejeitar
**Promise.any()** — primeira a resolver (ignora rejeições)

**async/await:**
  \`async function fetchData() {
      try {
          const res = await fetch(url);
          const data = await res.json();
          return data;
      } catch (err) {
          console.error(err);
      }
  }\`

**Top-level await** — (ES2022) em modules
  \`const data = await fetch(url);\``,
        },
        {
          heading: "📖 Módulos (ES6)",
          content: `**Named export:**
  \`export const PI = 3.14;\`
  \`export function soma(a, b) { return a + b; }\`

**Default export:**
  \`export default class User { }\`
  \`export default function() { }\`

**Named import:**
  \`import { PI, soma } from "./math.js";\`
  \`import { soma as add } from "./math.js";\`  // alias

**Default import:**
  \`import User from "./User.js";\`

**Mixed:**
  \`import User, { helper } from "./User.js";\`

**Import everything:**
  \`import * as math from "./math.js";
  math.soma(1, 2);\`

**Dynamic import:**
  \`const module = await import("./module.js");\`

**Re-export:**
  \`export { foo } from "./other.js";\`
  \`export * from "./other.js";\``,
        },
        {
          heading: "📖 Operadores Modernos",
          content: `**Nullish coalescing (??)** — default se null/undefined
  \`const nome = input ?? "Anônimo";\`

**Optional chaining (?.):**
  \`pessoa?.endereco?.cidade\`  // undefined se qualquer parte for null
  \`arr?.[0]\`  // com array
  \`func?.()\`  // com função

**Logical assignment:**
  \`x ||= valor;\`  // x = x || valor
  \`x &&= valor;\`  // x = x && valor  
  \`x ??= valor;\`  // x = x ?? valor

**Spread operator:**
  \`[...arr1, ...arr2]\`  // arrays
  \`{ ...obj1, ...obj2 }\`  // objetos

**Rest operator:**
  \`const [first, ...rest] = arr;\`
  \`const { a, ...others } = obj;\`
  \`function fn(...args) { }\`

**Comparison:**
  \`===\` — strict equality (tipo + valor)
  \`==\` — loose equality (coerção, evitar!)
  \`!==\` / \`!=\`

**Short-circuit:**
  \`a && b\`  // b se a truthy, senão a
  \`a || b\`  // a se truthy, senão b`,
        },
      ],
      keyTopics: [
        "let, const, var",
        "arrow functions: () => {}",
        "array methods: map, filter, reduce",
        "destructuring: { a, b }",
        "spread/rest: ...",
        "async/await, Promise",
        "import/export modules",
        "?., ??, ||=, &&=",
      ],
    },

    TypeScript: {
      title: "TypeScript - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe TypeScript. Sistema de tipos, interfaces, generics, utility types e configuração.",
      sections: [
        {
          heading: "📖 Tipos Primitivos",
          content: `**string:**
  \`let nome: string = "Ana";\`

**number:**
  \`let idade: number = 25;\`
  \`let preco: number = 19.99;\`

**boolean:**
  \`let ativo: boolean = true;\`

**null / undefined:**
  \`let valor: null = null;\`
  \`let indefinido: undefined = undefined;\`

**any** — desativa type-checking (evitar!)
  \`let x: any = "texto"; x = 42;\`

**unknown** — tipo seguro para valores desconhecidos
  \`let x: unknown = getData();
  if (typeof x === "string") { x.toUpperCase(); }\`

**void** — função sem retorno
  \`function log(msg: string): void { console.log(msg); }\`

**never** — nunca retorna (error/infinite)
  \`function error(msg: string): never { throw new Error(msg); }\`

**Inferência:**
  \`let x = 10;\`  // inferido como number`,
        },
        {
          heading: "📖 Arrays e Tuplas",
          content: `**Array:**
  \`let nums: number[] = [1, 2, 3];\`
  \`let nums: Array<number> = [1, 2, 3];\`  // forma genérica

**Array readonly:**
  \`const arr: readonly number[] = [1, 2, 3];\`
  \`const arr: ReadonlyArray<number> = [1, 2, 3];\`

**Tuple** — array com tipos e tamanho fixos
  \`let coord: [number, number] = [10, 20];\`
  \`let entry: [string, number] = ["idade", 25];\`

**Tuple com labels** — (TS 4.0+)
  \`type Coord = [x: number, y: number];\`

**Tuple rest:**
  \`type StringAndNumbers = [string, ...number[]];\`

**Const assertion:**
  \`const arr = [1, 2, 3] as const;\`  // readonly [1, 2, 3]`,
        },
        {
          heading: "📖 Interfaces",
          content: `**Interface** — define shape de objeto
  \`interface Pessoa {
      nome: string;
      idade: number;
      email?: string;  // opcional
      readonly id: number;  // somente leitura
  }\`

**Implementação:**
  \`const p: Pessoa = { nome: "Ana", idade: 25, id: 1 };\`

**Extensão:**
  \`interface Aluno extends Pessoa {
      matricula: string;
  }\`

**Múltipla extensão:**
  \`interface C extends A, B { }\`

**Index signature:**
  \`interface Dict {
      [key: string]: number;
  }\`

**Function signature:**
  \`interface SearchFunc {
      (query: string, limit: number): boolean;
  }\`

**Interface vs Type:** interfaces são extensíveis (declaration merging), types são mais flexíveis`,
        },
        {
          heading: "📖 Type Aliases",
          content: `**Type alias:**
  \`type ID = string | number;\`
  \`type Coords = [number, number];\`

**Union** — um OU outro
  \`type Status = "pending" | "success" | "error";\`
  \`let x: string | number;\`

**Intersection** — combina tipos
  \`type Employee = Person & { salary: number };\`

**Literal types:**
  \`type Direction = "up" | "down" | "left" | "right";\`
  \`type Dice = 1 | 2 | 3 | 4 | 5 | 6;\`

**Object type:**
  \`type User = {
      name: string;
      age: number;
  };\`

**Function type:**
  \`type Callback = (data: string) => void;\`
  \`type AsyncFn = () => Promise<void>;\`

**Template literal types:** (TS 4.1+)
  \`type EventName = \\\`on\${string}\\\`;\``,
        },
        {
          heading: "📖 Generics",
          content: `**Generic function:**
  \`function identity<T>(arg: T): T { return arg; }\`
  \`identity<number>(42);\`  // explícito
  \`identity(42);\`  // inferido

**Generic interface:**
  \`interface Box<T> {
      value: T;
  }
  const box: Box<string> = { value: "texto" };\`

**Generic class:**
  \`class Container<T> {
      constructor(private value: T) {}
      get(): T { return this.value; }
  }\`

**Multiple generics:**
  \`function pair<K, V>(key: K, value: V): [K, V] {
      return [key, value];
  }\`

**Constraints:**
  \`function getLength<T extends { length: number }>(item: T): number {
      return item.length;
  }\`

**Default type:**
  \`function create<T = string>(): T[] { return []; }\`

**keyof constraint:**
  \`function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
      return obj[key];
  }\``,
        },
        {
          heading: "📖 Utility Types",
          content: `**Partial<T>** — todas propriedades opcionais
  \`Partial<User>\`  // { name?: string; age?: number }

**Required<T>** — todas propriedades obrigatórias
  \`Required<PartialUser>\`

**Readonly<T>** — todas propriedades readonly
  \`Readonly<User>\`

**Pick<T, K>** — seleciona propriedades
  \`Pick<User, "name" | "age">\`

**Omit<T, K>** — remove propriedades
  \`Omit<User, "password">\`

**Record<K, V>** — objeto com keys K e valores V
  \`Record<string, number>\`  // { [key: string]: number }

**Exclude<T, U>** — remove tipos de union
  \`Exclude<"a" | "b" | "c", "a">\`  // "b" | "c"

**Extract<T, U>** — extrai tipos de union
  \`Extract<"a" | "b" | "c", "a" | "b">\`  // "a" | "b"

**NonNullable<T>** — remove null e undefined
  \`NonNullable<string | null>\`  // string

**ReturnType<T>** — tipo de retorno de função
  \`ReturnType<typeof getUser>\`

**Parameters<T>** — tipos dos parâmetros
  \`Parameters<typeof func>\`  // [string, number]`,
        },
        {
          heading: "📖 Type Guards e Narrowing",
          content: `**typeof:**
  \`if (typeof x === "string") { x.toUpperCase(); }\`

**instanceof:**
  \`if (err instanceof Error) { err.message; }\`

**in operator:**
  \`if ("name" in obj) { obj.name; }\`

**Truthiness:**
  \`if (value) { /* value é truthy */ }\`

**Equality:**
  \`if (x === null) { /* x é null */ }\`

**Custom type guard:**
  \`function isString(x: unknown): x is string {
      return typeof x === "string";
  }
  if (isString(value)) { value.toUpperCase(); }\`

**Discriminated union:**
  \`type Shape =
      | { kind: "circle"; radius: number }
      | { kind: "square"; side: number };
  
  function area(s: Shape) {
      switch (s.kind) {
          case "circle": return Math.PI * s.radius ** 2;
          case "square": return s.side ** 2;
      }
  }\`

**as const:**
  \`const config = { mode: "dark" } as const;\`  // readonly, literal types`,
        },
        {
          heading: "📖 Classes",
          content: `**Class básica:**
  \`class Pessoa {
      name: string;
      
      constructor(name: string) {
          this.name = name;
      }
      
      greet(): void {
          console.log(\\\`Hello, \${this.name}\\\`);
      }
  }\`

**Access modifiers:**
  \`public\` — acessível de qualquer lugar (padrão)
  \`private\` — apenas na classe
  \`protected\` — classe e subclasses
  \`readonly\` — não pode reatribuir

**Shorthand constructor:**
  \`class User {
      constructor(public name: string, private age: number) {}
  }\`

**Implements:**
  \`class Dog implements Animal { }\`

**Abstract:**
  \`abstract class Shape {
      abstract area(): number;
  }\`

**Static:**
  \`class Counter {
      static count = 0;
      static increment() { Counter.count++; }
  }\`

**Getter/Setter:**
  \`get fullName(): string { return this._name; }
  set fullName(value: string) { this._name = value; }\``,
        },
        {
          heading: "📖 Módulos e Configuração",
          content: `**Export:**
  \`export interface User { ... }
  export type ID = string;
  export const PI = 3.14;
  export default class App { }\`

**Import:**
  \`import { User, ID } from "./types";
  import App from "./App";
  import type { User } from "./types";  // type-only\`

**tsconfig.json principal:**
  \`{
    "compilerOptions": {
      "target": "ES2020",
      "module": "ESNext",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "outDir": "./dist"
    },
    "include": ["src/**/*"]
  }\`

**strict mode habilita:**
  \`strictNullChecks\` — null/undefined explícitos
  \`noImplicitAny\` — proíbe any implícito
  \`strictFunctionTypes\` — funções type-safe

**Declaration files:**
  \`.d.ts\` — tipos para JS libraries
  \`@types/nome\` — DefinitelyTyped packages`,
        },
      ],
      keyTopics: [
        "type annotations: : type",
        "interface { prop: type }",
        "union: A | B, intersection: A & B",
        "generics: <T>",
        "Partial, Pick, Omit, Record",
        "type guards: is, typeof, instanceof",
        "classes com modifiers",
        "tsconfig.json strict",
      ],
    },

    Go: {
      title: "Go (Golang) - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe Go. Variáveis, funções, structs, interfaces, goroutines e channels.",
      sections: [
        {
          heading: "📖 Variáveis e Tipos",
          content: `**var** — declaração explícita
  \`var nome string = "Ana"
  var idade int
  var x, y int = 10, 20\`

**:=** — short declaration (inferência + declaração)
  \`nome := "Ana"
  x, y := 10, 20\`

**const** — constante
  \`const PI = 3.14159
  const (
      StatusOK = 200
      StatusNotFound = 404
  )\`

**Tipos básicos:**
  \`int, int8, int16, int32, int64\`  // inteiros com sinal
  \`uint, uint8, uint16, uint32, uint64\`  // sem sinal
  \`float32, float64\`  // ponto flutuante
  \`string\`  // UTF-8 imutável
  \`bool\`  // true/false
  \`byte\`  // alias para uint8
  \`rune\`  // alias para int32 (Unicode code point)

**Zero values:**
  int → \`0\`, string → \`""\`, bool → \`false\`, pointer → \`nil\`

**Type conversion:**
  \`float64(intVar)\`
  \`int(floatVar)\`
  \`string(runeVar)\``,
        },
        {
          heading: "📖 Arrays, Slices e Maps",
          content: `**Array** — tamanho fixo
  \`var arr [5]int
  arr := [3]int{1, 2, 3}
  arr := [...]int{1, 2, 3}  // tamanho inferido\`

**Slice** — tamanho dinâmico (mais comum)
  \`nums := []int{1, 2, 3}
  nums := make([]int, 5)      // len=5, cap=5
  nums := make([]int, 0, 10)  // len=0, cap=10\`

**Slice operations:**
  \`len(slice)\`  \`cap(slice)\`
  \`slice[1:3]\`  // sub-slice
  \`append(slice, 4, 5)\`  // adicionar elementos
  \`copy(dst, src)\`

**Map** — hash table
  \`m := make(map[string]int)
  m := map[string]int{"a": 1, "b": 2}
  m["chave"] = 10
  valor := m["chave"]
  valor, ok := m["chave"]  // check existence
  delete(m, "chave")\`

**Range** — iterar
  \`for i, v := range slice { }
  for k, v := range myMap { }
  for i := range slice { }  // só índice
  for _, v := range slice { }  // só valor\``,
        },
        {
          heading: "📖 Funções",
          content: `**func** — declarar função
  \`func soma(a, b int) int {
      return a + b
  }\`

**Múltiplos retornos:**
  \`func divide(a, b int) (int, error) {
      if b == 0 {
          return 0, errors.New("divisão por zero")
      }
      return a / b, nil
  }
  resultado, err := divide(10, 2)\`

**Named returns:**
  \`func split(sum int) (x, y int) {
      x = sum / 2
      y = sum - x
      return  // naked return
  }\`

**Variadic:**
  \`func soma(nums ...int) int {
      total := 0
      for _, n := range nums { total += n }
      return total
  }
  soma(1, 2, 3, 4)\`

**Closures:**
  \`func counter() func() int {
      count := 0
      return func() int {
          count++
          return count
      }
  }\`

**defer** — executa ao sair da função (LIFO)
  \`defer file.Close()
  defer fmt.Println("cleanup")\``,
        },
        {
          heading: "📖 Structs",
          content: `**struct** — agrupar campos
  \`type Pessoa struct {
      Nome  string
      Idade int
  }
  p := Pessoa{Nome: "Ana", Idade: 25}
  p := Pessoa{"Ana", 25}  // ordem dos campos
  p.Nome = "Maria"\`

**Struct anônima:**
  \`p := struct {
      Nome string
      Idade int
  }{"Ana", 25}\`

**Embedded struct** — composição
  \`type Aluno struct {
      Pessoa  // embedded
      Matricula string
  }
  a := Aluno{Pessoa: Pessoa{"Ana", 20}, Matricula: "123"}
  a.Nome  // acessa campo promovido\`

**Methods** — função associada ao tipo
  \`func (p Pessoa) Falar() {
      fmt.Println("Olá, sou", p.Nome)
  }
  func (p *Pessoa) Aniversario() {
      p.Idade++  // pointer receiver para modificar
  }\`

**Constructor pattern:**
  \`func NewPessoa(nome string) *Pessoa {
      return &Pessoa{Nome: nome}
  }\``,
        },
        {
          heading: "📖 Interfaces",
          content: `**interface** — conjunto de métodos (implícita!)
  \`type Animal interface {
      Falar() string
  }
  
  type Cachorro struct{}
  func (c Cachorro) Falar() string { return "Au au" }
  // Cachorro implementa Animal automaticamente\`

**interface{}** — interface vazia (aceita qualquer tipo)
  \`func Print(v interface{}) { fmt.Println(v) }\`

**any** — (Go 1.18+) alias para interface{}
  \`func Print(v any) { fmt.Println(v) }\`

**Type assertion:**
  \`value := i.(string)  // panic se não for string
  value, ok := i.(string)  // safe\`

**Type switch:**
  \`switch v := i.(type) {
  case string:
      fmt.Println("string:", v)
  case int:
      fmt.Println("int:", v)
  default:
      fmt.Println("unknown")
  }\`

**Common interfaces:**
  \`io.Reader\` — Read(p []byte) (n int, err error)
  \`io.Writer\` — Write(p []byte) (n int, err error)
  \`fmt.Stringer\` — String() string
  \`error\` — Error() string`,
        },
        {
          heading: "📖 Error Handling",
          content: `**error** — interface de erro
  \`type error interface {
      Error() string
  }\`

**Criar erro:**
  \`errors.New("mensagem de erro")\`
  \`fmt.Errorf("erro: %v", detalhe)\`

**Padrão de checagem:**
  \`result, err := funcao()
  if err != nil {
      return err  // ou log.Fatal(err)
  }\`

**Wrap errors** — (Go 1.13+)
  \`fmt.Errorf("contexto: %w", err)\`
  \`errors.Is(err, ErrNotFound)\`  // comparar
  \`errors.As(err, &customErr)\`  // converter

**Custom error:**
  \`type MyError struct {
      Code    int
      Message string
  }
  func (e *MyError) Error() string {
      return e.Message
  }\`

**panic/recover:**
  \`panic("erro fatal")  // interrompe execução
  defer func() {
      if r := recover(); r != nil {
          fmt.Println("recovered:", r)
      }
  }()\``,
        },
        {
          heading: "📖 Goroutines",
          content: `**go** — iniciar goroutine (thread leve)
  \`go funcao()
  go func() {
      fmt.Println("async")
  }()\`

**sync.WaitGroup** — aguardar múltiplas goroutines
  \`var wg sync.WaitGroup
  for i := 0; i < 5; i++ {
      wg.Add(1)
      go func(n int) {
          defer wg.Done()
          fmt.Println(n)
      }(i)
  }
  wg.Wait()\`

**sync.Mutex** — exclusão mútua
  \`var mu sync.Mutex
  mu.Lock()
  // seção crítica
  mu.Unlock()\`

**sync.RWMutex** — múltiplos readers, único writer
  \`mu.RLock()  // read lock
  mu.RUnlock()
  mu.Lock()   // write lock\`

**sync.Once** — executar uma única vez
  \`var once sync.Once
  once.Do(func() { initialize() })\``,
        },
        {
          heading: "📖 Channels",
          content: `**make(chan T)** — criar channel
  \`ch := make(chan int)        // unbuffered
  ch := make(chan int, 10)    // buffered (cap 10)\`

**Enviar/Receber:**
  \`ch <- 42      // enviar
  valor := <-ch  // receber
  valor, ok := <-ch  // ok=false se fechado\`

**close** — fechar channel
  \`close(ch)
  for v := range ch { }  // itera até fechar\`

**select** — multiplexar channels
  \`select {
  case v := <-ch1:
      fmt.Println("ch1:", v)
  case ch2 <- valor:
      fmt.Println("enviado para ch2")
  case <-time.After(time.Second):
      fmt.Println("timeout")
  default:
      fmt.Println("nenhum pronto")
  }\`

**Directional channels:**
  \`func send(ch chan<- int) { ch <- 1 }\`  // send-only
  \`func recv(ch <-chan int) { <-ch }\`     // receive-only

**Patterns:**
  Worker pool, fan-in, fan-out, pipeline`,
        },
        {
          heading: "📖 Generics e Context",
          content: `**Generics** — (Go 1.18+)
  \`func Min[T constraints.Ordered](a, b T) T {
      if a < b { return a }
      return b
  }
  Min(3, 5)     // inferido
  Min[int](3, 5)  // explícito\`

**Type constraint:**
  \`type Number interface {
      int | int64 | float64
  }\`

**context.Context** — cancelamento e deadlines
  \`ctx, cancel := context.WithCancel(context.Background())
  defer cancel()

  ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
  ctx, cancel := context.WithDeadline(ctx, time.Now().Add(time.Hour))\`

**Passar context:**
  \`func DoWork(ctx context.Context) error {
      select {
      case <-ctx.Done():
          return ctx.Err()
      case result := <-work:
          return nil
      }
  }\`

**Values em context:**
  \`ctx := context.WithValue(ctx, key, value)
  value := ctx.Value(key)\``,
        },
      ],
      keyTopics: [
        "var, :=, const",
        "slice, map, range",
        "func, defer, multiple returns",
        "struct, methods, embedding",
        "interface (implícita)",
        "error handling (err != nil)",
        "go, goroutines, sync",
        "channels, select",
      ],
    },

    Rust: {
      title: "Rust - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe Rust. Ownership, borrowing, tipos, pattern matching, traits e async.",
      sections: [
        {
          heading: "📖 Variáveis e Tipos",
          content: `**let** — variável imutável (padrão)
  \`let x = 5;\`

**let mut** — variável mutável
  \`let mut x = 5;
  x = 10;\`

**const** — constante (tipo obrigatório)
  \`const MAX_POINTS: u32 = 100_000;\`

**Tipos inteiros:**
  \`i8, i16, i32, i64, i128, isize\`  // com sinal
  \`u8, u16, u32, u64, u128, usize\`  // sem sinal
  \`let x: i32 = 42;\`
  \`let y = 1_000_000u64;\`  // sufixo de tipo

**Tipos flutuantes:**
  \`f32, f64\`
  \`let pi: f64 = 3.14159;\`

**bool:**
  \`let ativo: bool = true;\`

**char** — Unicode scalar value (4 bytes)
  \`let c: char = '🦀';\`

**String:**
  \`String\` — heap-allocated, growable
  \`&str\` — string slice (view)
  \`let s = String::from("Olá");
  let slice: &str = "texto";\`

**Shadowing:**
  \`let x = 5;
  let x = x + 1;  // novo x\``,
        },
        {
          heading: "📖 Ownership e Borrowing",
          content: `**Regras de Ownership:**
  1. Cada valor tem um único owner
  2. Quando owner sai de escopo, valor é dropado
  3. Valores podem ser movidos ou emprestados

**Move:**
  \`let s1 = String::from("hello");
  let s2 = s1;  // s1 movido para s2
  // s1 não pode mais ser usado\`

**Clone:**
  \`let s2 = s1.clone();  // deep copy\`

**Copy types** — tipos copiados automaticamente (stack)
  Inteiros, floats, bool, char, tuples (se elementos são Copy)

**Borrowing** — referências
  \`&T\` — shared reference (read-only, múltiplas)
  \`&mut T\` — mutable reference (única)
  
  \`let s = String::from("hello");
  let len = calculate_length(&s);  // borrow
  
  fn calculate_length(s: &String) -> usize {
      s.len()
  }\`

**Regras de Borrowing:**
  - Múltiplas &T OU uma única &mut T
  - Referências devem ser sempre válidas

**Lifetimes:**
  \`fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
      if x.len() > y.len() { x } else { y }
  }\``,
        },
        {
          heading: "📖 Structs e Enums",
          content: `**struct:**
  \`struct User {
      name: String,
      age: u32,
      active: bool,
  }
  
  let user = User {
      name: String::from("Ana"),
      age: 25,
      active: true,
  };\`

**Struct update syntax:**
  \`let user2 = User { name: String::from("Bob"), ..user };\`

**Tuple struct:**
  \`struct Point(i32, i32);
  let p = Point(10, 20);
  p.0;  p.1;\`

**Unit struct:**
  \`struct Marker;\`

**impl** — implementar métodos
  \`impl User {
      fn new(name: String) -> Self {
          Self { name, age: 0, active: true }
      }
      
      fn greet(&self) {
          println!("Olá, {}", self.name);
      }
      
      fn celebrate_birthday(&mut self) {
          self.age += 1;
      }
  }\`

**enum:**
  \`enum Message {
      Quit,
      Move { x: i32, y: i32 },
      Write(String),
      ChangeColor(i32, i32, i32),
  }\``,
        },
        {
          heading: "📖 Option e Result",
          content: `**Option<T>** — valor opcional (substitui null)
  \`enum Option<T> {
      Some(T),
      None,
  }
  
  let x: Option<i32> = Some(5);
  let y: Option<i32> = None;\`

**Métodos de Option:**
  \`.unwrap()\` — valor ou panic
  \`.unwrap_or(default)\` — valor ou default
  \`.unwrap_or_else(|| compute())\` — lazy default
  \`.expect("msg")\` — valor ou panic com mensagem
  \`.is_some()\` / \`.is_none()\`
  \`.map(|x| x * 2)\` — transformar se Some
  \`.and_then(|x| some_fn(x))\` — flatmap

**Result<T, E>** — sucesso ou erro
  \`enum Result<T, E> {
      Ok(T),
      Err(E),
  }
  
  fn divide(a: i32, b: i32) -> Result<i32, String> {
      if b == 0 {
          Err(String::from("division by zero"))
      } else {
          Ok(a / b)
      }
  }\`

**? operator** — propagar erro
  \`fn read_file() -> Result<String, io::Error> {
      let content = fs::read_to_string("file.txt")?;
      Ok(content)
  }\``,
        },
        {
          heading: "📖 Pattern Matching",
          content: `**match** — exaustivo
  \`match x {
      1 => println!("um"),
      2 | 3 => println!("dois ou três"),
      4..=10 => println!("4 a 10"),
      _ => println!("outro"),
  }\`

**Match com Option:**
  \`match opt {
      Some(x) => println!("valor: {}", x),
      None => println!("nada"),
  }\`

**Match com structs:**
  \`match point {
      Point { x: 0, y } => println!("no eixo y: {}", y),
      Point { x, y: 0 } => println!("no eixo x: {}", x),
      Point { x, y } => println!("({}, {})", x, y),
  }\`

**if let** — match simplificado
  \`if let Some(value) = opt {
      println!("{}", value);
  }\`

**while let:**
  \`while let Some(top) = stack.pop() {
      println!("{}", top);
  }\`

**Guards:**
  \`match x {
      n if n < 0 => println!("negativo"),
      n if n > 0 => println!("positivo"),
      _ => println!("zero"),
  }\`

**@ binding:**
  \`match x {
      n @ 1..=5 => println!("1-5: {}", n),
      _ => (),
  }\``,
        },
        {
          heading: "📖 Traits",
          content: `**trait** — comportamento compartilhado
  \`trait Animal {
      fn sound(&self) -> String;
      
      fn describe(&self) {  // default implementation
          println!("Faz: {}", self.sound());
      }
  }
  
  struct Dog;
  impl Animal for Dog {
      fn sound(&self) -> String {
          String::from("Au au")
      }
  }\`

**Derive traits:**
  \`#[derive(Debug, Clone, PartialEq)]
  struct Point { x: i32, y: i32 }\`

**Common traits:**
  \`Debug\` — {:?} formatting
  \`Clone\` — .clone()
  \`Copy\` — bitwise copy
  \`PartialEq\` / \`Eq\` — igualdade
  \`PartialOrd\` / \`Ord\` — ordenação
  \`Default\` — valor padrão
  \`Display\` — {} formatting

**Trait bounds:**
  \`fn print<T: Debug>(item: T) { }
  fn print<T>(item: T) where T: Debug { }\`

**Multiple bounds:**
  \`fn example<T: Debug + Clone>(item: T) { }\`

**dyn Trait** — trait object (dynamic dispatch)
  \`fn process(animal: &dyn Animal) { }\``,
        },
        {
          heading: "📖 Collections",
          content: `**Vec<T>** — vetor dinâmico
  \`let mut v: Vec<i32> = Vec::new();
  let v = vec![1, 2, 3];
  v.push(4);
  v.pop();
  v[0];
  v.get(0);  // Option<&T>
  v.len();\`

**Iterando:**
  \`for item in &v { }  // borrow
  for item in &mut v { }  // mutable borrow
  for item in v { }  // consume\`

**HashMap<K, V>:**
  \`use std::collections::HashMap;
  let mut map = HashMap::new();
  map.insert("chave", 10);
  map.get("chave");  // Option<&V>
  map.entry("chave").or_insert(0);
  map.contains_key("chave");\`

**HashSet<T>:**
  \`use std::collections::HashSet;
  let mut set = HashSet::new();
  set.insert(1);
  set.contains(&1);\`

**String:**
  \`let mut s = String::new();
  s.push_str("hello");
  s.push('!');
  let s2 = format!("{} {}", s, "world");
  &s[0..5];  // slice (cuidado com UTF-8!)\``,
        },
        {
          heading: "📖 Iterators",
          content: `**Iterator trait:**
  \`trait Iterator {
      type Item;
      fn next(&mut self) -> Option<Self::Item>;
  }\`

**Criar iterador:**
  \`.iter()\` — &T
  \`.iter_mut()\` — &mut T
  \`.into_iter()\` — T (consome)

**Adaptadores (lazy):**
  \`.map(|x| x * 2)\`
  \`.filter(|x| x > &5)\`
  \`.take(n)\`  \`.skip(n)\`
  \`.enumerate()\` — (index, value)
  \`.zip(other_iter)\`
  \`.flatten()\`
  \`.chain(other_iter)\`
  \`.rev()\` (se DoubleEndedIterator)

**Consumidores:**
  \`.collect::<Vec<_>>()\`
  \`.sum::<i32>()\`
  \`.product()\`
  \`.count()\`
  \`.fold(init, |acc, x| acc + x)\`
  \`.find(|x| predicate)\` → Option
  \`.any(|x| predicate)\` → bool
  \`.all(|x| predicate)\` → bool

**Exemplo:**
  \`let sum: i32 = (1..=10)
      .filter(|x| x % 2 == 0)
      .map(|x| x * x)
      .sum();\``,
        },
        {
          heading: "📖 Async e Módulos",
          content: `**async/await:**
  \`async fn fetch_data() -> Result<String, Error> {
      let response = client.get(url).await?;
      let body = response.text().await?;
      Ok(body)
  }\`

**Runtime (tokio/async-std):**
  \`#[tokio::main]
  async fn main() {
      let result = fetch_data().await;
  }\`

**Módulos:**
  \`mod utils;  // arquivo utils.rs ou utils/mod.rs
  pub mod public_module;
  
  mod math {
      pub fn add(a: i32, b: i32) -> i32 { a + b }
  }
  use math::add;\`

**Visibility:**
  \`pub\` — público
  \`pub(crate)\` — visível no crate
  \`pub(super)\` — visível no módulo pai

**Cargo:**
  \`cargo new project\`
  \`cargo build\`
  \`cargo run\`
  \`cargo test\`
  \`cargo add nome_crate\`

**Cargo.toml:**
  \`[dependencies]
  serde = "1.0"
  tokio = { version = "1", features = ["full"] }\``,
        },
      ],
      keyTopics: [
        "let, let mut, const",
        "ownership, move, clone",
        "& (borrow), &mut",
        "struct, enum, impl",
        "Option<T>, Result<T,E>",
        "match, if let, ?",
        "trait, derive, impl for",
        "Vec, HashMap, iterators",
      ],
    },

    Swift: {
      title: "Swift - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe Swift. Tipos, optionals, funções, closures, protocolos e SwiftUI.",
      sections: [
        {
          heading: "📖 Variáveis e Tipos",
          content: `**let** — constante (imutável)
  \`let nome = "Ana"
  let pi: Double = 3.14159\`

**var** — variável (mutável)
  \`var contador = 0
  contador += 1\`

**Tipos básicos:**
  \`Int, Int8, Int16, Int32, Int64\`
  \`UInt, UInt8, UInt16, UInt32, UInt64\`
  \`Float\` (32-bit), \`Double\` (64-bit)
  \`Bool\` — true/false
  \`String\` — Unicode string
  \`Character\` — único caractere

**Type inference:**
  \`let x = 42\`  // Int
  \`let y = 3.14\`  // Double

**Type annotation:**
  \`let idade: Int = 25\`

**String interpolation:**
  \`"Olá, \\(nome)! Você tem \\(idade) anos."\`

**Multiline string:**
  \`"""
  Texto em
  múltiplas linhas
  """\``,
        },
        {
          heading: "📖 Optionals",
          content: `**Optional** — valor pode ser nil
  \`var nome: String? = "Ana"
  var idade: String? = nil\`

**if let** — unwrap seguro
  \`if let n = nome {
      print("Nome: \\(n)")
  }\`

**guard let** — early exit
  \`guard let n = nome else {
      return
  }
  // n disponível aqui\`

**??** — nil coalescing (default value)
  \`let display = nome ?? "Anônimo"\`

**?.** — optional chaining
  \`let tamanho = texto?.count\`  // Int?

**!** — force unwrap (perigoso!)
  \`let n = nome!  // crash se nil\`

**Implicitly unwrapped:**
  \`var valor: String!  // inicializado depois, unwrap automático\`

**Optional binding múltiplo:**
  \`if let a = x, let b = y, a > 0 {
      print(a + b)
  }\`

**map/flatMap em Optional:**
  \`let upper = nome.map { $0.uppercased() }\``,
        },
        {
          heading: "📖 Collections",
          content: `**Array:**
  \`var nums: [Int] = [1, 2, 3]
  var nums = [1, 2, 3]  // inferido
  nums.append(4)
  nums.remove(at: 0)
  nums[0]
  nums.count
  nums.isEmpty\`

**Dictionary:**
  \`var dict: [String: Int] = ["a": 1, "b": 2]
  dict["c"] = 3
  dict["a"]  // Int? (pode ser nil)
  dict.removeValue(forKey: "a")\`

**Set:**
  \`var set: Set<Int> = [1, 2, 3]
  set.insert(4)
  set.contains(2)
  set.remove(1)\`

**Iteração:**
  \`for item in array { }
  for (key, value) in dict { }
  for i in 0..<10 { }  // 0 a 9
  for i in 0...10 { }  // 0 a 10
  array.forEach { print($0) }\`

**Higher-order:**
  \`.map { $0 * 2 }\`
  \`.filter { $0 > 5 }\`
  \`.reduce(0) { $0 + $1 }\`
  \`.compactMap { Int($0) }\`  // remove nils
  \`.flatMap { $0 }\`  // achata arrays`,
        },
        {
          heading: "📖 Funções",
          content: `**func:**
  \`func soma(a: Int, b: Int) -> Int {
      return a + b
  }
  soma(a: 1, b: 2)\`

**Argument labels:**
  \`func greet(to name: String) {
      print("Olá, \\(name)")
  }
  greet(to: "Ana")  // label externo
  
  func greet(_ name: String) { }  // sem label
  greet("Ana")\`

**Default parameters:**
  \`func greet(nome: String = "visitante") { }\`

**Variadic:**
  \`func soma(_ nums: Int...) -> Int {
      nums.reduce(0, +)
  }
  soma(1, 2, 3, 4)\`

**inout** — parâmetro mutável
  \`func incrementar(_ x: inout Int) {
      x += 1
  }
  var n = 5
  incrementar(&n)\`

**Retorno múltiplo (tuple):**
  \`func minMax(_ arr: [Int]) -> (min: Int, max: Int) {
      (arr.min()!, arr.max()!)
  }
  let result = minMax([1,2,3])
  result.min  // 1\``,
        },
        {
          heading: "📖 Closures",
          content: `**Closure expression:**
  \`{ (params) -> ReturnType in
      statements
  }\`

**Exemplos:**
  \`let double = { (x: Int) -> Int in
      return x * 2
  }
  
  let double: (Int) -> Int = { x in x * 2 }
  let double: (Int) -> Int = { $0 * 2 }\`

**Trailing closure:**
  \`nums.sorted { $0 < $1 }
  
  UIView.animate(withDuration: 0.3) {
      view.alpha = 0
  }\`

**@escaping** — closure que escapa da função
  \`func fetch(completion: @escaping (Data) -> Void) { }\`

**Capture list:**
  \`{ [weak self, unowned owner] in
      self?.doSomething()
  }\`

**Shorthand:**
  \`$0, $1, $2\` — argumentos implícitos

**Closure como tipo:**
  \`typealias Handler = (Bool) -> Void
  var completionHandler: Handler?\``,
        },
        {
          heading: "📖 Structs e Classes",
          content: `**struct** — value type (copiado)
  \`struct Point {
      var x: Int
      var y: Int
      
      func distance() -> Double {
          sqrt(Double(x*x + y*y))
      }
      
      mutating func move(dx: Int, dy: Int) {
          x += dx
          y += dy
      }
  }
  var p = Point(x: 0, y: 0)  // memberwise initializer\`

**class** — reference type (referência compartilhada)
  \`class Person {
      var name: String
      
      init(name: String) {
          self.name = name
      }
      
      deinit {
          print("Deallocated")
      }
  }\`

**Propriedades computadas:**
  \`var fullName: String {
      get { "\\(first) \\(last)" }
      set { first = newValue.split(separator: " ").first ?? "" }
  }
  var fullName: String { "\\(first) \\(last)" }  // readonly\`

**Property observers:**
  \`var score: Int = 0 {
      willSet { print("Mudando para \\(newValue)") }
      didSet { print("Mudou de \\(oldValue)") }
  }\`

**lazy:** inicializado no primeiro acesso
  \`lazy var expensive = computeExpensive()\``,
        },
        {
          heading: "📖 Protocols e Extensions",
          content: `**protocol** — define requisitos
  \`protocol Animal {
      var name: String { get }
      func makeSound() -> String
  }
  
  struct Dog: Animal {
      var name: String
      func makeSound() -> String { "Au au" }
  }\`

**Protocol extension** — implementação default
  \`extension Animal {
      func describe() {
          print("\\(name) faz \\(makeSound())")
      }
  }\`

**extension** — adicionar a tipos existentes
  \`extension Int {
      var squared: Int { self * self }
  }
  5.squared  // 25\`

**Common protocols:**
  \`Equatable\` — ==
  \`Hashable\` — usável em Set/Dictionary
  \`Comparable\` — <, >, <=, >=
  \`Codable\` — JSON encoding/decoding
  \`CustomStringConvertible\` — description

**where clause:**
  \`extension Collection where Element: Numeric {
      var total: Element { reduce(0, +) }
  }\``,
        },
        {
          heading: "📖 Error Handling",
          content: `**Error protocol:**
  \`enum NetworkError: Error {
      case offline
      case timeout
      case invalidURL
  }\`

**throw:**
  \`func fetch(url: String) throws -> Data {
      guard isValid(url) else {
          throw NetworkError.invalidURL
      }
      return Data()
  }\`

**do-try-catch:**
  \`do {
      let data = try fetch(url: "...")
      process(data)
  } catch NetworkError.offline {
      print("Sem conexão")
  } catch {
      print("Erro: \\(error)")
  }\`

**try?** — retorna nil se erro
  \`let data = try? fetch(url: "...")\`

**try!** — crash se erro (evitar!)
  \`let data = try! fetch(url: "...")\`

**throws / rethrows:**
  \`func perform(action: () throws -> Void) rethrows {
      try action()
  }\`

**Result type:**
  \`func fetch() -> Result<Data, Error> {
      .success(Data()) // ou .failure(error)
  }
  switch fetch() {
      case .success(let data): process(data)
      case .failure(let error): handle(error)
  }\``,
        },
        {
          heading: "📖 Async/Await e SwiftUI",
          content: `**async/await** — (Swift 5.5+)
  \`func fetchData() async throws -> Data {
      let (data, _) = try await URLSession.shared.data(from: url)
      return data
  }
  
  Task {
      let data = try await fetchData()
  }\`

**async let** — concurrent binding
  \`async let a = fetchA()
  async let b = fetchB()
  let results = await (a, b)\`

**Actor** — type-safe concurrency
  \`actor Counter {
      var value = 0
      func increment() { value += 1 }
  }\`

**SwiftUI:**
  \`struct ContentView: View {
      @State private var count = 0
      
      var body: some View {
          VStack {
              Text("Count: \\(count)")
              Button("Increment") {
                  count += 1
              }
          }
      }
  }\`

**Property wrappers:**
  \`@State\` — estado local
  \`@Binding\` — referência a estado externo
  \`@ObservedObject\` — objeto observável
  \`@EnvironmentObject\` — injeção de dependência
  \`@Published\` — publica mudanças`,
        },
      ],
      keyTopics: [
        "let/var, type inference",
        "Optional: ?, if let, guard let, ??",
        "Array, Dictionary, Set",
        "func, argument labels, inout",
        "closure: { }, $0, trailing",
        "struct (value) vs class (ref)",
        "protocol, extension",
        "async/await, SwiftUI",
      ],
    },

    Kotlin: {
      title: "Kotlin - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe Kotlin. Tipos, null safety, classes, collections, coroutines e Android.",
      sections: [
        {
          heading: "📖 Variáveis e Tipos",
          content: `**val** — constante (imutável, read-only)
  \`val nome = "Ana"
  val pi: Double = 3.14159\`

**var** — variável (mutável)
  \`var contador = 0
  contador += 1\`

**Tipos básicos:**
  \`Byte, Short, Int, Long\`
  \`Float, Double\`
  \`Boolean\` — true/false
  \`Char\` — caractere
  \`String\` — texto

**Type inference:**
  \`val x = 42\`  // Int
  \`val y = 3.14\`  // Double

**Explicit type:**
  \`val idade: Int = 25\`

**String templates:**
  \`"Olá, $nome!"\`
  \`"Soma: \${a + b}"\`

**Multiline string:**
  \`"""
  Texto em
  múltiplas linhas
  """.trimIndent()\`

**Conversões (não automáticas):**
  \`val l: Long = i.toLong()
  val s: String = n.toString()\``,
        },
        {
          heading: "📖 Null Safety",
          content: `**Nullable vs Non-null:**
  \`var nome: String = "Ana"  // nunca null
  var nome: String? = null   // pode ser null\`

**?.** — safe call
  \`nome?.length  // Int? (null se nome for null)
  nome?.toUpperCase()?.length\`

**?:** — elvis operator (default se null)
  \`val len = nome?.length ?: 0\`

**!!** — not-null assertion (crash se null!)
  \`val len = nome!!.length  // EVITAR\`

**let** — executar se não null
  \`nome?.let {
      println("Nome: $it")
  }\`

**Safe cast:**
  \`val x: String? = y as? String  // null se cast falhar\`

**Platform types:**
  \`String!\` — tipo de Java (nullability desconhecida)

**lateinit** — inicialização tardia (non-null)
  \`lateinit var adapter: Adapter
  // atribuir antes de usar!\`

**lazy** — inicialização preguiçosa
  \`val expensive by lazy { computeExpensive() }\``,
        },
        {
          heading: "📖 Funções",
          content: `**fun:**
  \`fun soma(a: Int, b: Int): Int {
      return a + b
  }\`

**Single-expression:**
  \`fun soma(a: Int, b: Int) = a + b\`

**Default parameters:**
  \`fun greet(nome: String = "visitante") {
      println("Olá, $nome")
  }\`

**Named arguments:**
  \`greet(nome = "Ana")\`

**Vararg:**
  \`fun soma(vararg nums: Int): Int = nums.sum()
  soma(1, 2, 3, 4)\`

**Unit** — equivale a void
  \`fun log(msg: String): Unit { println(msg) }\`
  \`fun log(msg: String) { println(msg) }  // Unit implícito\`

**Nothing** — nunca retorna
  \`fun fail(): Nothing = throw Exception()\`

**Extension functions:**
  \`fun String.addExclamation() = this + "!"
  "Hello".addExclamation()  // "Hello!"\`

**Infix:**
  \`infix fun Int.plus(x: Int) = this + x
  5 plus 3  // 8\`

**Higher-order:**
  \`fun operate(a: Int, b: Int, op: (Int, Int) -> Int): Int {
      return op(a, b)
  }\``,
        },
        {
          heading: "📖 Control Flow",
          content: `**if** — é expressão (retorna valor)
  \`val max = if (a > b) a else b\`

**when** — switch aprimorado
  \`when (x) {
      1 -> println("um")
      2, 3 -> println("dois ou três")
      in 4..10 -> println("4 a 10")
      !in 11..20 -> println("fora de 11-20")
      is String -> println("é string")
      else -> println("outro")
  }
  
  val result = when {
      x > 0 -> "positivo"
      x < 0 -> "negativo"
      else -> "zero"
  }\`

**for:**
  \`for (i in 1..10) { }  // 1 a 10
  for (i in 1 until 10) { }  // 1 a 9
  for (i in 10 downTo 1) { }  // 10 a 1
  for (i in 1..10 step 2) { }  // 1, 3, 5, 7, 9
  for (item in list) { }
  for ((index, item) in list.withIndex()) { }\`

**while / do-while:**
  \`while (cond) { }
  do { } while (cond)\`

**return, break, continue:**
  \`break@loop\`  // label para loops aninhados`,
        },
        {
          heading: "📖 Classes e Objetos",
          content: `**class:**
  \`class Person(val name: String, var age: Int) {
      init { println("Criado: $name") }
      fun greet() = println("Olá, sou $name")
  }
  val p = Person("Ana", 25)\`

**Secondary constructor:**
  \`class Person {
      constructor(name: String) { }
  }\`

**data class** — equals, hashCode, toString, copy
  \`data class User(val name: String, val age: Int)
  val u2 = u1.copy(age = 26)\`

**object** — singleton
  \`object Database {
      fun connect() { }
  }
  Database.connect()\`

**companion object** — membros estáticos
  \`class User {
      companion object {
          fun create(): User = User()
      }
  }
  User.create()\`

**enum:**
  \`enum class Status { PENDING, SUCCESS, ERROR }
  Status.SUCCESS\`

**sealed class** — hierarquia fechada
  \`sealed class Result
  data class Success(val data: String) : Result()
  data class Error(val msg: String) : Result()\``,
        },
        {
          heading: "📖 Herança e Interfaces",
          content: `**open** — permite herança (classes são final por padrão)
  \`open class Animal {
      open fun sound() = "..."
  }
  class Dog : Animal() {
      override fun sound() = "Au au"
  }\`

**abstract:**
  \`abstract class Shape {
      abstract fun area(): Double
  }\`

**interface:**
  \`interface Clickable {
      fun click()
      fun description() = "Clickable"  // default
  }
  class Button : Clickable {
      override fun click() { }
  }\`

**Múltiplas interfaces:**
  \`class SmartButton : Clickable, Focusable { }\`

**super:**
  \`super.sound()
  super<InterfaceA>.method()\`

**Visibility:**
  \`public\` — padrão, visível em todo lugar
  \`private\` — apenas na classe/arquivo
  \`protected\` — classe e subclasses
  \`internal\` — mesmo módulo`,
        },
        {
          heading: "📖 Collections",
          content: `**Imutáveis:**
  \`val list = listOf(1, 2, 3)
  val set = setOf(1, 2, 3)
  val map = mapOf("a" to 1, "b" to 2)\`

**Mutáveis:**
  \`val list = mutableListOf(1, 2, 3)
  list.add(4)
  list.removeAt(0)
  
  val map = mutableMapOf("a" to 1)
  map["b"] = 2\`

**Acesso:**
  \`list[0]  list.first()  list.last()
  map["a"]  map.getOrDefault("c", 0)\`

**Operações funcionais:**
  \`.filter { it > 5 }\`
  \`.map { it * 2 }\`
  \`.flatMap { it.toList() }\`
  \`.forEach { println(it) }\`
  \`.reduce { acc, x -> acc + x }\`
  \`.fold(0) { acc, x -> acc + x }\`
  \`.find { it > 5 }\`  // primeiro ou null
  \`.any { it > 5 }\`  // algum satisfaz?
  \`.all { it > 0 }\`  // todos satisfazem?
  \`.count { it > 5 }\`
  \`.sortedBy { it.name }\`
  \`.groupBy { it.category }\`

**Sequence** — lazy
  \`list.asSequence().filter { }.map { }.toList()\``,
        },
        {
          heading: "📖 Lambdas e Scope Functions",
          content: `**Lambda:**
  \`val sum = { a: Int, b: Int -> a + b }
  sum(1, 2)\`

**it** — parâmetro implícito
  \`list.filter { it > 5 }\`

**Trailing lambda:**
  \`list.forEach { println(it) }\`

**Scope functions:**

**let** — transforma e retorna resultado
  \`val len = str?.let { it.length } ?: 0\`

**run** — executa bloco, retorna resultado
  \`val result = service.run { fetchData() }\`

**with** — executa no contexto do objeto
  \`with(person) {
      println(name)
      println(age)
  }\`

**apply** — configura objeto, retorna objeto
  \`val p = Person().apply {
      name = "Ana"
      age = 25
  }\`

**also** — executa side effect, retorna objeto
  \`list.also { println("Size: \${it.size}") }\`

**Referência de função:**
  \`list.forEach(::println)
  list.filter(String::isNotEmpty)\``,
        },
        {
          heading: "📖 Coroutines",
          content: `**suspend** — função que pode suspender
  \`suspend fun fetchData(): Data {
      delay(1000)
      return Data()
  }\`

**launch** — fire-and-forget (Job)
  \`lifecycleScope.launch {
      val data = fetchData()
      updateUI(data)
  }\`

**async/await** — retorna resultado
  \`val deferred = async { fetchData() }
  val result = deferred.await()\`

**Concurrent:**
  \`val a = async { fetchA() }
  val b = async { fetchB() }
  process(a.await(), b.await())\`

**Dispatchers:**
  \`Dispatchers.Main\` — UI thread
  \`Dispatchers.IO\` — I/O operations
  \`Dispatchers.Default\` — CPU-intensive

**withContext:**
  \`withContext(Dispatchers.IO) {
      // código IO
  }\`

**Flow** — stream de dados
  \`fun getItems(): Flow<Item> = flow {
      items.forEach {
          emit(it)
          delay(100)
      }
  }
  
  getItems().collect { item -> process(item) }\`

**CoroutineScope:**
  \`coroutineScope { }  // structured concurrency
  supervisorScope { }  // erros não propagam\``,
        },
      ],
      keyTopics: [
        "val/var, type inference",
        "null safety: ?. ?: !! let",
        "fun, extension functions",
        "when expression",
        "class, data class, object",
        "sealed class, enum",
        "List, Map, filter/map",
        "suspend, launch, async, Flow",
      ],
    },

    Dart: {
      title: "Dart - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe Dart. Tipos, null safety, classes, async, streams e Flutter.",
      sections: [
        {
          heading: "📖 Variáveis e Tipos",
          content: `**var** — tipo inferido
  \`var nome = "Ana";  // String inferido
  var idade = 25;     // int inferido\`

**Tipo explícito:**
  \`String nome = "Ana";
  int idade = 25;\`

**final** — atribuição única (runtime)
  \`final nome = "Ana";
  final DateTime agora = DateTime.now();\`

**const** — constante em tempo de compilação
  \`const pi = 3.14159;
  const lista = [1, 2, 3];  // lista imutável\`

**Tipos básicos:**
  \`int\` — inteiro 64-bit
  \`double\` — ponto flutuante 64-bit
  \`num\` — int ou double
  \`String\` — texto UTF-16
  \`bool\` — true/false
  \`dynamic\` — qualquer tipo (evitar!)

**String interpolation:**
  \`"Olá, $nome!"\`
  \`"Soma: \${a + b}"\`

**Multiline:**
  \`'''
  Texto em
  múltiplas linhas
  '''\`

**Type check/cast:**
  \`x is String\`  // verificar
  \`x as String\`  // cast\``,
        },
        {
          heading: "📖 Null Safety",
          content: `**Non-nullable por padrão:**
  \`String nome = "Ana";  // nunca null
  int idade = 25;\`

**Nullable:**
  \`String? nome;  // pode ser null
  int? idade = null;\`

**?.** — null-aware access
  \`nome?.length  // int? (null se nome for null)
  pessoa?.endereco?.cidade\`

**??** — if-null operator (default)
  \`final display = nome ?? "Anônimo";\`

**??=** — assign if null
  \`nome ??= "Padrão";\`

**!** — null assertion (crash se null!)
  \`final len = nome!.length;  // use com cuidado\`

**late** — inicialização tardia
  \`late String nome;  // atribuir antes de usar
  late final computed = expensiveCompute();  // lazy\`

**Null checking:**
  \`if (nome != null) {
      print(nome.length);  // promovido para non-null
  }
  
  final n = nome;
  if (n != null) { print(n.length); }\``,
        },
        {
          heading: "📖 Collections",
          content: `**List:**
  \`var lista = <int>[1, 2, 3];
  List<int> nums = [1, 2, 3];
  lista.add(4);
  lista.addAll([5, 6]);
  lista.remove(2);
  lista.removeAt(0);
  lista[0];
  lista.length;\`

**List spread operator:**
  \`var combined = [...lista1, ...lista2];\`

**Collection if/for:**
  \`[1, 2, if (addThree) 3]\`
  \`[for (var i = 0; i < 5; i++) i * 2]\`

**Set:**
  \`var set = <String>{"a", "b", "c"};
  set.add("d");
  set.contains("a");
  set.remove("a");\`

**Map:**
  \`var map = <String, int>{"a": 1, "b": 2};
  map["c"] = 3;
  map["a"];  // int? (pode ser null)
  map.containsKey("a");
  map.remove("a");
  map.keys;  map.values;  map.entries;\`

**Iteração:**
  \`for (var item in lista) { }
  for (var entry in map.entries) {
      print("\${entry.key}: \${entry.value}");
  }
  lista.forEach((item) => print(item));\``,
        },
        {
          heading: "📖 Funções",
          content: `**Função:**
  \`int soma(int a, int b) {
      return a + b;
  }\`

**Arrow function:**
  \`int soma(int a, int b) => a + b;\`

**Positional optional:**
  \`void greet(String nome, [String? msg]) {
      print("Olá, $nome! \${msg ?? ''}");
  }
  greet("Ana");
  greet("Ana", "Bem-vinda");\`

**Named parameters:**
  \`void greet({required String nome, int idade = 0}) {
      print("$nome, $idade");
  }
  greet(nome: "Ana", idade: 25);\`

**Default values:**
  \`void greet({String nome = "visitante"}) { }\`

**First-class functions:**
  \`var fn = (int x) => x * 2;
  var fn = multiply;  // function reference\`

**Anonymous function:**
  \`lista.forEach((item) {
      print(item);
  });
  lista.map((x) => x * 2);\`

**Closure:**
  \`Function makeAdder(int n) {
      return (int x) => x + n;
  }
  var add5 = makeAdder(5);\``,
        },
        {
          heading: "📖 Classes",
          content: `**class:**
  \`class Person {
      String name;
      int age;
      
      Person(this.name, this.age);  // shorthand
      
      void greet() {
          print("Olá, sou $name");
      }
  }
  var p = Person("Ana", 25);\`

**Named constructor:**
  \`class Point {
      double x, y;
      Point(this.x, this.y);
      Point.origin() : x = 0, y = 0;
      Point.fromJson(Map<String, double> json)
          : x = json['x']!, y = json['y']!;
  }\`

**Getters/Setters:**
  \`class Rectangle {
      double width, height;
      Rectangle(this.width, this.height);
      double get area => width * height;
      set size(double s) { width = height = s; }
  }\`

**Static:**
  \`class Math {
      static const pi = 3.14159;
      static double square(double x) => x * x;
  }
  Math.pi;  Math.square(5);\`

**Factory:**
  \`class Logger {
      static final _instance = Logger._internal();
      factory Logger() => _instance;
      Logger._internal();
  }\``,
        },
        {
          heading: "📖 Herança e Interfaces",
          content: `**extends:**
  \`class Animal {
      void speak() => print("...");
  }
  class Dog extends Animal {
      @override
      void speak() => print("Au au");
  }\`

**super:**
  \`class Student extends Person {
      String school;
      Student(String name, int age, this.school) : super(name, age);
  }\`

**abstract:**
  \`abstract class Shape {
      double area();  // método abstrato
  }
  class Circle extends Shape {
      double radius;
      Circle(this.radius);
      @override
      double area() => 3.14159 * radius * radius;
  }\`

**Implicit interface** — toda classe é uma interface
  \`class MockDatabase implements Database { ... }\`

**Mixin:**
  \`mixin Swimmer {
      void swim() => print("Nadando");
  }
  mixin Flyer {
      void fly() => print("Voando");
  }
  class Duck extends Animal with Swimmer, Flyer { }\`

**Extension methods:**
  \`extension StringExtensions on String {
      String get reversed => split('').reversed.join();
  }
  "hello".reversed;  // "olleh"\``,
        },
        {
          heading: "📖 Async/Await",
          content: `**Future<T>** — operação assíncrona
  \`Future<String> fetchData() async {
      await Future.delayed(Duration(seconds: 1));
      return "dados";
  }\`

**async/await:**
  \`void main() async {
      var data = await fetchData();
      print(data);
  }\`

**then/catchError:**
  \`fetchData()
      .then((data) => print(data))
      .catchError((e) => print("Erro: $e"));\`

**Future.wait:**
  \`var results = await Future.wait([future1, future2]);\`

**FutureBuilder (Flutter):**
  \`FutureBuilder<String>(
      future: fetchData(),
      builder: (context, snapshot) {
          if (snapshot.hasData) return Text(snapshot.data!);
          return CircularProgressIndicator();
      },
  )\`

**Errors:**
  \`try {
      await riskyOperation();
  } catch (e) {
      print("Erro: $e");
  } finally {
      cleanup();
  }\``,
        },
        {
          heading: "📖 Streams",
          content: `**Stream<T>** — sequência assíncrona de eventos
  \`Stream<int> countStream() async* {
      for (int i = 1; i <= 5; i++) {
          await Future.delayed(Duration(seconds: 1));
          yield i;
      }
  }\`

**await for:**
  \`await for (var value in countStream()) {
      print(value);
  }\`

**listen:**
  \`stream.listen(
      (data) => print(data),
      onError: (e) => print("Erro: $e"),
      onDone: () => print("Fim"),
  );\`

**Stream transformations:**
  \`stream.map((x) => x * 2)\`
  \`stream.where((x) => x > 5)\`
  \`stream.take(3)\`
  \`stream.distinct()\`

**StreamController:**
  \`final controller = StreamController<int>();
  controller.sink.add(1);
  controller.stream.listen((data) => print(data));
  controller.close();\`

**StreamBuilder (Flutter):**
  \`StreamBuilder<int>(
      stream: countStream(),
      builder: (context, snapshot) {
          return Text("\${snapshot.data}");
      },
  )\``,
        },
        {
          heading: "📖 Flutter Essentials",
          content: `**StatelessWidget:**
  \`class MyWidget extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
          return Text("Olá");
      }
  }\`

**StatefulWidget:**
  \`class Counter extends StatefulWidget {
      @override
      State<Counter> createState() => _CounterState();
  }
  class _CounterState extends State<Counter> {
      int count = 0;
      @override
      Widget build(BuildContext context) {
          return ElevatedButton(
              onPressed: () => setState(() => count++),
              child: Text("Count: $count"),
          );
      }
  }\`

**Common widgets:**
  \`Container\` \`Row\` \`Column\` \`Stack\`
  \`Text\` \`Image\` \`Icon\`
  \`ElevatedButton\` \`TextField\`
  \`ListView\` \`GridView\`
  \`Scaffold\` \`AppBar\`

**Layouts:**
  \`padding:\` \`margin:\`
  \`Expanded\` \`Flexible\`
  \`SizedBox\` \`Spacer\`

**pubspec.yaml:**
  \`dependencies:
      flutter:
          sdk: flutter
      http: ^0.13.0\``,
        },
      ],
      keyTopics: [
        "var, final, const",
        "null safety: ?. ?? ??= !",
        "List, Set, Map, spread",
        "=> arrow, named params",
        "class, mixin, extension",
        "async/await, Future<T>",
        "Stream, yield, listen",
        "StatelessWidget, StatefulWidget",
      ],
    },

    PHP: {
      title: "PHP - Dicionário de Comandos",
      introduction:
        "Referência completa de sintaxe PHP. Variáveis, arrays, OOP, namespaces e frameworks.",
      sections: [
        {
          heading: "📖 Variáveis e Tipos",
          content: `**Variável** — prefixo $
  \`$nome = "Ana";
  $idade = 25;
  $preco = 19.99;
  $ativo = true;\`

**Constante:**
  \`const PI = 3.14159;
  define('MAX_SIZE', 100);\`

**Tipos:**
  \`string, int, float, bool\`
  \`array, object, null\`
  \`resource, callable\`

**Type hints** (PHP 7+):
  \`function soma(int $a, int $b): int {
      return $a + $b;
  }\`

**Strict types:**
  \`<?php declare(strict_types=1);\`

**Type casting:**
  \`$str = (string) $num;
  $int = (int) "42";
  $arr = (array) $obj;\`

**Verificar tipo:**
  \`is_string($x)\`  \`is_int($x)\`  \`is_array($x)\`
  \`gettype($x)\`
  \`var_dump($x)\`  // debug completo

**String interpolation:**
  \`"Olá, $nome!"\`
  \`"Olá, {$array['nome']}!"\``,
        },
        {
          heading: "📖 Strings",
          content: `**Aspas duplas** — interpola variáveis
  \`"Olá, $nome"\`

**Aspas simples** — literal
  \`'Sem $interpolação'\`

**Heredoc/Nowdoc:**
  \`$texto = <<<EOT
  Texto com $variavel
  EOT;
  
  $texto = <<<'EOT'
  Texto literal sem $interpolação
  EOT;\`

**Funções de string:**
  \`strlen($s)\` — tamanho
  \`strtoupper($s)\` / \`strtolower($s)\`
  \`trim($s)\` / \`ltrim($s)\` / \`rtrim($s)\`
  \`substr($s, 0, 5)\` — substring
  \`str_replace("a", "b", $s)\`
  \`explode(",", $s)\` — string → array
  \`implode(",", $arr)\` — array → string
  \`sprintf("Nome: %s, Idade: %d", $nome, $idade)\`
  \`strpos($s, "sub")\` — posição (false se não encontrar)
  \`str_contains($s, "sub")\` — (PHP 8+)
  \`str_starts_with($s, "pre")\` — (PHP 8+)
  \`str_ends_with($s, "suf")\` — (PHP 8+)`,
        },
        {
          heading: "📖 Arrays",
          content: `**Indexed array:**
  \`$nums = [1, 2, 3];
  $nums = array(1, 2, 3);
  $nums[] = 4;  // append
  $nums[0];     // acesso\`

**Associative array:**
  \`$user = [
      "nome" => "Ana",
      "idade" => 25
  ];
  $user["email"] = "ana@email.com";\`

**Funções de array:**
  \`count($arr)\` — tamanho
  \`array_push($arr, $val)\`
  \`array_pop($arr)\`
  \`array_shift($arr)\` — remove primeiro
  \`array_unshift($arr, $val)\` — adiciona início
  \`array_merge($arr1, $arr2)\`
  \`in_array($val, $arr)\`
  \`array_key_exists("chave", $arr)\`
  \`array_keys($arr)\`  \`array_values($arr)\`
  \`array_map(fn($x) => $x * 2, $arr)\`
  \`array_filter($arr, fn($x) => $x > 5)\`
  \`array_reduce($arr, fn($acc, $x) => $acc + $x, 0)\`
  \`usort($arr, fn($a, $b) => $a <=> $b)\`

**Iteração:**
  \`foreach ($arr as $item) { }
  foreach ($arr as $key => $value) { }\``,
        },
        {
          heading: "📖 Controle de Fluxo",
          content: `**if/elseif/else:**
  \`if ($x > 0) {
      echo "positivo";
  } elseif ($x < 0) {
      echo "negativo";
  } else {
      echo "zero";
  }\`

**Ternary:**
  \`$result = $x > 0 ? "pos" : "não pos";\`

**Null coalescing:**
  \`$nome = $input ?? "Anônimo";\`
  \`$nome ??= "Padrão";\`  // assign if null

**Nullsafe** (PHP 8+):
  \`$cidade = $user?->endereco?->cidade;\`

**match** (PHP 8+):
  \`$result = match($status) {
      "ok", "success" => "Sucesso",
      "error" => "Erro",
      default => "Desconhecido"
  };\`

**switch:**
  \`switch ($valor) {
      case 1: echo "um"; break;
      case 2: echo "dois"; break;
      default: echo "outro";
  }\`

**for/while:**
  \`for ($i = 0; $i < 10; $i++) { }
  while ($cond) { }
  do { } while ($cond);\``,
        },
        {
          heading: "📖 Funções",
          content: `**function:**
  \`function soma(int $a, int $b): int {
      return $a + $b;
  }\`

**Default parameters:**
  \`function greet(string $nome = "visitante"): void {
      echo "Olá, $nome!";
  }\`

**Variadic:**
  \`function soma(...$nums): int {
      return array_sum($nums);
  }
  soma(1, 2, 3, 4);\`

**Named arguments** (PHP 8+):
  \`greet(nome: "Ana");\`

**Arrow function** (PHP 7.4+):
  \`$double = fn($x) => $x * 2;\`

**Anonymous function/Closure:**
  \`$greet = function($nome) {
      return "Olá, $nome!";
  };
  $greet("Ana");\`

**use** — capturar variáveis externas
  \`$prefix = "Sr.";
  $greet = function($nome) use ($prefix) {
      return "$prefix $nome";
  };\`

**Nullable types:**
  \`function find(int $id): ?User {
      return $user ?? null;
  }\`

**Union types** (PHP 8+):
  \`function process(int|string $input): void { }\``,
        },
        {
          heading: "📖 Classes e OOP",
          content: `**class:**
  \`class User {
      public string $name;
      private int $age;
      
      public function __construct(string $name, int $age) {
          $this->name = $name;
          $this->age = $age;
      }
      
      public function greet(): string {
          return "Olá, {$this->name}!";
      }
  }
  $user = new User("Ana", 25);\`

**Constructor promotion** (PHP 8+):
  \`class User {
      public function __construct(
          public string $name,
          private int $age = 0
      ) {}
  }\`

**Visibility:**
  \`public\` — acessível de qualquer lugar
  \`protected\` — classe e subclasses
  \`private\` — apenas na classe

**Static:**
  \`class Counter {
      public static int $count = 0;
      public static function increment(): void {
          self::$count++;
      }
  }
  Counter::increment();\`

**Readonly** (PHP 8.1+):
  \`public readonly string $id;\``,
        },
        {
          heading: "📖 Herança e Interfaces",
          content: `**extends:**
  \`class Admin extends User {
      public function __construct(
          string $name,
          public string $role
      ) {
          parent::__construct($name, 0);
      }
  }\`

**abstract:**
  \`abstract class Shape {
      abstract public function area(): float;
  }\`

**interface:**
  \`interface Printable {
      public function print(): void;
  }
  class Report implements Printable {
      public function print(): void { }
  }\`

**trait** — reutilização horizontal
  \`trait Timestampable {
      public DateTime $createdAt;
      public function touch(): void {
          $this->createdAt = new DateTime();
      }
  }
  class Post {
      use Timestampable;
  }\`

**final:**
  \`final class CannotExtend { }
  final public function cannotOverride() { }\`

**late static binding:**
  \`static::method()\` vs \`self::method()\``,
        },
        {
          heading: "📖 Namespaces e Autoloading",
          content: `**namespace:**
  \`<?php
  namespace App\\Models;
  
  class User { }\`

**use:**
  \`use App\\Models\\User;
  use App\\Services\\Auth as AuthService;
  use function App\\Helpers\\format_date;
  use const App\\Config\\MAX_SIZE;\`

**Classe acessível:**
  \`$user = new \\App\\Models\\User();
  $user = new User();  // com use\`

**PSR-4 autoloading (composer.json):**
  \`{
      "autoload": {
          "psr-4": {
              "App\\\\": "src/"
          }
      }
  }\`

**Composer:**
  \`composer init\`
  \`composer require vendor/package\`
  \`composer install\`
  \`composer dump-autoload\`

**Usar autoload:**
  \`<?php
  require_once 'vendor/autoload.php';\``,
        },
        {
          heading: "📖 PHP 8 Features",
          content: `**Attributes:**
  \`#[Route('/api/users')]
  #[Deprecated("Use newMethod()")]
  class UserController { }\`

**Named arguments:**
  \`function greet(string $nome, string $msg = "Olá") { }
  greet(msg: "Oi", nome: "Ana");\`

**Match expression:**
  \`$tipo = match($status) {
      200, 201 => "success",
      404 => "not found",
      default => "error"
  };\`

**Nullsafe operator:**
  \`$cidade = $user?->endereco?->cidade;\`

**Constructor promotion:**
  \`public function __construct(
      public string $name,
      private int $age
  ) {}\`

**Union types:**
  \`function process(int|float|string $value): void { }\`

**throw expression:**
  \`$value = $input ?? throw new Exception("Required");\`

**Enums** (PHP 8.1+):
  \`enum Status: string {
      case Pending = 'pending';
      case Active = 'active';
      case Closed = 'closed';
  }\`

**Fibers** (PHP 8.1+):
  \`$fiber = new Fiber(function() {
      Fiber::suspend('paused');
  });\``,
        },
      ],
      keyTopics: [
        "$ variables, const",
        "arrays: [], =>",
        "foreach, match, ??",
        "function, fn =>, use",
        "class, public/private",
        "interface, trait, abstract",
        "namespace, use, composer",
        "PHP 8: attributes, match, ?->",
      ],
    },

    SQL: {
      title: "SQL - Dicionário de Comandos",
      introduction:
        "Referência completa de SQL. DDL, DML, DQL, JOINs, aggregates e otimização.",
      sections: [
        {
          heading: "📖 SELECT - Consultas",
          content: `**SELECT** — consulta dados
  \`SELECT nome, email FROM usuarios;\`
  \`SELECT * FROM produtos WHERE preco > 100;\`

**DISTINCT** — valores únicos
  \`SELECT DISTINCT categoria FROM produtos;\`

**AS** — alias
  \`SELECT nome AS usuario, preco * 1.1 AS preco_com_taxas
  FROM produtos;\`

**WHERE** — filtro
  \`SELECT * FROM usuarios
  WHERE idade >= 18 AND cidade = 'SP';\`

**Operadores:**
  \`=, <>, !=, >, <, >=, <=\`
  \`AND, OR, NOT\`
  \`BETWEEN 10 AND 20\`
  \`IN ('SP', 'RJ', 'MG')\`
  \`LIKE '%padrão%'\`  // % = qualquer; _ = um char
  \`IS NULL, IS NOT NULL\`

**ORDER BY** — ordenar
  \`SELECT * FROM produtos
  ORDER BY preco DESC, nome ASC;\`

**LIMIT / OFFSET** — paginação
  \`SELECT * FROM produtos
  LIMIT 10 OFFSET 20;  -- página 3\``,
        },
        {
          heading: "📖 INSERT, UPDATE, DELETE",
          content: `**INSERT** — inserir registro
  \`INSERT INTO usuarios (nome, email)
  VALUES ('Ana', 'ana@email.com');\`

**Múltiplos valores:**
  \`INSERT INTO usuarios (nome, email) VALUES
  ('Ana', 'ana@email.com'),
  ('Bob', 'bob@email.com');\`

**INSERT com SELECT:**
  \`INSERT INTO backup_users (nome, email)
  SELECT nome, email FROM usuarios
  WHERE ativo = true;\`

**UPDATE** — atualizar registros
  \`UPDATE usuarios
  SET nome = 'Ana Silva', atualizado_em = NOW()
  WHERE id = 1;\`

**UPDATE múltiplas colunas:**
  \`UPDATE produtos
  SET preco = preco * 1.1, estoque = 0
  WHERE categoria = 'promoção';\`

**DELETE** — excluir registros
  \`DELETE FROM usuarios WHERE id = 1;\`

**TRUNCATE** — limpar tabela (mais rápido)
  \`TRUNCATE TABLE logs;\`

⚠️ **CUIDADO:** UPDATE e DELETE sem WHERE afetam TODOS os registros!`,
        },
        {
          heading: "📖 JOINs",
          content: `**INNER JOIN** — registros com match em ambas
  \`SELECT u.nome, p.titulo
  FROM usuarios u
  INNER JOIN posts p ON u.id = p.user_id;\`

**LEFT JOIN** — todos da esquerda + matches
  \`SELECT u.nome, COUNT(p.id) as total_posts
  FROM usuarios u
  LEFT JOIN posts p ON u.id = p.user_id
  GROUP BY u.id;\`

**RIGHT JOIN** — todos da direita + matches
  \`SELECT p.titulo, u.nome
  FROM posts p
  RIGHT JOIN usuarios u ON p.user_id = u.id;\`

**FULL OUTER JOIN** — todos de ambas
  \`SELECT *
  FROM tabela_a a
  FULL OUTER JOIN tabela_b b ON a.id = b.a_id;\`

**CROSS JOIN** — produto cartesiano
  \`SELECT * FROM cores CROSS JOIN tamanhos;\`

**Self JOIN:**
  \`SELECT e.nome, g.nome AS gerente
  FROM funcionarios e
  LEFT JOIN funcionarios g ON e.gerente_id = g.id;\`

**Múltiplos JOINs:**
  \`SELECT u.nome, p.titulo, c.texto
  FROM usuarios u
  JOIN posts p ON u.id = p.user_id
  JOIN comentarios c ON p.id = c.post_id;\``,
        },
        {
          heading: "📖 Aggregates e GROUP BY",
          content: `**COUNT** — contar registros
  \`SELECT COUNT(*) FROM usuarios;
  SELECT COUNT(DISTINCT categoria) FROM produtos;\`

**SUM** — somar valores
  \`SELECT SUM(preco * quantidade) AS total
  FROM itens_pedido WHERE pedido_id = 1;\`

**AVG** — média
  \`SELECT AVG(preco) FROM produtos;\`

**MIN / MAX** — mínimo/máximo
  \`SELECT MIN(preco), MAX(preco) FROM produtos;\`

**GROUP BY** — agrupar
  \`SELECT categoria, COUNT(*), AVG(preco)
  FROM produtos
  GROUP BY categoria;\`

**HAVING** — filtrar grupos (pós-agregação)
  \`SELECT categoria, COUNT(*) as qtd
  FROM produtos
  GROUP BY categoria
  HAVING COUNT(*) > 5;\`

**Exemplo completo:**
  \`SELECT 
      u.cidade,
      COUNT(*) as total_usuarios,
      AVG(u.idade) as media_idade
  FROM usuarios u
  WHERE u.ativo = true
  GROUP BY u.cidade
  HAVING COUNT(*) >= 10
  ORDER BY total_usuarios DESC;\``,
        },
        {
          heading: "📖 Subqueries e CTEs",
          content: `**Subquery no WHERE:**
  \`SELECT * FROM produtos
  WHERE preco > (SELECT AVG(preco) FROM produtos);\`

**Subquery com IN:**
  \`SELECT * FROM usuarios
  WHERE id IN (SELECT user_id FROM pedidos WHERE status = 'ativo');\`

**Subquery no FROM:**
  \`SELECT categoria, avg_preco
  FROM (
      SELECT categoria, AVG(preco) as avg_preco
      FROM produtos GROUP BY categoria
  ) AS sub
  WHERE avg_preco > 100;\`

**EXISTS:**
  \`SELECT * FROM usuarios u
  WHERE EXISTS (
      SELECT 1 FROM pedidos p WHERE p.user_id = u.id
  );\`

**CTE (Common Table Expression):**
  \`WITH vendas_mensais AS (
      SELECT 
          DATE_TRUNC('month', data) as mes,
          SUM(valor) as total
      FROM vendas
      GROUP BY DATE_TRUNC('month', data)
  )
  SELECT mes, total
  FROM vendas_mensais
  WHERE total > 10000;\`

**Recursive CTE:**
  \`WITH RECURSIVE subordinados AS (
      SELECT id, nome, gerente_id FROM funcionarios WHERE id = 1
      UNION ALL
      SELECT f.id, f.nome, f.gerente_id
      FROM funcionarios f
      JOIN subordinados s ON f.gerente_id = s.id
  )
  SELECT * FROM subordinados;\``,
        },
        {
          heading: "📖 DDL - Estrutura",
          content: `**CREATE TABLE:**
  \`CREATE TABLE usuarios (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      idade INT CHECK (idade >= 0),
      criado_em TIMESTAMP DEFAULT NOW()
  );\`

**Constraints:**
  \`PRIMARY KEY\` — identificador único
  \`FOREIGN KEY (col) REFERENCES tabela(col)\`
  \`UNIQUE\` — valores únicos
  \`NOT NULL\` — obrigatório
  \`CHECK (condição)\` — validação
  \`DEFAULT valor\` — valor padrão

**ALTER TABLE:**
  \`ALTER TABLE usuarios ADD COLUMN bio TEXT;
  ALTER TABLE usuarios DROP COLUMN bio;
  ALTER TABLE usuarios ALTER COLUMN nome TYPE VARCHAR(200);
  ALTER TABLE usuarios RENAME COLUMN nome TO full_name;
  ALTER TABLE usuarios ADD CONSTRAINT uk_email UNIQUE (email);\`

**DROP TABLE:**
  \`DROP TABLE IF EXISTS usuarios CASCADE;\`

**Tipos comuns:**
  \`INT, BIGINT, SERIAL, BIGSERIAL\`
  \`VARCHAR(n), TEXT, CHAR(n)\`
  \`BOOLEAN, DATE, TIME, TIMESTAMP\`
  \`DECIMAL(10,2), NUMERIC, FLOAT\`
  \`JSON, JSONB, ARRAY, UUID\``,
        },
        {
          heading: "📖 Índices e Performance",
          content: `**CREATE INDEX:**
  \`CREATE INDEX idx_users_email ON usuarios(email);
  CREATE UNIQUE INDEX idx_users_cpf ON usuarios(cpf);\`

**Índice composto:**
  \`CREATE INDEX idx_orders_user_date 
  ON pedidos(user_id, data DESC);\`

**Partial index:**
  \`CREATE INDEX idx_active_users 
  ON usuarios(email) WHERE ativo = true;\`

**DROP INDEX:**
  \`DROP INDEX idx_users_email;\`

**EXPLAIN** — analisar plano de execução
  \`EXPLAIN ANALYZE
  SELECT * FROM usuarios WHERE email = 'x@y.com';\`

**Dicas de otimização:**
• Índices em colunas de WHERE e JOIN
• Índices compostos: ordem importa (da esquerda para direita)
• Evitar SELECT * — selecione colunas necessárias
• LIMIT em consultas grandes
• Evitar funções em colunas indexadas: WHERE LOWER(email) = 'x'
• ANALYZE atualiza estatísticas para o planner

**VACUUM** (PostgreSQL):
  \`VACUUM ANALYZE usuarios;\``,
        },
        {
          heading: "📖 Funções Úteis",
          content: `**Strings:**
  \`CONCAT('a', 'b')\`  \`||  -- concatenação\`
  \`UPPER(s)\`  \`LOWER(s)\`  \`LENGTH(s)\`
  \`TRIM(s)\`  \`SUBSTRING(s, 1, 5)\`
  \`REPLACE(s, 'old', 'new')\`
  \`SPLIT_PART(s, ',', 1)\`

**Números:**
  \`ROUND(n, 2)\`  \`FLOOR(n)\`  \`CEIL(n)\`
  \`ABS(n)\`  \`MOD(10, 3)\`  \`POWER(2, 3)\`

**Datas:**
  \`NOW()\`  \`CURRENT_DATE\`  \`CURRENT_TIME\`
  \`DATE_PART('year', data)\`
  \`DATE_TRUNC('month', data)\`
  \`AGE(data1, data2)\`
  \`data + INTERVAL '7 days'\`

**Condicionais:**
  \`CASE 
      WHEN preco < 50 THEN 'barato'
      WHEN preco < 100 THEN 'médio'
      ELSE 'caro'
  END AS faixa\`

  \`COALESCE(valor, 0)\` — primeiro não-null
  \`NULLIF(a, b)\` — null se a = b

**Conversão:**
  \`CAST(valor AS INTEGER)\`
  \`valor::TEXT\` -- PostgreSQL`,
        },
        {
          heading: "📖 Transactions e Locks",
          content: `**Transaction:**
  \`BEGIN;  -- ou START TRANSACTION
  
  UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
  UPDATE contas SET saldo = saldo + 100 WHERE id = 2;
  
  COMMIT;  -- confirma
  -- ou ROLLBACK; para desfazer\`

**SAVEPOINT:**
  \`BEGIN;
  INSERT INTO log VALUES ('start');
  SAVEPOINT sp1;
  INSERT INTO tabela VALUES (1);
  ROLLBACK TO sp1;  -- desfaz apenas após savepoint
  COMMIT;\`

**Isolation levels:**
  \`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
  SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
  SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\`

**SELECT FOR UPDATE** — lock de linhas
  \`SELECT * FROM produtos 
  WHERE id = 1 
  FOR UPDATE;\`

**ACID:**
• **Atomicity** — tudo ou nada
• **Consistency** — estado válido
• **Isolation** — transações não interferem
• **Durability** — commits são permanentes`,
        },
      ],
      keyTopics: [
        "SELECT, WHERE, ORDER BY",
        "INSERT, UPDATE, DELETE",
        "JOINs: INNER, LEFT, RIGHT",
        "GROUP BY, HAVING, aggregates",
        "Subqueries, CTEs, WITH",
        "CREATE TABLE, constraints",
        "INDEX, EXPLAIN, optimize",
        "Transactions, ACID, locks",
      ],
    },

    HTML: {
      title: "HTML - Dicionário de Tags",
      introduction:
        "Referência completa de HTML5. Tags, atributos, semântica, formulários e acessibilidade.",
      sections: [
        {
          heading: "📖 Estrutura do Documento",
          content: `**<!DOCTYPE html>** — declaração HTML5
  \`<!DOCTYPE html>\`

**<html>** — elemento raiz
  \`<html lang="pt-BR">...</html>\`

**<head>** — metadados
  \`<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Descrição da página">
    <title>Título da Página</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="favicon.ico">
  </head>\`

**<body>** — conteúdo visível
  \`<body>
    <!-- conteúdo da página -->
  </body>\`

**<script>** — JavaScript
  \`<script src="app.js"></script>
  <script defer src="app.js"></script>  <!-- carrega após DOM -->
  <script type="module" src="app.js"></script>\`

**Meta tags importantes:**
  \`<meta name="robots" content="index, follow">
  <meta property="og:title" content="Título">
  <meta property="og:image" content="image.jpg">\``,
        },
        {
          heading: "📖 Elementos Semânticos",
          content: `**<header>** — cabeçalho da página/seção
  \`<header>
    <nav>...</nav>
  </header>\`

**<nav>** — navegação
  \`<nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">Sobre</a></li>
    </ul>
  </nav>\`

**<main>** — conteúdo principal (único por página)
  \`<main>
    <article>...</article>
  </main>\`

**<article>** — conteúdo independente
  \`<article>
    <h2>Título do Artigo</h2>
    <p>Conteúdo...</p>
  </article>\`

**<section>** — seção temática
  \`<section>
    <h2>Sobre Nós</h2>
    <p>...</p>
  </section>\`

**<aside>** — conteúdo relacionado/lateral
  \`<aside>
    <h3>Posts Relacionados</h3>
  </aside>\`

**<footer>** — rodapé
  \`<footer>
    <p>&copy; 2024 Empresa</p>
  </footer>\``,
        },
        {
          heading: "📖 Tags de Texto",
          content: `**<h1> - <h6>** — headings (hierarquia)
  \`<h1>Título Principal</h1>  <!-- 1 por página -->
  <h2>Subtítulo</h2>
  <h3>Seção</h3>\`

**<p>** — parágrafo
  \`<p>Texto do parágrafo.</p>\`

**<span>** — inline container
  \`<span class="destaque">texto</span>\`

**<div>** — block container (não semântico)
  \`<div class="card">...</div>\`

**<strong>** — importância (negrito)
  \`<strong>Importante!</strong>\`

**<em>** — ênfase (itálico)
  \`<em>enfatizado</em>\`

**<mark>** — texto destacado
  \`<mark>marcado</mark>\`

**<small>** — texto menor/secundário
  \`<small>* Termos aplicam-se</small>\`

**<br>** — quebra de linha
  \`Linha 1<br>Linha 2\`

**<hr>** — linha horizontal (separador)
  \`<hr>\`

**<blockquote>** — citação em bloco
  \`<blockquote cite="fonte">
    "Citação aqui."
  </blockquote>\`

**<code>** — código inline
  \`Use <code>const</code> para constantes.\`

**<pre>** — texto pré-formatado
  \`<pre><code>
  function hello() {
    console.log("Hi");
  }
  </code></pre>\``,
        },
        {
          heading: "📖 Listas",
          content: `**<ul>** — lista não ordenada
  \`<ul>
    <li>Item A</li>
    <li>Item B</li>
    <li>Item C</li>
  </ul>\`

**<ol>** — lista ordenada
  \`<ol>
    <li>Primeiro</li>
    <li>Segundo</li>
    <li>Terceiro</li>
  </ol>\`

**<ol> com atributos:**
  \`<ol start="5" reversed>  <!-- inicia em 5, decrescente -->
    <li>Item</li>
  </ol>\`

**<dl>** — lista de definição
  \`<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
  </dl>\`

**Listas aninhadas:**
  \`<ul>
    <li>Frutas
      <ul>
        <li>Maçã</li>
        <li>Banana</li>
      </ul>
    </li>
    <li>Legumes</li>
  </ul>\``,
        },
        {
          heading: "📖 Links e Mídia",
          content: `**<a>** — link
  \`<a href="https://site.com">Link Externo</a>
  <a href="/pagina">Link Interno</a>
  <a href="#secao">Âncora</a>
  <a href="mailto:email@ex.com">Email</a>
  <a href="tel:+5511999999999">Telefone</a>\`

**<a> atributos:**
  \`target="_blank"  <!-- nova aba -->
  rel="noopener noreferrer"  <!-- segurança -->
  download  <!-- baixar arquivo -->\`

**<img>** — imagem
  \`<img src="foto.jpg" alt="Descrição" width="300" height="200">
  <img src="foto.jpg" alt="Foto" loading="lazy">\`

**<picture>** — imagem responsiva
  \`<picture>
    <source media="(min-width: 800px)" srcset="grande.jpg">
    <source media="(min-width: 400px)" srcset="media.jpg">
    <img src="pequena.jpg" alt="Foto">
  </picture>\`

**<video>** — vídeo
  \`<video src="video.mp4" controls width="640">
    Navegador não suporta vídeo.
  </video>
  
  <video controls autoplay muted loop>
    <source src="video.mp4" type="video/mp4">
  </video>\`

**<audio>** — áudio
  \`<audio src="audio.mp3" controls></audio>\`

**<iframe>** — conteúdo externo
  \`<iframe src="https://youtube.com/embed/xxx" 
          width="560" height="315"
          allowfullscreen></iframe>\``,
        },
        {
          heading: "📖 Tabelas",
          content: `**<table>** — estrutura básica
  \`<table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Idade</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ana</td>
        <td>25</td>
      </tr>
      <tr>
        <td>Bob</td>
        <td>30</td>
      </tr>
    </tbody>
  </table>\`

**<caption>** — título da tabela
  \`<table>
    <caption>Lista de Usuários</caption>
    ...
  </table>\`

**colspan / rowspan** — mesclar células
  \`<td colspan="2">Ocupa 2 colunas</td>
  <td rowspan="3">Ocupa 3 linhas</td>\`

**<tfoot>** — rodapé da tabela
  \`<tfoot>
    <tr>
      <td>Total:</td>
      <td>R$ 500</td>
    </tr>
  </tfoot>\`

**scope** — acessibilidade
  \`<th scope="col">Coluna</th>
  <th scope="row">Linha</th>\``,
        },
        {
          heading: "📖 Formulários",
          content: `**<form>** — container do formulário
  \`<form action="/api/submit" method="POST">
    ...
  </form>\`

**<input>** — tipos principais
  \`<input type="text" name="nome" placeholder="Nome">
  <input type="email" name="email" required>
  <input type="password" name="senha" minlength="8">
  <input type="number" name="idade" min="0" max="120">
  <input type="tel" name="telefone">
  <input type="url" name="site">
  <input type="date" name="nascimento">
  <input type="time" name="horario">
  <input type="checkbox" name="termos" checked>
  <input type="radio" name="genero" value="m">
  <input type="file" name="foto" accept="image/*">
  <input type="hidden" name="token" value="xxx">
  <input type="submit" value="Enviar">\`

**<label>** — rótulo (acessibilidade!)
  \`<label for="email">Email:</label>
  <input type="email" id="email" name="email">\`

**<textarea>** — texto multilinha
  \`<textarea name="msg" rows="4" cols="50"></textarea>\`

**<select>** — dropdown
  \`<select name="estado">
    <option value="">Selecione...</option>
    <option value="SP">São Paulo</option>
    <option value="RJ" selected>Rio de Janeiro</option>
  </select>\`

**<button>** — botão
  \`<button type="submit">Enviar</button>
  <button type="button">Ação</button>
  <button type="reset">Limpar</button>\``,
        },
        {
          heading: "📖 Validação HTML5",
          content: `**required** — campo obrigatório
  \`<input type="text" required>\`

**minlength / maxlength** — tamanho
  \`<input type="text" minlength="3" maxlength="50">\`

**min / max** — valor numérico
  \`<input type="number" min="0" max="100">\`

**pattern** — regex
  \`<input type="text" pattern="[A-Za-z]{3,}"
         title="Mínimo 3 letras">\`

**Email automático:**
  \`<input type="email">  <!-- valida formato -->\`

**novalidate** — desativar validação
  \`<form novalidate>...</form>\`

**Exemplo completo:**
  \`<form action="/submit" method="POST">
    <label for="name">Nome:</label>
    <input type="text" id="name" name="name" 
           required minlength="2" maxlength="100">
    
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <label for="age">Idade:</label>
    <input type="number" id="age" name="age" min="18" max="120">
    
    <button type="submit">Cadastrar</button>
  </form>\``,
        },
        {
          heading: "📖 Acessibilidade (A11y)",
          content: `**alt** — descrição de imagem
  \`<img src="foto.jpg" alt="Pessoa sorrindo na praia">\`

**<label>** — sempre use com inputs!
  \`<label for="nome">Nome:</label>
  <input id="nome">\`

**role** — define função do elemento
  \`<div role="button">Clique</div>
  <nav role="navigation">...</nav>\`

**aria-label** — rótulo para leitores de tela
  \`<button aria-label="Fechar modal">X</button>\`

**aria-hidden** — esconder de leitores de tela
  \`<span aria-hidden="true">🔍</span>\`

**aria-describedby** — descrição adicional
  \`<input aria-describedby="help-text">
  <span id="help-text">Digite seu email.</span>\`

**aria-live** — atualizações dinâmicas
  \`<div aria-live="polite">Mensagem atualizada</div>\`

**tabindex** — ordem de tabulação
  \`<div tabindex="0">Focável</div>
  <div tabindex="-1">Focável via JS</div>\`

**skip link** — pular para conteúdo
  \`<a href="#main" class="skip-link">Pular para conteúdo</a>
  <main id="main">...</main>\`

**Boas práticas:**
• Hierarquia de headings (h1 → h2 → h3)
• Contraste de cores adequado
• Texto de links descritivo
• Navegação por teclado funcional`,
        },
      ],
      keyTopics: [
        "<!DOCTYPE html>, <head>, <body>",
        "Semânticos: header, nav, main, article",
        "<h1>-<h6>, <p>, <span>, <div>",
        "<a>, <img>, <video>, <audio>",
        "<ul>, <ol>, <dl>, <table>",
        "<form>, <input>, <select>",
        "Validação: required, pattern",
        "A11y: alt, label, aria-*, role",
      ],
    },

    CSS: {
      title: "CSS - Dicionário de Propriedades",
      introduction:
        "Referência completa de CSS. Seletores, Box Model, Flexbox, Grid, animações e responsividade.",
      sections: [
        {
          heading: "📖 Seletores",
          content: `**Elemento:**
  \`p { color: blue; }
  h1, h2, h3 { font-weight: bold; }\`

**Classe:**
  \`.card { padding: 1rem; }
  .btn.primary { background: blue; }\`

**ID:**
  \`#header { height: 60px; }\`

**Atributo:**
  \`[type="text"] { border: 1px solid; }
  [href^="https"] { color: green; }  /* começa com */
  [href$=".pdf"] { color: red; }     /* termina com */
  [class*="btn"] { cursor: pointer; } /* contém */\`

**Descendente / Filho:**
  \`nav a { text-decoration: none; }     /* descendente */
  nav > ul { list-style: none; }        /* filho direto */
  h2 + p { margin-top: 0; }             /* irmão adjacente */
  h2 ~ p { color: gray; }               /* irmãos gerais */\`

**Pseudo-classes:**
  \`:hover, :focus, :active\`
  \`:first-child, :last-child, :nth-child(2n)\`
  \`:not(.disabled)\`
  \`:checked, :disabled, :required\`

**Pseudo-elementos:**
  \`::before, ::after { content: ""; }
  ::first-letter, ::first-line
  ::placeholder, ::selection\`

**Especificidade:**
  inline style: 1000
  #id: 100
  .class, [attr], :pseudo-class: 10
  element, ::pseudo-element: 1`,
        },
        {
          heading: "📖 Box Model",
          content: `**Box Model:**
  content → padding → border → margin

**width / height:**
  \`width: 200px;
  max-width: 100%;
  min-height: 50vh;\`

**padding:**
  \`padding: 10px;               /* todos */
  padding: 10px 20px;          /* vertical horizontal */
  padding: 10px 20px 15px 25px; /* top right bottom left */
  padding-top: 10px;\`

**margin:**
  \`margin: 1rem;
  margin: 0 auto;  /* centralizar horizontalmente */
  margin-bottom: 2rem;\`

**border:**
  \`border: 1px solid #ccc;
  border-radius: 8px;
  border-top: 2px dashed blue;\`

**box-sizing:**
  \`box-sizing: border-box;  /* width inclui padding/border */
  box-sizing: content-box;  /* padrão: só conteúdo */\`

**Reset comum:**
  \`*, *::before, *::after {
    box-sizing: border-box;
  }\`

**outline:**
  \`outline: 2px solid blue;  /* não afeta layout */
  outline-offset: 2px;\``,
        },
        {
          heading: "📖 Display e Position",
          content: `**display:**
  \`display: block;        /* ocupa linha inteira */
  display: inline;       /* flui com texto */
  display: inline-block; /* inline + width/height */
  display: none;         /* remove do layout */
  display: flex;         /* flexbox */
  display: grid;         /* grid */\`

**visibility:**
  \`visibility: hidden;  /* oculto mas ocupa espaço */
  visibility: visible;\`

**position:**
  \`position: static;    /* padrão, fluxo normal */
  position: relative;  /* relativo à posição original */
  position: absolute;  /* relativo ao ancestral posicionado */
  position: fixed;     /* relativo ao viewport */
  position: sticky;    /* híbrido relative/fixed */\`

**Posicionamento:**
  \`top: 0;  right: 0;  bottom: 0;  left: 0;\`

**z-index:**
  \`z-index: 100;  /* ordem de empilhamento */\`

**Centralizar com position:**
  \`.centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }\`

**overflow:**
  \`overflow: hidden;  /* corta conteúdo */
  overflow: scroll;  /* sempre scrollbar */
  overflow: auto;    /* scrollbar se necessário */
  overflow-x: hidden;
  overflow-y: auto;\``,
        },
        {
          heading: "📖 Flexbox",
          content: `**Container flex:**
  \`.container {
    display: flex;
    flex-direction: row;     /* row | column | row-reverse */
    flex-wrap: wrap;         /* nowrap | wrap | wrap-reverse */
    justify-content: center; /* main axis */
    align-items: center;     /* cross axis */
    gap: 1rem;               /* espaço entre itens */
  }\`

**justify-content (main axis):**
  \`flex-start | flex-end | center
  space-between | space-around | space-evenly\`

**align-items (cross axis):**
  \`stretch | flex-start | flex-end | center | baseline\`

**align-content** (múltiplas linhas):
  \`flex-start | flex-end | center | space-between\`

**Itens flex:**
  \`.item {
    flex-grow: 1;    /* cresce proporcionalmente */
    flex-shrink: 0;  /* não encolhe */
    flex-basis: 200px; /* tamanho base */
    flex: 1 0 200px;   /* shorthand: grow shrink basis */
    align-self: flex-end; /* sobrescreve align-items */
    order: -1;        /* ordem de exibição */
  }\`

**Padrões comuns:**
  \`/* Centralizar */
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Espaçar igualmente */
  .spaced {
    display: flex;
    justify-content: space-between;
  }

  /* Coluna */
  .column {
    display: flex;
    flex-direction: column;
  }\``,
        },
        {
          heading: "📖 CSS Grid",
          content: `**Container grid:**
  \`.grid {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 1rem;
    row-gap: 1rem;
    column-gap: 2rem;
  }\`

**Colunas com repeat:**
  \`grid-template-columns: repeat(3, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\`

**Posicionar itens:**
  \`.item {
    grid-column: 1 / 3;     /* da coluna 1 até 3 */
    grid-row: 1 / 2;
    grid-column: span 2;    /* ocupa 2 colunas */
    grid-area: 1 / 1 / 3 / 4; /* row-start/col-start/row-end/col-end */
  }\`

**Áreas nomeadas:**
  \`.layout {
    grid-template-areas:
      "header header header"
      "sidebar main main"
      "footer footer footer";
  }
  .header { grid-area: header; }
  .sidebar { grid-area: sidebar; }
  .main { grid-area: main; }
  .footer { grid-area: footer; }\`

**Alinhamento:**
  \`justify-items: center;   /* horizontal dos itens */
  align-items: center;     /* vertical dos itens */
  justify-content: center; /* horizontal da grid */
  align-content: center;   /* vertical da grid */
  place-items: center;     /* shorthand */\`

**Auto-fill vs auto-fit:**
  \`/* auto-fill: mantém células vazias */
  repeat(auto-fill, minmax(200px, 1fr))
  /* auto-fit: colapsa células vazias */
  repeat(auto-fit, minmax(200px, 1fr))\``,
        },
        {
          heading: "📖 Cores e Backgrounds",
          content: `**color** (texto):
  \`color: red;
  color: #ff5733;
  color: rgb(255, 87, 51);
  color: rgba(255, 87, 51, 0.5);
  color: hsl(14, 100%, 60%);
  color: hsla(14, 100%, 60%, 0.5);\`

**background:**
  \`background-color: #f0f0f0;
  background-image: url('img.jpg');
  background-size: cover;        /* cover | contain | 100% */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;  /* parallax */

  /* shorthand */
  background: #f0f0f0 url('img.jpg') center/cover no-repeat;\`

**Gradientes:**
  \`background: linear-gradient(to right, #ff7e5f, #feb47b);
  background: linear-gradient(135deg, red, blue);
  background: radial-gradient(circle, #fff, #000);\`

**opacity:**
  \`opacity: 0.5;  /* 0 = transparente, 1 = opaco */\`

**box-shadow:**
  \`box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);\`

**text-shadow:**
  \`text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);\``,
        },
        {
          heading: "📖 Tipografia",
          content: `**font-family:**
  \`font-family: 'Roboto', Arial, sans-serif;
  font-family: 'Georgia', serif;
  font-family: 'Courier New', monospace;\`

**font-size:**
  \`font-size: 16px;
  font-size: 1rem;
  font-size: 1.5em;  /* relativo ao pai */
  font-size: clamp(1rem, 2vw, 2rem);\`

**font-weight:**
  \`font-weight: normal;  /* 400 */
  font-weight: bold;     /* 700 */
  font-weight: 300;      /* light */
  font-weight: 600;      /* semi-bold */\`

**font-style:**
  \`font-style: italic;
  font-style: normal;\`

**text-transform:**
  \`text-transform: uppercase;
  text-transform: lowercase;
  text-transform: capitalize;\`

**text-align:**
  \`text-align: left | right | center | justify;\`

**line-height:**
  \`line-height: 1.5;     /* múltiplo */
  line-height: 24px;    /* fixo */\`

**letter-spacing / word-spacing:**
  \`letter-spacing: 0.05em;
  word-spacing: 0.1em;\`

**text-decoration:**
  \`text-decoration: none;
  text-decoration: underline;
  text-decoration: line-through;\`

**white-space:**
  \`white-space: nowrap;   /* não quebra */
  white-space: pre-wrap;  /* preserva espaços, quebra */\`

**text-overflow:**
  \`.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }\``,
        },
        {
          heading: "📖 Animações e Transições",
          content: `**transition:**
  \`transition: all 0.3s ease;
  transition: background-color 0.2s, transform 0.3s;
  transition: opacity 0.5s ease-in-out;

  /* valores de timing */
  ease | linear | ease-in | ease-out | ease-in-out
  cubic-bezier(0.4, 0, 0.2, 1)\`

**transform:**
  \`transform: translateX(20px);
  transform: translateY(-10px);
  transform: translate(20px, -10px);
  transform: scale(1.1);
  transform: rotate(45deg);
  transform: skew(10deg);
  transform: rotate(45deg) scale(1.1);  /* combinar */
  transform-origin: center center;\`

**@keyframes:**
  \`@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }\`

**animation:**
  \`animation: fadeIn 0.5s ease-out;
  animation: bounce 1s infinite;
  animation: slide 0.3s ease-out forwards;

  /* propriedades individuais */
  animation-name: fadeIn;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-delay: 0.2s;
  animation-iteration-count: infinite | 3;
  animation-direction: alternate;
  animation-fill-mode: forwards | backwards | both;\`

**:hover animation:**
  \`.btn {
    transition: transform 0.2s;
  }
  .btn:hover {
    transform: scale(1.05);
  }\``,
        },
        {
          heading: "📖 Responsividade",
          content: `**Media Queries:**
  \`@media (max-width: 768px) {
    .sidebar { display: none; }
  }

  @media (min-width: 1024px) {
    .container { max-width: 1200px; }
  }

  @media (prefers-color-scheme: dark) {
    body { background: #121212; }
  }\`

**Breakpoints comuns:**
  \`/* Mobile first */
  /* base: mobile */
  @media (min-width: 640px) { /* sm */ }
  @media (min-width: 768px) { /* md */ }
  @media (min-width: 1024px) { /* lg */ }
  @media (min-width: 1280px) { /* xl */ }\`

**Unidades responsivas:**
  \`rem   /* relativo ao root font-size */
  em    /* relativo ao font-size do pai */
  vw    /* 1% da largura do viewport */
  vh    /* 1% da altura do viewport */
  %     /* porcentagem do pai */
  clamp(min, preferred, max)\`

**CSS Variables:**
  \`:root {
    --primary: #3490dc;
    --spacing: 1rem;
    --font-size: 16px;
  }
  .btn {
    background: var(--primary);
    padding: var(--spacing);
  }

  @media (min-width: 768px) {
    :root { --font-size: 18px; }
  }\`

**Container Queries** (moderno):
  \`@container (min-width: 400px) {
    .card { flex-direction: row; }
  }\``,
        },
      ],
      keyTopics: [
        "Seletores: .class, #id, [attr]",
        "Box Model: padding, margin, border",
        "display: block, flex, grid",
        "position: relative, absolute, fixed",
        "Flexbox: justify-content, align-items",
        "Grid: template-columns, grid-area",
        "transition, transform, @keyframes",
        "@media, rem, vw, CSS variables",
      ],
    },

    "Shell/Bash": {
      title: "Shell/Bash - Dicionário de Comandos",
      introduction:
        "Referência completa de Shell scripting. Comandos Unix, variáveis, loops, funções e automação.",
      sections: [
        {
          heading: "📖 Navegação e Arquivos",
          content: `**pwd** — diretório atual
  \`pwd   # /home/user\`

**cd** — mudar diretório
  \`cd /var/log
  cd ..        # diretório pai
  cd ~         # home
  cd -         # diretório anterior\`

**ls** — listar arquivos
  \`ls
  ls -la       # detalhado + ocultos
  ls -lh       # tamanhos legíveis
  ls *.txt     # pattern matching\`

**mkdir** — criar diretório
  \`mkdir pasta
  mkdir -p pasta/sub/sub2  # cria intermediários\`

**rm** — remover
  \`rm arquivo.txt
  rm -r pasta/   # recursivo
  rm -rf pasta/  # forçado (cuidado!)\`

**cp** — copiar
  \`cp origem.txt destino.txt
  cp -r pasta/ backup/\`

**mv** — mover/renomear
  \`mv antigo.txt novo.txt
  mv arquivo.txt pasta/\`

**touch** — criar/atualizar timestamp
  \`touch novo_arquivo.txt\`

**find** — buscar arquivos
  \`find . -name "*.log"
  find /var -type f -size +100M
  find . -name "*.tmp" -delete\``,
        },
        {
          heading: "📖 Leitura e Manipulação",
          content: `**cat** — exibir conteúdo
  \`cat arquivo.txt
  cat file1.txt file2.txt > merged.txt\`

**head / tail** — início/fim
  \`head -n 20 arquivo.txt   # primeiras 20 linhas
  tail -n 50 log.txt       # últimas 50
  tail -f log.txt          # follow (tempo real)\`

**less / more** — paginação
  \`less arquivo.txt   # q para sair\`

**grep** — buscar texto
  \`grep "erro" log.txt
  grep -i "erro"   # case insensitive
  grep -r "TODO"   # recursivo
  grep -n "func"   # com número da linha
  grep -v "debug"  # inverter (excluir)\`

**sed** — substituir texto
  \`sed 's/antigo/novo/' arquivo.txt
  sed -i 's/antigo/novo/g' arquivo.txt  # in-place, global\`

**awk** — processar colunas
  \`awk '{print $1}' arquivo.txt        # primeira coluna
  awk -F: '{print $1}' /etc/passwd     # delimitador :
  awk '{sum+=$1} END {print sum}'      # somar\`

**wc** — contar
  \`wc -l arquivo.txt   # linhas
  wc -w arquivo.txt   # palavras
  wc -c arquivo.txt   # bytes\`

**sort / uniq** — ordenar e únicos
  \`sort arquivo.txt
  sort -n números.txt   # numérico
  sort | uniq           # únicos
  sort | uniq -c        # contar ocorrências\``,
        },
        {
          heading: "📖 Pipes e Redirecionamento",
          content: `**| (pipe)** — conectar comandos
  \`cat log.txt | grep "ERROR" | wc -l
  ps aux | grep nginx
  history | grep git | tail -10\`

**> (stdout)** — redirecionar saída
  \`echo "texto" > arquivo.txt   # sobrescreve
  echo "mais" >> arquivo.txt   # append\`

**< (stdin)** — entrada de arquivo
  \`while read line; do echo "$line"; done < arquivo.txt\`

**2> (stderr)** — redirecionar erros
  \`command 2> erros.log
  command 2>/dev/null           # descartar erros\`

**&> / 2>&1** — stdout e stderr
  \`command &> output.log        # tudo para arquivo
  command > log.txt 2>&1        # mesmo efeito\`

**/dev/null** — descartar
  \`command > /dev/null 2>&1\`

**tee** — duplicar saída
  \`command | tee output.txt     # exibe e salva
  command | tee -a log.txt     # append\`

**xargs** — argumentos de stdin
  \`find . -name "*.tmp" | xargs rm
  cat urls.txt | xargs -n1 curl
  echo "1 2 3" | xargs -n1 echo\``,
        },
        {
          heading: "📖 Variáveis",
          content: `**Declarar variável:**
  \`nome="valor"      # sem espaços!
  idade=25
  readonly CONSTANTE="fixo"\`

**Usar variável:**
  \`echo $nome
  echo "Olá, $nome"
  echo "Olá, \${nome}!"\`

**Variáveis especiais:**
  \`$0          # nome do script
  $1 $2 $3    # argumentos
  $#          # número de argumentos
  $@          # todos argumentos (separados)
  $*          # todos argumentos (uma string)
  $?          # exit code do último comando
  $$          # PID do script
  $!          # PID do último background\`

**Substituição de comando:**
  \`data=$(date +%Y-%m-%d)
  arquivos=\`ls *.txt\`   # sintaxe antiga\`

**Arrays:**
  \`arr=("a" "b" "c")
  echo \${arr[0]}      # primeiro
  echo \${arr[@]}      # todos
  echo \${#arr[@]}     # tamanho\`

**Variáveis de ambiente:**
  \`export PATH="$PATH:/novo/caminho"
  export VAR="valor"
  env                   # listar todas\`

**Default values:**
  \`\${var:-default}     # default se vazio/unset
  \${var:=default}     # atribui default se vazio
  \${var:?erro}        # erro se vazio\``,
        },
        {
          heading: "📖 Condicionais",
          content: `**if/elif/else:**
  \`if [ condição ]; then
    echo "verdadeiro"
  elif [ outra ]; then
    echo "outra"
  else
    echo "falso"
  fi\`

**[[ ]] vs [ ]:**
  \`[[ ]] é mais seguro (Bash específico)
  [ ] é POSIX compatível\`

**Comparação de strings:**
  \`[[ "$a" == "$b" ]]   # igual
  [[ "$a" != "$b" ]]   # diferente
  [[ "$a" < "$b" ]]    # menor (lexicográfico)
  [[ -z "$a" ]]        # string vazia
  [[ -n "$a" ]]        # string não vazia\`

**Comparação numérica:**
  \`[[ $a -eq $b ]]   # igual
  [[ $a -ne $b ]]   # diferente
  [[ $a -lt $b ]]   # menor
  [[ $a -le $b ]]   # menor ou igual
  [[ $a -gt $b ]]   # maior
  [[ $a -ge $b ]]   # maior ou igual\`

**Testes de arquivo:**
  \`[[ -f arquivo ]]   # é arquivo
  [[ -d pasta ]]     # é diretório
  [[ -e caminho ]]   # existe
  [[ -r arquivo ]]   # legível
  [[ -w arquivo ]]   # gravável
  [[ -x script ]]    # executável\`

**Operadores lógicos:**
  \`[[ cond1 && cond2 ]]   # AND
  [[ cond1 || cond2 ]]   # OR
  [[ ! condição ]]       # NOT\`

**Curto-circuito:**
  \`[[ -f arquivo ]] && cat arquivo
  [[ -d pasta ]] || mkdir pasta\``,
        },
        {
          heading: "📖 Loops",
          content: `**for (lista):**
  \`for item in a b c; do
    echo "$item"
  done

  for file in *.txt; do
    echo "Processando $file"
  done\`

**for (range):**
  \`for i in {1..10}; do
    echo "$i"
  done

  for i in {0..100..10}; do   # step 10
    echo "$i"
  done\`

**for (C-style):**
  \`for ((i=0; i<10; i++)); do
    echo "$i"
  done\`

**while:**
  \`while [ condição ]; do
    comando
  done

  # ler arquivo linha por linha
  while IFS= read -r line; do
    echo "$line"
  done < arquivo.txt\`

**until:**
  \`until [ condição ]; do
    comando
  done\`

**break / continue:**
  \`for i in {1..10}; do
    [[ $i -eq 5 ]] && break      # sai do loop
    [[ $i -eq 3 ]] && continue   # próxima iteração
    echo "$i"
  done\`

**Loop infinito:**
  \`while true; do
    comando
    sleep 1
  done\``,
        },
        {
          heading: "📖 Funções",
          content: `**Declarar função:**
  \`function nome() {
    echo "Olá!"
  }

  # ou forma curta
  nome() {
    echo "Olá!"
  }\`

**Parâmetros:**
  \`greet() {
    local nome="$1"
    local idade="$2"
    echo "Olá, $nome! Idade: $idade"
  }
  greet "Ana" 25\`

**Return value:**
  \`soma() {
    local result=$(( $1 + $2 ))
    echo $result   # retorna via stdout
  }
  total=$(soma 5 3)\`

**Exit code:**
  \`valida() {
    [[ -f "$1" ]] && return 0 || return 1
  }
  if valida "arquivo.txt"; then
    echo "existe"
  fi\`

**local** — escopo local
  \`func() {
    local var="local"   # não polui escopo global
    global_var="global" # sem local, é global
  }\`

**Exemplo completo:**
  \`#!/bin/bash
  
  log() {
    local level="$1"
    local msg="$2"
    echo "[\$(date +%H:%M:%S)] [$level] $msg"
  }

  die() {
    log "ERROR" "$1"
    exit 1
  }

  log "INFO" "Iniciando..."
  [[ -f config.txt ]] || die "Config não encontrado"\``,
        },
        {
          heading: "📖 Case e Select",
          content: `**case:**
  \`case "$opcao" in
    start|s)
      echo "Iniciando..."
      ;;
    stop|p)
      echo "Parando..."
      ;;
    restart|r)
      echo "Reiniciando..."
      ;;
    *)
      echo "Uso: $0 {start|stop|restart}"
      exit 1
      ;;
  esac\`

**Pattern matching:**
  \`case "$arquivo" in
    *.txt) echo "Texto" ;;
    *.jpg|*.png) echo "Imagem" ;;
    *) echo "Outro" ;;
  esac\`

**select (menu interativo):**
  \`select opt in "Opção 1" "Opção 2" "Sair"; do
    case $opt in
      "Opção 1") echo "Escolheu 1" ;;
      "Opção 2") echo "Escolheu 2" ;;
      "Sair") break ;;
      *) echo "Inválido" ;;
    esac
  done\`

**read (input do usuário):**
  \`read -p "Nome: " nome
  read -s -p "Senha: " senha   # silencioso
  read -t 5 -p "Rápido: " val  # timeout\``,
        },
        {
          heading: "📖 Práticas e Utilitários",
          content: `**Shebang:**
  \`#!/bin/bash
  #!/usr/bin/env bash   # mais portável\`

**Modo estrito:**
  \`set -e    # sai em erro
  set -u    # erro em variável undefined
  set -o pipefail  # erro em pipe
  set -euo pipefail   # comum no início\`

**trap (cleanup):**
  \`cleanup() {
    rm -f /tmp/tempfile
  }
  trap cleanup EXIT
  trap cleanup SIGINT SIGTERM\`

**Exit codes:**
  \`exit 0    # sucesso
  exit 1    # erro genérico
  exit 127  # comando não encontrado\`

**Debugging:**
  \`set -x    # imprime comandos
  bash -x script.sh\`

**Permissões:**
  \`chmod +x script.sh
  chmod 755 script.sh
  chmod u+x,g+r script.sh\`

**Processos:**
  \`command &          # background
  jobs               # listar jobs
  fg %1              # trazer para frente
  bg %1              # enviar para background
  kill PID
  kill -9 PID        # forçar
  pkill -f "pattern"\`

**Cron (agendamento):**
  \`# crontab -e
  # minuto hora dia mês dia_semana comando
  0 * * * * /script.sh        # toda hora
  0 0 * * * /backup.sh        # meia-noite
  */5 * * * * /check.sh       # cada 5 min\``,
        },
      ],
      keyTopics: [
        "ls, cd, find, grep, sed, awk",
        "| pipe, > redirect, 2>&1",
        "$VAR, ${VAR}, $1 $2 $@",
        "if [[ ]], -f, -d, -eq",
        "for, while, until, break",
        "function, local, return",
        "case, select, read",
        "set -euo pipefail, trap, chmod",
      ],
    },

    "Spring Boot": {
      title: "Spring Boot - Dicionário de Anotações",
      introduction:
        "Referência completa de Spring Boot. Beans, REST APIs, JPA, Security e configuração.",
      sections: [
        {
          heading: "📖 Anotações Core",
          content: `**@SpringBootApplication** — classe principal
  \`@SpringBootApplication
  public class Application {
      public static void main(String[] args) {
          SpringApplication.run(Application.class, args);
      }
  }\`
  Combina: @Configuration + @EnableAutoConfiguration + @ComponentScan

**@Component** — bean genérico
  \`@Component
  public class MyComponent { }\`

**@Service** — camada de serviço
  \`@Service
  public class UserService { }\`

**@Repository** — camada de dados
  \`@Repository
  public class UserRepository { }\`

**@Controller** — MVC controller
  \`@Controller
  public class PageController { }\`

**@Configuration** — classe de configuração
  \`@Configuration
  public class AppConfig {
      @Bean
      public ObjectMapper objectMapper() {
          return new ObjectMapper();
      }
  }\`

**@Bean** — define bean manualmente
  \`@Bean
  public RestTemplate restTemplate() {
      return new RestTemplate();
  }\``,
        },
        {
          heading: "📖 Dependency Injection",
          content: `**@Autowired** — injeção de dependência
  \`@Service
  public class OrderService {
      @Autowired
      private UserRepository userRepository;
  }\`

**Constructor injection (recomendado):**
  \`@Service
  public class OrderService {
      private final UserRepository userRepository;
      
      public OrderService(UserRepository userRepository) {
          this.userRepository = userRepository;
      }
  }\`

**@Qualifier** — especificar qual bean
  \`@Autowired
  @Qualifier("primaryDataSource")
  private DataSource dataSource;\`

**@Primary** — bean padrão
  \`@Bean
  @Primary
  public DataSource primaryDataSource() { }\`

**@Value** — injetar propriedade
  \`@Value("\${app.name}")
  private String appName;

  @Value("\${app.timeout:30}")  // com default
  private int timeout;\`

**@ConfigurationProperties** — binding de config
  \`@ConfigurationProperties(prefix = "app")
  public class AppConfig {
      private String name;
      private int timeout;
      // getters/setters
  }\``,
        },
        {
          heading: "📖 REST Controllers",
          content: `**@RestController** — API REST
  \`@RestController
  @RequestMapping("/api/users")
  public class UserController {
      
      @GetMapping
      public List<User> findAll() {
          return userService.findAll();
      }
      
      @GetMapping("/{id}")
      public User findById(@PathVariable Long id) {
          return userService.findById(id);
      }
      
      @PostMapping
      public User create(@RequestBody @Valid UserDTO dto) {
          return userService.create(dto);
      }
      
      @PutMapping("/{id}")
      public User update(@PathVariable Long id, @RequestBody UserDTO dto) {
          return userService.update(id, dto);
      }
      
      @DeleteMapping("/{id}")
      public void delete(@PathVariable Long id) {
          userService.delete(id);
      }
  }\`

**@RequestParam** — query params
  \`@GetMapping("/search")
  public List<User> search(
      @RequestParam String name,
      @RequestParam(required = false) Integer age
  ) { }\`

**ResponseEntity** — controle da response
  \`@GetMapping("/{id}")
  public ResponseEntity<User> findById(@PathVariable Long id) {
      return userService.findById(id)
          .map(ResponseEntity::ok)
          .orElse(ResponseEntity.notFound().build());
  }\``,
        },
        {
          heading: "📖 Spring Data JPA",
          content: `**@Entity** — entidade JPA
  \`@Entity
  @Table(name = "users")
  public class User {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      
      @Column(nullable = false)
      private String name;
      
      @Column(unique = true)
      private String email;
      
      @ManyToOne
      @JoinColumn(name = "department_id")
      private Department department;
      
      @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
      private List<Order> orders;
  }\`

**Repository interface:**
  \`public interface UserRepository extends JpaRepository<User, Long> {
      List<User> findByName(String name);
      Optional<User> findByEmail(String email);
      List<User> findByAgeGreaterThan(int age);
      List<User> findByNameContainingIgnoreCase(String name);
      
      @Query("SELECT u FROM User u WHERE u.active = true")
      List<User> findAllActive();
      
      @Query(value = "SELECT * FROM users WHERE email LIKE %?1%", nativeQuery = true)
      List<User> searchByEmail(String email);
  }\`

**@Transactional:**
  \`@Service
  public class UserService {
      @Transactional
      public void transferMoney(Long from, Long to, BigDecimal amount) { }
      
      @Transactional(readOnly = true)
      public List<User> findAll() { }
  }\``,
        },
        {
          heading: "📖 Validação",
          content: `**Anotações de validação:**
  \`public class UserDTO {
      @NotNull
      @NotBlank
      @Size(min = 2, max = 100)
      private String name;
      
      @Email
      private String email;
      
      @Min(0)
      @Max(150)
      private Integer age;
      
      @Pattern(regexp = "\\\\d{11}")
      private String cpf;
      
      @Past
      private LocalDate birthDate;
      
      @NotEmpty
      private List<String> roles;
  }\`

**@Valid no controller:**
  \`@PostMapping
  public User create(@RequestBody @Valid UserDTO dto) { }\`

**Validação customizada:**
  \`@Constraint(validatedBy = CpfValidator.class)
  @Target(ElementType.FIELD)
  @Retention(RetentionPolicy.RUNTIME)
  public @interface ValidCpf {
      String message() default "CPF inválido";
      Class<?>[] groups() default {};
      Class<? extends Payload>[] payload() default {};
  }\``,
        },
        {
          heading: "📖 Exception Handling",
          content: `**@ControllerAdvice** — handler global
  \`@RestControllerAdvice
  public class GlobalExceptionHandler {
      
      @ExceptionHandler(EntityNotFoundException.class)
      @ResponseStatus(HttpStatus.NOT_FOUND)
      public ErrorResponse handleNotFound(EntityNotFoundException e) {
          return new ErrorResponse(e.getMessage());
      }
      
      @ExceptionHandler(MethodArgumentNotValidException.class)
      @ResponseStatus(HttpStatus.BAD_REQUEST)
      public ErrorResponse handleValidation(MethodArgumentNotValidException e) {
          List<String> errors = e.getBindingResult()
              .getFieldErrors()
              .stream()
              .map(f -> f.getField() + ": " + f.getDefaultMessage())
              .toList();
          return new ErrorResponse("Validation failed", errors);
      }
      
      @ExceptionHandler(Exception.class)
      @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
      public ErrorResponse handleGeneric(Exception e) {
          return new ErrorResponse("Internal server error");
      }
  }\`

**Custom Exception:**
  \`@ResponseStatus(HttpStatus.NOT_FOUND)
  public class ResourceNotFoundException extends RuntimeException {
      public ResourceNotFoundException(String message) {
          super(message);
      }
  }\``,
        },
        {
          heading: "📖 Spring Security",
          content: `**SecurityConfig:**
  \`@Configuration
  @EnableWebSecurity
  public class SecurityConfig {
      @Bean
      public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
          http
              .csrf(csrf -> csrf.disable())
              .authorizeHttpRequests(auth -> auth
                  .requestMatchers("/api/public/**").permitAll()
                  .requestMatchers("/api/admin/**").hasRole("ADMIN")
                  .anyRequest().authenticated()
              )
              .sessionManagement(session -> 
                  session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
              .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
          return http.build();
      }
      
      @Bean
      public PasswordEncoder passwordEncoder() {
          return new BCryptPasswordEncoder();
      }
  }\`

**@PreAuthorize** — method security
  \`@PreAuthorize("hasRole('ADMIN')")
  public void deleteUser(Long id) { }

  @PreAuthorize("hasRole('USER') or #id == authentication.principal.id")
  public User getUser(Long id) { }\`

**Obter usuário atual:**
  \`@GetMapping("/me")
  public User getCurrentUser(@AuthenticationPrincipal UserDetails user) {
      return userService.findByUsername(user.getUsername());
  }\``,
        },
        {
          heading: "📖 Configuração",
          content: `**application.properties:**
  \`# Server
  server.port=8080

  # Database
  spring.datasource.url=jdbc:postgresql://localhost:5432/db
  spring.datasource.username=user
  spring.datasource.password=pass
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.show-sql=true

  # Custom
  app.name=MyApp
  app.jwt.secret=\${JWT_SECRET}
  app.jwt.expiration=86400000\`

**application.yml:**
  \`spring:
    profiles:
      active: dev
    datasource:
      url: jdbc:postgresql://localhost:5432/db
    jpa:
      hibernate:
        ddl-auto: update

  app:
    name: MyApp
    jwt:
      secret: \${JWT_SECRET}
      expiration: 86400000\`

**@Profile:**
  \`@Configuration
  @Profile("dev")
  public class DevConfig { }

  @Configuration  
  @Profile("prod")
  public class ProdConfig { }\``,
        },
        {
          heading: "📖 Testes",
          content: `**@SpringBootTest** — teste de integração
  \`@SpringBootTest
  class UserServiceTest {
      @Autowired
      private UserService userService;
      
      @Test
      void shouldCreateUser() {
          User user = userService.create(new UserDTO("Ana", "ana@email.com"));
          assertThat(user.getId()).isNotNull();
      }
  }\`

**@WebMvcTest** — teste de controller
  \`@WebMvcTest(UserController.class)
  class UserControllerTest {
      @Autowired
      private MockMvc mockMvc;
      
      @MockBean
      private UserService userService;
      
      @Test
      void shouldReturnUsers() throws Exception {
          when(userService.findAll()).thenReturn(List.of(new User("Ana")));
          
          mockMvc.perform(get("/api/users"))
              .andExpect(status().isOk())
              .andExpect(jsonPath("$[0].name").value("Ana"));
      }
  }\`

**@DataJpaTest** — teste de repository
  \`@DataJpaTest
  class UserRepositoryTest {
      @Autowired
      private UserRepository repository;
      
      @Test
      void shouldFindByEmail() {
          repository.save(new User("Ana", "ana@email.com"));
          Optional<User> found = repository.findByEmail("ana@email.com");
          assertThat(found).isPresent();
      }
  }\``,
        },
      ],
      keyTopics: [
        "@SpringBootApplication, @Component",
        "@Service, @Repository, @Bean",
        "@Autowired, @Value, constructor injection",
        "@RestController, @GetMapping, @PostMapping",
        "@Entity, JpaRepository, @Query",
        "@Valid, @NotNull, @Email, @Size",
        "@ControllerAdvice, @ExceptionHandler",
        "SecurityFilterChain, @PreAuthorize",
      ],
    },

    Django: {
      title: "Django - Dicionário de Comandos",
      introduction:
        "Referência completa de Django. Models, Views, URLs, Templates, Forms e REST Framework.",
      sections: [
        {
          heading: "📖 Comandos Django",
          content: `**Criar projeto:**
  \`django-admin startproject myproject
  cd myproject\`

**Criar app:**
  \`python manage.py startapp myapp\`

**Migrations:**
  \`python manage.py makemigrations    # gera migrations
  python manage.py migrate            # aplica migrations
  python manage.py showmigrations     # lista status\`

**Servidor de desenvolvimento:**
  \`python manage.py runserver
  python manage.py runserver 0.0.0.0:8000\`

**Superusuário:**
  \`python manage.py createsuperuser\`

**Shell:**
  \`python manage.py shell             # shell Python
  python manage.py dbshell            # shell do banco\`

**Testes:**
  \`python manage.py test
  python manage.py test myapp.tests\`

**Coletar static files:**
  \`python manage.py collectstatic\``,
        },
        {
          heading: "📖 Models",
          content: `**Model básico:**
  \`from django.db import models

  class User(models.Model):
      name = models.CharField(max_length=100)
      email = models.EmailField(unique=True)
      age = models.IntegerField(null=True, blank=True)
      active = models.BooleanField(default=True)
      created_at = models.DateTimeField(auto_now_add=True)
      updated_at = models.DateTimeField(auto_now=True)
      
      def __str__(self):
          return self.name\`

**Tipos de Fields:**
  \`CharField(max_length=100)
  TextField()
  IntegerField(), FloatField(), DecimalField()
  BooleanField(default=False)
  DateField(), DateTimeField(), TimeField()
  EmailField(), URLField(), SlugField()
  FileField(upload_to='files/')
  ImageField(upload_to='images/')
  JSONField()\`

**Opções de Field:**
  \`null=True          # permite NULL no banco
  blank=True         # permite vazio no form
  default="valor"    # valor padrão
  unique=True        # único
  choices=[(1, "Opção 1"), (2, "Opção 2")]\`

**Meta:**
  \`class Meta:
      ordering = ['-created_at']
      verbose_name = 'Usuário'
      verbose_name_plural = 'Usuários'
      db_table = 'custom_users'\``,
        },
        {
          heading: "📖 Relacionamentos",
          content: `**ForeignKey (Many-to-One):**
  \`class Post(models.Model):
      author = models.ForeignKey(
          User,
          on_delete=models.CASCADE,  # deleta posts se user deletado
          related_name='posts'
      )
      title = models.CharField(max_length=200)\`

**on_delete options:**
  \`CASCADE      # deleta relacionados
  PROTECT      # impede deleção
  SET_NULL     # define como NULL
  SET_DEFAULT  # usa valor default
  DO_NOTHING   # não faz nada\`

**OneToOneField:**
  \`class Profile(models.Model):
      user = models.OneToOneField(User, on_delete=models.CASCADE)
      bio = models.TextField()\`

**ManyToManyField:**
  \`class Post(models.Model):
      tags = models.ManyToManyField(Tag, related_name='posts')
      
  # Com tabela intermediária customizada
  class Post(models.Model):
      authors = models.ManyToManyField(User, through='PostAuthor')

  class PostAuthor(models.Model):
      post = models.ForeignKey(Post, on_delete=models.CASCADE)
      user = models.ForeignKey(User, on_delete=models.CASCADE)
      role = models.CharField(max_length=50)  # campo extra\``,
        },
        {
          heading: "📖 QuerySet API",
          content: `**Buscar:**
  \`User.objects.all()
  User.objects.get(id=1)             # único ou exceção
  User.objects.get_or_create(email='x@y.com')
  User.objects.first()
  User.objects.last()\`

**Filtrar:**
  \`User.objects.filter(active=True)
  User.objects.filter(age__gte=18)   # >= 18
  User.objects.filter(name__icontains='ana')
  User.objects.exclude(status='banned')
  User.objects.filter(created_at__year=2024)\`

**Lookups:**
  \`__exact, __iexact         # igual (case sensitive/insensitive)
  __contains, __icontains   # contém
  __startswith, __endswith  # começa/termina com
  __gt, __gte, __lt, __lte  # >, >=, <, <=
  __in                      # em lista
  __isnull                  # é null
  __range                   # entre valores\`

**Ordenar e limitar:**
  \`User.objects.order_by('name')
  User.objects.order_by('-created_at')  # descending
  User.objects.all()[:10]               # LIMIT 10
  User.objects.all()[5:15]              # OFFSET 5, LIMIT 10\`

**Aggregations:**
  \`from django.db.models import Count, Sum, Avg, Max
  
  User.objects.count()
  User.objects.aggregate(avg_age=Avg('age'))
  User.objects.values('city').annotate(total=Count('id'))\`

**Q objects (OR, AND complexo):**
  \`from django.db.models import Q
  
  User.objects.filter(Q(name='Ana') | Q(name='Bob'))
  User.objects.filter(Q(active=True) & ~Q(role='admin'))\``,
        },
        {
          heading: "📖 Views",
          content: `**Function-based view:**
  \`from django.shortcuts import render, get_object_or_404
  from django.http import JsonResponse

  def user_list(request):
      users = User.objects.filter(active=True)
      return render(request, 'users/list.html', {'users': users})

  def user_detail(request, pk):
      user = get_object_or_404(User, pk=pk)
      return render(request, 'users/detail.html', {'user': user})

  def api_users(request):
      users = list(User.objects.values('id', 'name'))
      return JsonResponse({'users': users})\`

**Class-based views:**
  \`from django.views.generic import ListView, DetailView, CreateView

  class UserListView(ListView):
      model = User
      template_name = 'users/list.html'
      context_object_name = 'users'
      paginate_by = 10
      
      def get_queryset(self):
          return User.objects.filter(active=True)

  class UserDetailView(DetailView):
      model = User
      template_name = 'users/detail.html'

  class UserCreateView(CreateView):
      model = User
      fields = ['name', 'email']
      success_url = '/users/'\`

**Decorators:**
  \`from django.contrib.auth.decorators import login_required

  @login_required
  def profile(request):
      return render(request, 'profile.html')\``,
        },
        {
          heading: "📖 URLs",
          content: `**urls.py básico:**
  \`from django.urls import path, include
  from . import views

  urlpatterns = [
      path('', views.home, name='home'),
      path('users/', views.user_list, name='user-list'),
      path('users/<int:pk>/', views.user_detail, name='user-detail'),
      path('users/<slug:username>/', views.user_by_username),
  ]\`

**Include (app urls):**
  \`# projeto/urls.py
  urlpatterns = [
      path('admin/', admin.site.urls),
      path('api/', include('api.urls')),
      path('users/', include('users.urls')),
  ]\`

**Nomeando URLs:**
  \`path('posts/<int:pk>/', views.post_detail, name='post-detail')
  
  # No template
  <a href="{% url 'post-detail' pk=post.id %}">Ver</a>
  
  # No Python
  from django.urls import reverse
  url = reverse('post-detail', kwargs={'pk': 1})\`

**Converters:**
  \`<int:pk>      # inteiro
  <str:name>    # string (sem /)
  <slug:slug>   # letras, números, -, _
  <uuid:id>     # UUID
  <path:path>   # inclui /\``,
        },
        {
          heading: "📖 Templates",
          content: `**Variáveis:**
  \`{{ user.name }}
  {{ user.email|lower }}
  {{ post.created_at|date:"d/m/Y" }}
  {{ lista|length }}
  {{ texto|truncatewords:30 }}\`

**Tags:**
  \`{% if user.is_authenticated %}
      Olá, {{ user.name }}
  {% else %}
      <a href="{% url 'login' %}">Login</a>
  {% endif %}

  {% for post in posts %}
      <h2>{{ post.title }}</h2>
      {% empty %}
      <p>Nenhum post.</p>
  {% endfor %}

  {% include 'partials/header.html' %}\`

**Herança de templates:**
  \`<!-- base.html -->
  <!DOCTYPE html>
  <html>
  <head><title>{% block title %}Site{% endblock %}</title></head>
  <body>
      {% block content %}{% endblock %}
  </body>
  </html>

  <!-- home.html -->
  {% extends 'base.html' %}
  {% block title %}Home{% endblock %}
  {% block content %}
      <h1>Bem-vindo!</h1>
  {% endblock %}\`

**Static files:**
  \`{% load static %}
  <link rel="stylesheet" href="{% static 'css/style.css' %}">
  <img src="{% static 'images/logo.png' %}">\``,
        },
        {
          heading: "📖 Forms",
          content: `**Form básico:**
  \`from django import forms

  class ContactForm(forms.Form):
      name = forms.CharField(max_length=100)
      email = forms.EmailField()
      message = forms.CharField(widget=forms.Textarea)\`

**ModelForm:**
  \`from django.forms import ModelForm

  class UserForm(ModelForm):
      class Meta:
          model = User
          fields = ['name', 'email', 'age']
          # ou: exclude = ['password']
          widgets = {
              'age': forms.NumberInput(attrs={'min': 0})
          }\`

**View com form:**
  \`def contact(request):
      if request.method == 'POST':
          form = ContactForm(request.POST)
          if form.is_valid():
              # form.cleaned_data['name']
              # processar...
              return redirect('success')
      else:
          form = ContactForm()
      return render(request, 'contact.html', {'form': form})\`

**Template:**
  \`<form method="post">
      {% csrf_token %}
      {{ form.as_p }}
      <button type="submit">Enviar</button>
  </form>

  <!-- Ou render manual -->
  <form method="post">
      {% csrf_token %}
      <input name="{{ form.name.name }}" value="{{ form.name.value }}">
      {% if form.name.errors %}
          <span class="error">{{ form.name.errors }}</span>
      {% endif %}
  </form>\``,
        },
        {
          heading: "📖 Django REST Framework",
          content: `**Instalar:**
  \`pip install djangorestframework\`

**Serializer:**
  \`from rest_framework import serializers

  class UserSerializer(serializers.ModelSerializer):
      class Meta:
          model = User
          fields = ['id', 'name', 'email', 'created_at']
          read_only_fields = ['created_at']\`

**ViewSet:**
  \`from rest_framework import viewsets
  from rest_framework.permissions import IsAuthenticated

  class UserViewSet(viewsets.ModelViewSet):
      queryset = User.objects.all()
      serializer_class = UserSerializer
      permission_classes = [IsAuthenticated]
      
      def get_queryset(self):
          return User.objects.filter(active=True)\`

**Router:**
  \`from rest_framework.routers import DefaultRouter

  router = DefaultRouter()
  router.register(r'users', UserViewSet)

  urlpatterns = [
      path('api/', include(router.urls)),
  ]\`

**APIView:**
  \`from rest_framework.views import APIView
  from rest_framework.response import Response

  class UserList(APIView):
      def get(self, request):
          users = User.objects.all()
          serializer = UserSerializer(users, many=True)
          return Response(serializer.data)
      
      def post(self, request):
          serializer = UserSerializer(data=request.data)
          if serializer.is_valid():
              serializer.save()
              return Response(serializer.data, status=201)
          return Response(serializer.errors, status=400)\``,
        },
      ],
      keyTopics: [
        "manage.py: runserver, migrate",
        "Model: CharField, ForeignKey",
        "on_delete, related_name",
        "QuerySet: filter, exclude, get",
        "Views: FBV, CBV, generic views",
        "URLconf: path, include, name",
        "Templates: {{ }}, {% %}, extends",
        "Forms: ModelForm, is_valid()",
        "DRF: Serializer, ViewSet, Router",
      ],
    },

    Laravel: {
      title: "Laravel - Dicionário de Comandos",
      introduction:
        "Referência completa de Laravel. Eloquent, Routing, Controllers, Blade e Artisan.",
      sections: [
        {
          heading: "📖 Artisan CLI",
          content: `**Criar projeto:**
  \`composer create-project laravel/laravel myapp
  cd myapp && php artisan serve\`

**Make commands:**
  \`php artisan make:model User -mcrf
  # -m = migration, -c = controller, -r = resource, -f = factory

  php artisan make:controller UserController --resource
  php artisan make:migration create_posts_table
  php artisan make:seeder UserSeeder
  php artisan make:middleware CheckAge
  php artisan make:request StorePostRequest
  php artisan make:job ProcessPodcast
  php artisan make:event OrderShipped
  php artisan make:listener SendNotification\`

**Migrations:**
  \`php artisan migrate
  php artisan migrate:rollback
  php artisan migrate:fresh          # drop all + migrate
  php artisan migrate:fresh --seed   # com seeders\`

**Outros:**
  \`php artisan db:seed
  php artisan route:list
  php artisan config:cache
  php artisan cache:clear
  php artisan tinker               # REPL\``,
        },
        {
          heading: "📖 Eloquent Models",
          content: `**Model básico:**
  \`<?php
  namespace App\\Models;

  use Illuminate\\Database\\Eloquent\\Model;

  class User extends Model
  {
      protected $fillable = ['name', 'email', 'password'];
      protected $hidden = ['password'];
      protected $casts = [
          'email_verified_at' => 'datetime',
          'settings' => 'array',
      ];
  }\`

**Convenções:**
  \`Model User → tabela users
  Primary key: id
  Timestamps: created_at, updated_at\`

**Customizar:**
  \`protected $table = 'my_users';
  protected $primaryKey = 'user_id';
  public $timestamps = false;\`

**Accessors / Mutators:**
  \`// Laravel 9+
  protected function name(): Attribute
  {
      return Attribute::make(
          get: fn ($value) => ucfirst($value),
          set: fn ($value) => strtolower($value),
      );
  }\`

**Scopes:**
  \`// Local scope
  public function scopeActive($query)
  {
      return $query->where('active', true);
  }
  
  // Uso
  User::active()->get();\``,
        },
        {
          heading: "📖 Eloquent Queries",
          content: `**CRUD básico:**
  \`// Create
  $user = User::create(['name' => 'Ana', 'email' => 'ana@email.com']);
  $user = new User();
  $user->name = 'Ana';
  $user->save();

  // Read
  $users = User::all();
  $user = User::find(1);
  $user = User::findOrFail(1);
  $user = User::firstOrCreate(['email' => 'ana@email.com']);

  // Update
  $user->update(['name' => 'Ana Silva']);
  User::where('active', false)->update(['active' => true]);

  // Delete
  $user->delete();
  User::destroy([1, 2, 3]);\`

**Where clauses:**
  \`User::where('age', '>=', 18)->get();
  User::where('status', 'active')
      ->where('role', 'admin')
      ->get();
  User::where('age', '>=', 18)
      ->orWhere('role', 'admin')
      ->get();
  User::whereIn('id', [1, 2, 3])->get();
  User::whereNotNull('email_verified_at')->get();
  User::whereBetween('age', [18, 65])->get();\`

**Ordenar e limitar:**
  \`User::orderBy('name')->get();
  User::orderByDesc('created_at')->get();
  User::latest()->take(10)->get();
  User::oldest()->first();\`

**Agregações:**
  \`User::count();
  User::max('age');
  User::avg('salary');
  User::sum('balance');\``,
        },
        {
          heading: "📖 Relacionamentos",
          content: `**One to Many:**
  \`// User has many Posts
  class User extends Model {
      public function posts() {
          return $this->hasMany(Post::class);
      }
  }

  // Post belongs to User  
  class Post extends Model {
      public function user() {
          return $this->belongsTo(User::class);
      }
  }

  // Uso
  $user->posts;              // Collection
  $post->user;               // User
  $user->posts()->create(['title' => 'Novo post']);\`

**Many to Many:**
  \`class User extends Model {
      public function roles() {
          return $this->belongsToMany(Role::class);
      }
  }

  // Uso
  $user->roles;
  $user->roles()->attach($roleId);
  $user->roles()->detach($roleId);
  $user->roles()->sync([1, 2, 3]);\`

**One to One:**
  \`public function profile() {
      return $this->hasOne(Profile::class);
  }\`

**Eager Loading:**
  \`User::with('posts')->get();
  User::with(['posts', 'profile'])->get();
  User::with('posts.comments')->get();   // nested\``,
        },
        {
          heading: "📖 Migrations",
          content: `**Criar migration:**
  \`php artisan make:migration create_posts_table
  php artisan make:migration add_status_to_posts_table\`

**Schema:**
  \`use Illuminate\\Database\\Schema\\Blueprint;
  use Illuminate\\Support\\Facades\\Schema;

  public function up()
  {
      Schema::create('posts', function (Blueprint $table) {
          $table->id();
          $table->foreignId('user_id')->constrained()->onDelete('cascade');
          $table->string('title');
          $table->text('content')->nullable();
          $table->enum('status', ['draft', 'published'])->default('draft');
          $table->boolean('featured')->default(false);
          $table->json('metadata')->nullable();
          $table->timestamps();
          $table->softDeletes();
          
          $table->index('status');
          $table->unique(['user_id', 'slug']);
      });
  }

  public function down()
  {
      Schema::dropIfExists('posts');
  }\`

**Modificar tabela:**
  \`Schema::table('posts', function (Blueprint $table) {
      $table->string('slug')->after('title');
      $table->dropColumn('old_column');
  });\``,
        },
        {
          heading: "📖 Routing",
          content: `**Routes básicas (routes/web.php ou routes/api.php):**
  \`use App\\Http\\Controllers\\UserController;

  Route::get('/users', [UserController::class, 'index']);
  Route::get('/users/{id}', [UserController::class, 'show']);
  Route::post('/users', [UserController::class, 'store']);
  Route::put('/users/{id}', [UserController::class, 'update']);
  Route::delete('/users/{id}', [UserController::class, 'destroy']);\`

**Resource controller:**
  \`Route::resource('posts', PostController::class);
  // Gera: index, create, store, show, edit, update, destroy

  Route::apiResource('posts', PostController::class);
  // Sem create e edit (API only)\`

**Route model binding:**
  \`Route::get('/posts/{post}', function (Post $post) {
      return $post;  // injeta automaticamente
  });\`

**Grupos e Middleware:**
  \`Route::middleware(['auth', 'verified'])->group(function () {
      Route::get('/dashboard', [DashboardController::class, 'index']);
  });

  Route::prefix('admin')->group(function () {
      Route::get('/users', [AdminController::class, 'users']);
  });\`

**Named routes:**
  \`Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
  
  // Uso
  return redirect()->route('users.show', ['id' => 1]);\``,
        },
        {
          heading: "📖 Controllers",
          content: `**Controller básico:**
  \`<?php
  namespace App\\Http\\Controllers;

  use App\\Models\\User;
  use Illuminate\\Http\\Request;

  class UserController extends Controller
  {
      public function index()
      {
          $users = User::paginate(10);
          return view('users.index', compact('users'));
      }

      public function show(User $user)
      {
          return view('users.show', compact('user'));
      }

      public function store(Request $request)
      {
          $validated = $request->validate([
              'name' => 'required|string|max:255',
              'email' => 'required|email|unique:users',
          ]);

          $user = User::create($validated);
          return redirect()->route('users.show', $user);
      }
  }\`

**API Controller:**
  \`public function index()
  {
      return User::all();  // JSON automático
  }

  public function store(Request $request)
  {
      $user = User::create($request->validated());
      return response()->json($user, 201);
  }\`

**Form Request:**
  \`// php artisan make:request StoreUserRequest
  class StoreUserRequest extends FormRequest
  {
      public function rules()
      {
          return [
              'name' => 'required|string|max:255',
              'email' => 'required|email|unique:users',
          ];
      }
  }\``,
        },
        {
          heading: "📖 Blade Templates",
          content: `**Variáveis e escape:**
  \`{{ $user->name }}              // com escape
  {!! $html !!}                  // sem escape\`

**Condicionais:**
  \`@if($user->isAdmin())
      <span>Admin</span>
  @elseif($user->isModerator())
      <span>Moderador</span>
  @else
      <span>Usuário</span>
  @endif

  @auth
      Olá, {{ Auth::user()->name }}
  @endauth

  @guest
      <a href="/login">Login</a>
  @endguest\`

**Loops:**
  \`@foreach($users as $user)
      <p>{{ $user->name }}</p>
  @endforeach

  @forelse($users as $user)
      <p>{{ $user->name }}</p>
  @empty
      <p>Nenhum usuário.</p>
  @endforelse

  @for($i = 0; $i < 10; $i++)
      <span>{{ $i }}</span>
  @endfor\`

**Layouts:**
  \`<!-- resources/views/layouts/app.blade.php -->
  <!DOCTYPE html>
  <html>
  <head>
      <title>@yield('title')</title>
  </head>
  <body>
      @yield('content')
  </body>
  </html>

  <!-- resources/views/home.blade.php -->
  @extends('layouts.app')
  @section('title', 'Home')
  @section('content')
      <h1>Bem-vindo!</h1>
  @endsection\`

**Components:**
  \`<x-alert type="error" :message="$msg" />

  <!-- resources/views/components/alert.blade.php -->
  <div class="alert alert-{{ $type }}">
      {{ $message }}
  </div>\``,
        },
        {
          heading: "📖 Features Avançadas",
          content: `**Authentication:**
  \`// Laravel Breeze ou Jetstream
  composer require laravel/breeze
  php artisan breeze:install
  npm install && npm run dev
  php artisan migrate\`

**Middleware:**
  \`// app/Http/Middleware/CheckAge.php
  public function handle($request, Closure $next)
  {
      if ($request->age < 18) {
          return redirect('home');
      }
      return $next($request);
  }

  // Registrar em app/Http/Kernel.php
  'check.age' => \\App\\Http\\Middleware\\CheckAge::class\`

**Jobs e Queues:**
  \`// Criar job
  php artisan make:job ProcessOrder

  // Dispatch
  ProcessOrder::dispatch($order);
  ProcessOrder::dispatch($order)->delay(now()->addMinutes(10));

  // Executar worker
  php artisan queue:work\`

**Events:**
  \`// Dispatch event
  event(new OrderPlaced($order));

  // Listener
  class SendOrderNotification
  {
      public function handle(OrderPlaced $event)
      {
          // $event->order
      }
  }\`

**Cache:**
  \`Cache::get('key');
  Cache::put('key', 'value', 3600);  // 1 hora
  Cache::remember('users', 3600, fn() => User::all());\``,
        },
      ],
      keyTopics: [
        "artisan make:model -mcrf",
        "Eloquent: fillable, casts, scopes",
        "where, with, paginate",
        "hasMany, belongsTo, belongsToMany",
        "Schema::create, migrations",
        "Route::resource, middleware",
        "Controller: validate, redirect",
        "@if, @foreach, @extends, @yield",
        "Jobs, Events, Cache, Auth",
      ],
    },

    "Vue.js": {
      title: "Vue.js - Dicionário de Sintaxe",
      introduction:
        "Referência completa de Vue 3. Composition API, diretivas, componentes e ecossistema.",
      sections: [
        {
          heading: "📖 Setup Composition API",
          content: `**Single File Component (SFC):**
  \`<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'

  const count = ref(0)
  const doubled = computed(() => count.value * 2)

  const increment = () => {
    count.value++
  }

  onMounted(() => {
    console.log('Componente montado')
  })
  </script>

  <template>
    <button @click="increment">
      Count: {{ count }} ({{ doubled }})
    </button>
  </template>

  <style scoped>
  button { padding: 1rem; }
  </style>\`

**<script setup>** — não precisa return
  \`// Tudo no <script setup> fica disponível no template
  const name = ref('Ana')
  const user = reactive({ name: 'Ana', age: 25 })\`

**defineProps / defineEmits:**
  \`const props = defineProps<{
    title: string
    count?: number
  }>()

  const emit = defineEmits<{
    (e: 'update', value: number): void
  }>()\``,
        },
        {
          heading: "📖 Reatividade",
          content: `**ref** — valor reativo (primitivos)
  \`import { ref } from 'vue'

  const count = ref(0)
  const name = ref('Ana')

  // Acessar/modificar com .value
  count.value++
  console.log(count.value)

  // No template, .value é automático
  // {{ count }} — não {{ count.value }}\`

**reactive** — objeto reativo
  \`import { reactive } from 'vue'

  const user = reactive({
    name: 'Ana',
    age: 25
  })

  // Sem .value
  user.name = 'Ana Silva'
  user.age++\`

**computed** — valor derivado (cache automático)
  \`import { computed } from 'vue'

  const firstName = ref('Ana')
  const lastName = ref('Silva')

  const fullName = computed(() => {
    return \`\${firstName.value} \${lastName.value}\`
  })

  // Computed writable
  const fullName = computed({
    get: () => \`\${firstName.value} \${lastName.value}\`,
    set: (value) => {
      const [first, last] = value.split(' ')
      firstName.value = first
      lastName.value = last
    }
  })\`

**watch** — observar mudanças
  \`import { watch, watchEffect } from 'vue'

  watch(count, (newVal, oldVal) => {
    console.log(\`count mudou de \${oldVal} para \${newVal}\`)
  })

  // Watch múltiplos
  watch([firstName, lastName], ([newFirst, newLast]) => {
    console.log(\`Nome: \${newFirst} \${newLast}\`)
  })

  // watchEffect — executa imediatamente
  watchEffect(() => {
    console.log(\`Count é \${count.value}\`)
  })\``,
        },
        {
          heading: "📖 Diretivas",
          content: `**v-bind (:)** — binding de atributos
  \`<img :src="imageUrl">
  <button :disabled="isLoading">
  <div :class="{ active: isActive }">
  <div :class="[baseClass, activeClass]">
  <div :style="{ color: textColor, fontSize: '14px' }">\`

**v-on (@)** — eventos
  \`<button @click="handleClick">
  <button @click="count++">
  <input @input="onInput">
  <form @submit.prevent="onSubmit">
  <input @keyup.enter="submit">
  <button @click.stop="handleClick">  <!-- stop propagation -->\`

**v-model** — two-way binding
  \`<input v-model="name">
  <input v-model.lazy="name">     <!-- on blur -->
  <input v-model.number="age">    <!-- converte para number -->
  <input v-model.trim="text">     <!-- remove espaços -->\`

**v-if / v-else / v-show:**
  \`<div v-if="type === 'A'">Tipo A</div>
  <div v-else-if="type === 'B'">Tipo B</div>
  <div v-else>Outro</div>

  <div v-show="isVisible">  <!-- toggle display -->\`

**v-for** — loops
  \`<li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <li v-for="(item, index) in items" :key="item.id">
    {{ index }}: {{ item.name }}
  </li>

  <template v-for="item in items" :key="item.id">
    <h3>{{ item.title }}</h3>
    <p>{{ item.content }}</p>
  </template>\``,
        },
        {
          heading: "📖 Componentes",
          content: `**Props:**
  \`// Child.vue
  <script setup>
  const props = defineProps({
    title: String,
    count: { type: Number, required: true },
    items: { type: Array, default: () => [] }
  })
  </script>

  // Com TypeScript
  const props = defineProps<{
    title: string
    count: number
    items?: string[]
  }>()\`

**Emits:**
  \`// Child.vue
  <script setup>
  const emit = defineEmits(['update', 'delete'])

  const handleClick = () => {
    emit('update', { id: 1, name: 'Ana' })
  }
  </script>

  // Parent.vue
  <Child @update="handleUpdate" />\`

**v-model em componente:**
  \`// Child.vue
  <script setup>
  const model = defineModel<string>()
  </script>
  <template>
    <input :value="model" @input="model = $event.target.value">
  </template>

  // Parent.vue
  <Child v-model="name" />\`

**Slots:**
  \`// Child.vue
  <template>
    <div class="card">
      <slot>Conteúdo padrão</slot>
      <slot name="footer"></slot>
    </div>
  </template>

  // Parent.vue
  <Child>
    <p>Conteúdo principal</p>
    <template #footer>
      <button>Ação</button>
    </template>
  </Child>\``,
        },
        {
          heading: "📖 Lifecycle Hooks",
          content: `**onMounted** — após montar no DOM
  \`import { onMounted } from 'vue'

  onMounted(() => {
    console.log('Componente montado')
    fetchData()
  })\`

**onUnmounted** — antes de desmontar
  \`import { onUnmounted } from 'vue'

  onUnmounted(() => {
    clearInterval(intervalId)
  })\`

**onUpdated** — após rerender
  \`onUpdated(() => {
    console.log('DOM atualizado')
  })\`

**onBeforeMount / onBeforeUnmount / onBeforeUpdate:**
  \`onBeforeMount(() => { })
  onBeforeUnmount(() => { })
  onBeforeUpdate(() => { })\`

**Ordem de execução:**
  1. setup()
  2. onBeforeMount
  3. onMounted
  4. onBeforeUpdate (quando reativo muda)
  5. onUpdated
  6. onBeforeUnmount
  7. onUnmounted`,
        },
        {
          heading: "📖 Composables",
          content: `**Criar composable:**
  \`// composables/useMouse.ts
  import { ref, onMounted, onUnmounted } from 'vue'

  export function useMouse() {
    const x = ref(0)
    const y = ref(0)

    const update = (event: MouseEvent) => {
      x.value = event.pageX
      y.value = event.pageY
    }

    onMounted(() => window.addEventListener('mousemove', update))
    onUnmounted(() => window.removeEventListener('mousemove', update))

    return { x, y }
  }

  // Uso
  import { useMouse } from '@/composables/useMouse'

  const { x, y } = useMouse()\`

**useFetch composable:**
  \`export function useFetch<T>(url: string) {
    const data = ref<T | null>(null)
    const error = ref<Error | null>(null)
    const loading = ref(true)

    fetch(url)
      .then(res => res.json())
      .then(json => data.value = json)
      .catch(err => error.value = err)
      .finally(() => loading.value = false)

    return { data, error, loading }
  }

  // Uso
  const { data, loading, error } = useFetch<User[]>('/api/users')\`

**Convenção:** prefixo \`use\` (useMouse, useFetch, useAuth)`,
        },
        {
          heading: "📖 Vue Router",
          content: `**Configurar router:**
  \`// router/index.ts
  import { createRouter, createWebHistory } from 'vue-router'
  import Home from '@/views/Home.vue'

  const routes = [
    { path: '/', component: Home },
    { path: '/about', component: () => import('@/views/About.vue') },
    { path: '/users/:id', component: () => import('@/views/User.vue') },
    { path: '/:pathMatch(.*)*', component: NotFound }
  ]

  export const router = createRouter({
    history: createWebHistory(),
    routes
  })\`

**Usar no componente:**
  \`import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  // Parâmetros
  const userId = route.params.id
  const query = route.query.search

  // Navegação
  router.push('/users')
  router.push({ name: 'user', params: { id: 1 } })
  router.replace('/login')
  router.go(-1)  // voltar\`

**Template:**
  \`<router-link to="/">Home</router-link>
  <router-link :to="{ name: 'user', params: { id: 1 } }">User</router-link>
  <router-view />\`

**Navigation Guards:**
  \`router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !isLoggedIn()) {
      return '/login'
    }
  })\``,
        },
        {
          heading: "📖 Pinia (State)",
          content: `**Criar store:**
  \`// stores/counter.ts
  import { defineStore } from 'pinia'
  import { ref, computed } from 'vue'

  export const useCounterStore = defineStore('counter', () => {
    // State
    const count = ref(0)
    
    // Getters
    const doubleCount = computed(() => count.value * 2)
    
    // Actions
    function increment() {
      count.value++
    }
    
    async function fetchCount() {
      const res = await fetch('/api/count')
      count.value = await res.json()
    }

    return { count, doubleCount, increment, fetchCount }
  })\`

**Usar store:**
  \`import { useCounterStore } from '@/stores/counter'

  const counter = useCounterStore()

  // State
  console.log(counter.count)

  // Actions
  counter.increment()
  await counter.fetchCount()

  // Com storeToRefs para reatividade
  import { storeToRefs } from 'pinia'
  const { count, doubleCount } = storeToRefs(counter)\`

**Setup Pinia:**
  \`// main.ts
  import { createPinia } from 'pinia'

  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')\``,
        },
        {
          heading: "📖 Utilities",
          content: `**provide / inject:**
  \`// Parent
  import { provide } from 'vue'
  provide('theme', ref('dark'))

  // Child (qualquer nível)
  import { inject } from 'vue'
  const theme = inject('theme')\`

**toRef / toRefs:**
  \`const user = reactive({ name: 'Ana', age: 25 })

  // Extrair ref de reactive
  const nameRef = toRef(user, 'name')
  const { name, age } = toRefs(user)\`

**nextTick** — após próximo update do DOM
  \`import { nextTick } from 'vue'

  count.value++
  await nextTick()
  // DOM atualizado aqui\`

**defineExpose** — expor para parent via ref
  \`<script setup>
  const internalMethod = () => { }
  defineExpose({ internalMethod })
  </script>

  // Parent
  <Child ref="childRef" />
  childRef.value.internalMethod()\`

**Teleport:**
  \`<Teleport to="body">
    <div class="modal">Modal content</div>
  </Teleport>\`

**Suspense:**
  \`<Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <Loading />
    </template>
  </Suspense>\``,
        },
      ],
      keyTopics: [
        "<script setup>, defineProps, defineEmits",
        "ref(), reactive(), computed()",
        "watch(), watchEffect()",
        "v-bind (:), v-on (@), v-model",
        "v-if, v-for, slots",
        "onMounted, onUnmounted",
        "Composables: useMouse, useFetch",
        "Vue Router: useRoute, useRouter",
        "Pinia: defineStore, storeToRefs",
      ],
    },

    Angular: {
      title: "Angular - Dicionário de Sintaxe",
      introduction:
        "Referência completa de Angular. Components, Services, RxJS, Routing e Forms.",
      sections: [
        {
          heading: "📖 Angular CLI",
          content: `**Criar projeto:**
  \`ng new my-app
  cd my-app && ng serve\`

**Generate:**
  \`ng g component user        # ou ng generate component
  ng g service user
  ng g module admin --routing
  ng g directive highlight
  ng g pipe format-date
  ng g guard auth
  ng g interface user
  ng g class models/user
  ng g enum status\`

**Build:**
  \`ng build
  ng build --configuration production\`

**Testes:**
  \`ng test              # unit tests (Karma)
  ng e2e               # end-to-end (Cypress/Playwright)\`

**Outros:**
  \`ng lint
  ng update
  ng add @angular/material\``,
        },
        {
          heading: "📖 Componentes",
          content: `**@Component:**
  \`import { Component } from '@angular/core';

  @Component({
    selector: 'app-user',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.css'
  })
  export class UserComponent {
    name = 'Ana';
    age = 25;

    greet() {
      return \`Olá, \${this.name}!\`;
    }
  }\`

**Inline template:**
  \`@Component({
    selector: 'app-hello',
    standalone: true,
    template: \`
      <h1>{{ title }}</h1>
      <button (click)="onClick()">Click</button>
    \`,
    styles: [\`h1 { color: blue; }\`]
  })
  export class HelloComponent {
    title = 'Hello World';
    onClick() { console.log('clicked'); }
  }\`

**Standalone component (Angular 14+):**
  \`@Component({
    standalone: true,
    imports: [CommonModule, RouterModule, UserComponent],
    // ...
  })\``,
        },
        {
          heading: "📖 Template Syntax",
          content: `**Interpolation:**
  \`{{ user.name }}
  {{ getFullName() }}
  {{ price | currency:'BRL' }}\`

**Property binding []:**
  \`<img [src]="imageUrl">
  <button [disabled]="isLoading">
  <div [class.active]="isActive">
  <div [style.color]="textColor">
  <div [ngClass]="{ active: isActive, disabled: isDisabled }">
  <div [ngStyle]="{ 'font-size': fontSize + 'px' }">\`

**Event binding ():**
  \`<button (click)="handleClick()">
  <button (click)="handleClick($event)">
  <input (input)="onInput($event)">
  <input (keyup.enter)="onEnter()">
  <form (ngSubmit)="onSubmit()">\`

**Two-way binding [(ngModel)]:**
  \`import { FormsModule } from '@angular/forms';

  <input [(ngModel)]="name">
  <!-- equivale a -->
  <input [ngModel]="name" (ngModelChange)="name = $event">\`

**Template reference #:**
  \`<input #nameInput>
  <button (click)="greet(nameInput.value)">Greet</button>\``,
        },
        {
          heading: "📖 Diretivas",
          content: `**@if (Angular 17+):**
  \`@if (user) {
    <p>{{ user.name }}</p>
  } @else if (loading) {
    <p>Loading...</p>
  } @else {
    <p>No user</p>
  }\`

**@for (Angular 17+):**
  \`@for (item of items; track item.id) {
    <li>{{ item.name }}</li>
  } @empty {
    <li>No items</li>
  }\`

***ngIf (legado):**
  \`<div *ngIf="user">{{ user.name }}</div>
  <div *ngIf="user; else noUser">{{ user.name }}</div>
  <ng-template #noUser>
    <p>No user</p>
  </ng-template>\`

***ngFor (legado):**
  \`<li *ngFor="let item of items; let i = index; trackBy: trackById">
    {{ i }}: {{ item.name }}
  </li>\`

***ngSwitch:**
  \`<div [ngSwitch]="status">
    <p *ngSwitchCase="'active'">Active</p>
    <p *ngSwitchCase="'pending'">Pending</p>
    <p *ngSwitchDefault>Unknown</p>
  </div>\`

**Custom directive:**
  \`@Directive({
    selector: '[appHighlight]',
    standalone: true
  })
  export class HighlightDirective {
    @HostListener('mouseenter') onMouseEnter() {
      this.highlight('yellow');
    }
  }\``,
        },
        {
          heading: "📖 Input/Output",
          content: `**@Input() — dados pai → filho:**
  \`// child.component.ts
  @Component({...})
  export class ChildComponent {
    @Input() title!: string;
    @Input() count = 0;
  }

  // parent template
  <app-child [title]="'Hello'" [count]="10"></app-child>\`

**Required input (Angular 16+):**
  \`@Input({ required: true }) id!: string;\`

**Input transform:**
  \`@Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: numberAttribute }) count = 0;\`

**@Output() — eventos filho → pai:**
  \`// child.component.ts
  @Output() selected = new EventEmitter<User>();

  selectUser(user: User) {
    this.selected.emit(user);
  }

  // parent template
  <app-child (selected)="onUserSelected($event)"></app-child>\`

**Signals (Angular 16+):**
  \`import { signal, computed, effect } from '@angular/core';

  count = signal(0);
  doubled = computed(() => this.count() * 2);

  increment() {
    this.count.set(this.count() + 1);
    // ou this.count.update(c => c + 1);
  }

  // Effect (side effects)
  constructor() {
    effect(() => console.log('Count:', this.count()));
  }\``,
        },
        {
          heading: "📖 Services e DI",
          content: `**@Injectable:**
  \`import { Injectable, inject } from '@angular/core';
  import { HttpClient } from '@angular/common/http';

  @Injectable({
    providedIn: 'root'  // singleton global
  })
  export class UserService {
    private http = inject(HttpClient);

    getUsers() {
      return this.http.get<User[]>('/api/users');
    }

    getUser(id: number) {
      return this.http.get<User>(\`/api/users/\${id}\`);
    }

    createUser(user: User) {
      return this.http.post<User>('/api/users', user);
    }
  }\`

**inject() function (Angular 14+):**
  \`@Component({...})
  export class UserListComponent {
    private userService = inject(UserService);
    private router = inject(Router);
  }\`

**Constructor injection (legado):**
  \`constructor(
    private userService: UserService,
    private router: Router
  ) {}\`

**providedIn options:**
  \`providedIn: 'root'      // singleton app-wide
  providedIn: 'platform'  // compartilhado entre apps
  providedIn: SomeModule  // scoped ao module\``,
        },
        {
          heading: "📖 RxJS e HTTP",
          content: `**HttpClient:**
  \`import { HttpClient } from '@angular/common/http';

  // GET
  this.http.get<User[]>('/api/users').subscribe(users => {
    this.users = users;
  });

  // POST
  this.http.post<User>('/api/users', newUser).subscribe();

  // Com headers
  const headers = new HttpHeaders().set('Authorization', 'Bearer token');
  this.http.get('/api/data', { headers }).subscribe();\`

**Operadores RxJS:**
  \`import { map, filter, switchMap, catchError, tap } from 'rxjs/operators';
  import { of, throwError } from 'rxjs';

  this.http.get<User[]>('/api/users').pipe(
    map(users => users.filter(u => u.active)),
    tap(users => console.log('Fetched', users.length)),
    catchError(error => {
      console.error(error);
      return of([]);  // retorna array vazio em caso de erro
    })
  ).subscribe(users => this.users = users);\`

**switchMap** — cancelar request anterior
  \`this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.userService.search(term))
  ).subscribe(results => this.results = results);\`

**async pipe** — subscribe automático no template
  \`users$ = this.userService.getUsers();

  <ul>
    @for (user of users$ | async; track user.id) {
      <li>{{ user.name }}</li>
    }
  </ul>\``,
        },
        {
          heading: "📖 Router",
          content: `**Configurar rotas:**
  \`import { Routes } from '@angular/router';

  export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'users', component: UserListComponent },
    { path: 'users/:id', component: UserDetailComponent },
    { path: 'admin', loadChildren: () => import('./admin/routes') },
    { path: '**', component: NotFoundComponent }
  ];\`

**RouterLink:**
  \`<a routerLink="/">Home</a>
  <a [routerLink]="['/users', user.id]">User</a>
  <a routerLink="/users" [queryParams]="{ page: 1 }">Users</a>
  <a routerLink="/home" routerLinkActive="active">Home</a>\`

**Router no componente:**
  \`import { Router, ActivatedRoute } from '@angular/router';

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Navegar
  this.router.navigate(['/users', userId]);
  this.router.navigate(['/users'], { queryParams: { page: 1 } });

  // Parâmetros
  this.route.params.subscribe(params => {
    const id = params['id'];
  });

  // Query params
  this.route.queryParams.subscribe(params => {
    const page = params['page'];
  });\`

**Guards:**
  \`export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    return authService.isLoggedIn() ? true : inject(Router).parseUrl('/login');
  };

  // Na rota
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] }\``,
        },
        {
          heading: "📖 Forms",
          content: `**Reactive Forms:**
  \`import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

  @Component({
    imports: [ReactiveFormsModule],
    // ...
  })
  export class UserFormComponent {
    private fb = inject(FormBuilder);

    form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.min(0), Validators.max(120)]]
    });

    onSubmit() {
      if (this.form.valid) {
        console.log(this.form.value);
      }
    }
  }\`

**Template:**
  \`<form [formGroup]="form" (ngSubmit)="onSubmit()">
    <input formControlName="name">
    @if (form.get('name')?.invalid && form.get('name')?.touched) {
      <span class="error">Nome inválido</span>
    }

    <input formControlName="email" type="email">
    <input formControlName="age" type="number">

    <button type="submit" [disabled]="form.invalid">Salvar</button>
  </form>\`

**Template-Driven Forms:**
  \`import { FormsModule } from '@angular/forms';

  <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
    <input name="name" [(ngModel)]="user.name" required #name="ngModel">
    @if (name.invalid && name.touched) {
      <span>Required</span>
    }
    <button [disabled]="userForm.invalid">Save</button>
  </form>\``,
        },
      ],
      keyTopics: [
        "ng g component/service/module",
        "@Component, standalone, imports",
        "{{ }}, [], (), [(ngModel)]",
        "@if, @for, *ngIf, *ngFor",
        "@Input(), @Output(), signals",
        "@Injectable, inject(), HttpClient",
        "RxJS: pipe, map, switchMap, async",
        "RouterLink, ActivatedRoute, guards",
        "FormGroup, Validators, formControlName",
      ],
    },

    "Next.js": {
      title: "Next.js - Dicionário de Sintaxe",
      introduction:
        "Referência completa de Next.js 14+. App Router, Server Components, Data Fetching e API Routes.",
      sections: [
        {
          heading: "📖 Setup e CLI",
          content: `**Criar projeto:**
  \`npx create-next-app@latest my-app
  cd my-app && npm run dev\`

**Scripts package.json:**
  \`npm run dev          # desenvolvimento (localhost:3000)
  npm run build        # build produção
  npm run start        # servidor produção
  npm run lint         # linting\`

**Estrutura App Router:**
  \`app/
  ├── layout.tsx       # layout raiz (obrigatório)
  ├── page.tsx         # rota /
  ├── globals.css
  ├── users/
  │   ├── page.tsx     # /users
  │   └── [id]/
  │       └── page.tsx # /users/:id
  └── api/
      └── users/
          └── route.ts # API /api/users\`

**next.config.js:**
  \`/** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      remotePatterns: [{ hostname: 'example.com' }],
    },
    experimental: {
      typedRoutes: true,
    },
  };
  module.exports = nextConfig;\``,
        },
        {
          heading: "📖 Routing (App Router)",
          content: `**Rotas de página:**
  \`// app/page.tsx → /
  // app/about/page.tsx → /about
  // app/blog/[slug]/page.tsx → /blog/:slug
  // app/shop/[...slug]/page.tsx → /shop/a/b/c (catch-all)
  // app/(marketing)/about/page.tsx → /about (route groups)\`

**Parâmetros dinâmicos:**
  \`// app/users/[id]/page.tsx
  export default function UserPage({
    params
  }: {
    params: { id: string }
  }) {
    return <h1>User {params.id}</h1>;
  }\`

**Search params:**
  \`// ?page=1&sort=name
  export default function Page({
    searchParams
  }: {
    searchParams: { page?: string; sort?: string }
  }) {
    const page = searchParams.page ?? '1';
    return <p>Page {page}</p>;
  }\`

**Navegação (Link):**
  \`import Link from 'next/link';

  <Link href="/about">About</Link>
  <Link href={\`/users/\${id}\`}>User</Link>
  <Link href={{ pathname: '/search', query: { q: 'test' } }}>\`

**useRouter (Client):**
  \`'use client';
  import { useRouter } from 'next/navigation';

  const router = useRouter();
  router.push('/dashboard');
  router.replace('/login');
  router.back();
  router.refresh();  // revalidate server components\``,
        },
        {
          heading: "📖 Server Components",
          content: `**Server Component (padrão):**
  \`// app/users/page.tsx — server por padrão
  async function getUsers() {
    const res = await fetch('https://api.example.com/users');
    return res.json();
  }

  export default async function UsersPage() {
    const users = await getUsers();
    return (
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    );
  }\`

**Fetch com cache:**
  \`// Cache por padrão (similar SSG)
  fetch('https://...', { cache: 'force-cache' });

  // Revalidar a cada 60s (ISR)
  fetch('https://...', { next: { revalidate: 60 } });

  // Sem cache (similar SSR)
  fetch('https://...', { cache: 'no-store' });\`

**Streaming com Suspense:**
  \`import { Suspense } from 'react';

  export default function Page() {
    return (
      <Suspense fallback={<p>Loading users...</p>}>
        <UserList />
      </Suspense>
    );
  }\`

**generateStaticParams (SSG):**
  \`// app/blog/[slug]/page.tsx
  export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map((post) => ({ slug: post.slug }));
  }\``,
        },
        {
          heading: "📖 Client Components",
          content: `**'use client' directive:**
  \`'use client';

  import { useState, useEffect } from 'react';

  export default function Counter() {
    const [count, setCount] = useState(0);

    return (
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    );
  }\`

**Quando usar 'use client':**
  \`// useState, useEffect, useContext → Client
  // onClick, onChange, onSubmit → Client
  // Browser APIs (localStorage, window) → Client
  // Real-time updates → Client

  // Data fetching → Server
  // Acesso direto ao DB/filesystem → Server
  // Tokens secretos → Server\`

**Padrão: Server + Client híbrido:**
  \`// ServerComponent.tsx (server)
  import ClientButton from './ClientButton';

  export default async function Page() {
    const data = await fetchData();  // server
    return (
      <div>
        <h1>{data.title}</h1>
        <ClientButton />  {/* client island */}
      </div>
    );
  }\`

**Hooks úteis:**
  \`'use client';
  import { usePathname, useSearchParams } from 'next/navigation';

  const pathname = usePathname();      // /users/123
  const searchParams = useSearchParams();
  const page = searchParams.get('page');  // ?page=1 → "1"\``,
        },
        {
          heading: "📖 Layouts e Loading",
          content: `**Root layout (obrigatório):**
  \`// app/layout.tsx
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="pt-BR">
        <body>{children}</body>
      </html>
    );
  }\`

**Nested layout:**
  \`// app/dashboard/layout.tsx
  export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex">
        <Sidebar />
        <main>{children}</main>
      </div>
    );
  }\`

**loading.tsx (Suspense automático):**
  \`// app/users/loading.tsx
  export default function Loading() {
    return <p>Carregando...</p>;
  }\`

**error.tsx (Error Boundary):**
  \`'use client';
  // app/users/error.tsx
  export default function Error({
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }) {
    return (
      <div>
        <h2>Algo deu errado!</h2>
        <button onClick={() => reset()}>Tentar novamente</button>
      </div>
    );
  }\`

**not-found.tsx:**
  \`// app/not-found.tsx
  export default function NotFound() {
    return <h1>404 - Página não encontrada</h1>;
  }\``,
        },
        {
          heading: "📖 Server Actions",
          content: `**Server Action em arquivo:**
  \`// app/actions.ts
  'use server';

  import { revalidatePath } from 'next/cache';

  export async function createUser(formData: FormData) {
    const name = formData.get('name');

    await db.user.create({ data: { name } });

    revalidatePath('/users');
  }\`

**Usar em form:**
  \`// app/users/new/page.tsx
  import { createUser } from '../actions';

  export default function NewUserPage() {
    return (
      <form action={createUser}>
        <input name="name" required />
        <button type="submit">Criar</button>
      </form>
    );
  }\`

**useFormStatus (loading):**
  \`'use client';
  import { useFormStatus } from 'react-dom';

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button disabled={pending}>
        {pending ? 'Salvando...' : 'Salvar'}
      </button>
    );
  }\`

**useActionState (erro/sucesso):**
  \`'use client';
  import { useActionState } from 'react';
  import { createUser } from './actions';

  const [state, formAction] = useActionState(createUser, null);

  <form action={formAction}>
    <input name="name" />
    {state?.error && <p>{state.error}</p>}
  </form>\``,
        },
        {
          heading: "📖 API Routes",
          content: `**Route Handler básico:**
  \`// app/api/users/route.ts
  import { NextResponse } from 'next/server';

  export async function GET() {
    const users = await db.user.findMany();
    return NextResponse.json(users);
  }

  export async function POST(request: Request) {
    const body = await request.json();
    const user = await db.user.create({ data: body });
    return NextResponse.json(user, { status: 201 });
  }\`

**Parâmetros dinâmicos:**
  \`// app/api/users/[id]/route.ts
  export async function GET(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    const user = await db.user.findUnique({
      where: { id: params.id }
    });
    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  }\`

**Headers e Cookies:**
  \`import { cookies, headers } from 'next/headers';

  export async function GET() {
    const headersList = headers();
    const cookieStore = cookies();

    const token = cookieStore.get('token')?.value;
    const userAgent = headersList.get('user-agent');

    return NextResponse.json({ token, userAgent });
  }\`

**Redirect e Rewrite:**
  \`import { redirect } from 'next/navigation';
  import { NextResponse } from 'next/server';

  // Redirect
  redirect('/login');

  // Response redirect
  return NextResponse.redirect(new URL('/login', request.url));\``,
        },
        {
          heading: "📖 Middleware",
          content: `**middleware.ts (raiz do projeto):**
  \`// middleware.ts
  import { NextResponse } from 'next/server';
  import type { NextRequest } from 'next/server';

  export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*'],
  };\`

**Matcher patterns:**
  \`export const config = {
    matcher: [
      '/dashboard/:path*',        // /dashboard e sub-rotas
      '/api/:path*',              // todas API routes
      '/((?!_next|static|.*\\.).*)', // excluir assets
    ],
  };\`

**Adicionar headers:**
  \`export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    response.headers.set('x-custom', 'value');

    return response;
  }\``,
        },
        {
          heading: "📖 Otimizações",
          content: `**next/image:**
  \`import Image from 'next/image';

  <Image
    src="/hero.jpg"
    alt="Hero"
    width={800}
    height={400}
    priority  // carregar imediatamente (LCP)
  />

  // Fill container
  <div className="relative w-full h-64">
    <Image src="/bg.jpg" alt="" fill className="object-cover" />
  </div>\`

**next/font:**
  \`import { Inter } from 'next/font/google';

  const inter = Inter({ subsets: ['latin'] });

  export default function Layout({ children }) {
    return (
      <html className={inter.className}>
        <body>{children}</body>
      </html>
    );
  }\`

**Metadata:**
  \`// app/layout.tsx ou page.tsx
  export const metadata = {
    title: 'My App',
    description: 'Description',
    openGraph: {
      title: 'My App',
      images: ['/og.png'],
    },
  };

  // Dynamic metadata
  export async function generateMetadata({ params }) {
    const post = await getPost(params.slug);
    return { title: post.title };
  }\`

**Environment Variables:**
  \`.env.local (não commitado)
  DATABASE_URL=postgres://...
  NEXT_PUBLIC_API_URL=https://api.example.com

  // Server-only: process.env.DATABASE_URL
  // Client: process.env.NEXT_PUBLIC_API_URL\``,
        },
      ],
      keyTopics: [
        "App Router, page.tsx, layout.tsx",
        "Link, useRouter, params, searchParams",
        "Server Components, async/await, fetch",
        "'use client', useState, useEffect",
        "loading.tsx, error.tsx, not-found.tsx",
        "'use server', formAction, revalidatePath",
        "route.ts, GET, POST, NextResponse",
        "middleware.ts, matcher, redirect",
        "next/image, next/font, metadata",
      ],
    },

    Flutter: {
      title: "Flutter - Dicionário de Sintaxe",
      introduction:
        "Referência completa de Flutter/Dart. Widgets, State Management, Navigation e Platform Features.",
      sections: [
        {
          heading: "📖 Setup e CLI",
          content: `**Criar projeto:**
  \`flutter create my_app
  cd my_app && flutter run\`

**Comandos essenciais:**
  \`flutter run                  # executar app
  flutter run -d chrome        # executar na web
  flutter run -d all           # todos os dispositivos
  flutter build apk            # build Android
  flutter build ios            # build iOS
  flutter build web            # build Web
  flutter pub get              # instalar dependências
  flutter pub upgrade          # atualizar dependências
  flutter doctor               # verificar instalação
  flutter clean                # limpar build cache
  flutter analyze              # análise estática
  flutter test                 # executar testes\`

**pubspec.yaml:**
  \`name: my_app
  description: My Flutter app

  dependencies:
    flutter:
      sdk: flutter
    provider: ^6.0.0
    http: ^1.1.0

  dev_dependencies:
    flutter_test:
      sdk: flutter
    flutter_lints: ^2.0.0\``,
        },
        {
          heading: "📖 Widgets Básicos",
          content: `**StatelessWidget:**
  \`class MyWidget extends StatelessWidget {
    final String title;

    const MyWidget({super.key, required this.title});

    @override
    Widget build(BuildContext context) {
      return Text(title);
    }
  }\`

**StatefulWidget:**
  \`class Counter extends StatefulWidget {
    const Counter({super.key});

    @override
    State<Counter> createState() => _CounterState();
  }

  class _CounterState extends State<Counter> {
    int _count = 0;

    void _increment() {
      setState(() {
        _count++;
      });
    }

    @override
    Widget build(BuildContext context) {
      return ElevatedButton(
        onPressed: _increment,
        child: Text('Count: \$_count'),
      );
    }
  }\`

**Lifecycle hooks:**
  \`@override
  void initState() {
    super.initState();
    // Inicialização
  }

  @override
  void dispose() {
    // Cleanup (controllers, subscriptions)
    super.dispose();
  }

  @override
  void didUpdateWidget(Counter oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Widget foi reconstruído com novos params
  }\``,
        },
        {
          heading: "📖 Layout Widgets",
          content: `**Container:**
  \`Container(
    width: 200,
    height: 100,
    padding: EdgeInsets.all(16),
    margin: EdgeInsets.symmetric(horizontal: 8),
    decoration: BoxDecoration(
      color: Colors.blue,
      borderRadius: BorderRadius.circular(12),
      boxShadow: [BoxShadow(blurRadius: 4, color: Colors.black26)],
    ),
    child: Text('Hello'),
  )\`

**Column e Row:**
  \`Column(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Item 1'),
      Text('Item 2'),
      Spacer(),  // expande para preencher espaço
      Text('Item 3'),
    ],
  )

  Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [Icon(Icons.star), Text('Rating'), Icon(Icons.star)],
  )\`

**Stack (sobreposição):**
  \`Stack(
    children: [
      Image.asset('bg.png'),
      Positioned(
        bottom: 16,
        right: 16,
        child: Text('Overlay'),
      ),
    ],
  )\`

**Expanded e Flexible:**
  \`Row(
    children: [
      Expanded(flex: 2, child: Container(color: Colors.red)),
      Expanded(flex: 1, child: Container(color: Colors.blue)),
    ],
  )\`

**ListView:**
  \`ListView.builder(
    itemCount: items.length,
    itemBuilder: (context, index) {
      return ListTile(
        title: Text(items[index].name),
        onTap: () => print(items[index].id),
      );
    },
  )\``,
        },
        {
          heading: "📖 Widgets de Input",
          content: `**TextField:**
  \`final _controller = TextEditingController();

  TextField(
    controller: _controller,
    decoration: InputDecoration(
      labelText: 'Nome',
      hintText: 'Digite seu nome',
      prefixIcon: Icon(Icons.person),
      border: OutlineInputBorder(),
    ),
    onChanged: (value) => print(value),
    onSubmitted: (value) => _submit(),
  )

  // Obter valor: _controller.text
  // Limpar: _controller.clear()\`

**Form com validação:**
  \`final _formKey = GlobalKey<FormState>();

  Form(
    key: _formKey,
    child: Column(
      children: [
        TextFormField(
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Campo obrigatório';
            }
            return null;
          },
        ),
        ElevatedButton(
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              // Form válido
            }
          },
          child: Text('Enviar'),
        ),
      ],
    ),
  )\`

**Buttons:**
  \`ElevatedButton(onPressed: () {}, child: Text('Elevated'))
  TextButton(onPressed: () {}, child: Text('Text'))
  OutlinedButton(onPressed: () {}, child: Text('Outlined'))
  IconButton(onPressed: () {}, icon: Icon(Icons.add))
  FloatingActionButton(onPressed: () {}, child: Icon(Icons.add))\`

**Checkbox, Switch, Radio:**
  \`Checkbox(value: isChecked, onChanged: (v) => setState(() => isChecked = v!))
  Switch(value: isOn, onChanged: (v) => setState(() => isOn = v))
  Radio<int>(value: 1, groupValue: selected, onChanged: (v) => setState(() => selected = v!))\``,
        },
        {
          heading: "📖 Navegação",
          content: `**Navigator.push/pop:**
  \`// Navegar para nova tela
  Navigator.push(
    context,
    MaterialPageRoute(builder: (context) => DetailScreen()),
  );

  // Voltar
  Navigator.pop(context);

  // Voltar com resultado
  Navigator.pop(context, result);

  // Receber resultado
  final result = await Navigator.push(
    context,
    MaterialPageRoute(builder: (c) => SelectScreen()),
  );\`

**Named routes:**
  \`// Em MaterialApp
  MaterialApp(
    initialRoute: '/',
    routes: {
      '/': (context) => HomeScreen(),
      '/details': (context) => DetailScreen(),
      '/user': (context) => UserScreen(),
    },
  )

  // Navegar
  Navigator.pushNamed(context, '/details');

  // Com argumentos
  Navigator.pushNamed(context, '/user', arguments: user);

  // Receber argumentos
  final user = ModalRoute.of(context)!.settings.arguments as User;\`

**go_router (recomendado):**
  \`final router = GoRouter(
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => HomeScreen(),
      ),
      GoRoute(
        path: '/user/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return UserScreen(id: id);
        },
      ),
    ],
  );

  // Navegar
  context.go('/user/123');
  context.push('/details');
  context.pop();\``,
        },
        {
          heading: "📖 State Management",
          content: `**setState (local):**
  \`setState(() {
    _count++;
  });\`

**Provider:**
  \`// pubspec: provider: ^6.0.0

  // Modelo
  class Counter extends ChangeNotifier {
    int _count = 0;
    int get count => _count;

    void increment() {
      _count++;
      notifyListeners();
    }
  }

  // Prover
  ChangeNotifierProvider(
    create: (_) => Counter(),
    child: MyApp(),
  )

  // Consumir
  final counter = context.watch<Counter>();
  Text('\${counter.count}')

  // Chamar método (sem rebuild)
  context.read<Counter>().increment();\`

**Riverpod:**
  \`// pubspec: flutter_riverpod: ^2.0.0

  final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) {
    return CounterNotifier();
  });

  class CounterNotifier extends StateNotifier<int> {
    CounterNotifier() : super(0);
    void increment() => state++;
  }

  // Consumir
  class MyWidget extends ConsumerWidget {
    @override
    Widget build(BuildContext context, WidgetRef ref) {
      final count = ref.watch(counterProvider);
      return ElevatedButton(
        onPressed: () => ref.read(counterProvider.notifier).increment(),
        child: Text('\$count'),
      );
    }
  }\``,
        },
        {
          heading: "📖 Async e HTTP",
          content: `**FutureBuilder:**
  \`FutureBuilder<User>(
    future: fetchUser(),
    builder: (context, snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return CircularProgressIndicator();
      }
      if (snapshot.hasError) {
        return Text('Error: \${snapshot.error}');
      }
      final user = snapshot.data!;
      return Text(user.name);
    },
  )\`

**StreamBuilder:**
  \`StreamBuilder<int>(
    stream: counterStream,
    builder: (context, snapshot) {
      if (!snapshot.hasData) return CircularProgressIndicator();
      return Text('\${snapshot.data}');
    },
  )\`

**HTTP requests:**
  \`// pubspec: http: ^1.1.0
  import 'package:http/http.dart' as http;
  import 'dart:convert';

  Future<List<User>> fetchUsers() async {
    final response = await http.get(Uri.parse('https://api.example.com/users'));

    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((e) => User.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load users');
    }
  }

  // POST
  await http.post(
    Uri.parse('https://api.example.com/users'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'name': 'John'}),
  );\``,
        },
        {
          heading: "📖 Scaffold e AppBar",
          content: `**Scaffold completo:**
  \`Scaffold(
    appBar: AppBar(
      title: Text('My App'),
      actions: [
        IconButton(icon: Icon(Icons.search), onPressed: () {}),
        IconButton(icon: Icon(Icons.more_vert), onPressed: () {}),
      ],
    ),
    drawer: Drawer(
      child: ListView(
        children: [
          DrawerHeader(child: Text('Menu')),
          ListTile(title: Text('Home'), onTap: () {}),
          ListTile(title: Text('Settings'), onTap: () {}),
        ],
      ),
    ),
    body: Center(child: Text('Content')),
    floatingActionButton: FloatingActionButton(
      onPressed: () {},
      child: Icon(Icons.add),
    ),
    bottomNavigationBar: NavigationBar(
      selectedIndex: _selectedIndex,
      onDestinationSelected: (i) => setState(() => _selectedIndex = i),
      destinations: [
        NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
      ],
    ),
  )\`

**TabBar:**
  \`DefaultTabController(
    length: 3,
    child: Scaffold(
      appBar: AppBar(
        bottom: TabBar(
          tabs: [
            Tab(icon: Icon(Icons.home), text: 'Home'),
            Tab(icon: Icon(Icons.star), text: 'Favorites'),
            Tab(icon: Icon(Icons.person), text: 'Profile'),
          ],
        ),
      ),
      body: TabBarView(
        children: [HomePage(), FavoritesPage(), ProfilePage()],
      ),
    ),
  )\``,
        },
        {
          heading: "📖 Tema e Estilo",
          content: `**MaterialApp theme:**
  \`MaterialApp(
    theme: ThemeData(
      colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
      useMaterial3: true,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blue,
        ),
      ),
    ),
    darkTheme: ThemeData.dark(useMaterial3: true),
    themeMode: ThemeMode.system,
  )\`

**Acessar tema:**
  \`final theme = Theme.of(context);
  final primaryColor = theme.colorScheme.primary;
  final textStyle = theme.textTheme.titleLarge;\`

**TextStyle:**
  \`Text(
    'Hello',
    style: TextStyle(
      fontSize: 24,
      fontWeight: FontWeight.bold,
      color: Colors.blue,
      letterSpacing: 1.2,
    ),
  )

  // Usar tema
  Text('Title', style: Theme.of(context).textTheme.headlineMedium)\`

**MediaQuery:**
  \`final screenWidth = MediaQuery.of(context).size.width;
  final screenHeight = MediaQuery.of(context).size.height;
  final padding = MediaQuery.of(context).padding;  // safe area\``,
        },
      ],
      keyTopics: [
        "flutter create, run, build, pub get",
        "StatelessWidget, StatefulWidget, setState",
        "Container, Column, Row, Stack, ListView",
        "TextField, Form, TextFormField, validator",
        "Navigator.push/pop, named routes, go_router",
        "Provider, Riverpod, ChangeNotifier",
        "FutureBuilder, StreamBuilder, http",
        "Scaffold, AppBar, Drawer, BottomNav",
        "ThemeData, TextStyle, MediaQuery",
      ],
    },
  },

  // ===========================================
  // SEGURANÇA DA INFORMAÇÃO
  // ===========================================
  "seguranca-da-informacao": {
    Criptografia: {
      title: "Criptografia",
      introduction:
        "Criptografia é a ciência de proteger informações através de técnicas matemáticas que tornam dados ilegíveis para não autorizados. Fundamental para confidencialidade, integridade e autenticação. Divide-se em simétrica (mesma chave) e assimétrica (par de chaves pública/privada).",
      sections: [
        {
          heading: "Criptografia Simétrica",
          content:
            "Usa mesma chave para cifrar e decifrar. Rápida, ideal para grandes volumes. AES (Advanced Encryption Standard): padrão atual, blocos de 128 bits, chaves 128/192/256 bits. DES/3DES: obsoletos. Modos de operação: ECB (inseguro), CBC (com IV), GCM (autenticação integrada). Problema: distribuição segura da chave.",
        },
        {
          heading: "Criptografia Assimétrica",
          content:
            "Par de chaves: pública (distribui) e privada (guarda). RSA: baseado em fatoração de primos grandes, 2048+ bits. ECC (Elliptic Curve): mesma segurança com chaves menores. Cifra com pública → decifra com privada (confidencialidade). Assina com privada → verifica com pública (autenticação). Mais lenta que simétrica.",
        },
        {
          heading: "Hashing e Assinaturas",
          content:
            "Hash: função unidirecional que gera digest de tamanho fixo. SHA-256/SHA-3: seguros. MD5/SHA-1: quebrados, evitar. Propriedades: determinístico, resistente a colisão e pré-imagem. HMAC adiciona chave para autenticação. Assinatura digital: hash + criptografia com chave privada. Garante integridade e não-repúdio.",
        },
      ],
      keyTopics: [
        "AES e Modos de Operação",
        "RSA e ECC",
        "Chave Pública vs Privada",
        "SHA-256 e Hashing",
        "Assinatura Digital",
        "HMAC",
        "Cifra de Bloco vs Fluxo",
        "Diffie-Hellman",
      ],
    },

    "Certificados Digitais e PKI": {
      title: "Certificados Digitais e PKI",
      introduction:
        "PKI (Public Key Infrastructure) é a estrutura que gerencia certificados digitais e chaves públicas. Certificados vinculam identidades a chaves públicas, assinados por Autoridades Certificadoras (CAs) confiáveis. Base do HTTPS, assinaturas digitais e autenticação forte.",
      sections: [
        {
          heading: "Estrutura de Certificados X.509",
          content:
            "X.509 é o padrão de certificados. Contém: subject (identidade), issuer (CA), chave pública, validade, serial number, extensões. CN (Common Name) ou SAN (Subject Alternative Name) identificam o domínio. Cadeia de confiança: certificado → CA intermediária → CA raiz (trust anchor).",
        },
        {
          heading: "Autoridades Certificadoras",
          content:
            "CA raiz: auto-assinada, armazenada em trust stores (browser/OS). CA intermediária: assina certificados finais, limita exposição da raiz. RA (Registration Authority): verifica identidade antes de emitir. CRL (Certificate Revocation List) e OCSP (Online Certificate Status Protocol) verificam revogação.",
        },
        {
          heading: "Tipos e Uso de Certificados",
          content:
            "DV (Domain Validation): valida controle do domínio, automático, Let's Encrypt. OV (Organization Validation): valida organização. EV (Extended Validation): validação rigorosa, barra verde. Wildcard: *.dominio.com. SAN: múltiplos domínios. Client certificates para autenticação mútua (mTLS).",
        },
      ],
      keyTopics: [
        "X.509",
        "Cadeia de Certificados",
        "CA Raiz e Intermediária",
        "CRL e OCSP",
        "DV, OV, EV",
        "Let's Encrypt",
        "TLS/SSL",
        "mTLS",
        "Trust Store",
      ],
    },

    "Controle de Acesso": {
      title: "Controle de Acesso",
      introduction:
        "Controle de acesso determina quem pode acessar o quê e como. Baseado em autenticação (quem é você), autorização (o que pode fazer) e accountability (registro de ações). Modelos variam de simples (DAC) a rigorosos (MAC) e flexíveis (RBAC, ABAC).",
      sections: [
        {
          heading: "Autenticação e Fatores",
          content:
            "Fatores de autenticação: algo que sabe (senha), algo que tem (token, celular), algo que é (biometria). MFA (Multi-Factor Authentication) combina 2+ fatores de categorias diferentes. SSO (Single Sign-On): um login para múltiplos sistemas. OAuth 2.0 para autorização delegada; OIDC adiciona identidade sobre OAuth.",
        },
        {
          heading: "Modelos de Autorização",
          content:
            "DAC (Discretionary): owner define permissões (Unix chmod). MAC (Mandatory): sistema impõe com labels de classificação (militar). RBAC (Role-Based): permissões atribuídas a roles, usuários recebem roles. ABAC (Attribute-Based): políticas baseadas em atributos do sujeito, objeto, ambiente. Princípio do menor privilégio.",
        },
        {
          heading: "Gestão de Identidade",
          content:
            "IAM (Identity and Access Management): ciclo de vida de identidades. Provisionamento/desprovisionamento de contas. PAM (Privileged Access Management): contas administrativas com controle extra. Just-in-time access: permissões temporárias. Zero Trust: 'never trust, always verify' — verificação contínua.",
        },
      ],
      keyTopics: [
        "Autenticação vs Autorização",
        "MFA e 2FA",
        "SSO, OAuth 2.0, OIDC",
        "RBAC e ABAC",
        "Princípio do Menor Privilégio",
        "IAM e PAM",
        "Zero Trust",
        "Biometria",
      ],
    },

    Malwares: {
      title: "Malwares e Ameaças",
      introduction:
        "Malware (malicious software) é código projetado para danificar, roubar ou controlar sistemas. Evolui constantemente: de vírus simples a ransomware sofisticado e ataques nation-state. Defesa em profundidade com antivírus, EDR, sandboxing e conscientização.",
      sections: [
        {
          heading: "Tipos de Malware",
          content:
            "Vírus: infecta arquivos, precisa de host. Worm: autorreplica pela rede. Trojan: disfarçado de software legítimo. Ransomware: criptografa dados, exige resgate. Spyware: coleta informações. Keylogger: captura teclas. Rootkit: esconde presença no sistema. Botnet: rede de máquinas controladas remotamente.",
        },
        {
          heading: "Técnicas de Ataque",
          content:
            "Phishing: engenharia social via email/site falso. Spear phishing: alvo específico. Drive-by download: infecção ao visitar site comprometido. Fileless malware: reside em memória, usa ferramentas legítimas (PowerShell). Living off the land: usa binários do sistema. Supply chain attack: compromete software/dependência confiável.",
        },
        {
          heading: "Defesas e Detecção",
          content:
            "Antivírus: assinaturas + heurística. EDR (Endpoint Detection and Response): comportamental, threat hunting. Sandboxing: execução isolada para análise. IOCs (Indicators of Compromise): hashes, IPs, domínios. YARA rules para detecção customizada. Threat Intelligence: feeds de ameaças conhecidas. Patch management crítico.",
        },
      ],
      keyTopics: [
        "Vírus, Worms, Trojans",
        "Ransomware",
        "Phishing e Spear Phishing",
        "Fileless Malware",
        "EDR e Antivírus",
        "IOCs",
        "Sandboxing",
        "Engenharia Social",
      ],
    },

    Cibersegurança: {
      title: "Cibersegurança e Defesa",
      introduction:
        "Cibersegurança protege sistemas, redes e dados contra ataques digitais. Framework NIST: Identify, Protect, Detect, Respond, Recover. Defesa em profundidade com múltiplas camadas. Blue team defende, red team ataca para testar, purple team colabora.",
      sections: [
        {
          heading: "Ataques e Vulnerabilidades",
          content:
            "DDoS: sobrecarrega serviços com tráfego. SQL Injection: manipula queries de banco. XSS: injeta scripts em páginas. CSRF: forja requisições do usuário. Man-in-the-Middle: intercepta comunicação. Zero-day: vulnerabilidade sem patch. CVE (Common Vulnerabilities and Exposures) identifica vulnerabilidades públicas.",
        },
        {
          heading: "Defesa em Profundidade",
          content:
            "Múltiplas camadas: firewall, IDS/IPS, WAF, segmentação de rede, endpoint protection. SIEM (Security Information and Event Management): correlaciona logs para detectar ameaças. SOC (Security Operations Center): monitora 24/7. Honeypots atraem atacantes para estudo.",
        },
        {
          heading: "Resposta a Incidentes",
          content:
            "Fases: Preparação, Identificação, Contenção, Erradicação, Recuperação, Lições Aprendidas. Playbooks documentam procedimentos. IR team coordena resposta. Comunicação com stakeholders. Preservação de evidências para forense. Post-mortem sem blame para melhorar.",
        },
      ],
      keyTopics: [
        "DDoS, SQL Injection, XSS",
        "OWASP Top 10",
        "Defesa em Profundidade",
        "SIEM e SOC",
        "IDS/IPS e WAF",
        "Resposta a Incidentes",
        "Threat Hunting",
        "CVE e CVSS",
      ],
    },

    "Segurança em Aplicações Web": {
      title: "Segurança em Aplicações Web",
      introduction:
        "Aplicações web são alvo principal de ataques. OWASP Top 10 lista vulnerabilidades mais críticas. Segurança deve ser integrada no desenvolvimento (DevSecOps), não adicionada depois. Input validation, output encoding e autenticação robusta são fundamentais.",
      sections: [
        {
          heading: "Injeções e XSS",
          content:
            "SQL Injection: input malicioso em queries. Defesa: prepared statements/parameterized queries, NUNCA concatenar input. XSS (Cross-Site Scripting): injeta JavaScript executado no browser da vítima. Stored XSS persiste no servidor. Reflected XSS via URL. Defesa: output encoding, Content-Security-Policy.",
        },
        {
          heading: "Autenticação e Sessões",
          content:
            "Broken Authentication: senhas fracas, session fixation, credential stuffing. Defesas: bcrypt/argon2 para hashing de senhas, rate limiting, MFA. Session management: tokens seguros, httpOnly e secure flags em cookies. JWT: validar assinatura, verificar exp/iss. CSRF tokens para forms.",
        },
        {
          heading: "Configuração e Headers",
          content:
            "Security headers: Strict-Transport-Security (HSTS), X-Content-Type-Options, X-Frame-Options, Content-Security-Policy. HTTPS obrigatório. Remover headers que revelam tecnologia (X-Powered-By). CORS configurado corretamente. Secrets em variáveis de ambiente, nunca no código. SAST/DAST para análise.",
        },
      ],
      keyTopics: [
        "OWASP Top 10",
        "SQL Injection",
        "XSS (Stored, Reflected, DOM)",
        "CSRF",
        "Broken Authentication",
        "Security Headers",
        "HTTPS e HSTS",
        "Content-Security-Policy",
        "CORS",
      ],
    },

    "Forense Digital": {
      title: "Forense Digital",
      introduction:
        "Forense digital investiga incidentes de segurança, coleta e analisa evidências digitais de forma admissível legalmente. Crucial para entender ataques, identificar atacantes e prevenir recorrência. Cadeia de custódia garante integridade das evidências.",
      sections: [
        {
          heading: "Coleta e Preservação",
          content:
            "Ordem de volatilidade: RAM primeiro, depois disco. Imagem forense: cópia bit-a-bit do disco com hash para verificação. Write blockers impedem alteração da evidência original. Chain of custody documenta quem acessou evidência. Timestamps e logs são críticos. Volatility para análise de memória.",
        },
        {
          heading: "Análise de Evidências",
          content:
            "File carving recupera arquivos deletados. Timeline analysis reconstrói sequência de eventos. Análise de logs: auth, sistema, aplicação, rede. Análise de malware: estática (strings, imports) e dinâmica (sandbox). Network forensics: pcap, flow data. Artifacts: browser history, registros, prefetch.",
        },
        {
          heading: "Ferramentas e Processo",
          content:
            "EnCase, FTK, Autopsy para análise de disco. Wireshark para rede. Volatility para memória. SIFT Workstation: distro forense. Relatório final documenta achados, metodologia e conclusões. Testemunho técnico pode ser necessário. Compliance com jurisdição local.",
        },
      ],
      keyTopics: [
        "Cadeia de Custódia",
        "Imagem Forense",
        "Ordem de Volatilidade",
        "Análise de Memória (Volatility)",
        "Timeline Analysis",
        "File Carving",
        "Análise de Malware",
        "EnCase, FTK, Autopsy",
      ],
    },

    "Gestão de Riscos": {
      title: "Gestão de Riscos de Segurança",
      introduction:
        "Gestão de riscos identifica, avalia e trata riscos de segurança. Risco = Ameaça × Vulnerabilidade × Impacto. Nem todo risco pode ser eliminado — decisões de negócio equilibram custo de controles vs impacto potencial. Frameworks como ISO 31000 e NIST RMF guiam o processo.",
      sections: [
        {
          heading: "Identificação e Avaliação",
          content:
            "Asset inventory: o que proteger. Threat modeling identifica ameaças (STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege). Vulnerability assessment: scans, pentests. Análise qualitativa (Alto/Médio/Baixo) ou quantitativa (valor monetário). Risk register documenta.",
        },
        {
          heading: "Tratamento de Riscos",
          content:
            "Quatro estratégias: Mitigar (controles reduzem risco), Transferir (seguro, terceirização), Aceitar (risco dentro do apetite), Evitar (elimina atividade). Controles: preventivos, detectivos, corretivos. Risco residual: o que sobra após controles. Risk owner responsável pela decisão.",
        },
        {
          heading: "Monitoramento Contínuo",
          content:
            "Risco não é estático — novas ameaças, mudanças no ambiente. KRIs (Key Risk Indicators) alertam tendências. Revisões periódicas do risk register. Auditorias internas/externas. Board reporting: dashboards executivos. Cultura de risco: todos participam.",
        },
      ],
      keyTopics: [
        "Ameaça, Vulnerabilidade, Impacto",
        "Análise Qualitativa vs Quantitativa",
        "STRIDE",
        "Risk Register",
        "Mitigar, Transferir, Aceitar, Evitar",
        "Risco Residual",
        "KRIs",
        "ISO 31000",
      ],
    },

    "Políticas de Segurança": {
      title: "Políticas de Segurança da Informação",
      introduction:
        "Políticas de segurança são documentos organizacionais que definem regras, responsabilidades e procedimentos para proteger informações. Hierarquia: Política (o quê) → Normas (como) → Procedimentos (passo-a-passo). Base para compliance e conscientização.",
      sections: [
        {
          heading: "Estrutura e Componentes",
          content:
            "Política de Segurança da Informação: documento master, aprovado pela alta gestão. Políticas específicas: uso aceitável, senhas, backup, classificação de dados, resposta a incidentes, BYOD. Normas detalham requisitos técnicos. Procedimentos são instruções operacionais. Revisão anual ou após mudanças significativas.",
        },
        {
          heading: "Classificação de Informações",
          content:
            "Classifica dados por sensibilidade: Pública, Interna, Confidencial, Restrita (ou similar). Define controles por nível: criptografia obrigatória para confidencial, acesso restrito por função. Data owners responsáveis pela classificação. Rotulagem e handling guidelines. Retenção e descarte seguro.",
        },
        {
          heading: "Conscientização e Enforcement",
          content:
            "Security awareness training para todos. Simulações de phishing. Termo de aceite de políticas. Consequências para violações definidas. Metrics: taxa de cliques em phishing, incidentes reportados. Cultura de segurança: 'see something, say something'. Champions de segurança nas áreas.",
        },
      ],
      keyTopics: [
        "Política vs Norma vs Procedimento",
        "Política de Uso Aceitável",
        "Classificação de Dados",
        "BYOD Policy",
        "Security Awareness",
        "Termo de Responsabilidade",
        "Data Retention",
        "Revisão de Políticas",
      ],
    },

    "Governança e Compliance": {
      title: "Governança de Segurança e Compliance",
      introduction:
        "Governança de segurança define estrutura, responsabilidades e processos para gerenciar segurança alinhada aos objetivos de negócio. Compliance garante conformidade com leis e regulamentos. Frameworks como COBIT e ITIL integram segurança à governança de TI.",
      sections: [
        {
          heading: "Estrutura de Governança",
          content:
            "CISO (Chief Information Security Officer) lidera segurança, reporta ao board. Comitê de segurança: representantes de áreas para decisões estratégicas. Security steering committee prioriza iniciativas. Métricas e KPIs para board: risco, compliance, incidentes. Segregation of duties evita concentração de poder.",
        },
        {
          heading: "Frameworks e Padrões",
          content:
            "ISO 27001: SGSI certificável. NIST Cybersecurity Framework: Identify, Protect, Detect, Respond, Recover. CIS Controls: 18 controles prioritizados. COBIT: governança de TI. SOC 2: controles para provedores de serviço. PCI DSS: dados de cartão. HIPAA: saúde (EUA). Mapeamento entre frameworks.",
        },
        {
          heading: "Auditorias e Certificações",
          content:
            "Audit trails registram ações para revisão. Auditoria interna: primeira linha de defesa. Auditoria externa: independente, certificações. Gap analysis compara estado atual com framework. Remediation plan para achados. Compliance contínuo vs point-in-time. GRC tools integram governança, risco e compliance.",
        },
      ],
      keyTopics: [
        "CISO e Governança",
        "ISO 27001",
        "NIST CSF",
        "CIS Controls",
        "SOC 2",
        "PCI DSS",
        "Auditoria Interna/Externa",
        "GRC",
      ],
    },

    "Normas ISO 27001/27002": {
      title: "Normas ISO 27001 e 27002",
      introduction:
        "ISO 27001 é o padrão internacional para Sistema de Gestão de Segurança da Informação (SGSI), certificável. ISO 27002 fornece orientações de implementação dos controles. Juntas, estabelecem framework completo para segurança organizacional.",
      sections: [
        {
          heading: "ISO 27001: SGSI",
          content:
            "Sistema de Gestão de Segurança da Informação (SGSI): abordagem de processo para estabelecer, implementar, manter e melhorar segurança. Ciclo PDCA: Plan (escopo, política, risk assessment), Do (implementar controles), Check (monitorar, auditar), Act (melhorar). Certificação por organismo acreditado. Statement of Applicability (SoA) documenta controles aplicáveis.",
        },
        {
          heading: "ISO 27002: Controles",
          content:
            "93 controles em 4 temas (versão 2022): Organizacionais, Pessoas, Físicos, Tecnológicos. Cada controle: objetivo, orientação, propósito. Controles organizacionais: políticas, papéis, threat intelligence. Pessoas: screening, conscientização, disciplinar. Físicos: perímetros, proteção de equipamentos. Tecnológicos: acesso, criptografia, logging.",
        },
        {
          heading: "Implementação e Certificação",
          content:
            "Gap analysis inicial. Definir escopo realista. Risk assessment obrigatório. Implementar controles justificados pelo risco. Documentação: políticas, procedimentos, registros. Auditoria interna antes da certificação. Stage 1: revisão documental. Stage 2: auditoria operacional. Manutenção: auditorias de vigilância anuais, recertificação em 3 anos.",
        },
      ],
      keyTopics: [
        "SGSI",
        "Ciclo PDCA",
        "Statement of Applicability (SoA)",
        "Risk Assessment obrigatório",
        "Controles da ISO 27002",
        "Domínios de Controle",
        "Certificação ISO 27001",
        "Auditoria de Vigilância",
      ],
    },

    LGPD: {
      title: "LGPD - Lei Geral de Proteção de Dados",
      introduction:
        "A LGPD (Lei 13.709/2018) regula o tratamento de dados pessoais no Brasil. Inspirada na GDPR europeia, estabelece direitos dos titulares, obrigações dos controladores/operadores e penalidades. ANPD (Autoridade Nacional) fiscaliza. Fundamental para qualquer organização que trata dados de brasileiros.",
      sections: [
        {
          heading: "Princípios e Bases Legais",
          content:
            "10 princípios: finalidade, adequação, necessidade, livre acesso, qualidade, transparência, segurança, prevenção, não discriminação, responsabilização. 10 bases legais para tratamento: consentimento, obrigação legal, execução de políticas públicas, pesquisa, execução de contrato, exercício de direitos, proteção da vida, tutela da saúde, legítimo interesse, proteção de crédito.",
        },
        {
          heading: "Direitos dos Titulares",
          content:
            "Confirmação e acesso aos dados. Correção de dados incompletos ou inexatos. Anonimização, bloqueio ou eliminação. Portabilidade. Informação sobre compartilhamento. Revogação do consentimento. Oposição ao tratamento. Revisão de decisões automatizadas. Canal de atendimento obrigatório. Prazo de resposta: 15 dias.",
        },
        {
          heading: "Obrigações e Penalidades",
          content:
            "Controlador: decide sobre tratamento; Operador: trata em nome do controlador. DPO (Encarregado) obrigatório para algumas organizações. RIPD (Relatório de Impacto) para tratamentos de risco. Registro de operações. Notificação de incidentes à ANPD e titulares. Penalidades: advertência até 2% do faturamento (teto R$ 50 milhões por infração).",
        },
      ],
      keyTopics: [
        "Dados Pessoais e Sensíveis",
        "Controlador vs Operador",
        "Bases Legais (10)",
        "Princípios da LGPD",
        "Direitos dos Titulares",
        "DPO / Encarregado",
        "RIPD",
        "ANPD",
        "Penalidades",
      ],
    },
  },

  // ===========================================
  // REDE DE COMPUTADORES
  // ===========================================
  "rede-de-computadores": {
    "Modelo OSI e TCP/IP": {
      title: "Modelo OSI e TCP/IP",
      introduction:
        "Os modelos OSI (7 camadas) e TCP/IP (4 camadas) são frameworks que descrevem como dados são transmitidos em redes. OSI é referência teórica; TCP/IP é implementação prática da Internet. Cada camada tem responsabilidades específicas e protocolos associados.",
      sections: [
        {
          heading: "Modelo OSI - 7 Camadas",
          content:
            "7-Aplicação: interface com usuário (HTTP, FTP, SMTP). 6-Apresentação: formatos, criptografia, compressão. 5-Sessão: estabelece/mantém sessões. 4-Transporte: entrega fim-a-fim (TCP, UDP). 3-Rede: roteamento, endereçamento IP. 2-Enlace: frames, MAC address, switches. 1-Física: bits, cabos, sinais elétricos. Mnemônico: 'All People Seem To Need Data Processing' (de baixo para cima).",
        },
        {
          heading: "Modelo TCP/IP - 4 Camadas",
          content:
            "Aplicação: combina OSI 5-7, protocolos de usuário. Transporte: TCP (confiável, ordenado) e UDP (rápido, sem garantia). Internet: IP, roteamento, ICMP. Acesso à Rede (Link): combina OSI 1-2, Ethernet, Wi-Fi. TCP/IP é mais prático, OSI é referência educacional. Encapsulamento: dados → segmento → pacote → frame → bits.",
        },
        {
          heading: "Protocolos por Camada",
          content:
            "Aplicação: HTTP/HTTPS (web), SMTP/IMAP/POP3 (email), DNS (nomes), FTP/SFTP (arquivos), SSH (remoto), SNMP (gerenciamento). Transporte: TCP (portas, conexão, confiável), UDP (datagrams, rápido). Rede: IP, ICMP (ping), ARP (IP→MAC). Enlace: Ethernet, 802.11 (Wi-Fi), PPP.",
        },
      ],
      keyTopics: [
        "7 Camadas OSI",
        "4 Camadas TCP/IP",
        "Encapsulamento",
        "TCP vs UDP",
        "IP e ICMP",
        "Portas e Sockets",
        "ARP",
        "Ethernet e MAC",
      ],
    },

    "Endereçamento IP e Sub-redes": {
      title: "Endereçamento IP e Sub-redes",
      introduction:
        "Endereços IP identificam dispositivos em redes. IPv4 usa 32 bits (4 octetos), IPv6 usa 128 bits. Sub-redes dividem redes maiores em menores para organização e segurança. CIDR (Classless Inter-Domain Routing) substituiu classes de endereço para uso eficiente.",
      sections: [
        {
          heading: "Estrutura de Endereços IPv4",
          content:
            "32 bits em 4 octetos: 192.168.1.100. Network portion + Host portion, separados pela máscara. Classes (obsoletas): A (1-126), B (128-191), C (192-223). Privados (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. Loopback: 127.0.0.0/8. Broadcast: .255 na rede.",
        },
        {
          heading: "Máscara de Sub-rede e CIDR",
          content:
            "Máscara separa network de host: 255.255.255.0 = /24. /24 significa 24 bits para rede, 8 para hosts (256 IPs, 254 usáveis). /25 = 128 IPs, /26 = 64, /27 = 32, /28 = 16, /30 = 4 (links ponto-a-ponto). VLSM (Variable Length Subnet Mask) permite subnets de tamanhos diferentes.",
        },
        {
          heading: "Subnetting e Planejamento",
          content:
            "Fórmula hosts: 2^(32-prefixo) - 2 (network e broadcast). Dividir rede: aumentar prefixo. 192.168.1.0/24 dividido em 4: /26 cada. Primeira sub-rede: .0-.63, segunda: .64-.127, etc. Exemplo: rede para 50 hosts → /26 (62 usáveis). Supernetting: combina redes menores (summarization).",
        },
      ],
      keyTopics: [
        "IPv4 e 32 bits",
        "Máscara de Sub-rede",
        "CIDR Notation (/24)",
        "Endereços Privados (RFC 1918)",
        "Broadcast e Network Address",
        "VLSM",
        "Cálculo de Hosts",
        "Subnetting",
      ],
    },

    IPv6: {
      title: "IPv6 - Internet Protocol versão 6",
      introduction:
        "IPv6 resolve a exaustão de endereços IPv4 com 128 bits (340 undecilhões de endereços). Formato hexadecimal, sem NAT obrigatório, autoconfiguração nativa. Transição gradual: dual-stack, túneis. Essencial para IoT e crescimento da Internet.",
      sections: [
        {
          heading: "Formato e Tipos de Endereço",
          content:
            "128 bits em 8 grupos de 16 bits hex: 2001:0db8:85a3:0000:0000:8a2e:0370:7334. Simplificação: zeros leading removidos, :: substitui grupos consecutivos de zeros (uma vez só). Unicast: um destino. Multicast: grupo. Anycast: mais próximo do grupo. Não há broadcast; multicast substitui.",
        },
        {
          heading: "Endereços Especiais e Escopo",
          content:
            "Link-local (fe80::/10): comunicação no link, autoconfigurado. Unique Local (fc00::/7): análogo a privado IPv4. Global Unicast (2000::/3): roteável na Internet. Loopback: ::1. Prefixos: /64 para sub-redes (padrão), /48 para sites. EUI-64 gera host portion do MAC address.",
        },
        {
          heading: "Protocolos e Transição",
          content:
            "NDP (Neighbor Discovery Protocol): substitui ARP, Router Advertisement, SLAAC (autoconfiguração stateless). DHCPv6 para configuração stateful. ICMPv6 essencial (não bloquear em firewall). Dual-stack: dispositivo com IPv4 e IPv6. Túneis: 6to4, Teredo encapsulam IPv6 em IPv4. NAT64/DNS64 para tradução.",
        },
      ],
      keyTopics: [
        "128 bits e Formato Hexadecimal",
        "Simplificação de Endereços",
        "Link-local (fe80::)",
        "Global Unicast",
        "SLAAC e NDP",
        "ICMPv6",
        "Dual-Stack",
        "Túneis e Transição",
      ],
    },

    "DNS, DHCP e NAT": {
      title: "DNS, DHCP e NAT",
      introduction:
        "DNS traduz nomes (google.com) para IPs. DHCP atribui configurações de rede automaticamente. NAT permite múltiplos dispositivos compartilharem um IP público. Três serviços fundamentais que tornam a Internet utilizável para usuários finais.",
      sections: [
        {
          heading: "DNS - Domain Name System",
          content:
            "Hierarquia: Root (.) → TLD (.com, .br) → Domain (google) → Subdomain. Tipos de registro: A (IPv4), AAAA (IPv6), CNAME (alias), MX (email), TXT (SPF, DKIM), NS (nameservers), SOA (autoridade). Resolução recursiva: resolver consulta hierarquia. Cache com TTL. DNSSEC adiciona assinaturas para autenticidade.",
        },
        {
          heading: "DHCP - Dynamic Host Configuration Protocol",
          content:
            "DORA: Discover (cliente broadcast), Offer (servidor propõe), Request (cliente aceita), Acknowledge (servidor confirma). Fornece: IP, máscara, gateway, DNS. Lease time: duração do empréstimo. DHCP Relay para subnets sem servidor. Reservations vinculam MAC a IP fixo. Escopo define range de IPs.",
        },
        {
          heading: "NAT - Network Address Translation",
          content:
            "SNAT/Masquerade: múltiplos IPs privados → um público (port mapping). PAT (Port Address Translation): mais comum, usa portas para distinguir conexões. DNAT: redireciona porta externa para servidor interno (port forwarding). NAT preserva IPs públicos mas complica conexões peer-to-peer e certos protocolos.",
        },
      ],
      keyTopics: [
        "Resolução DNS Recursiva",
        "Registros DNS (A, AAAA, CNAME, MX)",
        "DNSSEC",
        "DHCP DORA",
        "Lease e Reservations",
        "NAT e PAT",
        "Port Forwarding",
        "Gateway e DNS via DHCP",
      ],
    },

    "Equipamentos de Rede": {
      title: "Equipamentos de Rede",
      introduction:
        "Equipamentos de rede conectam e direcionam tráfego: switches na camada 2 (MAC), roteadores na camada 3 (IP), access points para wireless. Load balancers distribuem carga, firewalls filtram tráfego. Entender cada função é essencial para design e troubleshooting.",
      sections: [
        {
          heading: "Switch e Hub",
          content:
            "Hub (obsoleto): repete para todas as portas (colisões, compartilha banda). Switch: aprende MACs em tabela CAM, encaminha apenas para porta correta. Layer 2: baseado em MAC. Layer 3: também roteia com IP. Managed switches: VLANs, spanning tree, port security. Unmanaged: plug-and-play.",
        },
        {
          heading: "Roteador",
          content:
            "Opera na camada 3, conecta redes diferentes. Tabela de roteamento: destino, gateway, interface. Protocolos de roteamento: estático (manual), dinâmico (OSPF, BGP). NAT geralmente implementado no roteador de borda. Roteadores SOHO combinam switch, AP, firewall, modem.",
        },
        {
          heading: "Outros Equipamentos",
          content:
            "Access Point (AP): conecta Wi-Fi à rede cabeada. Controller gerencia múltiplos APs. Load Balancer: distribui requisições entre servidores (L4 ou L7). Firewall: filtra tráfego por regras. IDS/IPS: detecta/previne intrusões. Proxy: intermediário para caching e filtragem. Gateway: ponto de saída para outras redes.",
        },
      ],
      keyTopics: [
        "Switch vs Hub",
        "Tabela CAM/MAC",
        "Roteador e Tabela de Roteamento",
        "Access Point",
        "Load Balancer (L4/L7)",
        "Modem",
        "Gateway",
        "Roteador SOHO",
      ],
    },

    "VLANs e Switching": {
      title: "VLANs e Tecnologias de Switching",
      introduction:
        "VLANs (Virtual LANs) segmentam redes logicamente em um mesmo switch físico. Isolamento de tráfego, segurança e organização sem precisar de infraestrutura separada. Spanning Tree previne loops. 802.1Q é o padrão para tagging de VLANs.",
      sections: [
        {
          heading: "VLANs e Segmentação",
          content:
            "VLAN: broadcast domain isolado logicamente. Portas do switch atribuídas a VLANs específicas. Tráfego entre VLANs requer roteamento (router-on-a-stick ou L3 switch). Native VLAN: tráfego não-tagged em trunk. VLAN 1: default, evitar usar em produção. Gerenciamento e voice VLANs comuns.",
        },
        {
          heading: "Trunking e 802.1Q",
          content:
            "Trunk: link que carrega múltiplas VLANs entre switches. 802.1Q: padrão de tagging (4 bytes adicionados ao frame, incluindo VLAN ID 12 bits = 4094 VLANs). Trunk mode: configurar portas como trunk ou access. DTP (Dynamic Trunking Protocol): negocia mas é risco de segurança — desabilitar.",
        },
        {
          heading: "Spanning Tree Protocol (STP)",
          content:
            "Previne loops de camada 2 (broadcast storms, MAC table instability). Elege root bridge (menor ID). Calcula caminhos. Bloqueia portas redundantes. Estados: Blocking, Listening, Learning, Forwarding. RSTP (Rapid STP): convergência mais rápida. PVST: STP por VLAN. PortFast para portas de acesso (pula estados).",
        },
      ],
      keyTopics: [
        "VLAN e Broadcast Domain",
        "Trunk vs Access Port",
        "802.1Q Tagging",
        "Native VLAN",
        "Spanning Tree Protocol",
        "Root Bridge",
        "RSTP",
        "PortFast",
      ],
    },

    "Protocolos de Roteamento": {
      title: "Protocolos de Roteamento",
      introduction:
        "Protocolos de roteamento permitem que roteadores aprendam e compartilhem informações sobre redes dinamicamente. Dividem-se em IGP (dentro de um AS) e EGP (entre ASes). OSPF e EIGRP dominam redes corporativas; BGP é a cola da Internet.",
      sections: [
        {
          heading: "Roteamento Estático e Dinâmico",
          content:
            "Estático: rotas configuradas manualmente. Simples, previsível, mas não escala. Dinâmico: protocolos descobrem e atualizam rotas automaticamente. Adapta-se a falhas. Métricas determinam melhor caminho: hop count, bandwidth, delay, cost. Administrative distance: preferência entre protocolos (lower = better).",
        },
        {
          heading: "IGP: OSPF e EIGRP",
          content:
            "OSPF (Open Shortest Path First): link-state, padrão aberto. Áreas hierárquicas, área 0 é backbone. LSAs propagam estado dos links. Dijkstra calcula SPF. Custo baseado em bandwidth. EIGRP (Cisco proprietário, agora aberto): distance-vector avançado, DUAL algorithm, convergência rápida, fácil configurar. Métrica composta (bandwidth, delay).",
        },
        {
          heading: "EGP: BGP",
          content:
            "BGP (Border Gateway Protocol): protocolo da Internet entre ASes (Autonomous Systems). Path-vector: seleciona rota por atributos (AS path, local pref, MED). eBGP entre ASes, iBGP dentro do AS. Política-driven: prioriza relações de negócio. Tabela global: ~900k rotas. Segurança: RPKI, ROA para validar anúncios.",
        },
      ],
      keyTopics: [
        "Roteamento Estático vs Dinâmico",
        "Métrica e Administrative Distance",
        "OSPF e Áreas",
        "EIGRP e DUAL",
        "BGP e AS",
        "eBGP vs iBGP",
        "Tabela de Roteamento",
        "Convergência",
      ],
    },

    "Firewall e Proxy": {
      title: "Firewall e Proxy",
      introduction:
        "Firewall filtra tráfego entre redes baseado em regras. Proxy atua como intermediário em conexões. Juntos, formam camadas essenciais de segurança perimetral. NGFWs combinam firewall tradicional com IPS, application awareness e threat intelligence.",
      sections: [
        {
          heading: "Tipos de Firewall",
          content:
            "Packet Filter: filtra por IP, porta, protocolo (stateless). Stateful: rastreia conexões, permite respostas. Application Layer (Proxy): inspeciona payload em L7. NGFW (Next-Generation): deep packet inspection, IPS integrado, user identity, application control. WAF (Web Application Firewall): específico para HTTP/HTTPS, protege contra XSS, SQLi.",
        },
        {
          heading: "Regras e Zonas",
          content:
            "Regras: source, destination, service/port, action (allow/deny), logging. Ordem importa: primeira match vence. Default deny (whitelist) mais seguro. Zonas: inside (trusted), outside (untrusted), DMZ (servidores públicos). Políticas entre zonas: inside→outside geralmente permitido, outside→inside bloqueado exceto DMZ.",
        },
        {
          heading: "Proxy e Inspeção",
          content:
            "Forward proxy: usuários internos acessam Internet via proxy. Caching, logging, filtragem de URL. Reverse proxy: protege servidores internos, load balancing, SSL offloading. Transparent proxy: intercepta sem configuração no cliente. SSL inspection: decifra HTTPS para inspeção (requer CA interna em clientes).",
        },
      ],
      keyTopics: [
        "Stateless vs Stateful",
        "NGFW",
        "WAF",
        "Regras (Source, Dest, Action)",
        "Zonas (Inside, Outside, DMZ)",
        "Forward vs Reverse Proxy",
        "SSL Inspection",
        "Default Deny",
      ],
    },

    "VPN e Túneis": {
      title: "VPN e Túneis",
      introduction:
        "VPN (Virtual Private Network) cria conexão segura sobre rede pública. Túneis encapsulam tráfego, criptografia garante confidencialidade. Site-to-site conecta redes; remote access conecta usuários. Essencial para trabalho remoto e conexão entre escritórios.",
      sections: [
        {
          heading: "IPsec",
          content:
            "Suite de protocolos para VPN site-to-site. IKE (Internet Key Exchange) negocia chaves e SAs (Security Associations). Fase 1: autenticação mútua, canal seguro. Fase 2: negocia túnel de dados. ESP (Encapsulating Security Payload): criptografia e integridade. AH (Authentication Header): só integridade. Tunnel mode encapsula pacote inteiro; transport mode só payload.",
        },
        {
          heading: "SSL/TLS VPN",
          content:
            "VPN sobre HTTPS (porta 443), atravessa firewalls facilmente. OpenVPN: open source, popular. Cisco AnyConnect, GlobalProtect: enterprise. Clientless: acesso via browser (aplicações web). Full tunnel: todo tráfego via VPN. Split tunnel: só tráfego corporativo. WireGuard: moderna, simples, rápida.",
        },
        {
          heading: "Túneis e Casos de Uso",
          content:
            "GRE (Generic Routing Encapsulation): encapsula qualquer protocolo, sem criptografia (combinar com IPsec). L2TP: Layer 2, geralmente com IPsec (L2TP/IPsec). DMVPN: hub-and-spoke dinâmico para múltiplos sites. SD-WAN: overlay sobre Internet com otimização e failover automático. Zero Trust Network Access (ZTNA) substitui VPN tradicional com acesso granular.",
        },
      ],
      keyTopics: [
        "IPsec (IKE, ESP, AH)",
        "Tunnel vs Transport Mode",
        "SSL VPN e OpenVPN",
        "WireGuard",
        "Split Tunnel vs Full Tunnel",
        "GRE",
        "DMVPN",
        "SD-WAN",
      ],
    },

    "Redes Sem Fio": {
      title: "Redes Sem Fio (Wi-Fi)",
      introduction:
        "Wi-Fi (802.11) permite conexão de rede sem cabos. Padrões evoluíram: a/b/g/n/ac/ax (Wi-Fi 6/6E). Frequências 2.4 GHz (maior alcance, mais interferência) e 5/6 GHz (mais velocidade, menor alcance). Segurança WPA3 é atual; WEP e WPA obsoletos.",
      sections: [
        {
          heading: "Padrões 802.11",
          content:
            "802.11b/g: 2.4 GHz, até 54 Mbps. 802.11n (Wi-Fi 4): 2.4/5 GHz, MIMO, até 600 Mbps. 802.11ac (Wi-Fi 5): 5 GHz, MU-MIMO, até 6.9 Gbps. 802.11ax (Wi-Fi 6): eficiência em ambientes densos, OFDMA, até 9.6 Gbps. Wi-Fi 6E: banda de 6 GHz adicional. Backwards compatible.",
        },
        {
          heading: "Canais e Interferência",
          content:
            "2.4 GHz: canais 1-14, usar 1, 6, 11 (não sobrepõem). Interferência: micro-ondas, Bluetooth. 5 GHz: mais canais, menos interferência, DFS (Dynamic Frequency Selection) para evitar radar. Site survey para planejamento. Heat maps mostram cobertura. Roaming: handoff entre APs no mesmo SSID.",
        },
        {
          heading: "Segurança Wireless",
          content:
            "WEP: quebrado, nunca usar. WPA/WPA2-Personal (PSK): senha compartilhada. WPA2-Enterprise: 802.1X, autenticação individual (RADIUS). WPA3: criptografia individual, proteção contra brute force (SAE). SSID oculto: segurança mínima (sniffers descobrem). MAC filtering: facilmente burlável. WPA3 + 802.1X ideal.",
        },
      ],
      keyTopics: [
        "802.11 a/b/g/n/ac/ax",
        "Wi-Fi 6 e OFDMA",
        "Frequências 2.4 vs 5 GHz",
        "Canais e Interferência",
        "WPA2 vs WPA3",
        "802.1X e RADIUS",
        "SSID e Roaming",
        "Site Survey",
      ],
    },

    "Cabeamento Estruturado": {
      title: "Cabeamento Estruturado",
      introduction:
        "Cabeamento estruturado é a infraestrutura física que conecta dispositivos de rede. Padrões (TIA/EIA-568) garantem compatibilidade e qualidade. Categorias de cabo definem velocidade/frequência. Certificação assegura performance. Fundamento de qualquer rede corporativa.",
      sections: [
        {
          heading: "Categorias de Cabo UTP",
          content:
            "Cat 5e: 1 Gbps, 100 MHz, 100m. Cat 6: 1 Gbps (10 Gbps até 55m), 250 MHz. Cat 6a: 10 Gbps, 500 MHz. Cat 7/7a: shielded, 10 Gbps+, data centers (conectores diferentes). Cat 8: 25-40 Gbps, curtas distâncias. UTP (unshielded) vs STP (shielded). RJ-45: conector padrão. T568A e T568B: padrões de pinagem.",
        },
        {
          heading: "Fibra Óptica",
          content:
            "Monomodo (SMF): núcleo fino (9μm), longas distâncias (km), mais cara, laser. Multimodo (MMF): núcleo maior (50/62.5μm), curtas distâncias (até 550m), LED. Conectores: SC, LC (mais compacto), ST, MPO. Transceiver: SFP, SFP+, QSFP. Vantagens: imune a EMI, longas distâncias, alta capacidade.",
        },
        {
          heading: "Infraestrutura e Normas",
          content:
            "Subsistemas: horizontal (workstation→patch panel), backbone (entre andares/prédios), work area. Patch panel centraliza conexões no rack. Testes: certificação verifica todos os parâmetros. TIA/EIA-568: norma americana. ISO/IEC 11801: internacional. Racks 19': padrão de montagem. U (rack unit) = 1.75 polegadas.",
        },
      ],
      keyTopics: [
        "Categorias (Cat 5e, 6, 6a)",
        "UTP vs STP",
        "Fibra Monomodo vs Multimodo",
        "Conectores (RJ-45, LC, SC)",
        "T568A e T568B",
        "Patch Panel e Rack",
        "Certificação de Cabeamento",
        "SFP e Transceiver",
      ],
    },

    "Segurança de Redes": {
      title: "Segurança de Redes",
      introduction:
        "Segurança de redes protege infraestrutura, dados em trânsito e endpoints. Defesa em camadas: perímetro (firewall), segmentação (VLANs), criptografia (VPN/TLS), controle de acesso (802.1X), monitoramento (IDS/IPS). Ataques evoluem; defesas devem acompanhar.",
      sections: [
        {
          heading: "Ataques de Rede",
          content:
            "ARP Spoofing: falsifica respostas ARP para interceptar tráfego. MITM (Man-in-the-Middle): atacante entre vítimas. DDoS: sobrecarrega recursos com tráfego. DNS Poisoning: redireciona para sites maliciosos. MAC Flooding: satura tabela CAM do switch. VLAN Hopping: acessa VLANs não autorizadas via double tagging.",
        },
        {
          heading: "Controle de Acesso à Rede",
          content:
            "802.1X: autenticação de porta baseada em RADIUS. EAP (Extensible Authentication Protocol): métodos de autenticação. NAC (Network Access Control): verifica compliance antes de permitir acesso (antivírus, patches). Port Security: limita MACs por porta. DHCP Snooping: previne DHCP rogue. Dynamic ARP Inspection: valida ARP com DHCP bindings.",
        },
        {
          heading: "Criptografia e Monitoramento",
          content:
            "TLS/SSL: criptografia em trânsito para aplicações. IPsec: criptografia network layer. MACsec (802.1AE): criptografia layer 2 (link por link). IDS (Intrusion Detection): alerta sobre ataques. IPS (Intrusion Prevention): bloqueia automaticamente. SIEM correlaciona eventos de múltiplas fontes. Network TAP para captura passiva.",
        },
      ],
      keyTopics: [
        "ARP Spoofing e MITM",
        "DDoS",
        "802.1X e NAC",
        "Port Security",
        "DHCP Snooping",
        "IDS vs IPS",
        "TLS/IPsec/MACsec",
        "Segmentação de Rede",
      ],
    },

    "Monitoramento e Diagnóstico de Redes": {
      title: "Monitoramento e Diagnóstico de Redes",
      introduction:
        "Monitoramento garante disponibilidade e performance. SNMP coleta métricas de devices. Ferramentas de troubleshooting (ping, traceroute, Wireshark) diagnosticam problemas. Proatividade com alertas e dashboards previne incidentes.",
      sections: [
        {
          heading: "SNMP e Métricas",
          content:
            "SNMP (Simple Network Management Protocol): coleta dados de devices (CPU, memória, interfaces). MIB define objetos gerenciáveis. Community strings: autenticação (SNMPv1/v2c). SNMPv3: criptografia e autenticação forte. Traps: alertas assíncronos do device para manager. Polling: manager consulta devices.",
        },
        {
          heading: "Ferramentas de Diagnóstico",
          content:
            "ping: testa conectividade (ICMP echo). traceroute/tracert: mostra caminho e latência por hop. nslookup/dig: consultas DNS. netstat/ss: conexões e portas abertas. tcpdump/Wireshark: captura de pacotes. iperf: teste de throughput. MTR: combina ping + traceroute contínuo. arp -a: tabela ARP local.",
        },
        {
          heading: "Plataformas de Monitoramento",
          content:
            "Zabbix, Nagios, PRTG: monitoramento tradicional com agentes ou SNMP. Prometheus + Grafana: métricas time-series, popular em cloud-native. ELK Stack: logs centralizados (Elasticsearch, Logstash, Kibana). NetFlow/sFlow: análise de fluxo de tráfego. Dashboards com SLAs e alertas por thresholds.",
        },
      ],
      keyTopics: [
        "SNMP e MIB",
        "SNMPv3",
        "ping, traceroute",
        "Wireshark",
        "netstat/ss",
        "Zabbix, Nagios",
        "NetFlow/sFlow",
        "Prometheus + Grafana",
      ],
    },

    "Serviços de Rede": {
      title: "Serviços de Rede",
      introduction:
        "Serviços de rede fornecem funcionalidades essenciais: web (HTTP), email (SMTP), transferência de arquivos (FTP/SFTP), acesso remoto (SSH), sincronização de tempo (NTP). Portas bem conhecidas identificam serviços (80=HTTP, 443=HTTPS, 22=SSH).",
      sections: [
        {
          heading: "Web e Email",
          content:
            "HTTP/HTTPS (80/443): protocolo da web. HTTPS = HTTP + TLS. SMTP (25/587): envio de email. IMAP (143/993): acesso a email, sincroniza com servidor. POP3 (110/995): download de email, remove do servidor. SPF, DKIM, DMARC: autenticação de email para combater spam/phishing.",
        },
        {
          heading: "Transferência e Acesso Remoto",
          content:
            "FTP (20/21): legado, não criptografado. SFTP (22): FTP sobre SSH, seguro. FTPS: FTP + TLS. SCP: cópia via SSH. SSH (22): shell remoto criptografado, substitui Telnet. RDP (3389): acesso remoto Windows. VNC: acesso remoto multiplataforma. TFTP (69): simples, sem autenticação, usado para firmware/boot.",
        },
        {
          heading: "Outros Serviços",
          content:
            "NTP (123): sincronização de tempo. LDAP (389/636): diretório, autenticação centralizada (Active Directory usa LDAP). RADIUS (1812/1813): autenticação remota, 802.1X. Syslog (514): logs centralizados. SNMP (161/162): gerenciamento de rede. SMB/CIFS (445): compartilhamento de arquivos Windows.",
        },
      ],
      keyTopics: [
        "HTTP/HTTPS",
        "SMTP, IMAP, POP3",
        "FTP, SFTP, SCP",
        "SSH vs Telnet",
        "NTP",
        "LDAP e Active Directory",
        "RADIUS",
        "Syslog",
      ],
    },

    MPLS: {
      title: "MPLS - Multiprotocol Label Switching",
      introduction:
        "MPLS roteia pacotes por labels em vez de lookups de IP, aumentando eficiência em backbones de ISPs. Permite engenharia de tráfego, VPNs corporativas e QoS avançado. Base de muitas WANs empresariais, sendo substituído gradualmente por SD-WAN.",
      sections: [
        {
          heading: "Conceitos Fundamentais",
          content:
            "Label: identificador curto (20 bits) entre camadas 2 e 3. LSR (Label Switch Router): roteador MPLS. LER (Label Edge Router): ingress/egress da nuvem MPLS. LSP (Label Switched Path): caminho pré-determinado. Label stack: múltiplas labels empilhadas. Push, swap, pop: operações em labels.",
        },
        {
          heading: "Protocolos MPLS",
          content:
            "LDP (Label Distribution Protocol): distribui labels automaticamente baseado em tabela de rotas. RSVP-TE: reserva de recursos com engenharia de tráfego, paths explícitos. MP-BGP: multiprotocol BGP distribui rotas VPN com labels. VRF (Virtual Routing and Forwarding): tabelas de roteamento virtuais isoladas.",
        },
        {
          heading: "MPLS VPN e Aplicações",
          content:
            "L3VPN: VPN de camada 3, ISP roteia entre sites do cliente. L2VPN (VPLS, VPWS): emula LAN/link ponto-a-ponto sobre MPLS. PE (Provider Edge) conecta clientes; P (Provider) é core. Route Distinguisher (RD) e Route Target (RT) diferenciam VPNs. Traffic Engineering: paths otimizados, fast reroute para failover.",
        },
      ],
      keyTopics: [
        "Labels e LSP",
        "LSR, LER",
        "LDP e RSVP-TE",
        "MPLS L3VPN",
        "VRF",
        "PE e P Routers",
        "Traffic Engineering",
        "Fast Reroute",
      ],
    },

    "QoS e Engenharia de Tráfego": {
      title: "QoS e Engenharia de Tráfego",
      introduction:
        "QoS (Quality of Service) prioriza tráfego crítico (voz, vídeo) sobre melhor esforço. Classificação, marcação, enfileiramento e policing controlam como pacotes são tratados. Essencial quando banda é limitada ou latência/jitter impactam aplicações.",
      sections: [
        {
          heading: "Métricas e Classificação",
          content:
            "Métricas QoS: bandwidth, latency (delay), jitter (variação de delay), packet loss. Voz/vídeo sensíveis a latência (<150ms) e jitter (<30ms). Classificação: identifica tráfego por porta, protocolo, IP, DSCP. DSCP (Differentiated Services Code Point): 6 bits no header IP para marcar classe de tráfego. Exemplo: EF (Expedited Forwarding) = voz.",
        },
        {
          heading: "Enfileiramento e Schedulers",
          content:
            "FIFO: primeiro a chegar, primeiro a sair (sem QoS). Priority Queuing: estrito, risco de starvation. WFQ (Weighted Fair Queuing): divide banda proporcionalmente. CBWFQ (Class-Based): bandwidth garantido por classe. LLQ (Low Latency Queuing): priority queue para voz + CBWFQ para resto. Ideal para convergência.",
        },
        {
          heading: "Policing e Shaping",
          content:
            "Policing: descarta ou remarca tráfego que excede limite. Burst tolerado. Shaping: atrasa tráfego para suavizar, usa buffer. Token bucket: modelo de controle. Policing geralmente na entrada; shaping na saída. Congestion avoidance: WRED descarta seletivamente antes de filas encherem (TCP recua).",
        },
      ],
      keyTopics: [
        "Bandwidth, Latency, Jitter",
        "Classificação e DSCP",
        "Enfileiramento (PQ, WFQ, LLQ)",
        "Policing vs Shaping",
        "WRED",
        "Traffic Shaping",
        "CoS e ToS",
        "IntServ vs DiffServ",
      ],
    },

    "SDN e Virtualização de Redes": {
      title: "SDN e Virtualização de Redes",
      introduction:
        "SDN (Software-Defined Networking) separa plano de controle do plano de dados, centralizando inteligência em controller. Virtualização de rede (NSX, VXLAN) abstrai rede física. NFV substitui appliances por VNFs. Fundamentos de redes modernas e cloud.",
      sections: [
        {
          heading: "SDN e OpenFlow",
          content:
            "Plano de dados (forwarding): switches processam pacotes. Plano de controle: decisões de roteamento. SDN centraliza controle em controller. OpenFlow: protocolo entre controller e switches, programa flow tables. Controllers: OpenDaylight, ONOS, Floodlight. APIs northbound para aplicações.",
        },
        {
          heading: "Virtualização de Rede",
          content:
            "Overlay networks: redes virtuais sobre física. VXLAN: encapsulamento que escala VLANs (24 bits = 16 milhões VNIs). VTEP: Virtual Tunnel Endpoint. VMware NSX, Cisco ACI: plataformas enterprise. Micro-segmentation: políticas granulares entre VMs/containers. Distributed firewall no hypervisor.",
        },
        {
          heading: "NFV e Cloud Networking",
          content:
            "NFV (Network Functions Virtualization): firewall, load balancer, router como VMs/containers em hardware commodity. VNF (Virtual Network Function): a função virtualizada. MANO orquestra NFV. Cloud networking: VPCs, subnets, security groups, peering. Intent-based networking: declara objetivo, sistema implementa.",
        },
      ],
      keyTopics: [
        "Plano de Controle vs Dados",
        "SDN Controller",
        "OpenFlow",
        "VXLAN e Overlays",
        "NSX e Micro-segmentation",
        "NFV e VNF",
        "VPC e Cloud Networking",
        "Intent-Based Networking",
      ],
    },

    VoIP: {
      title: "VoIP - Voz sobre IP",
      introduction:
        "VoIP transmite voz como pacotes IP em vez de circuitos telefônicos. Reduz custos, unifica comunicações. SIP é o protocolo de sinalização dominante. Codecs comprimem áudio. QoS é crítico para qualidade — jitter e packet loss degradam chamadas.",
      sections: [
        {
          heading: "Protocolos de Sinalização",
          content:
            "SIP (Session Initiation Protocol): controle de sessões (INVITE, ACK, BYE). Texto-based, similar a HTTP. SIP Proxy, Registrar, Location Service. H.323: legado, complexo. MGCP/Megaco: controle centralizado de media gateways. RTP (Real-time Transport Protocol): transporta áudio/vídeo. RTCP: controle e estatísticas de qualidade.",
        },
        {
          heading: "Codecs e Qualidade",
          content:
            "Codec: codifica/decodifica voz. G.711: sem compressão, 64 kbps, melhor qualidade. G.729: 8 kbps, comprimido, aceitável. Opus: moderno, adaptativo. MOS (Mean Opinion Score): 1-5, acima de 4 é bom. Jitter buffer compensa variação. Packet loss > 1% perceptível. Latência > 150ms problemática.",
        },
        {
          heading: "Infraestrutura VoIP",
          content:
            "IP PBX: central telefônica IP (Asterisk, Cisco CUCM, 3CX). SIP Trunk: conexão com PSTN via SIP. Phones IP ou softphones. VLAN de voz: separa tráfego, QoS. PoE (Power over Ethernet): alimenta telefones. E911: localização para emergência. SBC (Session Border Controller): segurança e interoperabilidade na borda.",
        },
      ],
      keyTopics: [
        "SIP e Sinalização",
        "RTP/RTCP",
        "Codecs (G.711, G.729)",
        "Jitter e Packet Loss",
        "IP PBX",
        "SIP Trunk",
        "QoS para Voz",
        "PoE",
      ],
    },
  },

  // ===========================================
  // MATEMÁTICA - Formato Aula de Quadro
  // ===========================================
  matematica: {
    "Análise Combinatória": {
      title: "Análise Combinatória",
      introduction:
        "A Análise Combinatória estuda métodos de contagem para determinar o número de possibilidades de um evento ocorrer. Utiliza os princípios fundamental da contagem, permutações (ordem importa), combinações (ordem não importa) e arranjos. Fórmulas: P(n) = n!, A(n,p) = n!/(n-p)!, C(n,p) = n!/[p!(n-p)!]",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Uma comissão de 5 pessoas será formada a partir de um grupo de 4 homens e 6 mulheres. De quantas maneiras podemos formar essa comissão de modo que tenha pelo menos 3 mulheres?",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  DADOS DO PROBLEMA:                                      │\n│  • Total de homens: 4                                    │\n│  • Total de mulheres: 6                                  │\n│  • Comissão: 5 pessoas                                   │\n│  • Condição: pelo menos 3 mulheres                       │\n└─────────────────────────────────────────────────────────┘\n\n✏️ CASOS POSSÍVEIS:\n   Caso 1: 3 mulheres e 2 homens\n   Caso 2: 4 mulheres e 1 homem\n   Caso 3: 5 mulheres e 0 homens\n\n─────────────────────────────────────────────────────────\n│ CASO 1: 3 mulheres e 2 homens                          │\n─────────────────────────────────────────────────────────\n   C(6,3) × C(4,2)\n   \n   C(6,3) = 6!/(3!·3!) = (6×5×4)/(3×2×1) = 120/6 = 20\n   \n   C(4,2) = 4!/(2!·2!) = (4×3)/(2×1) = 12/2 = 6\n   \n   Caso 1 = 20 × 6 = 120 maneiras\n\n─────────────────────────────────────────────────────────\n│ CASO 2: 4 mulheres e 1 homem                           │\n─────────────────────────────────────────────────────────\n   C(6,4) × C(4,1)\n   \n   C(6,4) = 6!/(4!·2!) = (6×5)/(2×1) = 30/2 = 15\n   \n   C(4,1) = 4\n   \n   Caso 2 = 15 × 4 = 60 maneiras\n\n─────────────────────────────────────────────────────────\n│ CASO 3: 5 mulheres e 0 homens                          │\n─────────────────────────────────────────────────────────\n   C(6,5) × C(4,0)\n   \n   C(6,5) = 6\n   \n   C(4,0) = 1\n   \n   Caso 3 = 6 × 1 = 6 maneiras\n\n═══════════════════════════════════════════════════════════\n║  TOTAL = Caso 1 + Caso 2 + Caso 3                       ║\n║  TOTAL = 120 + 60 + 6 = 186 maneiras                    ║\n═══════════════════════════════════════════════════════════",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Combinação C(n,p): escolha de p elementos de n, sem importar ordem\n• Princípio Multiplicativo: eventos independentes se multiplicam\n• Princípio Aditivo: casos mutuamente exclusivos se somam\n• Fatoração: n! = n × (n-1) × ... × 2 × 1",
        },
      ],
      keyTopics: [
        "Permutação P(n) = n!",
        "Arranjo A(n,p)",
        "Combinação C(n,p)",
        "Princípio Multiplicativo",
        "Princípio Aditivo",
        "Permutação com Repetição",
        "Combinação com Repetição",
      ],
    },

    "Equações e Inequações": {
      title: "Equações e Inequações",
      introduction:
        "Equações são sentenças matemáticas com igualdade e incógnita(s). Inequações usam desigualdades (<, >, ≤, ≥). Tipos principais: 1º grau (ax+b=0), 2º grau (ax²+bx+c=0), exponenciais, logarítmicas e modulares. Resolver significa encontrar valores que satisfazem a sentença.",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content: "Resolva a inequação: |2x - 3| < x + 6",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  INEQUAÇÃO MODULAR: |2x - 3| < x + 6                     │\n│  Propriedade: |A| < B ⟺ -B < A < B (se B > 0)           │\n└─────────────────────────────────────────────────────────┘\n\n✏️ PASSO 1: Verificar condição B > 0\n   \n   x + 6 > 0  →  x > -6\n   \n   (Guardar esta condição para o final)\n\n─────────────────────────────────────────────────────────\n│ PASSO 2: Aplicar a propriedade do módulo               │\n─────────────────────────────────────────────────────────\n   \n   |2x - 3| < x + 6\n   \n   -(x + 6) < 2x - 3 < x + 6\n\n─────────────────────────────────────────────────────────\n│ PASSO 3: Resolver a primeira inequação                 │\n─────────────────────────────────────────────────────────\n   \n   -(x + 6) < 2x - 3\n   -x - 6 < 2x - 3\n   -6 + 3 < 2x + x\n   -3 < 3x\n   x > -1\n\n─────────────────────────────────────────────────────────\n│ PASSO 4: Resolver a segunda inequação                  │\n─────────────────────────────────────────────────────────\n   \n   2x - 3 < x + 6\n   2x - x < 6 + 3\n   x < 9\n\n─────────────────────────────────────────────────────────\n│ PASSO 5: Interseção das soluções                       │\n─────────────────────────────────────────────────────────\n   \n   Condição 1: x > -6\n   Condição 2: x > -1\n   Condição 3: x < 9\n   \n        -6        -1                 9\n   ──────┼─────────┼─────────────────┼──────▶\n         │    ░░░░░│█████████████████│\n         │         │    SOLUÇÃO      │\n   \n═══════════════════════════════════════════════════════════\n║  SOLUÇÃO: S = {x ∈ ℝ | -1 < x < 9}                      ║\n║  ou em intervalo: S = (-1, 9)                           ║\n═══════════════════════════════════════════════════════════",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Módulo: |a| = a se a ≥ 0, |a| = -a se a < 0\n• Propriedade: |A| < B ⟺ -B < A < B (quando B > 0)\n• Inequação dupla: resolver duas desigualdades\n• Interseção de intervalos: região comum às soluções",
        },
      ],
      keyTopics: [
        "Equação do 1º Grau",
        "Equação do 2º Grau (Bhaskara)",
        "Inequação do 1º e 2º Grau",
        "Equação e Inequação Modular",
        "Equação Exponencial",
        "Equação Logarítmica",
        "Sistemas de Equações",
      ],
    },

    "Estatística e Probabilidade": {
      title: "Estatística e Probabilidade",
      introduction:
        "Estatística organiza, apresenta e interpreta dados. Medidas de tendência central: média, mediana, moda. Medidas de dispersão: variância, desvio padrão. Probabilidade mede a chance de eventos: P(A) = casos favoráveis / casos possíveis. Eventos independentes: P(A∩B) = P(A)·P(B).",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Uma urna contém 5 bolas vermelhas e 3 bolas azuis. Retiramos 2 bolas sucessivamente, SEM reposição. Qual a probabilidade de a primeira ser vermelha E a segunda ser azul?",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  DADOS:                                                  │\n│  • Bolas vermelhas: 5                                    │\n│  • Bolas azuis: 3                                        │\n│  • Total inicial: 8 bolas                                │\n│  • Retirada: SEM reposição                               │\n└─────────────────────────────────────────────────────────┘\n\n✏️ ESQUEMA DA URNA:\n\n   ┌───────────────────┐\n   │  🔴🔴🔴🔴🔴 🔵🔵🔵  │  8 bolas no início\n   └───────────────────┘\n\n─────────────────────────────────────────────────────────\n│ EVENTO A: Primeira bola é VERMELHA                     │\n─────────────────────────────────────────────────────────\n   \n   P(A) = bolas vermelhas / total\n   \n   P(A) = 5/8\n   \n   ┌───────────────────┐\n   │  🔴🔴🔴🔴 🔵🔵🔵    │  Agora restam 7 bolas\n   └───────────────────┘\n\n─────────────────────────────────────────────────────────\n│ EVENTO B: Segunda bola é AZUL (dado que A ocorreu)     │\n─────────────────────────────────────────────────────────\n   \n   P(B|A) = bolas azuis / novo total\n   \n   P(B|A) = 3/7\n   \n   (A urna agora tem 4 vermelhas e 3 azuis = 7 bolas)\n\n─────────────────────────────────────────────────────────\n│ PROBABILIDADE CONJUNTA: P(A ∩ B)                       │\n─────────────────────────────────────────────────────────\n   \n   P(A ∩ B) = P(A) × P(B|A)\n   \n   P(A ∩ B) = 5/8 × 3/7\n   \n   P(A ∩ B) = 15/56\n\n═══════════════════════════════════════════════════════════\n║  RESPOSTA: P = 15/56 ≈ 0,268 ou ≈ 26,8%                 ║\n═══════════════════════════════════════════════════════════",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Probabilidade condicional: P(B|A) - prob. de B dado que A já ocorreu\n• Eventos dependentes: sem reposição, total muda\n• Regra do produto: P(A∩B) = P(A) × P(B|A)\n• Fração irredutível: 15 e 56 não têm divisor comum",
        },
      ],
      keyTopics: [
        "Média, Mediana, Moda",
        "Variância e Desvio Padrão",
        "Probabilidade Simples",
        "Probabilidade Condicional",
        "Eventos Independentes",
        "Eventos Mutuamente Exclusivos",
        "Distribuição Normal",
      ],
    },

    Funções: {
      title: "Funções",
      introduction:
        "Função é uma relação onde cada elemento do domínio tem exatamente uma imagem no contradomínio. Notação: f(x). Tipos: afim (1º grau), quadrática (2º grau), exponencial, logarítmica, trigonométrica. Propriedades: domínio, imagem, crescimento, raízes, vértice.",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Um projétil é lançado verticalmente para cima. Sua altura h (em metros) em função do tempo t (em segundos) é dada por h(t) = -5t² + 40t + 45. Determine: a) A altura máxima atingida. b) Em que instante atinge o solo.",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  FUNÇÃO: h(t) = -5t² + 40t + 45                         │\n│  Tipo: Função Quadrática (parábola)                      │\n│  a = -5 (negativo → concavidade para baixo ∩)           │\n└─────────────────────────────────────────────────────────┘\n\n✏️ GRÁFICO ESQUEMÁTICO:\n\n        h │        ●  máximo\n          │       /│\\\n          │      / │ \\\n          │     /  │  \\\n          │    /   │   \\\n        45├───●    │    \\\n          │        │     \\\n        ──┼────────┼──────●───▶ t\n          0       tv      t₂\n\n═══════════════════════════════════════════════════════════\n│ ITEM A: ALTURA MÁXIMA                                   │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Passo 1: Encontrar o tempo do vértice (tv)             │\n─────────────────────────────────────────────────────────\n   \n   tv = -b/(2a)\n   \n   tv = -40/(2·(-5))\n   \n   tv = -40/(-10) = 4 segundos\n\n─────────────────────────────────────────────────────────\n│ Passo 2: Calcular h(tv) - altura máxima                │\n─────────────────────────────────────────────────────────\n   \n   h(4) = -5·(4)² + 40·(4) + 45\n   \n   h(4) = -5·16 + 160 + 45\n   \n   h(4) = -80 + 160 + 45\n   \n   h(4) = 125 metros\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ ALTURA MÁXIMA = 125 metros (em t = 4s)               │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM B: INSTANTE QUE ATINGE O SOLO                      │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Passo 1: Solo significa h(t) = 0                       │\n─────────────────────────────────────────────────────────\n   \n   -5t² + 40t + 45 = 0\n   \n   Dividindo por -5:\n   t² - 8t - 9 = 0\n\n─────────────────────────────────────────────────────────\n│ Passo 2: Aplicar Bhaskara                              │\n─────────────────────────────────────────────────────────\n   \n   a = 1, b = -8, c = -9\n   \n   Δ = b² - 4ac\n   Δ = (-8)² - 4·1·(-9)\n   Δ = 64 + 36 = 100\n   \n   t = (-b ± √Δ)/(2a)\n   t = (8 ± 10)/2\n   \n   t₁ = (8 + 10)/2 = 18/2 = 9\n   t₂ = (8 - 10)/2 = -2/2 = -1 (não serve, t > 0)\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ ATINGE O SOLO em t = 9 segundos                      │\n└─────────────────────────────────────────────────────────┘",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Função Quadrática: f(x) = ax² + bx + c\n• Vértice: xv = -b/(2a), yv = -Δ/(4a)\n• Concavidade: a > 0 (∪ mínimo), a < 0 (∩ máximo)\n• Bhaskara: x = (-b ± √Δ)/(2a), onde Δ = b² - 4ac",
        },
      ],
      keyTopics: [
        "Função Afim (1º grau)",
        "Função Quadrática (2º grau)",
        "Vértice da Parábola",
        "Função Exponencial",
        "Função Logarítmica",
        "Domínio e Imagem",
        "Função Composta e Inversa",
      ],
    },

    "Geometria Plana": {
      title: "Geometria Plana",
      introduction:
        "Geometria Plana estuda figuras bidimensionais: triângulos, quadriláteros, círculos, polígonos. Conceitos fundamentais: perímetro, área, semelhança, congruência. Teoremas importantes: Pitágoras (a² = b² + c²), Tales, relações métricas no triângulo retângulo.",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Em um triângulo retângulo, a hipotenusa mede 13 cm e um dos catetos mede 5 cm. Calcule: a) O outro cateto. b) A área do triângulo. c) A altura relativa à hipotenusa.",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  DADOS:                                                  │\n│  • Hipotenusa (a): 13 cm                                 │\n│  • Cateto (b): 5 cm                                      │\n│  • Cateto (c): ?                                         │\n└─────────────────────────────────────────────────────────┘\n\n✏️ FIGURA:\n\n              C\n              │\\\n              │ \\\n            c │  \\  a = 13\n              │   \\\n              │  h \\\n              │─────\\\n              A  b=5  B\n\n═══════════════════════════════════════════════════════════\n│ ITEM A: ENCONTRAR O CATETO c                            │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Teorema de Pitágoras: a² = b² + c²                     │\n─────────────────────────────────────────────────────────\n   \n   13² = 5² + c²\n   \n   169 = 25 + c²\n   \n   c² = 169 - 25\n   \n   c² = 144\n   \n   c = √144 = 12 cm\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ CATETO c = 12 cm                                      │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM B: ÁREA DO TRIÂNGULO                               │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Área = (base × altura)/2                               │\n─────────────────────────────────────────────────────────\n   \n   No triângulo retângulo, os catetos são\n   perpendiculares entre si:\n   \n   Área = (b × c)/2\n   \n   Área = (5 × 12)/2\n   \n   Área = 60/2 = 30 cm²\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ ÁREA = 30 cm²                                         │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM C: ALTURA RELATIVA À HIPOTENUSA (h)                │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Usando: Área = (hipotenusa × altura)/2                 │\n─────────────────────────────────────────────────────────\n   \n   30 = (13 × h)/2\n   \n   60 = 13 × h\n   \n   h = 60/13 ≈ 4,62 cm\n\n   OU pela relação métrica: b × c = a × h\n   \n   5 × 12 = 13 × h\n   60 = 13h\n   h = 60/13 cm\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ ALTURA h = 60/13 cm ≈ 4,62 cm                        │\n└─────────────────────────────────────────────────────────┘",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Teorema de Pitágoras: a² = b² + c²\n• Área do triângulo: A = (b × h)/2\n• Relação métrica: b·c = a·h (produto dos catetos = hipotenusa × altura)\n• Triângulo pitagórico 5-12-13",
        },
      ],
      keyTopics: [
        "Teorema de Pitágoras",
        "Área de Triângulos",
        "Área de Quadriláteros",
        "Circunferência e Círculo",
        "Teorema de Tales",
        "Semelhança de Triângulos",
        "Relações Métricas",
      ],
    },

    "Geometria Espacial": {
      title: "Geometria Espacial",
      introduction:
        "Geometria Espacial estuda sólidos tridimensionais: prismas, pirâmides, cilindros, cones, esferas. Conceitos: área lateral, área total, volume. Volume prisma/cilindro = Ab × h. Volume pirâmide/cone = (Ab × h)/3. Volume esfera = (4/3)πr³.",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Um cone reto tem raio da base igual a 6 cm e altura igual a 8 cm. Calcule: a) A geratriz do cone. b) A área lateral. c) O volume do cone.",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  DADOS:                                                  │\n│  • Raio (r): 6 cm                                        │\n│  • Altura (h): 8 cm                                      │\n│  • π ≈ 3,14 (ou deixar em função de π)                  │\n└─────────────────────────────────────────────────────────┘\n\n✏️ FIGURA:\n\n                 V (vértice)\n                /|\\\n               / | \\\n              /  |  \\  g (geratriz)\n             /   |h=8\\\n            /    |    \\\n           /_____|_____\\\n                r=6\n              (base)\n\n═══════════════════════════════════════════════════════════\n│ ITEM A: GERATRIZ (g)                                    │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Pitágoras no triângulo retângulo: g² = r² + h²         │\n─────────────────────────────────────────────────────────\n   \n   O corte vertical do cone forma um\n   triângulo retângulo:\n   \n           V\n           |\\\n         h | \\ g\n           |  \\\n           |___\\\n             r\n   \n   g² = 6² + 8²\n   \n   g² = 36 + 64\n   \n   g² = 100\n   \n   g = √100 = 10 cm\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ GERATRIZ g = 10 cm                                    │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM B: ÁREA LATERAL                                    │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Fórmula: AL = π × r × g                                │\n─────────────────────────────────────────────────────────\n   \n   (A área lateral é um setor circular planificado)\n   \n   AL = π × 6 × 10\n   \n   AL = 60π cm²\n   \n   AL ≈ 60 × 3,14 = 188,4 cm²\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ ÁREA LATERAL = 60π cm² ≈ 188,4 cm²                   │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM C: VOLUME                                          │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Fórmula: V = (1/3) × π × r² × h                        │\n─────────────────────────────────────────────────────────\n   \n   V = (1/3) × π × 6² × 8\n   \n   V = (1/3) × π × 36 × 8\n   \n   V = (1/3) × 288π\n   \n   V = 96π cm³\n   \n   V ≈ 96 × 3,14 = 301,44 cm³\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ VOLUME = 96π cm³ ≈ 301,44 cm³                        │\n└─────────────────────────────────────────────────────────┘",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Geratriz do cone: segmento do vértice à base, g² = r² + h²\n• Área lateral do cone: AL = πrg (setor circular)\n• Volume do cone: V = (1/3)πr²h (1/3 do cilindro)\n• Terno pitagórico (6, 8, 10): triângulo retângulo",
        },
      ],
      keyTopics: [
        "Prismas e Volume",
        "Pirâmides e Volume",
        "Cilindro",
        "Cone e Geratriz",
        "Esfera",
        "Área Lateral e Total",
        "Troncos",
      ],
    },

    "Juros Simples e Compostos": {
      title: "Juros Simples e Compostos",
      introduction:
        "Juros é a remuneração pelo uso do capital ao longo do tempo. Juros Simples: J = C·i·t, montante M = C(1 + i·t). Juros Compostos: M = C(1 + i)^t, juros sobre juros. Compostos crescem mais rápido e são usados no mercado financeiro.",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Carlos investiu R$ 10.000,00 em uma aplicação que rende 2% ao mês. Compare o montante após 12 meses em: a) Juros Simples. b) Juros Compostos. c) Qual a diferença entre os dois?",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  DADOS:                                                  │\n│  • Capital (C): R$ 10.000,00                             │\n│  • Taxa (i): 2% a.m. = 0,02                              │\n│  • Tempo (t): 12 meses                                   │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM A: JUROS SIMPLES                                   │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Fórmula: M = C × (1 + i × t)                           │\n─────────────────────────────────────────────────────────\n   \n   M = 10.000 × (1 + 0,02 × 12)\n   \n   M = 10.000 × (1 + 0,24)\n   \n   M = 10.000 × 1,24\n   \n   M = R$ 12.400,00\n   \n   Juros = M - C = 12.400 - 10.000 = R$ 2.400,00\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ MONTANTE SIMPLES = R$ 12.400,00                      │\n│    Juros ganhos: R$ 2.400,00                            │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM B: JUROS COMPOSTOS                                 │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Fórmula: M = C × (1 + i)^t                             │\n─────────────────────────────────────────────────────────\n   \n   M = 10.000 × (1 + 0,02)^12\n   \n   M = 10.000 × (1,02)^12\n   \n   Calculando (1,02)^12:\n   (1,02)^12 ≈ 1,2682\n   \n   M = 10.000 × 1,2682\n   \n   M = R$ 12.682,42\n   \n   Juros = 12.682,42 - 10.000 = R$ 2.682,42\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ MONTANTE COMPOSTO = R$ 12.682,42                     │\n│    Juros ganhos: R$ 2.682,42                            │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM C: COMPARAÇÃO                                      │\n═══════════════════════════════════════════════════════════\n\n   ┌──────────────┬──────────────┬──────────────┐\n   │              │ J. SIMPLES   │ J. COMPOSTOS │\n   ├──────────────┼──────────────┼──────────────┤\n   │ Montante     │ R$ 12.400,00 │ R$ 12.682,42 │\n   │ Juros        │ R$  2.400,00 │ R$  2.682,42 │\n   └──────────────┴──────────────┴──────────────┘\n   \n   DIFERENÇA = 12.682,42 - 12.400,00\n   \n   DIFERENÇA = R$ 282,42 a mais no J. Compostos\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ Juros Compostos rendem R$ 282,42 A MAIS             │\n│    (11,76% a mais de juros que o simples)               │\n└─────────────────────────────────────────────────────────┘",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Juros Simples: cresce linearmente, J = C·i·t\n• Juros Compostos: cresce exponencialmente, juros sobre juros\n• Taxa equivalente: mesma rentabilidade em períodos diferentes\n• (1,02)^12: calculadora ou tabela financeira",
        },
      ],
      keyTopics: [
        "Juros Simples: M = C(1+it)",
        "Juros Compostos: M = C(1+i)^t",
        "Taxa Equivalente",
        "Desconto Simples",
        "Desconto Composto",
        "Capitalização",
        "Montante e Capital",
      ],
    },

    "Lógica Matemática": {
      title: "Lógica Matemática",
      introduction:
        "Lógica Matemática estuda proposições (V ou F), conectivos (e, ou, se...então, se e somente se) e argumentos. Tabela-verdade determina valores lógicos. Tautologia: sempre verdadeiro. Contradição: sempre falso. Fundamental em concursos e programação.",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Considere as proposições:\np: 'Está chovendo'\nq: 'O trânsito está lento'\n\nConstrua a tabela-verdade para: (p → q) ↔ (¬q → ¬p)",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  LEGENDA DOS CONECTIVOS:                                 │\n│  → : condicional (se...então)                           │\n│  ↔ : bicondicional (se e somente se)                    │\n│  ¬ : negação (não)                                       │\n└─────────────────────────────────────────────────────────┘\n\n✏️ REGRAS DOS CONECTIVOS:\n\n   p → q (CONDICIONAL):       p ↔ q (BICONDICIONAL):\n   ┌───┬───┬───────┐          ┌───┬───┬───────┐\n   │ p │ q │ p → q │          │ p │ q │ p ↔ q │\n   ├───┼───┼───────┤          ├───┼───┼───────┤\n   │ V │ V │   V   │          │ V │ V │   V   │\n   │ V │ F │   F   │ ← única  │ V │ F │   F   │\n   │ F │ V │   V   │  falsa   │ F │ V │   F   │\n   │ F │ F │   V   │          │ F │ F │   V   │\n   └───┴───┴───────┘          └───┴───┴───────┘\n\n═══════════════════════════════════════════════════════════\n│ CONSTRUÇÃO DA TABELA-VERDADE                            │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Passo 1: Colunas base (p, q, ¬p, ¬q)                   │\n─────────────────────────────────────────────────────────\n\n   ┌───┬───┬────┬────┐\n   │ p │ q │ ¬p │ ¬q │\n   ├───┼───┼────┼────┤\n   │ V │ V │ F  │ F  │\n   │ V │ F │ F  │ V  │\n   │ F │ V │ V  │ F  │\n   │ F │ F │ V  │ V  │\n   └───┴───┴────┴────┘\n\n─────────────────────────────────────────────────────────\n│ Passo 2: Calcular p → q                                │\n─────────────────────────────────────────────────────────\n\n   Linha 1: V → V = V\n   Linha 2: V → F = F\n   Linha 3: F → V = V\n   Linha 4: F → F = V\n\n─────────────────────────────────────────────────────────\n│ Passo 3: Calcular ¬q → ¬p (CONTRAPOSITIVA)            │\n─────────────────────────────────────────────────────────\n\n   Linha 1: F → F = V\n   Linha 2: V → F = F\n   Linha 3: F → V = V\n   Linha 4: V → V = V\n\n─────────────────────────────────────────────────────────\n│ Passo 4: Calcular (p→q) ↔ (¬q→¬p)                     │\n─────────────────────────────────────────────────────────\n\n   ┌───┬───┬───────┬───────────┬─────────────────────┐\n   │ p │ q │ p → q │ ¬q → ¬p   │ (p→q) ↔ (¬q→¬p)    │\n   ├───┼───┼───────┼───────────┼─────────────────────┤\n   │ V │ V │   V   │     V     │         V          │\n   │ V │ F │   F   │     F     │         V          │\n   │ F │ V │   V   │     V     │         V          │\n   │ F │ F │   V   │     V     │         V          │\n   └───┴───┴───────┴───────────┴─────────────────────┘\n\n═══════════════════════════════════════════════════════════\n║  RESULTADO: Coluna final tem TODOS os valores V         ║\n║  Portanto, é uma TAUTOLOGIA!                             ║\n║                                                          ║\n║  CONCLUSÃO: (p → q) ↔ (¬q → ¬p) é sempre verdadeira     ║\n║  Isso prova que A CONTRAPOSITIVA é equivalente          ║\n║  à proposição original!                                  ║\n═══════════════════════════════════════════════════════════",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Contrapositiva de (p → q) é (¬q → ¬p) - são equivalentes\n• Bicondicional é V quando ambos lados têm mesmo valor\n• Tautologia: proposição sempre verdadeira\n• Condicional: só F quando antecedente V e consequente F",
        },
      ],
      keyTopics: [
        "Proposições e Conectivos",
        "Tabela-Verdade",
        "Condicional (→)",
        "Bicondicional (↔)",
        "Negação de Proposições",
        "Tautologia e Contradição",
        "Equivalências Lógicas",
        "Argumentação",
      ],
    },

    "Matrizes e Determinantes": {
      title: "Matrizes e Determinantes",
      introduction:
        "Matrizes são tabelas de números com m linhas e n colunas. Operações: soma, multiplicação por escalar, multiplicação de matrizes. Determinante é um número associado a matrizes quadradas. Usado para resolver sistemas (Cramer) e verificar inversibilidade.",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Dada a matriz A = |2  1  3|\n                  |4  -1 2|\n                  |1  0  1|\n\nCalcule o determinante de A usando a Regra de Sarrus.",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  MATRIZ A (3×3):                                         │\n│                                                          │\n│       │ 2   1   3 │                                      │\n│   A = │ 4  -1   2 │                                      │\n│       │ 1   0   1 │                                      │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ REGRA DE SARRUS - Preparação                            │\n═══════════════════════════════════════════════════════════\n\n✏️ Repetir as duas primeiras colunas à direita:\n\n     │ 2   1   3 │ 2   1\n     │ 4  -1   2 │ 4  -1\n     │ 1   0   1 │ 1   0\n\n─────────────────────────────────────────────────────────\n│ DIAGONAIS PRINCIPAIS (↘) → SOMAR                       │\n─────────────────────────────────────────────────────────\n\n     │ 2   1   3 │ 2   1\n       ↘\n     │ 4  -1   2 │ 4  -1\n           ↘\n     │ 1   0   1 │ 1   0\n\n   D1: 2 × (-1) × 1 = -2\n\n     │ 2   1   3 │ 2   1\n           ↘\n     │ 4  -1   2 │ 4  -1\n               ↘\n     │ 1   0   1 │ 1   0\n\n   D2: 1 × 2 × 1 = 2\n\n     │ 2   1   3 │ 2   1\n               ↘\n     │ 4  -1   2 │ 4  -1\n                   ↘\n     │ 1   0   1 │ 1   0\n\n   D3: 3 × 4 × 0 = 0\n\n   SOMA PRINCIPAIS = -2 + 2 + 0 = 0\n\n─────────────────────────────────────────────────────────\n│ DIAGONAIS SECUNDÁRIAS (↙) → SUBTRAIR                   │\n─────────────────────────────────────────────────────────\n\n     │ 2   1   3 │ 2   1\n                   ↙\n     │ 4  -1   2 │ 4  -1\n               ↙\n     │ 1   0   1 │ 1   0\n\n   D4: 1 × 2 × 1 = 2\n\n     │ 2   1   3 │ 2   1\n               ↙\n     │ 4  -1   2 │ 4  -1\n           ↙\n     │ 1   0   1 │ 1   0\n\n   D5: 2 × 4 × 1 = 8\n\n     │ 2   1   3 │ 2   1\n           ↙\n     │ 4  -1   2 │ 4  -1\n       ↙\n     │ 1   0   1 │ 1   0\n\n   D6: 3 × (-1) × 0 = 0\n\n   SOMA SECUNDÁRIAS = 2 + 8 + 0 = 10\n\n═══════════════════════════════════════════════════════════\n│ CÁLCULO FINAL                                           │\n═══════════════════════════════════════════════════════════\n\n   det(A) = (Diag. Principais) - (Diag. Secundárias)\n   \n   det(A) = 0 - 10\n   \n   det(A) = -10\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ DETERMINANTE de A = -10                               │\n│                                                          │\n│  Como det(A) ≠ 0, a matriz A é INVERSÍVEL               │\n└─────────────────────────────────────────────────────────┘",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Regra de Sarrus: só para matrizes 3×3\n• Diagonais principais: soma\n• Diagonais secundárias: subtrai\n• det ≠ 0 → matriz inversível, sistema possível e determinado\n• det = 0 → matriz singular, não inversível",
        },
      ],
      keyTopics: [
        "Tipos de Matrizes",
        "Operações com Matrizes",
        "Multiplicação de Matrizes",
        "Determinante 2×2 e 3×3",
        "Regra de Sarrus",
        "Cofator e Laplace",
        "Matriz Inversa",
        "Regra de Cramer",
      ],
    },

    "Porcentagem e Regra de Três": {
      title: "Porcentagem e Regra de Três",
      introduction:
        "Porcentagem é uma razão de denominador 100. 25% = 25/100 = 0,25. Aumento de p%: multiplica por (1 + p/100). Desconto de p%: multiplica por (1 - p/100). Regra de três relaciona grandezas proporcionais (direta ou inversamente).",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Um produto custava R$ 80,00 e sofreu um aumento de 25%. Depois, entrou em promoção com desconto de 20% sobre o novo preço. Qual o preço final? Houve aumento ou desconto em relação ao preço original?",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  DADOS:                                                  │\n│  • Preço inicial: R$ 80,00                               │\n│  • 1º movimento: aumento de 25%                          │\n│  • 2º movimento: desconto de 20%                         │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ETAPA 1: AUMENTO DE 25%                                 │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Fator de aumento = 1 + 25/100 = 1,25                   │\n─────────────────────────────────────────────────────────\n   \n   Preço inicial ────────▶ Preço após aumento\n       R$ 80,00      ×1,25      R$ ???\n   \n   Preço₁ = 80 × 1,25\n   \n   Preço₁ = R$ 100,00\n\n   ┌─────────────────────────────────────────────────────┐\n   │  80,00 ──(+25%)──▶ 100,00                           │\n   │                                                     │\n   │  O aumento foi de R$ 20,00                          │\n   └─────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ETAPA 2: DESCONTO DE 20%                                │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Fator de desconto = 1 - 20/100 = 0,80                  │\n─────────────────────────────────────────────────────────\n   \n   Preço após aumento ────────▶ Preço final\n       R$ 100,00        ×0,80     R$ ???\n   \n   Preço_final = 100 × 0,80\n   \n   Preço_final = R$ 80,00\n\n   ┌─────────────────────────────────────────────────────┐\n   │  100,00 ──(-20%)──▶ 80,00                           │\n   │                                                     │\n   │  O desconto foi de R$ 20,00                         │\n   └─────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ CÁLCULO ALTERNATIVO (Fator Acumulado)                   │\n═══════════════════════════════════════════════════════════\n\n   Fator total = 1,25 × 0,80 = 1,00\n   \n   Preço final = 80 × 1,00 = R$ 80,00\n\n═══════════════════════════════════════════════════════════\n║  ✓ PREÇO FINAL = R$ 80,00                               ║\n║                                                          ║\n║  ✓ NÃO HOUVE ALTERAÇÃO em relação ao preço original!    ║\n║    (O preço voltou exatamente ao valor inicial)         ║\n║                                                          ║\n║  ⚠️ ATENÇÃO: Aumento de 25% seguido de desconto de 20%  ║\n║    NÃO resulta em aumento de 5%!                         ║\n║    1,25 × 0,80 = 1,00 (volta ao original)               ║\n═══════════════════════════════════════════════════════════",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Fator de aumento: (1 + p/100)\n• Fator de desconto: (1 - p/100)\n• Variações sucessivas: multiplicar os fatores\n• Armadilha: +25% e -20% não é +5% porque a base muda\n• 1,25 × 0,80 = 1,00 → fatores se anulam",
        },
      ],
      keyTopics: [
        "Porcentagem de um valor",
        "Aumento Percentual",
        "Desconto Percentual",
        "Variações Sucessivas",
        "Regra de Três Simples",
        "Regra de Três Composta",
        "Grandezas Proporcionais",
      ],
    },

    "Progressões (PA e PG)": {
      title: "Progressões Aritméticas e Geométricas",
      introduction:
        "PA (Progressão Aritmética): sequência com razão constante somada. Fórmula do termo geral: aₙ = a₁ + (n-1)r. Soma: Sₙ = n(a₁+aₙ)/2. PG (Progressão Geométrica): razão constante multiplicada. Termo geral: aₙ = a₁·q^(n-1). Soma finita: Sₙ = a₁(qⁿ-1)/(q-1).",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Uma bola é largada de uma altura de 16 metros. A cada rebatida, ela sobe a 3/4 da altura anterior. Calcule: a) A altura da bola após o 4º rebote. b) A distância total percorrida até parar completamente (soma infinita).",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  DADOS:                                                  │\n│  • Altura inicial: 16 metros                             │\n│  • Razão: q = 3/4 = 0,75 (cada rebote é 75% do anterior)│\n│  • Tipo: PG decrescente (0 < q < 1)                     │\n└─────────────────────────────────────────────────────────┘\n\n✏️ VISUALIZAÇÃO:\n\n   16m │████\n       │████    ↓\n       │████────┘\n       │████  12m │███\n       │████      │███    ↓\n       │████      │███────┘\n       │████      │███  9m │██\n       │████      │███     │██\n       └──────────┴────────┴──────▶ rebotes\n          1º        2º       3º\n\n═══════════════════════════════════════════════════════════\n│ SEQUÊNCIA DAS ALTURAS (PG):                             │\n═══════════════════════════════════════════════════════════\n\n   a₁ = 16        (1º rebote)\n   a₂ = 16 × 3/4 = 12     (2º rebote)\n   a₃ = 12 × 3/4 = 9      (3º rebote)\n   a₄ = 9 × 3/4 = 6,75    (4º rebote)\n\n═══════════════════════════════════════════════════════════\n│ ITEM A: ALTURA APÓS O 4º REBOTE                         │\n═══════════════════════════════════════════════════════════\n\n─────────────────────────────────────────────────────────\n│ Fórmula do termo geral da PG: aₙ = a₁ × q^(n-1)        │\n─────────────────────────────────────────────────────────\n   \n   a₄ = 16 × (3/4)^(4-1)\n   \n   a₄ = 16 × (3/4)³\n   \n   a₄ = 16 × 27/64\n   \n   a₄ = 432/64\n   \n   a₄ = 6,75 metros\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ ALTURA no 4º rebote = 6,75 metros                    │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ ITEM B: DISTÂNCIA TOTAL (até parar)                     │\n═══════════════════════════════════════════════════════════\n\n   A bola percorre:\n   • 16m descendo (queda inicial)\n   • 12m subindo + 12m descendo (1º rebote)\n   • 9m subindo + 9m descendo (2º rebote)\n   • ... e assim por diante\n\n─────────────────────────────────────────────────────────\n│ Distância = 16 + 2×(12 + 9 + 6,75 + ...)               │\n─────────────────────────────────────────────────────────\n   \n   A parte (12 + 9 + 6,75 + ...) é uma PG infinita:\n   • Primeiro termo: a₁ = 12\n   • Razão: q = 3/4 = 0,75\n   • Como |q| < 1, a soma converge!\n\n─────────────────────────────────────────────────────────\n│ Fórmula da soma infinita: S = a₁/(1 - q)               │\n─────────────────────────────────────────────────────────\n   \n   S_rebotes = 12/(1 - 3/4)\n   \n   S_rebotes = 12/(1/4)\n   \n   S_rebotes = 12 × 4 = 48 metros\n\n─────────────────────────────────────────────────────────\n│ Distância total:                                       │\n─────────────────────────────────────────────────────────\n   \n   D = 16 + 2 × 48\n   \n   D = 16 + 96\n   \n   D = 112 metros\n\n┌─────────────────────────────────────────────────────────┐\n│  ✓ DISTÂNCIA TOTAL = 112 metros                         │\n└─────────────────────────────────────────────────────────┘",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• PG: cada termo é o anterior multiplicado por q\n• Termo geral: aₙ = a₁·q^(n-1)\n• Soma infinita de PG (|q|<1): S = a₁/(1-q)\n• A bola sobe e desce: cada altura conta 2× (exceto queda inicial)",
        },
      ],
      keyTopics: [
        "PA: Termo Geral aₙ = a₁+(n-1)r",
        "PA: Soma Sₙ = n(a₁+aₙ)/2",
        "PG: Termo Geral aₙ = a₁·q^(n-1)",
        "PG: Soma Finita",
        "PG: Soma Infinita (|q|<1)",
        "Razão da PA e PG",
        "Interpolação",
      ],
    },

    "Razão e Proporção": {
      title: "Razão e Proporção",
      introduction:
        "Razão é a divisão entre duas grandezas de mesma natureza. Proporção é a igualdade entre duas razões: a/b = c/d. Propriedade fundamental: a·d = b·c. Divisão proporcional distribui valores mantendo razões fixas. Base para regra de três e escala.",
      sections: [
        {
          heading: "📋 PROBLEMA",
          content:
            "Uma herança de R$ 180.000,00 deve ser dividida entre três irmãos: Ana, Bruno e Carlos, em partes diretamente proporcionais a 2, 3 e 5, respectivamente. Quanto cada um receberá?",
        },
        {
          heading: "📝 RESOLUÇÃO PASSO A PASSO",
          content:
            "┌─────────────────────────────────────────────────────────┐\n│  DADOS:                                                  │\n│  • Total da herança: R$ 180.000,00                       │\n│  • Proporção: Ana(2) : Bruno(3) : Carlos(5)             │\n│  • Tipo: Divisão DIRETAMENTE proporcional               │\n└─────────────────────────────────────────────────────────┘\n\n═══════════════════════════════════════════════════════════\n│ MÉTODO 1: Constante de Proporcionalidade (k)            │\n═══════════════════════════════════════════════════════════\n\n✏️ Seja k a constante de proporcionalidade:\n\n   Ana recebe:    2k\n   Bruno recebe:  3k\n   Carlos recebe: 5k\n   ─────────────────\n   Total:         10k\n\n─────────────────────────────────────────────────────────\n│ Passo 1: Encontrar k                                   │\n─────────────────────────────────────────────────────────\n\n   2k + 3k + 5k = 180.000\n   \n   10k = 180.000\n   \n   k = 180.000/10\n   \n   k = 18.000\n\n─────────────────────────────────────────────────────────\n│ Passo 2: Calcular a parte de cada um                   │\n─────────────────────────────────────────────────────────\n\n   Ana:    2k = 2 × 18.000 = R$ 36.000,00\n   \n   Bruno:  3k = 3 × 18.000 = R$ 54.000,00\n   \n   Carlos: 5k = 5 × 18.000 = R$ 90.000,00\n\n─────────────────────────────────────────────────────────\n│ Verificação                                            │\n─────────────────────────────────────────────────────────\n\n   36.000 + 54.000 + 90.000 = 180.000 ✓\n\n═══════════════════════════════════════════════════════════\n│ MÉTODO 2: Por Frações                                   │\n═══════════════════════════════════════════════════════════\n\n   Total de partes = 2 + 3 + 5 = 10 partes\n   \n   ┌─────────────────────────────────────────────────────┐\n   │      Ana       │     Bruno      │     Carlos       │\n   │    2 partes    │    3 partes    │    5 partes      │\n   │   ███ ███      │  ███ ███ ███   │ ████ ████ ████   │\n   │                │                │ ██               │\n   └─────────────────────────────────────────────────────┘\n   \n   Ana:    (2/10) × 180.000 = 36.000\n   Bruno:  (3/10) × 180.000 = 54.000\n   Carlos: (5/10) × 180.000 = 90.000\n\n═══════════════════════════════════════════════════════════\n║  RESPOSTAS:                                              ║\n║  • Ana recebe:    R$ 36.000,00  (20%)                   ║\n║  • Bruno recebe:  R$ 54.000,00  (30%)                   ║\n║  • Carlos recebe: R$ 90.000,00  (50%)                   ║\n═══════════════════════════════════════════════════════════",
        },
        {
          heading: "💡 CONCEITOS APLICADOS",
          content:
            "• Proporção direta: maior coeficiente → maior parte\n• Constante k: cada parte é multiplicada por k\n• Soma das partes: 2 + 3 + 5 = 10 partes\n• Fração de cada um: coeficiente / soma total\n• Verificar: soma das partes = total",
        },
      ],
      keyTopics: [
        "Razão a/b",
        "Proporção a/b = c/d",
        "Propriedade Fundamental",
        "Divisão Proporcional Direta",
        "Divisão Proporcional Inversa",
        "Escala",
        "Grandezas Proporcionais",
      ],
    },
  },

  // ===========================================
  // PORTUGUÊS - Regras com Exemplos Contextualizados
  // ===========================================
  portugues: {
    "Acentuação Gráfica": {
      title: "Acentuação Gráfica",
      introduction:
        "A acentuação gráfica em português segue regras baseadas na posição da sílaba tônica (mais forte) e na terminação da palavra. Dominar essas regras elimina dúvidas na escrita e evita erros em provas e documentos oficiais.",
      sections: [
        {
          heading: "📌 REGRA 1: Proparoxítonas (antepenúltima sílaba tônica)",
          content:
            "TODAS as proparoxítonas são acentuadas, sem exceção.\n\n✅ EXEMPLOS:\n• LÂM-pa-da → sílaba tônica: LÂM (antepenúltima)\n• mé-di-co → sílaba tônica: MÉ\n• ma-te-MÁ-ti-ca → sílaba tônica: MÁ\n• pú-bli-co, trân-si-to, úl-ti-mo, árvore, paralelepípedo\n\n💡 DICA: Se a sílaba mais forte é a antepenúltima, acentue sempre!",
        },
        {
          heading: "📌 REGRA 2: Oxítonas (última sílaba tônica)",
          content:
            "Acentuam-se as oxítonas terminadas em: A(s), E(s), O(s), EM, ENS.\n\n✅ ACENTUADAS:\n• ca-FÉ, ja-ca-RÉ, do-mi-NÓ, a-vô, a-vós\n• so-FÁ, ma-ra-cu-JÁ, pa-ra-béNS\n• tam-BÉM, nin-guÉM, ar-ma-zÉM, re-féNS\n\n❌ NÃO ACENTUADAS (outras terminações):\n• amor (termina em R)\n• feliz (termina em Z)\n• bambu (termina em U)\n• girassol (termina em L)",
        },
        {
          heading: "📌 REGRA 3: Paroxítonas (penúltima sílaba tônica)",
          content:
            "Acentuam-se as paroxítonas que NÃO terminam em A(s), E(s), O(s), EM, ENS.\n\n✅ ACENTUADAS (terminações menos comuns):\n• FÁ-cil (L), a-MÁ-vel (L), hí-fen (EN)\n• ór-fã (Ã), ór-gão (ÃO), bí-ceps (PS)\n• tó-rax (X), lá-pis (I/IS), jú-ri (I)\n• ál-bum (UM), fó-rum (UM), ví-rus (US)\n• ca-RÁ-ter (R), re-VÓL-ver (R)\n\n❌ NÃO ACENTUADAS (terminações comuns):\n• casa, escola, livro, homem, jovens\n(terminam em A, E, O, EM, ENS → maioria das palavras)",
        },
        {
          heading: "📌 REGRA 4: Hiatos I e U tônicos",
          content:
            "Acentuam-se I e U tônicos quando formam hiato com a vogal anterior.\n\n✅ ACENTUADAS:\n• sa-Í-da (i sozinho, tônico, hiato com A)\n• ba-Ú (u sozinho, tônico, hiato com A)\n• pa-ÍS, sa-Ú-de, ca-Í, fa-ÍS-ca\n• re-Ú-ne, con-te-Ú-do, ju-Í-zo\n\n❌ NÃO ACENTUADAS (exceções):\n• ra-i-nha, mo-i-nho (I seguido de NH)\n• Cam-pi-nas, ju-iz (I não é tônico)\n• ru-im (I não é tônico)",
        },
        {
          heading: "📌 REGRA 5: Acentos Diferenciais",
          content:
            "Usados para diferenciar palavras com grafia igual mas significados diferentes.\n\n✅ OBRIGATÓRIOS:\n• pôr (verbo) × por (preposição)\n  'Vou PÔR o livro na mesa.' / 'Passei POR você.'\n\n• pôde (passado) × pode (presente)\n  'Ele não PÔDE ir ontem.' / 'Ele PODE ir hoje.'\n\n• têm/vêm (plural) × tem/vem (singular)\n  'Eles TÊM razão.' / 'Ele TEM razão.'\n  'Eles VÊM amanhã.' / 'Ela VEM amanhã.'\n\n❌ NÃO EXISTEM MAIS (Acordo Ortográfico 2009):\n• para (verbo) = para (preposição)\n• pela (verbo) = pela (contração)\n• polo = polo (ambos sem acento)",
        },
        {
          heading: "🎯 RESUMO PRÁTICO",
          content:
            "┌─────────────────────────────────────────────────────┐\n│  TIPO          │ REGRA                             │\n├─────────────────────────────────────────────────────┤\n│  Proparoxítona │ SEMPRE acentuada                  │\n│  Oxítona       │ A(s), E(s), O(s), EM, ENS        │\n│  Paroxítona    │ Terminações DIFERENTES das acima │\n│  Hiato I/U     │ I ou U tônico sozinho na sílaba   │\n│  Diferencial   │ pôr/por, pôde/pode, têm/tem      │\n└─────────────────────────────────────────────────────┘",
        },
      ],
      keyTopics: [
        "Proparoxítonas",
        "Oxítonas",
        "Paroxítonas",
        "Hiatos I e U",
        "Acentos Diferenciais",
        "Acordo Ortográfico",
        "Sílaba Tônica",
      ],
    },

    "Classes de Palavras": {
      title: "Classes de Palavras",
      introduction:
        "As classes de palavras (ou classes gramaticais) são 10 categorias que classificam todas as palavras da língua portuguesa conforme sua função e características. Dominar essa classificação é essencial para análise sintática e concordância.",
      sections: [
        {
          heading: "📌 SUBSTANTIVO - Nomeia seres, coisas, sentimentos",
          content:
            "Dá nome a tudo que existe, concreto ou abstrato.\n\n✅ EXEMPLOS:\n• Concretos: mesa, cachorro, Maria, Brasil, água\n• Abstratos: amor, saudade, coragem, beleza, medo\n• Coletivos: cardume (peixes), alcateia (lobos), rebanho (ovelhas)\n\n💡 DICA: Substantivo aceita artigo na frente.\n'O amor', 'A mesa', 'Um cachorro' → substantivos",
        },
        {
          heading: "📌 ARTIGO - Determina ou generaliza o substantivo",
          content:
            "Sempre acompanha substantivo, definindo-o ou não.\n\n✅ DEFINIDOS (especificam):\n• o, a, os, as\n• 'Comprei O livro que você indicou.' (livro específico)\n\n✅ INDEFINIDOS (generalizam):\n• um, uma, uns, umas\n• 'Comprei UM livro ontem.' (qualquer livro)\n\n💡 DICA: Artigo transforma qualquer palavra em substantivo:\n'O belo agrada.' (belo = substantivo)",
        },
        {
          heading: "📌 ADJETIVO - Qualifica o substantivo",
          content:
            "Atribui qualidade, característica ou estado ao substantivo.\n\n✅ EXEMPLOS:\n• casa GRANDE, menino INTELIGENTE\n• dia ENSOLARADO, água GELADA\n• pessoa HONESTA, filme INTERESSANTE\n\n✅ LOCUÇÕES ADJETIVAS (expressões que funcionam como adjetivo):\n• amor de mãe = amor MATERNO\n• luz do sol = luz SOLAR\n• dor de cabeça = dor CEFÁLICA\n\n💡 DICA: Adjetivo responde à pergunta 'Como é?'\nCasa grande → Como é a casa? Grande.",
        },
        {
          heading: "📌 PRONOME - Substitui ou acompanha o substantivo",
          content:
            "Evita repetição ou indica pessoa/posse/demonstração.\n\n✅ PESSOAIS:\n• Retos: eu, tu, ele, nós, vós, eles\n• Oblíquos: me, te, se, nos, lhe, o, a\n\n✅ POSSESSIVOS: meu, teu, seu, nosso, vosso\n✅ DEMONSTRATIVOS: este, esse, aquele, isto, isso\n✅ INDEFINIDOS: alguém, ninguém, tudo, nada, algum\n✅ INTERROGATIVOS: quem?, qual?, quanto?\n✅ RELATIVOS: que, o qual, cujo, onde\n\n💡 TESTE: 'João comprou um carro. ELE é azul.'\nELE substitui 'o carro' → pronome",
        },
        {
          heading: "📌 VERBO - Expressa ação, estado ou fenômeno",
          content:
            "Indica o que o sujeito faz, é ou acontece. Flexiona em tempo, modo, pessoa.\n\n✅ AÇÃO: correr, estudar, comprar, escrever\n• 'Maria ESTUDA todos os dias.'\n\n✅ ESTADO: ser, estar, ficar, parecer, permanecer\n• 'João ESTÁ feliz.' / 'Ela PARECE cansada.'\n\n✅ FENÔMENO DA NATUREZA: chover, nevar, ventar, trovejar\n• 'Ontem CHOVEU muito.' (sem sujeito)\n\n💡 DICA: Verbo aceita 'não' na frente.\n'Não corro', 'Não estudo' → verbos",
        },
        {
          heading: "📌 ADVÉRBIO - Modifica verbo, adjetivo ou outro advérbio",
          content:
            "Indica circunstância: modo, tempo, lugar, intensidade, negação.\n\n✅ MODO: bem, mal, assim, depressa, devagar\n• 'Ela canta BEM.'\n\n✅ TEMPO: hoje, ontem, amanhã, sempre, nunca\n• 'AMANHÃ viajaremos.'\n\n✅ LUGAR: aqui, ali, lá, perto, longe\n• 'Moro PERTO daqui.'\n\n✅ INTENSIDADE: muito, pouco, bastante, demais\n• 'Estou MUITO cansado.'\n\n✅ NEGAÇÃO: não, nunca, jamais\n• 'NÃO irei à festa.'",
        },
        {
          heading: "📌 PREPOSIÇÃO, CONJUNÇÃO, INTERJEIÇÃO, NUMERAL",
          content:
            "✅ PREPOSIÇÃO (liga palavras): a, de, em, com, por, para, sobre\n• 'Livro DE matemática', 'Fui PARA casa'\n\n✅ CONJUNÇÃO (liga orações):\n• Coordenativas: e, mas, ou, porém, pois\n• Subordinativas: que, se, porque, quando, embora\n• 'Estudei, MAS não passei.'\n\n✅ INTERJEIÇÃO (exprime emoção): Ah!, Oh!, Ufa!, Oba!, Ai!\n• 'UFA! Terminei o trabalho.'\n\n✅ NUMERAL (quantidade/ordem): um, dois, primeiro, dobro\n• 'Ele ficou em PRIMEIRO lugar.'",
        },
        {
          heading: "🎯 RESUMO DAS 10 CLASSES",
          content:
            "┌────────────────────────────────────────────────────┐\n│  CLASSE        │ FUNÇÃO                          │\n├────────────────────────────────────────────────────┤\n│  Substantivo   │ Nomeia seres/coisas             │\n│  Artigo        │ Determina substantivo           │\n│  Adjetivo      │ Qualifica substantivo           │\n│  Pronome       │ Substitui/acompanha subst.      │\n│  Verbo         │ Ação, estado, fenômeno          │\n│  Advérbio      │ Circunstância (modo, tempo...)  │\n│  Preposição    │ Liga palavras                   │\n│  Conjunção     │ Liga orações                    │\n│  Interjeição   │ Expressa emoção                 │\n│  Numeral       │ Quantidade ou ordem             │\n└────────────────────────────────────────────────────┘",
        },
      ],
      keyTopics: [
        "Substantivo",
        "Artigo",
        "Adjetivo",
        "Pronome",
        "Verbo",
        "Advérbio",
        "Preposição",
        "Conjunção",
        "Interjeição",
        "Numeral",
      ],
    },

    "Coesão e Coerência Textual": {
      title: "Coesão e Coerência Textual",
      introduction:
        "Coesão e coerência são pilares da boa escrita. Coesão refere-se às conexões gramaticais entre frases e parágrafos (uso de conectivos, pronomes, sinônimos). Coerência é a lógica do texto, a organização das ideias de forma que façam sentido.",
      sections: [
        {
          heading: "📌 COESÃO REFERENCIAL - Retomada de termos",
          content:
            "Evita repetição usando pronomes, sinônimos ou expressões equivalentes.\n\n✅ EXEMPLOS:\n\n❌ REPETITIVO:\n'O Brasil é um país grande. O Brasil tem muitos recursos. O Brasil é diverso.'\n\n✅ COM COESÃO:\n'O Brasil é um país grande. ELE tem muitos recursos. NOSSA NAÇÃO é diversa.'\n\n💡 RECURSOS DE RETOMADA:\n• Pronomes: ele, ela, isso, aquilo, que, cujo\n• Sinônimos: país → nação, território, pátria\n• Expressões: 'o referido', 'tal', 'esse último'",
        },
        {
          heading: "📌 COESÃO SEQUENCIAL - Conectivos",
          content:
            "Liga ideias estabelecendo relações lógicas entre elas.\n\n✅ ADIÇÃO: e, além disso, também, ademais, outrossim\n'Estudou muito. ALÉM DISSO, fez exercícios.'\n\n✅ OPOSIÇÃO: mas, porém, contudo, entretanto, todavia\n'É caro. PORÉM, vale a pena.'\n\n✅ CAUSA: porque, pois, já que, visto que, uma vez que\n'Faltou à aula PORQUE estava doente.'\n\n✅ CONSEQUÊNCIA: portanto, logo, assim, então, por isso\n'Estudou muito, PORTANTO passou.'\n\n✅ CONCLUSÃO: em suma, enfim, em síntese, concluindo\n'EM SUMA, o projeto foi um sucesso.'",
        },
        {
          heading: "📌 COERÊNCIA - Lógica das Ideias",
          content:
            "O texto faz sentido? As ideias estão organizadas logicamente?\n\n❌ INCOERENTE:\n'Acordei às 6h. Por isso, o Brasil é um país tropical.'\n(Não há relação lógica entre acordar e clima tropical)\n\n✅ COERENTE:\n'Acordei às 6h. Por isso, cheguei cedo ao trabalho.'\n(Causa e consequência lógicas)\n\n❌ CONTRADIÇÃO:\n'João é vegetariano. Ele adora um churrasco de carne.'\n\n✅ CONSISTENTE:\n'João é vegetariano. Ele prepara deliciosos pratos sem carne.'",
        },
        {
          heading: "📌 PROGRESSÃO TEXTUAL",
          content:
            "O texto deve progredir, trazendo informações novas.\n\n❌ SEM PROGRESSÃO:\n'A educação é importante. A educação é fundamental. A educação é essencial.'\n(Repete a mesma ideia com palavras diferentes)\n\n✅ COM PROGRESSÃO:\n'A educação é importante para o desenvolvimento individual. Além disso, impacta a economia do país. Por fim, fortalece a democracia.'\n(Cada frase acrescenta informação nova)\n\n💡 ESTRUTURA IDEAL:\n1. Introdução: apresenta o tema\n2. Desenvolvimento: aprofunda com argumentos\n3. Conclusão: fecha com síntese ou proposta",
        },
        {
          heading: "📌 ERROS COMUNS DE COESÃO",
          content:
            "✅ AMBIGUIDADE:\n❌ 'O professor disse ao aluno que ele estava errado.'\n(Quem estava errado? Professor ou aluno?)\n✅ 'O professor disse ao aluno: — Você está errado.'\n\n✅ USO INCORRETO DE CONECTIVOS:\n❌ 'Estudou muito, E não passou.'\n(E indica adição, não oposição)\n✅ 'Estudou muito, MAS não passou.'\n\n✅ FALTA DE REFERENTE:\n❌ 'A empresa cresceu muito. Isso foi bom para eles.'\n(Quem são 'eles'?)\n✅ 'A empresa cresceu muito. Isso foi bom para OS FUNCIONÁRIOS.'",
        },
        {
          heading: "🎯 RESUMO: COESÃO vs COERÊNCIA",
          content:
            "┌───────────────────────────────────────────────────────┐\n│  COESÃO (forma)      │  COERÊNCIA (conteúdo)        │\n├───────────────────────────────────────────────────────┤\n│  Conexão gramatical  │  Conexão lógica              │\n│  Conectivos, pronomes│  Ideias fazem sentido        │\n│  Evita repetição     │  Sem contradições            │\n│  Liga frases         │  Progressão de ideias        │\n│  Superfície do texto │  Significado do texto        │\n└───────────────────────────────────────────────────────┘\n\n💡 Um texto pode ter coesão sem coerência:\n'Comprei um carro. Portanto, as estrelas brilham.'\n(Tem conectivo, mas não faz sentido)",
        },
      ],
      keyTopics: [
        "Coesão Referencial",
        "Coesão Sequencial",
        "Conectivos",
        "Coerência Textual",
        "Progressão Textual",
        "Ambiguidade",
        "Retomada de Termos",
      ],
    },

    "Compreensão e Interpretação de Texto": {
      title: "Compreensão e Interpretação de Texto",
      introduction:
        "Compreensão é entender o que está EXPLÍCITO no texto (na superfície). Interpretação é ir ALÉM, inferindo significados implícitos, intenções do autor e relações com contextos externos. Habilidades essenciais em provas de concursos e vestibulares.",
      sections: [
        {
          heading: "📌 COMPREENSÃO vs INTERPRETAÇÃO",
          content:
            "✅ COMPREENSÃO (explícito - está no texto):\n• O que o texto DIZ literalmente\n• Informações escritas diretamente\n• 'Segundo o texto...', 'O autor afirma que...'\n\n✅ INTERPRETAÇÃO (implícito - você deduz):\n• O que o texto QUER DIZER nas entrelinhas\n• Inferências, conclusões, críticas\n• 'Depreende-se...', 'Infere-se...', 'O autor sugere...'\n\n💡 EXEMPLO:\nTexto: 'João chegou ensopado ao trabalho.'\n• Compreensão: João chegou molhado.\n• Interpretação: Provavelmente estava chovendo.",
        },
        {
          heading: "📌 IDENTIFICANDO A IDEIA CENTRAL",
          content:
            "A ideia central (tese) é o ponto principal que o autor quer transmitir.\n\n✅ COMO ENCONTRAR:\n1. Leia o texto inteiro primeiro\n2. Identifique o TEMA (assunto geral)\n3. Encontre a TESE (posição do autor sobre o tema)\n4. Geralmente está na introdução ou conclusão\n\n💡 EXEMPLO:\nTema: Redes sociais\nTese: 'As redes sociais prejudicam relações interpessoais presenciais.'\n\n⚠️ CUIDADO: Não confunda com ideias secundárias (exemplos, argumentos de apoio).",
        },
        {
          heading: "📌 TIPOS DE INFERÊNCIA",
          content:
            "✅ INFERÊNCIA LÓGICA:\nBaseada em raciocínio dedutivo.\n'Todo mamífero é vertebrado. O gato é mamífero.'\n→ Inferência: O gato é vertebrado.\n\n✅ INFERÊNCIA CONTEXTUAL:\nBaseada em pistas do texto.\n'Maria guardou o guarda-chuva e tirou os óculos de sol.'\n→ Inferência: O tempo mudou (parou de chover, fez sol).\n\n✅ INFERÊNCIA CULTURAL:\nDepende de conhecimento prévio.\n'Ele é um verdadeiro Dom Quixote.'\n→ Inferência: É um idealista que luta por causas impossíveis.",
        },
        {
          heading: "📌 ARMADILHAS COMUNS EM QUESTÕES",
          content:
            "❌ EXTRAPOLAÇÃO:\nAfirmar algo que vai ALÉM do texto.\nTexto: 'A poluição afeta a saúde.'\nErro: 'A poluição é a principal causa de mortes no Brasil.'\n(O texto não disse isso)\n\n❌ REDUÇÃO:\nLimitar demais o sentido.\nTexto fala de 'problemas urbanos' em geral.\nErro: Alternativa diz que fala APENAS de trânsito.\n\n❌ CONTRADIÇÃO:\nAfirmar o oposto do texto.\nTexto: 'A tecnologia facilitou a comunicação.'\nErro: 'A tecnologia dificulta a comunicação.'\n\n❌ DADOS EXTERNOS:\nUsar informação de fora do texto.\nNa prova, responda COM BASE NO TEXTO.",
        },
        {
          heading: "📌 ESTRATÉGIAS DE LEITURA",
          content:
            "✅ ANTES DE LER AS QUESTÕES:\n1. Leia o texto com atenção\n2. Identifique tema, tese e estrutura\n3. Sublinhe palavras-chave\n\n✅ AO RESPONDER:\n1. Leia a pergunta com cuidado\n2. Volte ao texto para confirmar\n3. Elimine alternativas absurdas\n4. Cuidado com 'sempre', 'nunca', 'todos' (radicais)\n\n✅ PALAVRAS-CHAVE NAS QUESTÕES:\n• 'De acordo com o texto' → Compreensão (explícito)\n• 'Infere-se' / 'Depreende-se' → Interpretação (implícito)\n• 'O autor defende' → Identificar a tese\n• 'A finalidade do texto' → Objetivo comunicativo",
        },
        {
          heading: "🎯 RESUMO PRÁTICO",
          content:
            "┌─────────────────────────────────────────────────────┐\n│  COMPREENSÃO         │  INTERPRETAÇÃO             │\n├─────────────────────────────────────────────────────┤\n│  Explícito           │  Implícito                 │\n│  Está no texto       │  Nas entrelinhas          │\n│  O que DIZ           │  O que QUER DIZER         │\n│  Literal             │  Inferido                 │\n└─────────────────────────────────────────────────────┘\n\n⚠️ EVITE:\n• Extrapolar (ir além do texto)\n• Reduzir (limitar demais)\n• Contradizer o texto\n• Usar conhecimento externo sem base textual",
        },
      ],
      keyTopics: [
        "Ideia Central e Secundária",
        "Inferência",
        "Explícito vs Implícito",
        "Tipos de Texto",
        "Intencionalidade",
        "Extrapolação",
        "Estratégias de Leitura",
      ],
    },

    "Concordância Nominal e Verbal": {
      title: "Concordância Nominal e Verbal",
      introduction:
        "Concordância é a harmonia gramatical entre palavras. Verbal: o verbo concorda com o sujeito em número e pessoa. Nominal: artigos, adjetivos e pronomes concordam com o substantivo em gênero e número.",
      sections: [
        {
          heading: "📌 CONCORDÂNCIA VERBAL - Regra Geral",
          content:
            "O verbo concorda com o sujeito em NÚMERO (singular/plural) e PESSOA (1ª, 2ª, 3ª).\n\n✅ EXEMPLOS:\n• 'O aluno ESTUDA.' (singular → verbo singular)\n• 'Os alunos ESTUDAM.' (plural → verbo plural)\n• 'EU estudo, TU estudas, ELE estuda'\n• 'NÓS estudamos, VÓS estudais, ELES estudam'\n\n💡 DICA: Identifique o sujeito primeiro!\n'Chegaram os livros.' → Sujeito: os livros (plural)\n'Chegou o livro.' → Sujeito: o livro (singular)",
        },
        {
          heading: "📌 CASOS ESPECIAIS - Sujeito Composto",
          content:
            "✅ SUJEITO COMPOSTO ANTES DO VERBO → Plural:\n'João E Maria CHEGARAM cedo.'\n'O professor E os alunos SAÍRAM.'\n\n✅ SUJEITO COMPOSTO DEPOIS DO VERBO → Plural ou concorda com o mais próximo:\n'CHEGARAM João e Maria.' (plural - mais comum)\n'CHEGOU João e Maria.' (singular - aceito)\n\n✅ NÚCLEOS SINÔNIMOS → Singular ou Plural:\n'A angústia e a ansiedade o CONSUMIA/CONSUMIAM.'\n\n✅ NÚCLEOS EM GRADAÇÃO → Singular (ênfase no último):\n'Um mês, um ano, uma década de amor SE PASSOU.'",
        },
        {
          heading: "📌 CASOS ESPECIAIS - Expressões Partitivas",
          content:
            "✅ A MAIORIA DE, GRANDE PARTE DE, METADE DE:\nConcorda com o núcleo OU com o especificador.\n\n'A maioria dos alunos PASSOU.' ✓ (concorda com 'maioria')\n'A maioria dos alunos PASSARAM.' ✓ (concorda com 'alunos')\n\n✅ MAIS DE UM → Geralmente singular:\n'Mais de um aluno FALTOU.'\n'Mais de um candidato SE INSCREVEU.'\n\nMas plural se houver reciprocidade:\n'Mais de um jogador SE AGREDIRAM.' (ação recíproca)",
        },
        {
          heading: "📌 CASOS ESPECIAIS - Pronomes e Expressões",
          content:
            "✅ QUE (pronome relativo) → Concorda com o antecedente:\n'Fui eu QUE FIZ.' / 'Fomos nós QUE FIZEMOS.'\n'Os alunos QUE CHEGARAM cedo saíram.'\n\n✅ QUEM → Geralmente 3ª pessoa singular:\n'Fui eu QUEM FEZ.' (mais formal)\n'Fui eu QUEM FIZ.' (aceito)\n\n✅ UM DOS QUE → Plural (mais comum):\n'Ele foi um dos que VOTARAM contra.'\n\n✅ HAVER (sentido de existir) → Sempre singular:\n'HAVIA muitas pessoas.' ✓\n'HAVIAM muitas pessoas.' ✗\n'FAZ dois anos que...' (tempo) → singular",
        },
        {
          heading: "📌 CONCORDÂNCIA NOMINAL - Regra Geral",
          content:
            "Artigos, adjetivos, pronomes e numerais concordam com o substantivo em GÊNERO e NÚMERO.\n\n✅ EXEMPLOS:\n• 'A menina BONITA' (fem. sing.)\n• 'Os meninos BONITOS' (masc. pl.)\n• 'DUAS casas GRANDES' (fem. pl.)\n\n✅ ADJETIVO + VÁRIOS SUBSTANTIVOS:\n• 'Comprei camisa e calça PRETA.' (concorda com o mais próximo)\n• 'Comprei camisa e calça PRETAS.' (concorda com todos)\n\n✅ SUBSTANTIVOS DE GÊNEROS DIFERENTES:\n• 'Homens e mulheres BRASILEIROS.' (masculino predomina)",
        },
        {
          heading: "📌 CASOS ESPECIAIS DE CONCORDÂNCIA NOMINAL",
          content:
            "✅ MESMO, PRÓPRIO, SÓ, ANEXO, INCLUSO → Variáveis:\n'Ela MESMA fez.' / 'Eles MESMOS fizeram.'\n'ANEXAS estão as fotos.' / 'ANEXOS seguem os documentos.'\n'Elas ficaram SÓS.' (sozinhas)\n\n✅ MEIO, BASTANTE, MUITO → Depende da função:\n• Advérbio (modificando verbo/adj.) → Invariável:\n'Ela está MEIO cansada.' (um pouco)\n'Eles correram BASTANTE.'\n\n• Adjetivo/Numeral → Variável:\n'Tomei MEIA garrafa.' (metade)\n'Havia BASTANTES pessoas.' (muitas)\n\n✅ É PROIBIDO, É NECESSÁRIO → Sem artigo = invariável:\n'É PROIBIDO entrada.' ✓\n'É PROIBIDA a entrada.' ✓ (com artigo)",
        },
        {
          heading: "🎯 RESUMO PRÁTICO",
          content:
            "┌───────────────────────────────────────────────────────┐\n│  CONCORDÂNCIA VERBAL                                   │\n├───────────────────────────────────────────────────────┤\n│  • Verbo concorda com SUJEITO (número + pessoa)       │\n│  • Sujeito composto antes → PLURAL                    │\n│  • HAVER/FAZER (impessoal) → sempre SINGULAR          │\n│  • Maioria de + pl. → singular OU plural              │\n└───────────────────────────────────────────────────────┘\n\n┌───────────────────────────────────────────────────────┐\n│  CONCORDÂNCIA NOMINAL                                  │\n├───────────────────────────────────────────────────────┤\n│  • Adjetivo concorda com SUBSTANTIVO (gên. + núm.)   │\n│  • Gêneros diferentes → MASCULINO prevalece          │\n│  • MEIO/BASTANTE: advérbio=invariável, adj=variável  │\n│  • É PROIBIDO: sem artigo=invar., com artigo=variável│\n└───────────────────────────────────────────────────────┘",
        },
      ],
      keyTopics: [
        "Sujeito Simples e Composto",
        "Verbos Impessoais",
        "Expressões Partitivas",
        "Pronome Relativo QUE/QUEM",
        "Adjetivo Posposto",
        "Meio, Bastante, Muito",
        "É Proibido, É Necessário",
      ],
    },

    Crase: {
      title: "Crase",
      introduction:
        "Crase é a fusão de duas vogais idênticas: a preposição 'a' + o artigo 'a' (ou pronomes demonstrativos 'aquele/aquela/aquilo'). Indicada pelo acento grave (à). Ocorre antes de palavras femininas quando há preposição + artigo.",
      sections: [
        {
          heading: "📌 REGRA BÁSICA - Quando usar crase",
          content:
            "CRASE = preposição A + artigo A\n\nPara haver crase, são necessárias DUAS condições:\n1. O termo anterior EXIGE a preposição 'a'\n2. O termo posterior ACEITA o artigo 'a'\n\n✅ EXEMPLOS:\n• 'Vou À escola.' (Vou A + A escola)\n  - 'Ir' exige preposição 'a' (ir a algum lugar)\n  - 'Escola' aceita artigo 'a' (a escola)\n\n• 'Assisti À peça.' (Assisti A + A peça)\n  - 'Assistir' exige 'a' (assistir a algo)\n  - 'Peça' aceita artigo 'a'",
        },
        {
          heading: "📌 TRUQUE DO MASCULINO",
          content:
            "Substitua a palavra feminina por uma MASCULINA equivalente:\n• Se aparecer 'AO' → há crase (À)\n• Se aparecer apenas 'A' ou 'O' → não há crase\n\n✅ EXEMPLOS:\n\n'Vou à praia.' → 'Vou AO clube.' ✓ (crase)\n'Vou a Salvador.' → 'Vou A São Paulo.' ✗ (sem crase)\n'Vi a menina.' → 'Vi O menino.' ✗ (sem crase)\n'Refiro-me à carta.' → 'Refiro-me AO documento.' ✓ (crase)\n\n💡 FUNCIONA SEMPRE! Esse truque resolve 90% dos casos.",
        },
        {
          heading: "📌 CASOS OBRIGATÓRIOS DE CRASE",
          content:
            "✅ LOCUÇÕES FEMININAS:\n\n• Tempo: às vezes, à noite, à tarde, à meia-noite, às 8h\n• Modo: à vontade, às pressas, às claras, à francesa\n• Lugar: à esquerda, à direita, à frente, às margens\n• Outras: à medida que, à proporção que, à custa de\n\n'Chegou À noite.' (período)\n'Chegou A noite.' (a noite chegou - sujeito)\n\n✅ INDICANDO HORAS:\n'A reunião é ÀS 14h.' (ao meio-dia → crase)\n\n✅ AQUELE/AQUELA/AQUILO:\n'Refiro-me ÀQUELE livro.' (a + aquele)\n'Fui ÀQUELA loja.' (a + aquela)",
        },
        {
          heading: "📌 CASOS PROIBIDOS - Nunca use crase",
          content:
            "❌ ANTES DE PALAVRAS MASCULINAS:\n'Andei a cavalo.' / 'Pagou a prazo.'\n\n❌ ANTES DE VERBOS:\n'Começou a chover.' / 'Voltei a estudar.'\n\n❌ ANTES DE PRONOMES (em geral):\n'Referi-me a ela.' / 'Disse a você.'\n'Fui a esta cidade.' (pron. demonstrativo)\n\n❌ ANTES DE CIDADE SEM DETERMINANTE:\n'Fui a Paris.' (sem artigo)\nMAS: 'Fui à Paris das luzes.' (com determinante)\nTeste: 'Venho DE Paris' → sem crase\n       'Venho DA Bahia' → com crase\n\n❌ PALAVRAS REPETIDAS:\n'Cara a cara', 'gota a gota', 'dia a dia'",
        },
        {
          heading: "📌 CASOS FACULTATIVOS",
          content:
            "✅ ANTES DE NOMES PRÓPRIOS FEMININOS:\n'Entreguei o livro a/à Maria.'\n(Ambos corretos - depende da intimidade)\n\n✅ ANTES DE PRONOMES POSSESSIVOS FEMININOS:\n'Refiro-me a/à sua proposta.'\n'Fui a/à minha casa.'\n(Se usar artigo antes, usa crase)\n\n✅ DEPOIS DE 'ATÉ':\n'Fui até a/à escola.'\n(Até a = sem crase / Até à = com crase - facultativo)",
        },
        {
          heading: "🎯 RESUMO PRÁTICO",
          content:
            "┌────────────────────────────────────────────────────────┐\n│  ✅ USA CRASE                │  ❌ NÃO USA CRASE         │\n├────────────────────────────────────────────────────────┤\n│  À + palavra feminina        │  A + palavra masculina  │\n│  Às + horas (às 10h)         │  A + verbo (a fazer)    │\n│  Locuções femininas          │  A + pronomes           │\n│  À + aquele/aquela/aquilo    │  A + cidade sem artigo  │\n│                              │  Palavras repetidas     │\n└────────────────────────────────────────────────────────┘\n\n💡 TRUQUE INFALÍVEL:\n'Vou à praia' → 'Vou AO clube' (AO = crase)\n'Vou a Roma' → 'Vou A Paris' (sem AO = sem crase)",
        },
      ],
      keyTopics: [
        "Preposição + Artigo",
        "Truque do Masculino",
        "Locuções Femininas",
        "Crase com Horas",
        "Casos Proibidos",
        "Casos Facultativos",
        "Aquele/Aquela/Aquilo",
      ],
    },

    "Figuras de Linguagem": {
      title: "Figuras de Linguagem",
      introduction:
        "Figuras de linguagem são recursos expressivos que dão mais força, beleza ou emoção ao texto. Dividem-se em figuras de palavras (semântica), de pensamento, de sintaxe e de som. Muito cobradas em literatura e interpretação de texto.",
      sections: [
        {
          heading: "📌 METÁFORA - Comparação implícita",
          content:
            "Comparação sem conectivo (como, tal qual). Uma coisa É outra por semelhança.\n\n✅ EXEMPLOS:\n• 'A vida É uma viagem.'\n  (vida comparada a viagem, sem 'como')\n\n• 'Seus olhos são ESTRELAS.'\n  (olhos brilhantes como estrelas)\n\n• 'Ele é uma FERA no trabalho.'\n  (trabalha intensamente)\n\n• 'Aquela mulher é uma FLOR.'\n  (delicada, bonita)\n\n💡 COMPARAÇÃO (símile) usa conectivo:\n'A vida é COMO uma viagem.' → Comparação\n'A vida É uma viagem.' → Metáfora",
        },
        {
          heading: "📌 METONÍMIA - Substituição por relação",
          content:
            "Troca de uma palavra por outra com relação de proximidade (não semelhança).\n\n✅ TIPOS E EXEMPLOS:\n\n• Autor pela obra:\n'Li MACHADO DE ASSIS.' (li a obra dele)\n\n• Parte pelo todo:\n'Não tinha TETO para morar.' (casa)\n'Completou 20 PRIMAVERAS.' (anos)\n\n• Marca pelo produto:\n'Me dá uma GILLETTE.' (lâmina de barbear)\n'Preciso de XEROX.' (fotocópia)\n\n• Continente pelo conteúdo:\n'Bebi dois COPOS.' (o líquido)\n\n• Abstrato pelo concreto:\n'A JUVENTUDE é rebelde.' (os jovens)",
        },
        {
          heading: "📌 IRONIA e ANTÍTESE",
          content:
            "✅ IRONIA - Dizer o contrário do que se pensa:\n\n• 'Que BONITO! Tirou zero na prova.'\n  (na verdade, é feio/ruim)\n\n• 'PARABÉNS por quebrar o vaso!'\n  (crítica disfarçada de elogio)\n\n• 'Você é um GÊNIO, hein?' (para quem errou)\n\n✅ ANTÍTESE - Oposição de ideias:\n\n• 'É um MORTO-VIVO.'\n• 'Fez um ESTARDALHAÇO SILENCIOSO.'\n• 'O amor é fogo que ARDE sem se ver,\n   É ferida que DÓI e não se sente.' (Camões)\n• 'Nasce o SOL, e não dura mais que um DIA,\n   Depois da LUZ se segue a NOITE escura.' (Gregório)",
        },
        {
          heading: "📌 HIPÉRBOLE e EUFEMISMO",
          content:
            "✅ HIPÉRBOLE - Exagero intencional:\n\n• 'Estou MORRENDO de fome.'\n• 'Já te disse UM MILHÃO de vezes!'\n• 'Chorou RIOS de lágrimas.'\n• 'Esperei uma ETERNIDADE por você.'\n\n✅ EUFEMISMO - Suavização de algo desagradável:\n\n• 'Ele PASSOU DESTA PARA MELHOR.' (morreu)\n• 'É uma pessoa de BAIXA RENDA.' (pobre)\n• 'Faltou com a VERDADE.' (mentiu)\n• 'Ele não é muito AGRACIADO.' (é feio)\n• 'DESCANSOU em paz.' (morreu)",
        },
        {
          heading: "📌 PERSONIFICAÇÃO e CATACRESE",
          content:
            "✅ PERSONIFICAÇÃO (Prosopopeia) - Atribui características humanas a seres inanimados:\n\n• 'O SOL SORRIA no horizonte.'\n• 'As ÁRVORES DANÇAVAM com o vento.'\n• 'A LUA ESPIAVA pela janela.'\n• 'O TEMPO VOA.'\n\n✅ CATACRESE - Metáfora cristalizada pelo uso:\n\n• 'O PÉ da mesa.' (não é pé de verdade)\n• 'A ASA da xícara.'\n• 'Os DENTES do alho.'\n• 'EMBARCAR no avião.' (não é barco)\n• 'A CABEÇA do prego.'",
        },
        {
          heading: "📌 FIGURAS DE SOM E SINTAXE",
          content:
            "✅ FIGURAS DE SOM:\n\n• ALITERAÇÃO (repetição de consoantes):\n'O RATO ROEU a ROUPA do REI de ROMA.'\n\n• ASSONÂNCIA (repetição de vogais):\n'Sou um mulAto nAto no sentIdo lAto.' (A)\n\n• ONOMATOPEIA (imita sons):\n'O gato fez MIAU.' / 'TIC-TAC do relógio.'\n\n✅ FIGURAS DE SINTAXE:\n\n• ELIPSE (omissão de termo subentendido):\n'Na sala, apenas dois alunos.' (havia)\n\n• PLEONASMO (redundância expressiva):\n'Vi com meus PRÓPRIOS OLHOS.'\n'Subir PRA CIMA.'\n\n• ANÁFORA (repetição no início):\n'É preciso AMAR... É preciso VIVER...'",
        },
        {
          heading: "🎯 RESUMO DAS PRINCIPAIS FIGURAS",
          content:
            "┌────────────────────────────────────────────────────────┐\n│  FIGURA          │  O QUE FAZ               │ EXEMPLO  │\n├────────────────────────────────────────────────────────┤\n│  Metáfora        │  Comparação implícita    │ É um gelo│\n│  Comparação      │  Com 'como', 'tal'       │ Como gelo│\n│  Metonímia       │  Substituição relação    │ Li Camões│\n│  Ironia          │  Diz o contrário         │ Que lindo│\n│  Antítese        │  Oposição                │ Vida/mort│\n│  Hipérbole       │  Exagero                 │ 1 milhão │\n│  Eufemismo       │  Suaviza                 │ Descansou│\n│  Personificação  │  Humaniza objetos        │ Sol sorri│\n│  Aliteração      │  Repete consoantes       │ Rato roeu│\n│  Onomatopeia     │  Imita sons              │ Miau, bum│\n└────────────────────────────────────────────────────────┘",
        },
      ],
      keyTopics: [
        "Metáfora",
        "Metonímia",
        "Ironia",
        "Antítese",
        "Hipérbole",
        "Eufemismo",
        "Personificação",
        "Aliteração",
        "Onomatopeia",
      ],
    },

    Ortografia: {
      title: "Ortografia",
      introduction:
        "Ortografia é a escrita correta das palavras. Envolve uso de letras (S/Z, X/CH, G/J), hífen, acentuação e grafia de expressões. O Novo Acordo Ortográfico (2009) trouxe mudanças importantes. Tema frequente em concursos.",
      sections: [
        {
          heading: "📌 S ou Z?",
          content:
            "✅ USA-SE S:\n\n• Após ditongo: coisa, pausa, lousa, maisena\n• Sufixo -ÊS/-ESA (origem): português, inglesa, japonês\n• Sufixo -OSO/-OSA: carinhoso, gostosa, nervoso\n• Sufixo -ISA (profissão fem.): poetisa, papisa\n• Verbos PÔR e QUERER: pus, pôs, quis, quiseram\n\n✅ USA-SE Z:\n\n• Sufixo -EZ/-EZA (substantivos abstratos):\n  rapidez, beleza, riqueza, tristeza\n• Sufixo -IZAR (formar verbos):\n  realizar, atualizar, civilizar\n• Verbos IZER/UZIR: fazer → fazes, reduzir → reduzes\n\n❌ ERROS COMUNS:\n• 'paralizar' ✗ → 'paralisar' ✓\n• 'pesquiza' ✗ → 'pesquisa' ✓",
        },
        {
          heading: "📌 X ou CH?",
          content:
            "✅ USA-SE X:\n\n• Após ditongo: caixa, peixe, faixa, ameixa\n• Após EN-: enxada, enxame, enxergar, enxugar\n  EXCEÇÃO: encher, enchente, enchumaçar (derivam de 'cheio')\n• Palavras de origem indígena/africana:\n  xavante, xará, xangô, abacaxi\n\n✅ USA-SE CH:\n\n• Palavras de origem estrangeira:\n  chave, chuva, chocolate, chance, cheque\n• Derivados de palavras com CH:\n  cheio → encher, enchente\n\n💡 DICA: Palavras com X têm som variável:\n• X = Z: exame, exato\n• X = S: máximo, próximo\n• X = KS: táxi, tóxico\n• X = CH: xícara, xerox",
        },
        {
          heading: "📌 G ou J?",
          content:
            "✅ USA-SE G:\n\n• Palavras terminadas em -ÁGIO, -ÉGIO, -ÍGIO, -ÓGIO, -ÚGIO:\n  pedágio, colégio, prestígio, relógio, refúgio\n• Palavras terminadas em -GEM:\n  viagem, coragem, garagem, bagagem\n  EXCEÇÃO: pajem, lajem\n\n✅ USA-SE J:\n\n• Verbos terminados em -JAR:\n  viajar → eu viajo, viajem (imperativo)\n  arranjar → arranje, arranjem\n• Palavras de origem indígena/africana:\n  pajé, jiboia, jenipapo, jiló, canjica\n• Derivados de palavras com J:\n  loja → lojista, gorja → gorjeta\n\n⚠️ VIAGEM × VIAJEM:\n• 'A VIAGEM foi boa.' (substantivo = G)\n• 'VIAJEM com segurança!' (verbo = J)",
        },
        {
          heading: "📌 USO DO HÍFEN - Prefixos",
          content:
            "✅ USA HÍFEN:\n\n• Mesma letra: anti-inflamatório, micro-ondas, semi-interno\n• H após prefixo: anti-higiênico, super-homem\n• Prefixo ex-, pós-, pré-, pró-, vice-:\n  ex-presidente, pós-graduação, pré-vestibular, vice-rei\n\n✅ NÃO USA HÍFEN:\n\n• Letras diferentes: autoescola, antiaéreo, infraestrutura\n• R ou S após prefixo: dobra a consoante:\n  antissocial, contrarregra, ultrassom, minissaia\n\n❌ ERROS COMUNS:\n• 'auto-escola' ✗ → 'autoescola' ✓\n• 'anti-social' ✗ → 'antissocial' ✓\n• 'micro-ondas' ✓ (mesma letra: O-O)",
        },
        {
          heading: "📌 PORQUÊS",
          content:
            "✅ POR QUE (separado, sem acento):\n• Início de pergunta: 'POR QUE você veio?'\n• = pelo qual: 'O motivo POR QUE chorei'\n\n✅ POR QUÊ (separado, com acento):\n• Final de frase: 'Você veio POR QUÊ?'\n• Antes de pontuação forte\n\n✅ PORQUE (junto, sem acento):\n• Resposta/explicação: 'Vim PORQUE quis.'\n• = pois\n\n✅ PORQUÊ (junto, com acento):\n• Substantivo (com artigo): 'Não sei O PORQUÊ.'\n• = o motivo\n\n💡 MACETE:\n• Pergunta direta → POR QUE (separado)\n• Resposta → PORQUE (junto)\n• Substantivo → O PORQUÊ (artigo antes)",
        },
        {
          heading: "📌 PALAVRAS FREQUENTEMENTE ERRADAS",
          content:
            "✅ GRAFIA CORRETA:\n\n• EXCEÇÃO (e não 'excessão')\n• EXCESSO (e não 'exceço')\n• PRIVILÉGIO (e não 'previlégio')\n• BENEFICENTE (e não 'beneficiente')\n• MAISENA (e não 'maizena')\n• ESTRANGEIRO (e não 'extrangeiro')\n• COMPANHIA (e não 'compania')\n• ADVOGADO (e não 'adevogado')\n• MORTADELA (e não 'mortandela')\n• METEOROLOGIA (e não 'metereologia')\n• ATERRIZAR ou ATERRISSAR (ambos corretos)\n\n✅ MAU × MAL:\n• MAU = adjetivo (oposto de bom): 'mau humor'\n• MAL = advérbio (oposto de bem): 'passou mal'",
        },
        {
          heading: "🎯 RESUMO PRÁTICO",
          content:
            "┌─────────────────────────────────────────────────────┐\n│  LETRA    │  QUANDO USAR                           │\n├─────────────────────────────────────────────────────┤\n│  S        │  ditongo, -oso, pôr/querer             │\n│  Z        │  -ez/-eza (abstrato), -izar            │\n│  X        │  ditongo, en- (exceto encher)          │\n│  CH       │  origem estrangeira, derivados         │\n│  G        │  -agem, -ágio, -égio                   │\n│  J        │  verbos -jar, origem indígena          │\n└─────────────────────────────────────────────────────┘\n\n┌─────────────────────────────────────────────────────┐\n│  HÍFEN    │  mesma letra, após H, ex/pré/pós/vice │\n│  SEM      │  letras diferentes, R/S (dobra)        │\n└─────────────────────────────────────────────────────┘",
        },
      ],
      keyTopics: [
        "S ou Z",
        "X ou CH",
        "G ou J",
        "Uso do Hífen",
        "Os Porquês",
        "Mau × Mal",
        "Palavras Difíceis",
        "Acordo Ortográfico",
      ],
    },

    Pontuação: {
      title: "Pontuação",
      introduction:
        "A pontuação organiza o texto, indica pausas, entonações e relações entre ideias. Uso incorreto pode mudar completamente o sentido da frase. Dominar vírgula, ponto e dois-pontos é essencial para redações e concursos.",
      sections: [
        {
          heading: "📌 VÍRGULA - Quando usar",
          content:
            "✅ SEPARAR ELEMENTOS DE MESMA FUNÇÃO:\n• 'Comprei maçãs, bananas, uvas e laranjas.'\n• 'João, Pedro e Maria chegaram.'\n\n✅ ISOLAR VOCATIVO (chamamento):\n• 'Maria, venha aqui!'\n• 'Meus amigos, preciso de ajuda.'\n• 'Vai, Brasil!'\n\n✅ ISOLAR APOSTO (explicação):\n• 'Brasília, capital do Brasil, é moderna.'\n• 'Carlos, meu vizinho, viajou.'\n\n✅ ISOLAR ADJUNTO ADVERBIAL DESLOCADO:\n• 'Ontem, fui ao cinema.' (no início)\n• 'Fui, ontem, ao cinema.' (no meio)\n• 'Fui ao cinema ontem.' (no final - facultativa)",
        },
        {
          heading: "📌 VÍRGULA - Quando NÃO usar",
          content:
            "❌ NUNCA separe com vírgula:\n\n• SUJEITO do VERBO:\n✗ 'O professor, explicou a matéria.'\n✓ 'O professor explicou a matéria.'\n\n• VERBO do COMPLEMENTO:\n✗ 'Comprei, uma casa.'\n✓ 'Comprei uma casa.'\n\n• NOME do COMPLEMENTO ou ADJUNTO:\n✗ 'Tenho certeza, de que virá.'\n✓ 'Tenho certeza de que virá.'\n\n💡 MACETE:\nNunca coloque vírgula entre termos que 'se abraçam':\nSujeito ↔ Verbo ↔ Complemento (sem vírgula entre eles)",
        },
        {
          heading: "📌 PONTO E VÍRGULA (;)",
          content:
            "✅ USA-SE PARA:\n\n• SEPARAR ORAÇÕES LONGAS JÁ COM VÍRGULAS:\n'Alguns preferem café; outros, chá; e há quem goste de suco.'\n\n• SEPARAR ITENS DE UMA LISTA:\n'Os candidatos devem apresentar:\na) diploma de graduação;\nb) carteira de identidade;\nc) comprovante de residência.'\n\n• ANTES DE CONECTIVOS ADVERSATIVOS (porém, contudo):\n'Estudou muito; porém, não passou.'\n(Pode usar vírgula também, mas ponto e vírgula marca pausa maior)\n\n💡 Pausa maior que vírgula, menor que ponto.",
        },
        {
          heading: "📌 DOIS-PONTOS (:)",
          content:
            "✅ INTRODUZIR ENUMERAÇÃO:\n'Comprei três frutas: maçã, banana e uva.'\n\n✅ INTRODUZIR FALA/CITAÇÃO:\n'Ele disse: — Não vou desistir.'\n'Como dizia Sócrates: \"Só sei que nada sei.\"'\n\n✅ INTRODUZIR EXPLICAÇÃO:\n'Só quero uma coisa: paz.'\n'A resposta é simples: estudar.'\n\n✅ APÓS SAUDAÇÃO EM CORRESPONDÊNCIA:\n'Prezado Senhor:\nVenho por meio desta...'\n\n💡 Dois-pontos anuncia algo que virá em seguida.",
        },
        {
          heading: "📌 ASPAS, PARÊNTESES e TRAVESSÃO",
          content:
            "✅ ASPAS (\" \"):\n• Citações: 'Ele disse: \"Vou vencer.\"'\n• Ironia ou destaque: 'Que \"amigo\" você é!'\n• Estrangeirismos: 'O \"delivery\" chegou.'\n• Títulos de obras: 'Li \"Dom Casmurro\".'\n\n✅ PARÊNTESES ( ):\n• Inserir explicação secundária:\n'A ONU (Organização das Nações Unidas) se reuniu.'\n• Indicações: '(risos)', '(grifo nosso)'\n\n✅ TRAVESSÃO (—):\n• Indicar fala em diálogos:\n'— Você vem? — perguntou Maria.'\n• Isolar aposto (ênfase maior que vírgula):\n'O resultado — surpreendente — foi positivo.'",
        },
        {
          heading: "📌 RETICÊNCIAS e PONTO DE EXCLAMAÇÃO/INTERROGAÇÃO",
          content:
            "✅ RETICÊNCIAS (...):\n• Indicar interrupção ou hesitação:\n'Eu queria dizer que... Ah, esquece.'\n• Criar suspense:\n'E então a porta se abriu...'\n• Omissão em citações:\n'O autor afirma que \"a educação... é essencial.\"'\n\n✅ PONTO DE EXCLAMAÇÃO (!):\n• Emoção (alegria, raiva, surpresa): 'Que lindo!'\n• Ordem/imperativo: 'Saia daqui!'\n• Interjeição: 'Ufa! Nossa!'\n\n✅ PONTO DE INTERROGAÇÃO (?):\n• Pergunta direta: 'Você vem?'\n• NÃO usar em pergunta indireta:\n✓ 'Quero saber se você vem.' (sem ?)\n✗ 'Quero saber se você vem?'",
        },
        {
          heading: "🎯 RESUMO PRÁTICO",
          content:
            "┌────────────────────────────────────────────────────────┐\n│  SINAL       │  FUNÇÃO PRINCIPAL                      │\n├────────────────────────────────────────────────────────┤\n│  Vírgula     │  Pausa breve, isolar termos, enumerar  │\n│  Ponto       │  Encerrar frase/período                │\n│  Ponto e víg.│  Pausa intermediária                   │\n│  Dois-pontos │  Introduzir algo (fala, lista)         │\n│  Aspas       │  Citação, ironia, títulos              │\n│  Parênteses  │  Explicação secundária                 │\n│  Travessão   │  Diálogo, destaque                     │\n│  Reticências │  Interrupção, suspense                 │\n└────────────────────────────────────────────────────────┘\n\n⚠️ PROIBIDO:\n• Vírgula entre sujeito e verbo\n• Vírgula entre verbo e complemento",
        },
      ],
      keyTopics: [
        "Uso da Vírgula",
        "Ponto e Vírgula",
        "Dois-Pontos",
        "Aspas",
        "Parênteses",
        "Travessão",
        "Reticências",
        "Ponto de Exclamação",
      ],
    },

    "Redação Oficial": {
      title: "Redação Oficial",
      introduction:
        "Redação oficial é a forma de comunicação utilizada pelos órgãos públicos. Segue padrões do Manual de Redação da Presidência. Princípios: impessoalidade, clareza, concisão, formalidade e padronização. Essencial para concursos públicos.",
      sections: [
        {
          heading: "📌 PRINCÍPIOS DA REDAÇÃO OFICIAL",
          content:
            "✅ IMPESSOALIDADE:\n• Evitar impressões pessoais: 'Achamos que...'\n• Usar: 'Verifica-se que...', 'Constata-se...'\n• O redator fala em nome do órgão, não de si\n\n✅ CLAREZA:\n• Texto compreensível na primeira leitura\n• Evitar ambiguidades e rebuscamento\n• Ordem direta: sujeito + verbo + complemento\n\n✅ CONCISÃO:\n• Dizer muito com poucas palavras\n• Eliminar redundâncias e adjetivação excessiva\n\n✅ FORMALIDADE:\n• Linguagem culta, sem gírias ou coloquialismos\n• Respeito à hierarquia e aos pronomes de tratamento",
        },
        {
          heading: "📌 PRONOMES DE TRATAMENTO",
          content:
            "✅ VOSSA EXCELÊNCIA (V. Exa.):\n• Presidente da República\n• Ministros, Governadores, Prefeitos\n• Deputados, Senadores, Juízes\n• 'Comunicamos a Vossa Excelência que...'\n\n✅ VOSSA SENHORIA (V. Sa.):\n• Autoridades de menor escalão\n• Diretores, Chefes de Setor\n• Particulares em situação formal\n\n✅ VOSSA MAGNIFICÊNCIA:\n• Reitores de universidades\n\n✅ VOSSA SANTIDADE:\n• Papa\n\n⚠️ CONCORDÂNCIA:\nVossa Excelência (você) + VERBO NA 3ª PESSOA:\n'Vossa Excelência DECIDIU...' ✓\n'Vossa Excelência DECIDISTES...' ✗",
        },
        {
          heading: "📌 TIPOS DE DOCUMENTOS OFICIAIS",
          content:
            "✅ OFÍCIO:\n• Comunicação externa (entre órgãos diferentes)\n• Formato: data, vocativo, corpo, fecho, assinatura\n• 'Senhor Diretor,' (vocativo) + texto + 'Atenciosamente,'\n\n✅ MEMORANDO:\n• Comunicação interna (mesmo órgão)\n• Mais simples e ágil que o ofício\n• Numeração: Mem. nº XX/2024 - Setor\n\n✅ E-MAIL OFICIAL:\n• Estrutura: assunto claro, vocativo, texto, fecho\n• Mesmo padrão formal dos demais documentos\n• Pode substituir memorando e ofício em muitos casos",
        },
        {
          heading: "📌 REQUERIMENTO E RELATÓRIO",
          content:
            "✅ REQUERIMENTO:\n• Pedido formal a uma autoridade\n• Estrutura: invocação, identificação, pedido, fecho\n\nMODELO:\n'Ilmo. Sr. Diretor do Departamento de Pessoal,\n\nFulano de Tal, brasileiro, portador do CPF nº XXX, servidor deste órgão, vem respeitosamente requerer a Vossa Senhoria a concessão de férias...\n\nNestes termos, pede deferimento.\n[Local e data]\n[Assinatura]'\n\n✅ RELATÓRIO:\n• Expõe atividades realizadas ou situações\n• Estrutura: introdução, desenvolvimento, conclusão\n• Linguagem objetiva, dados concretos",
        },
        {
          heading: "📌 FECHOS DE COMUNICAÇÃO",
          content:
            "✅ FECHOS PADRÃO:\n\n• 'Respeitosamente,'\n  → Para autoridades SUPERIORES ao remetente\n  → Presidente, Ministros, Governadores\n\n• 'Atenciosamente,'\n  → Para autoridades de MESMA hierarquia\n  → Ou para autoridades INFERIORES\n\n⚠️ FECHOS ABOLIDOS:\n• 'Sem mais para o momento...'\n• 'Subscrevemo-nos...'\n• 'Com elevada estima...'\n• 'Sendo o que se apresenta...'\n\nESTES NÃO SÃO MAIS USADOS na redação oficial moderna.",
        },
        {
          heading: "📌 VÍCIOS A EVITAR",
          content:
            "❌ ARCAÍSMOS (expressões antigas):\n• 'Outrossim' → Usar: 'além disso'\n• 'Destarte' → Usar: 'assim', 'dessa forma'\n\n❌ CHAVÕES E JARGÕES:\n• 'Via de regra' → Usar: 'geralmente'\n• 'Fazer jus' → Usar: 'ter direito'\n• 'No que tange' → Usar: 'quanto a', 'sobre'\n\n❌ REDUNDÂNCIAS:\n• 'Elo de ligação' → 'elo'\n• 'Há anos atrás' → 'há anos'\n• 'Anexo junto' → 'anexo'\n\n❌ GERUNDISMO:\n• 'Vou estar enviando' → 'Enviarei'\n• 'Vamos estar analisando' → 'Analisaremos'",
        },
        {
          heading: "🎯 ESTRUTURA PADRÃO",
          content:
            "┌────────────────────────────────────────────────────────┐\n│  DOCUMENTO OFICIAL - ESTRUTURA                         │\n├────────────────────────────────────────────────────────┤\n│  1. Cabeçalho: brasão, nome do órgão                   │\n│  2. Número e tipo: Ofício nº XX/2024                   │\n│  3. Local e data: Brasília, 15 de março de 2024        │\n│  4. Vocativo: Senhor Diretor,                          │\n│  5. Corpo: texto em parágrafos                         │\n│  6. Fecho: Atenciosamente, / Respeitosamente,          │\n│  7. Assinatura: nome e cargo                           │\n└────────────────────────────────────────────────────────┘\n\n💡 REGRAS DE FORMATAÇÃO:\n• Fonte: Times ou Arial, tamanho 12\n• Margens: 3cm (esq/sup), 1,5cm (dir/inf)\n• Espaçamento: 1,5 entre linhas",
        },
      ],
      keyTopics: [
        "Princípios da Redação Oficial",
        "Pronomes de Tratamento",
        "Ofício",
        "Memorando",
        "Requerimento",
        "Fechos Oficiais",
        "Vícios de Linguagem",
        "Manual de Redação",
      ],
    },

    "Regência Nominal e Verbal": {
      title: "Regência Nominal e Verbal",
      introduction:
        "Regência é a relação entre um termo regente (verbo ou nome) e seu complemento. Define qual preposição usar (ou não usar) após verbos e nomes. Erros de regência são muito cobrados em provas e afetam a crase.",
      sections: [
        {
          heading: "📌 VERBOS COM REGÊNCIAS DIFERENTES CONFORME O SENTIDO",
          content:
            "✅ ASSISTIR:\n• Assistir A (VER, PRESENCIAR) → exige preposição A:\n'Assistimos AO jogo.' ✓ / 'Assistimos o jogo.' ✗\n\n• Assistir (AJUDAR, DAR ASSISTÊNCIA) → sem preposição:\n'O médico assistiu o paciente.' ✓\n\n✅ VISAR:\n• Visar A (ALMEJAR, PRETENDER) → exige preposição A:\n'Ele visa AO cargo de diretor.' ✓\n\n• Visar (MIRAR, DAR VISTO) → sem preposição:\n'Visei o alvo.' / 'O gerente visou o cheque.'",
        },
        {
          heading: "📌 VERBOS QUE EXIGEM PREPOSIÇÃO",
          content:
            "✅ VERBOS + A:\n• Assistir A (ver): 'Assisti AO filme.'\n• Obedecer/Desobedecer A: 'Obedeceu AO pai.'\n• Responder A: 'Respondeu AO e-mail.'\n• Referir-se A: 'Refiro-me A você.'\n• Aludir A: 'Aludiu AO problema.'\n\n✅ VERBOS + DE:\n• Precisar DE: 'Preciso DE ajuda.'\n• Gostar DE: 'Gosto DE chocolate.'\n• Lembrar-se DE / Esquecer-se DE:\n  'Lembrei-me DO aniversário.'  (pronominal)\n  'Lembrei o aniversário.' (não pronominal)\n\n✅ VERBOS + COM:\n• Simpatizar/Antipatizar COM: 'Simpatizo COM ele.'\n• Sonhar COM: 'Sonhei COM você.'",
        },
        {
          heading: "📌 VERBOS QUE NÃO PEDEM PREPOSIÇÃO",
          content:
            "✅ VERBOS TRANSITIVOS DIRETOS (sem preposição):\n\n• NAMORAR (alguém):\n✓ 'Ele namora A Maria.' ✗\n✓ 'Ele namora Maria.' ✓\n\n• PAGAR/PERDOAR (algo A alguém):\n✓ 'Pagou a conta.' (TD - pagar algo)\n✓ 'Pagou ao garçom.' (TI - pagar a alguém)\n\n• PREFERIR (A preferir B):\n✓ 'Prefiro café A chá.' ✓ (e não 'do que')\n✗ 'Prefiro café DO QUE chá.' ✗\n\n• IMPLICAR (acarretar):\n✓ 'Isso implica custos.' ✓\n✗ 'Isso implica EM custos.' ✗",
        },
        {
          heading: "📌 VERBOS IR, VIR, CHEGAR",
          content:
            "⚠️ ERRO MUITO COMUM: usar 'em' ao invés de 'a'.\n\n✅ CORRETO (preposição A):\n• 'Fui AO cinema.' ✓\n• 'Vou À escola.' ✓\n• 'Cheguei A casa.' ✓ (sem artigo)\n• 'Cheguei À escola.' ✓ (com artigo)\n\n❌ ERRADO (preposição EM):\n• 'Fui NO cinema.' ✗\n• 'Vou NA escola.' ✗\n• 'Cheguei NA escola.' ✗\n\n💡 MACETE:\nVerbos de MOVIMENTO pedem:\n• IR A, VIR A, CHEGAR A (destino)\n• IR PARA (permanência prolongada)\n\n'Vou A São Paulo.' (visita)\n'Vou PARA São Paulo.' (mudar de cidade)",
        },
        {
          heading: "📌 REGÊNCIA NOMINAL",
          content:
            "Nomes (substantivos, adjetivos) também exigem preposições.\n\n✅ NOMES + A:\n• Obediente A: 'Obediente AO regulamento.'\n• Acessível A: 'Acessível A todos.'\n• Favorável A: 'Favorável AO projeto.'\n• Alusão A: 'Fez alusão AO tema.'\n\n✅ NOMES + DE:\n• Capaz/Incapaz DE: 'Capaz DE aprender.'\n• Medo DE: 'Medo DE altura.'\n• Certeza DE: 'Tenho certeza DE que virá.'\n\n✅ NOMES + COM:\n• Compatível COM: 'Compatível COM o sistema.'\n• Contente COM: 'Contente COM o resultado.'\n\n✅ NOMES + EM:\n• Especialista EM: 'Especialista EM redes.'\n• Interesse EM: 'Interesse EM aprender.'",
        },
        {
          heading: "📌 PARALELISMO DE REGÊNCIA",
          content:
            "Quando dois verbos regem o mesmo complemento, devem ter a MESMA regência.\n\n❌ ERRADO (regências diferentes):\n'Entrei e saí DA sala.'\n(entrar = em / sair = de → incompatíveis)\n\n✅ CORRETO:\n'Entrei NA sala e saí DELA.'\n'Entrei NA sala e DELA saí.'\n\n❌ ERRADO:\n'Assisti e gostei DO filme.'\n(assistir = a / gostar = de → incompatíveis)\n\n✅ CORRETO:\n'Assisti AO filme e gostei DELE.'\n'Assisti AO filme e DELE gostei.'",
        },
        {
          heading: "🎯 RESUMO - VERBOS MAIS COBRADOS",
          content:
            "┌──────────────────────────────────────────────────────┐\n│  VERBO        │  REGÊNCIA         │  EXEMPLO          │\n├──────────────────────────────────────────────────────┤\n│  Assistir     │  A (ver)          │  Assisti AO filme │\n│  Obedecer     │  A                │  Obedeceu AO pai  │\n│  Visar        │  A (almejar)      │  Visa AO cargo    │\n│  Aspirar      │  A (almejar)      │  Aspira AO sucesso│\n│  Ir/Chegar    │  A (destino)      │  Fui A São Paulo  │\n│  Preferir     │  A (não 'do que') │  Prefiro X A Y    │\n│  Namorar      │  sem prep.        │  Namora Maria     │\n│  Implicar     │  sem prep. (geral)│  Implica custos   │\n│  Gostar       │  DE               │  Gosto DE música  │\n│  Precisar     │  DE               │  Preciso DE ajuda │\n│  Simpatizar   │  COM              │  Simpatizo COM ele│\n└──────────────────────────────────────────────────────┘",
        },
      ],
      keyTopics: [
        "Regência Verbal",
        "Regência Nominal",
        "Verbos Transitivos",
        "Preposições Obrigatórias",
        "Assistir/Visar/Aspirar",
        "Ir/Chegar/Vir",
        "Namorar/Implicar/Preferir",
        "Paralelismo de Regência",
      ],
    },

    "Sintaxe do Período Composto": {
      title: "Sintaxe do Período Composto",
      introduction:
        "Período composto é formado por duas ou mais orações. Podem ser coordenadas (independentes entre si) ou subordinadas (uma depende da outra). Compreender essa estrutura é essencial para pontuação e interpretação.",
      sections: [
        {
          heading: "📌 PERÍODO SIMPLES vs COMPOSTO",
          content:
            "✅ PERÍODO SIMPLES (1 oração, 1 verbo):\n'O aluno estudou.'\n(1 verbo = 1 oração)\n\n✅ PERÍODO COMPOSTO (2+ orações, 2+ verbos):\n'O aluno estudou e passou.'\n(2 verbos = 2 orações)\n\n'Ele disse que viria.'\n(2 verbos: disse / viria = 2 orações)\n\n💡 COMO CONTAR ORAÇÕES:\n• Conte os VERBOS (ou locuções verbais)\n• Cada verbo = 1 oração\n\n'Se você estudar, será aprovado e ganhará o prêmio.'\nVerbos: estudar / será / ganhará = 3 orações",
        },
        {
          heading: "📌 COORDENAÇÃO - Orações Independentes",
          content:
            "Orações coordenadas são INDEPENDENTES sintaticamente.\nCada uma faz sentido sozinha.\n\n✅ TIPOS:\n\n• ADITIVA (soma): e, nem, também, bem como\n'Estudou E passou.'\n'Não come NEM dorme.'\n\n• ADVERSATIVA (oposição): mas, porém, contudo, todavia\n'Estudou, MAS não passou.'\n'É rico, PORÉM infeliz.'\n\n• ALTERNATIVA (alternância): ou, ou...ou, ora...ora\n'Estuda OU trabalha.'\n'ORA chora, ORA ri.'\n\n• CONCLUSIVA (conclusão): logo, portanto, assim, então\n'Estudou, LOGO passou.'\n'Penso, PORTANTO existo.'\n\n• EXPLICATIVA (explicação): pois, porque, que\n'Volte, POIS está tarde.' (= porque)",
        },
        {
          heading: "📌 SUBORDINAÇÃO - Orações Dependentes",
          content:
            "Orações subordinadas DEPENDEM da oração principal.\nSozinhas, não fazem sentido completo.\n\n✅ 3 TIPOS DE SUBORDINADAS:\n\n1️⃣ SUBSTANTIVAS:\nFuncionam como SUBSTANTIVO (sujeito, objeto, etc.)\n'Espero QUE VOCÊ VENHA.' (objeto direto)\n'É necessário QUE TODOS PARTICIPEM.' (sujeito)\n\n2️⃣ ADJETIVAS:\nFuncionam como ADJETIVO (modificam substantivo)\n'O aluno QUE ESTUDOU passou.' (qual aluno?)\n\n3️⃣ ADVERBIAIS:\nFuncionam como ADVÉRBIO (circunstância)\n'QUANDO VOCÊ CHEGAR, avise-me.' (tempo)",
        },
        {
          heading: "📌 ORAÇÕES SUBORDINADAS ADVERBIAIS",
          content:
            "Indicam CIRCUNSTÂNCIAS. Tipos principais:\n\n✅ TEMPORAL (quando): quando, enquanto, assim que\n'QUANDO CHEGUEI, ele saiu.'\n\n✅ CAUSAL (por que): porque, já que, visto que\n'Faltou PORQUE ESTAVA DOENTE.'\n\n✅ CONDICIONAL (se): se, caso, desde que\n'SE ESTUDAR, passará.'\n\n✅ CONCESSIVA (embora): embora, apesar de que, mesmo que\n'EMBORA ESTIVESSE CANSADO, trabalhou.'\n\n✅ FINAL (para que): para que, a fim de que\n'Estudou PARA QUE PASSASSE.'\n\n✅ COMPARATIVA (como): como, mais...que, menos...que\n'Ele é inteligente COMO O PAI.'\n\n✅ CONSECUTIVA (tão...que): tão...que, tanto...que\n'Correu TANTO QUE CANSOU.'",
        },
        {
          heading: "📌 ORAÇÕES ADJETIVAS - Restritivas vs Explicativas",
          content:
            "✅ RESTRITIVA (sem vírgula) - Restringe, especifica:\n'Os alunos QUE ESTUDARAM passaram.'\n(Só os que estudaram, não todos)\n\n✅ EXPLICATIVA (com vírgula) - Explica, generaliza:\n'Os alunos, QUE ERAM JOVENS, passaram.'\n(Todos os alunos eram jovens - informação extra)\n\n💡 A VÍRGULA MUDA O SENTIDO:\n\n'Meu irmão que mora em SP veio.'\n(Tenho mais irmãos, especifiquei qual)\n\n'Meu irmão, que mora em SP, veio.'\n(Tenho só um irmão, e ele mora em SP)\n\n⚠️ PRONOMES RELATIVOS:\nque, o qual, a qual, cujo, onde, quem",
        },
        {
          heading: "📌 CONJUNÇÕES MAIS COBRADAS",
          content:
            "⚠️ CONJUNÇÕES QUE MUDAM DE SENTIDO:\n\n✅ COMO:\n• Comparativa: 'É esperto COMO o pai.' (igual a)\n• Causal: 'COMO estava cansado, dormiu.' (porque)\n• Conformativa: 'Fiz COMO você mandou.' (conforme)\n\n✅ QUANDO:\n• Temporal: 'QUANDO chegar, avise.' (momento)\n• Condicional: 'QUANDO necessário, intervenha.' (se)\n\n✅ QUE:\n• Integrante (subst.): 'Espero QUE venha.' (isso)\n• Relativo (adj.): 'O livro QUE li é bom.' (o qual)\n• Causal: 'Corra, QUE está tarde.' (porque)\n• Consecutivo: 'Correu tanto QUE cansou.'",
        },
        {
          heading: "🎯 RESUMO - CLASSIFICAÇÃO DAS ORAÇÕES",
          content:
            "┌────────────────────────────────────────────────────────┐\n│  COORDENADAS (independentes)                           │\n├────────────────────────────────────────────────────────┤\n│  Aditiva     │ e, nem        │ soma                   │\n│  Adversativa │ mas, porém    │ oposição               │\n│  Alternativa │ ou, ora...ora │ alternância            │\n│  Conclusiva  │ logo, portanto│ conclusão              │\n│  Explicativa │ pois, porque  │ explicação             │\n└────────────────────────────────────────────────────────┘\n\n┌────────────────────────────────────────────────────────┐\n│  SUBORDINADAS (dependentes)                            │\n├────────────────────────────────────────────────────────┤\n│  Substantivas  │ função de substantivo (sujeito, OD)  │\n│  Adjetivas     │ modificam substantivo (restritiva)   │\n│  Adverbiais    │ circunstância (tempo, causa, cond.)  │\n└────────────────────────────────────────────────────────┘",
        },
      ],
      keyTopics: [
        "Período Simples e Composto",
        "Orações Coordenadas",
        "Orações Subordinadas",
        "Subordinadas Substantivas",
        "Subordinadas Adjetivas",
        "Subordinadas Adverbiais",
        "Conjunções Coordenativas",
        "Conjunções Subordinativas",
      ],
    },
  },

  // ==================== INGLÊS ====================
  ingles: {
    "Compreensão de Texto": {
      title: "Compreensão de Texto",
      introduction:
        "Dicionário de termos e técnicas para interpretação de textos em inglês. Domine o vocabulário essencial para compreensão textual.",
      sections: [
        {
          heading: "📖 Vocabulário de Compreensão",
          content: `**COMPREHENSION** /ˌkɒmprɪˈhenʃən/ (noun)
A capacidade de entender completamente algo que se lê ou ouve.
• "Reading comprehension is essential for language learning."
Sinônimos: understanding, grasp, perception

**CONTEXT** /ˈkɒntekst/ (noun)
As circunstâncias ou informações que cercam uma palavra ou frase e ajudam a determinar seu significado.
• "You can often guess the meaning from context."
Dica: Sempre leia as frases antes e depois para entender o contexto!

**INFERENCE** /ˈɪnfərəns/ (noun)
Uma conclusão que você chega baseada em evidências e raciocínio, não em afirmação direta.
• "The text implies, rather than states directly — you must infer the meaning."
Verbo relacionado: to infer /ɪnˈfɜːr/

**SKIM** /skɪm/ (verb)
Ler rapidamente para obter uma ideia geral do conteúdo, sem focar em detalhes.
• "Skim the article first to get the main idea."

**SCAN** /skæn/ (verb)
Ler rapidamente procurando informações específicas, como nomes, datas ou números.
• "Scan the text to find the date of the event."
Diferença: Skim = ideia geral; Scan = informação específica

**MAIN IDEA** /meɪn aɪˈdɪə/ (noun phrase)
O ponto central ou mensagem principal de um texto ou parágrafo.
• "The main idea is usually found in the first or last sentence."

**PARAPHRASE** /ˈpærəfreɪz/ (verb/noun)
Expressar o significado de algo usando palavras diferentes; uma reformulação.
• "Can you paraphrase what the author said?"
Diferença: Quote = palavras exatas; Paraphrase = suas próprias palavras

**TONE** /təʊn/ (noun)
A atitude ou sentimento do autor em relação ao assunto, expressa através da escolha de palavras.
Tipos: formal, informal, serious, humorous, critical, optimistic, pessimistic

**IMPLY** /ɪmˈplaɪ/ (verb)
Sugerir algo indiretamente, sem afirmar explicitamente.
• O autor IMPLIES (sugere); o leitor INFERS (deduz)

**COGNATE** /ˈkɒɡneɪt/ (noun)
Palavra que tem origem comum e significado similar em dois idiomas.
• telephone/telefone, information/informação
Cuidado com FALSE COGNATES: actually ≠ atualmente (actually = na verdade)`,
        },
      ],
      keyTopics: [
        "Comprehension",
        "Context",
        "Inference",
        "Skim e Scan",
        "Main Idea",
        "Supporting Details",
        "Paraphrase e Summarize",
        "Tone",
        "Literal vs Figurative",
        "Cognates",
      ],
    },

    "Expressões Idiomáticas": {
      title: "Expressões Idiomáticas",
      introduction:
        "Dicionário de idioms e expressões populares em inglês com traduções equivalentes em português.",
      sections: [
        {
          heading: "🗣️ Idioms Essenciais",
          content: `**BREAK THE ICE** /breɪk ðə aɪs/ - Quebrar o gelo
Fazer algo para aliviar a tensão. "He told a joke to break the ice."

**PIECE OF CAKE** /piːs əv keɪk/ - Moleza
Algo muito fácil. "The exam was a piece of cake!"

**HIT THE NAIL ON THE HEAD** - Acertar em cheio
Estar absolutamente certo. "You hit the nail on the head!"

**COST AN ARM AND A LEG** - Custar os olhos da cara
Ser extremamente caro. "That car cost me an arm and a leg."

**UNDER THE WEATHER** - Estar indisposto
Não estar bem de saúde. "I'm feeling under the weather today."

**BEAT AROUND THE BUSH** - Fazer rodeios
Evitar falar diretamente. "Stop beating around the bush!"

**ONCE IN A BLUE MOON** - Muito raramente
"I only eat fast food once in a blue moon."

**THE BALL IS IN YOUR COURT** - A bola está com você
É sua vez de agir. "I've made my offer — the ball is in your court."

**LET THE CAT OUT OF THE BAG** - Deixar escapar um segredo
"Who let the cat out of the bag about the party?"

**KILL TWO BIRDS WITH ONE STONE** - Matar dois coelhos com uma cajadada
Resolver dois problemas com uma ação.

**WHEN PIGS FLY** - Quando as galinhas tiverem dentes
Algo que nunca vai acontecer.

**BREAK A LEG** - Boa sorte!
Desejo de boa sorte (especialmente em teatro).

**IT'S RAINING CATS AND DOGS** - Está chovendo canivetes
Está chovendo muito forte.`,
        },
      ],
      keyTopics: [
        "Break the Ice",
        "Piece of Cake",
        "Hit the Nail on the Head",
        "Cost an Arm and a Leg",
        "Under the Weather",
        "Beat Around the Bush",
        "Once in a Blue Moon",
        "The Ball is in Your Court",
        "Let the Cat Out of the Bag",
        "Kill Two Birds with One Stone",
        "When Pigs Fly",
        "Break a Leg",
      ],
    },

    "Gramática Fundamental": {
      title: "Gramática Fundamental",
      introduction:
        "Dicionário de termos e estruturas gramaticais essenciais do inglês. Classes de palavras e estrutura frasal.",
      sections: [
        {
          heading: "📚 Classes de Palavras",
          content: `**NOUN** /naʊn/ - Substantivo
Nomeia pessoas, lugares, coisas, ideias. Tipos: common, proper, abstract, collective.
Plural: +s/es (cats, boxes); irregulares: man→men, child→children

**PRONOUN** /ˈprəʊnaʊn/ - Pronome
Substitui substantivos. Subject: I, you, he, she, it, we, they
Object: me, you, him, her, it, us, them | Possessive: mine, yours, his, hers

**VERB** /vɜːb/ - Verbo
Expressa ação ou estado. Tipos: action (run), state (be), auxiliary (do, have), modal (can, must)

**ADJECTIVE** /ˈædʒɪktɪv/ - Adjetivo
Descreve substantivos. Posição: ANTES do substantivo! "A beautiful day"
Ordem: Opinion→Size→Age→Shape→Color→Origin→Material

**ADVERB** /ˈædvɜːb/ - Advérbio
Modifica verbos, adjetivos, outros advérbios. Formação: +ly (quick→quickly)
Tipos: manner, time, place, frequency`,
        },
        {
          heading: "📚 Estrutura e Sintaxe",
          content: `**PREPOSITION** - Preposição
Tempo: IN (meses/anos), ON (dias/datas), AT (horas)
Lugar: in the room, on the table, at school

**ARTICLE** - Artigo
Definite: THE (específico) | Indefinite: A/AN (geral)
A + som consoante | AN + som vogal (an hour, a university)

**CONJUNCTION** - Conjunção
Coordinating (FANBOYS): For, And, Nor, But, Or, Yet, So
Subordinating: because, although, when, if, while

**SENTENCE STRUCTURE** - Estrutura Frasal
Ordem padrão: Subject + Verb + Object (SVO)
Simple: "She runs" | Compound: "She runs and he walks"

**SINGULAR vs PLURAL**
+s (cats), +es (boxes), y→ies (cities), f→ves (lives)
Irregulares: man/men, woman/women, child/children, tooth/teeth`,
        },
      ],
      keyTopics: [
        "Noun",
        "Pronoun",
        "Verb",
        "Adjective",
        "Adverb",
        "Preposition",
        "Article",
        "Conjunction",
        "Subject e Object",
        "Sentence Structure",
        "Singular e Plural",
      ],
    },

    "Phrasal Verbs": {
      title: "Phrasal Verbs",
      introduction:
        "Dicionário de phrasal verbs essenciais com significados e exemplos. Verbos compostos fundamentais do inglês.",
      sections: [
        {
          heading: "🔄 Phrasal Verbs Essenciais",
          content: `**GET UP** - Levantar-se. "I get up at 7 AM."

**GIVE UP** (separável) - Desistir. "Don't give up!" / "He gave it up."

**LOOK FOR** (inseparável) - Procurar. "I'm looking for my keys."

**TURN ON/OFF** (separável) - Ligar/Desligar. "Turn it on."

**FIND OUT** (separável) - Descobrir. "I found out the truth."

**LOOK AFTER** (inseparável) - Cuidar de. "Look after my dog."

**RUN OUT OF** - Ficar sem. "We ran out of milk."

**PUT OFF** (separável) - Adiar. "Don't put it off!"

**COME UP WITH** - Ter uma ideia. "She came up with a solution."

**FIGURE OUT** (separável) - Entender/Resolver. "I can't figure it out."

**PICK UP** (separável) - Pegar/Buscar/Aprender. "I'll pick you up at 8."

**BREAK DOWN** - Quebrar/Ter colapso. "My car broke down."

**TAKE OFF** - Tirar(roupa)/Decolar. "Take off your shoes."`,
        },
        {
          heading: "📋 Separáveis vs Inseparáveis",
          content: `**SEPARÁVEIS:** Objeto pode ir no meio
• "Turn off the light" OU "Turn the light off"
• Com pronomes DEVE separar: "Turn IT off" (nunca "turn off it")

**INSEPARÁVEIS:** Objeto sempre depois
• "Look FOR the keys" (nunca "look the keys for")
• "Look AFTER the children" (nunca "look the children after")`,
        },
      ],
      keyTopics: [
        "Get Up",
        "Give Up",
        "Look For / Look After",
        "Turn On / Turn Off",
        "Find Out / Figure Out",
        "Run Out Of",
        "Put Off",
        "Come Up With",
        "Pick Up",
        "Break Down",
        "Take Off",
        "Separáveis vs Inseparáveis",
      ],
    },

    "Preposições e Conectivos": {
      title: "Preposições e Conectivos",
      introduction:
        "Dicionário de preposições e conectivos com regras de uso. Domine IN/ON/AT e conjunções essenciais.",
      sections: [
        {
          heading: "📍 Preposições de Tempo e Lugar",
          content: `**IN** - Dentro / Períodos maiores
• Lugar: in the room, in Brazil, in Europe
• Tempo: in January, in 2024, in summer, in the morning
• Exceção: AT night (não "in the night")

**ON** - Superfície / Dias específicos
• Lugar: on the table, on Main Street, on the bus
• Tempo: on Monday, on July 4th, on Christmas Day

**AT** - Ponto específico
• Lugar: at school, at work, at home, at the airport
• Tempo: at 3 o'clock, at noon, at midnight, AT night

**TO/FROM** - Direção/Origem
• "I'm going TO school" / "I'm FROM Brazil"
• Atenção: "I'm going home" (sem TO)

**FOR/SINCE** - Duração vs Ponto inicial
• FOR + duração: "for 5 years"
• SINCE + ponto: "since 2020" (sempre com Present Perfect)

**BY/UNTIL** - Prazo vs Duração
• BY = até no máximo: "Finish BY Friday"
• UNTIL = continuamente até: "Wait UNTIL Friday"`,
        },
        {
          heading: "🔗 Conjunções e Conectivos",
          content: `**AND** - Adição. "Coffee and tea"
**BUT** - Contraste. "I tried, but I failed."
**OR** - Alternativa. "Coffee or tea?"

**BECAUSE** - Causa. "I stayed home because it rained."
**BECAUSE OF** + noun: "because of the rain"

**ALTHOUGH/THOUGH** - Concessão. "Although it rained, we went out."

**IF** - Condição. "If you study, you'll pass."
**WHETHER** - Escolha entre duas opções. "whether to go or stay"

**HOWEVER** - Contraste (formal). "However, I was tired."
**THEREFORE** - Conclusão. "Therefore, he stayed home."`,
        },
      ],
      keyTopics: [
        "In / On / At (lugar)",
        "In / On / At (tempo)",
        "To / From",
        "For / Since",
        "By / Until",
        "And / But / Or",
        "Because",
        "Although / Though",
        "If / Whether",
        "However / Therefore",
      ],
    },

    "Pronúncia e Fonética": {
      title: "Pronúncia e Fonética",
      introduction:
        "Dicionário de sons e regras de pronúncia do inglês. Sons vocálicos, TH, acentuação e fala conectada.",
      sections: [
        {
          heading: "🔊 Sons Vocálicos e Consoantes",
          content: `**VOGAIS CURTAS:** /ɪ/ bit, /e/ bed, /æ/ cat, /ʌ/ cup, /ʊ/ book
**VOGAIS LONGAS:** /iː/ see, /ɑː/ car, /ɔː/ door, /uː/ food, /ɜː/ bird

**DITONGOS:** /eɪ/ day, /aɪ/ my, /ɔɪ/ boy, /aʊ/ now, /əʊ/ go

**TH SOUNDS (língua entre os dentes!):**
• /θ/ surdo: think, three, bath, thank
• /ð/ sonoro: this, that, the, mother
Erro comum: pronunciar como /f/, /d/ ou /t/

**LETRAS MUDAS:**
• K antes de N: know, knight, knee
• W antes de R: write, wrong, wrap
• B após M: climb, dumb, doubt
• GH: night, thought, light
• H: hour, honest`,
        },
        {
          heading: "🔊 Acentuação e Entonação",
          content: `**WORD STRESS - Acentuação:**
• Substantivo 2 sílabas: 1ª sílaba (REcord, TAble)
• Verbo 2 sílabas: 2ª sílaba (reCORD, preSENT)
• Sufixos -tion/-ic: sílaba anterior (inforMAtion, ecoNOmic)

**SENTENCE STRESS:**
Acentuadas: substantivos, verbos, adjetivos, advérbios
Não acentuadas: artigos, preposições, pronomes

**CONNECTED SPEECH - Fala rápida:**
• Linking: "an apple" → "an_apple"
• Reduction: "want to" → "wanna", "going to" → "gonna"

**INTONATION:**
• Rising ↗️: Yes/No questions, interesse
• Falling ↘️: Statements, WH-questions, comandos

**SCHWA /ə/ - Som mais comum:**
about, sofa, mother, police (sílabas não acentuadas)`,
        },
      ],
      keyTopics: [
        "Vowel Sounds",
        "Diphthongs",
        "TH Sounds",
        "Silent Letters",
        "Word Stress",
        "Sentence Stress",
        "Connected Speech",
        "Intonation",
        "Minimal Pairs",
        "Schwa",
      ],
    },

    "Tempos Verbais": {
      title: "Tempos Verbais",
      introduction:
        "Guia completo dos tempos verbais em inglês. Estrutura, usos e exemplos de cada tempo.",
      sections: [
        {
          heading: "⏰ Present Tenses",
          content: `**SIMPLE PRESENT:** Subject + verb (he/she +s)
• Hábitos: "I wake up at 7 AM every day."
• Fatos: "Water boils at 100°C."
• Horários: "The train leaves at 8 PM."

**PRESENT CONTINUOUS:** am/is/are + verbing
• Agora: "I am studying right now."
• Temporário: "She is living in Paris this year."
• Planos: "We are meeting tomorrow."

**PRESENT PERFECT:** have/has + past participle
• Experiências: "I have visited Japan."
• Recente: "She has just arrived."
• Expressões: ever, never, just, already, yet`,
        },
        {
          heading: "⏰ Past Tenses",
          content: `**SIMPLE PAST:** verb-ed / 2nd form
• "I visited Paris last year."
• Irregulares: go→went, see→saw, have→had, make→made

**PAST CONTINUOUS:** was/were + verbing
• Em progresso: "I was sleeping at midnight."
• Background: "I was walking when it started to rain."

**PAST PERFECT:** had + past participle
• Antes de outro passado: "When I arrived, the movie had started."
• Expressões: before, after, by the time`,
        },
        {
          heading: "⏰ Future Tenses",
          content: `**SIMPLE FUTURE - WILL:** Subject + will + verb
• Decisões espontâneas: "I'll help you."
• Previsões: "It will rain tomorrow."
• Promessas: "I won't tell anyone."

**GOING TO:** am/is/are + going to + verb
• Planos: "I'm going to study medicine."
• Evidência: "Look at the clouds — it's going to rain."

**FUTURE CONTINUOUS:** will be + verbing
• "This time tomorrow, I will be flying to London."

**FUTURE PERFECT:** will have + past participle
• "By next year, I will have graduated."`,
        },
      ],
      keyTopics: [
        "Simple Present",
        "Present Continuous",
        "Simple Past",
        "Past Continuous",
        "Present Perfect",
        "Present Perfect Continuous",
        "Simple Future (will / going to)",
        "Future Continuous",
        "Future Perfect",
        "Past Perfect",
      ],
    },

    "Vocabulário Essencial": {
      title: "Vocabulário Essencial",
      introduction:
        "Dicionário de vocabulário fundamental em inglês. Cumprimentos, expressões, verbos e falsos cognatos.",
      sections: [
        {
          heading: "📝 Cumprimentos e Expressões",
          content: `**GREETINGS:** Good morning/afternoon/evening | Hi, Hey, What's up?
**FAREWELLS:** Goodbye, Bye, See you!, Take care!

**POLITE EXPRESSIONS:**
• Please, Thank you, You're welcome
• Excuse me, Sorry, No problem
• Could you...? Would you mind...?

**QUESTION WORDS:**
What (o que) | Who (quem) | Where (onde) | When (quando)
Why (por que) | How (como) | Which (qual) | Whose (de quem)`,
        },
        {
          heading: "📝 Tempo e Frequência",
          content: `**TIME EXPRESSIONS:**
• Presente: now, today, currently
• Passado: yesterday, last week, ago
• Futuro: tomorrow, next week, soon

**FREQUENCY ADVERBS (posição antes do verbo):**
always (100%) → usually (80%) → often (70%)
sometimes (50%) → rarely (10%) → never (0%)`,
        },
        {
          heading: "📝 Verbos e Adjetivos",
          content: `**COMMON IRREGULAR VERBS:**
be→was/were→been | have→had→had | go→went→gone
see→saw→seen | make→made→made | take→took→taken
know→knew→known | think→thought→thought

**ADJECTIVE OPPOSITES:**
big×small | hot×cold | good×bad | fast×slow
happy×sad | old×new | easy×difficult | expensive×cheap`,
        },
        {
          heading: "📝 Falsos Cognatos (CUIDADO!)",
          content: `**actually** ≠ atualmente → = na verdade (currently = atualmente)
**pretend** ≠ pretender → = fingir (intend = pretender)
**push** ≠ puxar → = empurrar (pull = puxar)
**library** ≠ livraria → = biblioteca (bookstore = livraria)
**sensible** ≠ sensível → = sensato (sensitive = sensível)
**parents** ≠ parentes → = pais (relatives = parentes)
**attend** ≠ atender → = comparecer (answer = atender)`,
        },
      ],
      keyTopics: [
        "Greetings & Farewells",
        "Polite Expressions",
        "Question Words",
        "Time Expressions",
        "Frequency Adverbs",
        "Basic Adjectives",
        "Common Verbs",
        "Numbers",
        "False Cognates",
        "Useful Phrases",
      ],
    },
  },

  "sistemas-operacionais": {
    "Linux — Comandos Básicos do Terminal": {
      title: "Comandos Básicos do Terminal",
      introduction:
        "O terminal Linux é a interface de linha de comando que dá acesso direto ao poder do sistema operacional. Diferente de interfaces gráficas, o terminal permite automação, acesso remoto (SSH) e controle granular sobre o sistema. Dominar os comandos básicos é o primeiro passo para administração de servidores, DevOps e qualquer carreira em infraestrutura de TI.",
      sections: [
        {
          heading: "🧭 Navegação e Exploração",
          content: `**Comandos essenciais de navegação:**

\`pwd\` → mostra o diretório atual (print working directory)
\`ls\` → lista arquivos e diretórios (\`-la\` mostra ocultos + detalhes)
\`cd\` → muda de diretório (\`cd ~\` = home, \`cd -\` = anterior)
\`tree\` → visualiza estrutura de diretórios em árvore

**Caminhos:** absolutos começam com \`/\` (ex: \`/home/user\`), relativos partem do diretório atual (\`./docs\`, \`../\`).

**Curingas (wildcards):** \`*\` = qualquer sequência, \`?\` = um caractere, \`[abc]\` = a, b ou c.`,
        },
        {
          heading: "📁 Manipulação de Arquivos",
          content: `**Criar, copiar, mover e remover:**

\`touch arquivo.txt\` → cria arquivo vazio
\`mkdir -p pasta/sub\` → cria diretórios (com -p cria pais)
\`cp -r origem destino\` → copia (-r para diretórios)
\`mv origem destino\` → move ou renomeia
\`rm -rf pasta\` → remove recursivamente (⚠️ sem confirmação!)

**Visualizar conteúdo:**
\`cat\` → exibe tudo | \`less\` → paginado | \`head -n 20\` → primeiras linhas
\`tail -f log.txt\` → acompanha em tempo real (ideal para logs)

**Buscar:** \`find / -name "*.conf"\` encontra arquivos; \`grep -r "padrão" /etc\` busca conteúdo dentro de arquivos.`,
        },
        {
          heading: "🔗 Redirecionamento e Pipes",
          content: `**Redirecionamento de I/O:**

\`comando > arquivo\` → redireciona saída (sobrescreve)
\`comando >> arquivo\` → redireciona saída (acrescenta)
\`comando 2> erros.log\` → redireciona erros (stderr)
\`comando &> tudo.log\` → redireciona stdout + stderr

**Pipes (\`|\`)** conectam a saída de um comando à entrada de outro:
\`cat /var/log/syslog | grep "error" | wc -l\` → conta linhas com "error"

**Comandos de filtro:** \`sort\`, \`uniq\`, \`cut\`, \`awk\`, \`sed\` — formam o toolkit de processamento de texto no terminal.`,
        },
      ],
      keyTopics: [
        "pwd, ls, cd",
        "cp, mv, rm, mkdir",
        "cat, less, head, tail",
        "find e grep",
        "Pipes e Redirecionamento",
        "Wildcards",
        "man e --help",
        "Caminhos Absolutos vs Relativos",
      ],
    },

    "Linux — Gerenciamento de Arquivos e Permissões": {
      title: "Gerenciamento de Arquivos e Permissões",
      introduction:
        "O sistema de permissões do Linux é um pilar fundamental de segurança. Cada arquivo e diretório possui um dono (owner), um grupo e permissões para leitura (r), escrita (w) e execução (x). Entender esse modelo é essencial para administração segura de servidores, controle de acesso e hardening de sistemas.",
      sections: [
        {
          heading: "🔐 Modelo de Permissões Unix",
          content: `**Três categorias de acesso:** owner (u) | group (g) | others (o)
**Três tipos de permissão:** read (r=4) | write (w=2) | execute (x=1)

Exemplo: \`-rwxr-xr--\` = owner (rwx=7), group (r-x=5), others (r--=4) → **754**

**Comandos:**
\`chmod 755 script.sh\` → define permissões numéricas
\`chmod u+x,g-w arquivo\` → modo simbólico
\`chown user:group arquivo\` → muda dono e grupo
\`chgrp devs projeto/\` → muda apenas o grupo

**Permissões em diretórios:** r = listar conteúdo, w = criar/deletar arquivos, x = acessar (entrar no diretório).`,
        },
        {
          heading: "⚡ Permissões Especiais",
          content: `**SUID (Set User ID) — 4xxx:**
Arquivo executa com as permissões do dono, não de quem executou.
Ex: \`/usr/bin/passwd\` tem SUID para alterar \`/etc/shadow\`.
\`chmod u+s programa\` ou \`chmod 4755 programa\`

**SGID (Set Group ID) — 2xxx:**
Em arquivos: executa com grupo do dono. Em diretórios: novos arquivos herdam o grupo do diretório (ideal para pastas compartilhadas).

**Sticky Bit — 1xxx:**
Em diretórios: apenas o dono pode deletar seus próprios arquivos.
Exemplo clássico: \`/tmp\` tem sticky bit (\`drwxrwxrwt\`).
\`chmod +t /shared\` ou \`chmod 1777 /shared\``,
        },
        {
          heading: "📋 ACLs e umask",
          content: `**ACLs (Access Control Lists)** — permissões granulares além do modelo Unix:
\`setfacl -m u:joao:rwx projeto/\` → permissão específica para um usuário
\`getfacl projeto/\` → visualiza ACLs
\`setfacl -m g:devs:rx projeto/\` → permissão para grupo específico
\`setfacl -d -m g:devs:rwx projeto/\` → ACL padrão para novos arquivos

**umask** define permissões padrão de novos arquivos:
umask 022 → arquivos criados com 644, diretórios com 755
umask 077 → arquivos com 600, diretórios com 700 (mais restritivo)
Configurado em \`/etc/profile\` ou \`~/.bashrc\`.`,
        },
      ],
      keyTopics: [
        "chmod e Notação Octal",
        "chown e chgrp",
        "SUID, SGID, Sticky Bit",
        "ACLs (setfacl / getfacl)",
        "umask",
        "Permissões em Diretórios",
        "Links Simbólicos e Hard Links",
        "Sistemas de Arquivos (ext4, xfs)",
      ],
    },

    "Linux — Gerenciamento de Processos": {
      title: "Gerenciamento de Processos",
      introduction:
        "Um processo é uma instância de um programa em execução no Linux. O kernel gerencia processos com PIDs únicos, hierarquia pai-filho, prioridades e sinais. Entender processos é fundamental para diagnosticar problemas de performance, gerenciar recursos do servidor e manter serviços funcionando de forma estável.",
      sections: [
        {
          heading: "📊 Monitoramento de Processos",
          content: `**Comandos de visualização:**

\`ps aux\` → lista todos os processos (snapshot estático)
\`top\` → monitor interativo em tempo real (CPU, memória)
\`htop\` → versão aprimorada do top (com cores e interação)
\`pstree\` → exibe hierarquia de processos em árvore

**Colunas importantes do \`ps\`:**
PID = ID do processo | PPID = ID do processo pai
%CPU / %MEM = uso de recursos
STAT: S (sleeping), R (running), Z (zombie), D (uninterruptible)
TIME = tempo total de CPU consumido

\`ps aux --sort=-%mem | head\` → top 10 por uso de memória`,
        },
        {
          heading: "🎯 Controle de Processos",
          content: `**Foreground vs Background:**
\`comando &\` → executa em background
\`Ctrl+Z\` → suspende processo | \`bg\` → continua em background
\`fg\` → traz de volta ao foreground | \`jobs\` → lista processos do shell

**Sinais (signals):**
\`kill PID\` → envia SIGTERM (15) — encerramento gracioso
\`kill -9 PID\` → SIGKILL — força encerramento (último recurso!)
\`kill -HUP PID\` → SIGHUP — recarrega configuração
\`killall nome\` → mata por nome | \`pkill -f padrao\` → mata por padrão

**Prioridade (nice):**
Valores de -20 (máxima) a 19 (mínima). Padrão = 0.
\`nice -n 10 comando\` → inicia com prioridade baixa
\`renice -5 -p PID\` → altera prioridade de processo existente`,
        },
        {
          heading: "🔧 Serviços e systemd",
          content: `**systemd** é o sistema de init padrão nas distros modernas:

\`systemctl start nginx\` → inicia serviço
\`systemctl stop nginx\` → para serviço
\`systemctl restart nginx\` → reinicia
\`systemctl enable nginx\` → habilita no boot
\`systemctl status nginx\` → verifica estado detalhado

**Journald (logs do sistema):**
\`journalctl -u nginx\` → logs de um serviço
\`journalctl -f\` → segue logs em tempo real
\`journalctl --since "1 hour ago"\` → filtra por tempo

**Daemons** são processos em background sem terminal associado. Nomes tipicamente terminam com \`d\` (sshd, httpd, crond).`,
        },
      ],
      keyTopics: [
        "ps, top, htop",
        "kill e Sinais (SIGTERM, SIGKILL)",
        "Foreground vs Background",
        "nice e renice",
        "systemctl e systemd",
        "journalctl",
        "Processos Zombie e Orphan",
        "cron e crontab",
      ],
    },

    "Linux — Gerenciamento de Usuários e Grupos": {
      title: "Gerenciamento de Usuários e Grupos",
      introduction:
        "A administração de usuários e grupos é a base do controle de acesso no Linux. Cada usuário possui um UID, pertence a pelo menos um grupo e tem um diretório home. Arquivos como /etc/passwd, /etc/shadow e /etc/group controlam identidades e credenciais. Gerenciar corretamente usuários e grupos é essencial para segurança e organização de servidores multi-usuário.",
      sections: [
        {
          heading: "👤 Gerenciamento de Usuários",
          content: `**Criar e modificar usuários:**

\`useradd -m -s /bin/bash joao\` → cria usuário com home e shell
\`passwd joao\` → define/altera senha
\`usermod -aG sudo joao\` → adiciona ao grupo sudo (-a = append!)
\`userdel -r joao\` → remove usuário e seu home

**Arquivos de configuração:**
\`/etc/passwd\` → info do usuário (UID, GID, shell, home)
\`/etc/shadow\` → senhas criptografadas + políticas de expiração
\`/etc/skel/\` → template para novos diretórios home

**Comandos úteis:**
\`whoami\` → usuário atual | \`id\` → UID, GID e grupos
\`su - user\` → troca de usuário (com ambiente)
\`sudo comando\` → executa como root (configurado em \`/etc/sudoers\`)`,
        },
        {
          heading: "👥 Gerenciamento de Grupos",
          content: `**Criar e administrar grupos:**

\`groupadd devs\` → cria grupo
\`groupmod -n developers devs\` → renomeia grupo
\`groupdel devs\` → remove grupo
\`gpasswd -a joao devs\` → adiciona usuário ao grupo
\`gpasswd -d joao devs\` → remove usuário do grupo

**Arquivo \`/etc/group\`:** lista grupos, GIDs e membros.
Cada usuário tem um grupo primário (GID no \`/etc/passwd\`) e pode ter múltiplos grupos secundários.

**Verificar:** \`groups joao\` ou \`id joao\` mostra todos os grupos.
⚠️ Mudanças de grupo só valem no próximo login (use \`newgrp\` para aplicar imediatamente).`,
        },
        {
          heading: "🔑 Políticas de Senha e Segurança",
          content: `**Configuração de políticas com \`chage\`:**

\`chage -M 90 joao\` → senha expira em 90 dias
\`chage -m 7 joao\` → mínimo 7 dias entre trocas
\`chage -W 14 joao\` → avisa 14 dias antes de expirar
\`chage -l joao\` → lista políticas do usuário

**PAM (Pluggable Authentication Modules):**
Configura regras de autenticação em \`/etc/pam.d/\`.
Módulos úteis: \`pam_pwquality\` (complexidade de senha), \`pam_faillock\` (bloqueio após tentativas falhas).

**Boas práticas:**
• Desabilitar login root via SSH (\`PermitRootLogin no\`)
• Usar chaves SSH em vez de senhas
• Configurar \`sudo\` com privilégios mínimos necessários
• Auditar contas inativas regularmente`,
        },
      ],
      keyTopics: [
        "useradd, usermod, userdel",
        "groupadd e gpasswd",
        "/etc/passwd e /etc/shadow",
        "sudo e /etc/sudoers",
        "Políticas de Senha (chage)",
        "PAM",
        "UID e GID",
        "su vs sudo",
      ],
    },

    "Linux — Shell Script e Automação": {
      title: "Shell Script e Automação",
      introduction:
        "Shell scripting é a arte de automatizar tarefas no Linux combinando comandos em scripts executáveis. Com Bash (Bourne Again Shell), você pode criar desde backups automatizados até pipelines de deploy complexos. É a habilidade que separa um usuário Linux de um administrador eficiente — qualquer tarefa repetitiva pode (e deve) ser automatizada.",
      sections: [
        {
          heading: "📝 Fundamentos de Shell Script",
          content: `**Estrutura básica de um script Bash:**

\`\`\`bash
#!/bin/bash
# Shebang (primeira linha) indica o interpretador

NOME="Mundo"              # Variável (sem espaços no =)
echo "Olá, \${NOME}!"      # Interpolação com \${}
readonly PI=3.14           # Constante (não pode alterar)
\`\`\`

**Variáveis especiais:**
\`$0\` = nome do script | \`$1, $2...\` = argumentos
\`$#\` = número de argumentos | \`$?\` = exit code do último comando
\`$@\` = todos os argumentos | \`$$\` = PID do script

**Tornar executável:** \`chmod +x script.sh\` e executar com \`./script.sh\``,
        },
        {
          heading: "🔀 Estruturas de Controle",
          content: `**Condicionais:**
\`\`\`bash
if [[ -f "/etc/hosts" ]]; then
    echo "Arquivo existe"
elif [[ -d "/tmp" ]]; then
    echo "É um diretório"
else
    echo "Não encontrado"
fi
\`\`\`

**Testes:** \`-f\` (arquivo), \`-d\` (diretório), \`-z\` (string vazia), \`-eq\` (igual numérico), \`==\` (igual string)

**Loops:**
\`\`\`bash
for file in *.log; do
    gzip "\$file"        # Compacta cada arquivo .log
done

while read -r linha; do
    echo "\$linha"
done < arquivo.txt   # Lê arquivo linha por linha
\`\`\`

**Case:** ideal para menus e múltiplas opções (similar a switch).`,
        },
        {
          heading: "⚙️ Automação com cron",
          content: `**crontab** agenda tarefas periódicas:

\`crontab -e\` → edita tarefas do usuário atual
\`crontab -l\` → lista tarefas agendadas

**Formato:** \`minuto hora dia mês dia_semana comando\`
\`0 2 * * * /backup.sh\` → diariamente às 2h
\`*/5 * * * * /monitor.sh\` → a cada 5 minutos
\`0 0 * * 0 /weekly.sh\` → domingo à meia-noite

**Boas práticas de scripts:**
• Sempre use \`set -euo pipefail\` (falha rápido em erros)
• Redirecione saída para logs: \`>> /var/log/script.log 2>&1\`
• Use \`trap\` para cleanup em caso de erro
• Valide inputs e use \`exit 1\` para erros com mensagem clara
• Teste com \`bash -x script.sh\` (modo debug)`,
        },
      ],
      keyTopics: [
        "Shebang e Variáveis",
        "if/elif/else e case",
        "for, while e until",
        "Variáveis Especiais ($?, $@)",
        "cron e crontab",
        "set -euo pipefail",
        "Funções em Bash",
        "sed e awk",
        "trap para Cleanup",
      ],
    },

    "Windows Server — Active Directory": {
      title: "Active Directory",
      introduction:
        "O Active Directory Domain Services (AD DS) é o serviço de diretório da Microsoft que centraliza a administração de identidades, autenticação e recursos em redes corporativas. Com autenticação via Kerberos, políticas de grupo (GPO) e estrutura hierárquica (floresta → domínio → OU), o AD é a espinha dorsal de praticamente toda infraestrutura Windows enterprise.",
      sections: [
        {
          heading: "🏗️ Estrutura Lógica do AD",
          content: `**Hierarquia do Active Directory:**

**Floresta (Forest)** → fronteira máxima de segurança e replicação
  └─ **Árvore (Tree)** → domínios com namespace DNS contíguo
       └─ **Domínio (Domain)** → unidade administrativa básica
            └─ **OU (Organizational Unit)** → container organizacional

**Objetos principais:**
• **Usuários** → contas com atributos (nome, email, departamento)
• **Grupos** → Security Groups (ACLs) e Distribution Groups (email)
• **Computadores** → machines ingressadas no domínio
• **GPOs** → políticas aplicadas a OUs, domínios ou sites

**Domain Controller (DC):** servidor que hospeda o AD, autentica usuários e replica dados. Mínimo recomendado: 2 DCs por domínio.`,
        },
        {
          heading: "🔑 Autenticação e Protocolos",
          content: `**Kerberos** (padrão no AD):
1. Usuário autentica no KDC (Key Distribution Center)
2. Recebe TGT (Ticket-Granting Ticket)
3. TGT solicita ticket de serviço para cada recurso
4. Ticket de serviço autentica no servidor de destino
→ Senha NUNCA trafega pela rede!

**LDAP** (Lightweight Directory Access Protocol):
Protocolo de consulta ao diretório. Porta 389 (LDAP) / 636 (LDAPS).
Base DN: \`DC=empresa,DC=com\`
Filtros: \`(&(objectClass=user)(department=TI))\`

**NTLM:** protocolo legado, menos seguro que Kerberos. Usado como fallback quando Kerberos não é possível (ex: acesso por IP em vez de hostname).`,
        },
        {
          heading: "🔄 Replicação e Sites",
          content: `**Replicação multi-master:** todo DC pode receber alterações.
**FSMO Roles** (operações de mestre único):
• **Schema Master** → modifica schema do AD (1/floresta)
• **Domain Naming Master** → adiciona/remove domínios (1/floresta)
• **PDC Emulator** → sincronismo de hora, senha (1/domínio)
• **RID Master** → distribui blocos de RIDs para SIDs (1/domínio)
• **Infrastructure Master** → referências entre domínios (1/domínio)

**Sites do AD:** representam topologia física da rede.
Replicação intra-site: automática, rápida (15 segundos).
Replicação inter-site: agendada, usa links de site com custo para otimizar banda WAN.`,
        },
      ],
      keyTopics: [
        "Floresta, Árvore e Domínio",
        "OU e Objetos do AD",
        "Domain Controllers",
        "Kerberos e LDAP",
        "FSMO Roles",
        "Replicação e Sites",
        "Relações de Confiança (Trusts)",
        "DNS integrado ao AD",
      ],
    },

    "Windows Server — Serviços de Rede": {
      title: "Serviços de Rede",
      introduction:
        "O Windows Server oferece uma suíte completa de serviços de rede que formam a infraestrutura essencial de ambientes corporativos. DNS, DHCP, IIS, WSUS, File Server e Print Server — cada um desempenha um papel vital na conectividade, resolução de nomes, distribuição de configurações e disponibilização de recursos compartilhados na rede.",
      sections: [
        {
          heading: "🌐 DNS no Windows Server",
          content: `**DNS integrado ao Active Directory** — replicação automática entre DCs:

**Zonas DNS:**
• **Zona de pesquisa direta** → nome → IP (A/AAAA)
• **Zona de pesquisa inversa** → IP → nome (PTR)
• **Integrada ao AD** → armazenada no AD, replicação segura
• **Zona stub** → aponta para servidores autoritativos

**Registros essenciais:**
A (IPv4) | AAAA (IPv6) | CNAME (alias) | MX (email) | SRV (serviços)
**SRV records do AD:** \`_ldap._tcp.dc._msdcs.dominio.com\` — DCs registram serviços automaticamente.

**DNS Scavenging:** limpeza automática de registros obsoletos (stale records). Configure aging + scavenging para manter a zona saudável.`,
        },
        {
          heading: "📡 DHCP e IPAM",
          content: `**DHCP** distribui configurações IP automaticamente:

**Processo DORA:**
**D**iscover → cliente envia broadcast procurando servidor
**O**ffer → servidor oferece IP disponível
**R**equest → cliente aceita a oferta
**A**ck → servidor confirma e registra a lease

**Configurações:**
• **Escopo (Scope):** range de IPs + máscara + gateway + DNS
• **Reservas:** IP fixo por MAC address (impressoras, servidores)
• **Opções:** gateway padrão (003), servidores DNS (006), domínio (015)
• **DHCP Failover:** alta disponibilidade com hot standby ou load balance

**IPAM (IP Address Management):** gerenciamento centralizado de espaços IP, integrado com DNS e DHCP do Windows Server.`,
        },
        {
          heading: "🖥️ IIS, File Server e WSUS",
          content: `**IIS (Internet Information Services):**
Servidor web da Microsoft. Hospeda sites, APIs e aplicações ASP.NET.
Application Pools isolam processos. Bindings configuram IP/porta/hostname.

**File Server:**
• **Compartilhamentos (SMB):** \`\\\\server\\share\` com permissões NTFS + Share
• **DFS (Distributed File System):** namespace unificado + replicação entre servidores
• **FSRM:** cotas, triagem de arquivos e relatórios de armazenamento
• **Shadow Copies (VSS):** snapshots de versões anteriores de arquivos

**WSUS (Windows Server Update Services):**
Gerencia distribuição de atualizações Microsoft na rede.
Centraliza aprovações, agenda instalações e reporta compliance.
Reduz banda WAN — downloads feitos uma vez do Microsoft Update.`,
        },
      ],
      keyTopics: [
        "DNS Integrado ao AD",
        "DHCP e Processo DORA",
        "DHCP Failover",
        "IIS e Application Pools",
        "Compartilhamentos SMB",
        "DFS e Replicação",
        "WSUS",
        "IPAM",
      ],
    },

    "Windows Server — Hyper-V": {
      title: "Hyper-V",
      introduction:
        "Hyper-V é o hypervisor nativo da Microsoft para virtualização de servidores. Como hypervisor Type-1 (bare-metal), ele roda diretamente sobre o hardware, oferecendo performance próxima ao nativo. Permite consolidação de servidores, ambientes de teste isolados, alta disponibilidade e disaster recovery — pilares da infraestrutura moderna.",
      sections: [
        {
          heading: "⚙️ Arquitetura e Tipos de Hypervisor",
          content: `**Hyper-V é Type-1 (bare-metal):**
Roda diretamente no hardware, sem SO host intermediário.
A partição pai (management OS) gerencia, mas não é host — o hypervisor está abaixo.

**Type-1 vs Type-2:**
• **Type-1:** Hyper-V, VMware ESXi, KVM → produção, melhor performance
• **Type-2:** VirtualBox, VMware Workstation → desktop, desenvolvimento

**Gerações de VMs:**
• **Gen 1:** BIOS legado, IDE boot, compatibilidade máxima
• **Gen 2:** UEFI, Secure Boot, boot via SCSI, PXE via synthetic NIC
→ Sempre use Gen 2 para Windows 8+/Server 2012+ e Linux moderno

**Requisitos:** CPU com virtualização (Intel VT-x / AMD-V), SLAT, 64 bits.`,
        },
        {
          heading: "💾 Armazenamento e Rede Virtual",
          content: `**Discos virtuais (VHD/VHDX):**
• **Dinâmico:** cresce conforme uso (economia de espaço)
• **Fixo:** alocado integralmente (melhor performance)
• **Differencing:** herda de pai, armazena apenas diferenças (snapshots)
VHDX suporta até 64 TB vs 2 TB do VHD.

**Checkpoints (Snapshots):**
• **Standard:** captura estado completo (memória + disco)
• **Production:** usa VSS/fsfreeze, consistente para aplicações (recomendado!)

**Virtual Switch:**
• **External:** conecta VMs à rede física
• **Internal:** comunicação VM ↔ host (sem rede física)
• **Private:** apenas entre VMs (isolamento total)

**NIC Teaming:** combina adaptadores para redundância e agregação de banda.`,
        },
        {
          heading: "🔄 Alta Disponibilidade e Migração",
          content: `**Live Migration:** move VM entre hosts sem downtime!
Requisitos: processadores compatíveis, rede dedicada, armazenamento compartilhado (ou SMB/Storage Migration).

**Failover Clustering:**
Cluster de Hyper-V com failover automático — se um host cai, VMs reiniciam em outro nó automaticamente.
Quorum: determina quantos nós precisam estar online.

**Hyper-V Replica:**
Replicação assíncrona de VMs para disaster recovery.
RPO configurável: 30 segundos, 5 ou 15 minutos.
Failover planejado (zero perda) ou não planejado (usa último ponto).

**Resource Metering:** monitora CPU, memória, rede e disco por VM para chargeback/showback.`,
        },
      ],
      keyTopics: [
        "Type-1 vs Type-2",
        "VMs Gen 1 vs Gen 2",
        "VHD vs VHDX",
        "Virtual Switch (External/Internal/Private)",
        "Checkpoints Standard vs Production",
        "Live Migration",
        "Failover Clustering",
        "Hyper-V Replica",
      ],
    },

    "Windows Server — GPO": {
      title: "Group Policy Objects (GPO)",
      introduction:
        "Group Policy Objects (GPOs) são o mecanismo central de gerenciamento de configurações no Active Directory. Permitem definir políticas de segurança, configurações de software, scripts de logon e restrições de desktop para milhares de máquinas e usuários de forma centralizada. Uma GPO bem estruturada transforma horas de configuração manual em regras automáticas e auditáveis.",
      sections: [
        {
          heading: "📋 Estrutura e Processamento de GPOs",
          content: `**Onde GPOs são vinculadas (linkadas):**
**Site** → **Domínio** → **OU** (ordem de processamento LSDOU)
→ Última GPO processada vence (mais próxima do objeto)!

**Partes de uma GPO:**
• **Computer Configuration:** aplica ao boot, antes do login
• **User Configuration:** aplica no logon do usuário

**Processamento:**
1. GPOs de Site (raramente usado)
2. GPOs de Domínio (Default Domain Policy)
3. GPOs de OUs pai → OUs filhas
4. **Enforcement (No Override):** impede que GPOs inferiores sobrescrevam
5. **Block Inheritance:** OU bloqueia herança (Enforcement vence!)

**Atualização:** a cada ~90 minutos + offset aleatório de 0-30 min.
Forçar: \`gpupdate /force\` no cliente.`,
        },
        {
          heading: "🔒 Políticas de Segurança",
          content: `**Políticas de senha (Default Domain Policy):**
• Comprimento mínimo, complexidade, histórico, idade máxima
• Fine-Grained Password Policies (PSOs): políticas diferentes por grupo!

**Account Lockout:** bloqueio após N tentativas, duração, reset counter.

**Audit Policy:** registra eventos de logon, acesso a objetos e alterações. Essencial para compliance e forense.

**User Rights Assignment:**
• Log on locally, Log on as a service
• Shut down the system
• Deny log on through Remote Desktop

**Restricted Groups:** força membros de grupos (ex: apenas Admins no grupo local Administrators).

**AppLocker / Software Restriction Policies:** controla quais executáveis, scripts e instaladores podem rodar.`,
        },
        {
          heading: "🛠️ Configurações e Preferences",
          content: `**Administrative Templates (ADMX):**
Configuram registry do Windows — milhares de opções!
• Desabilitar USB, configurar proxy, ocultar painel de controle
• Templates customizados para apps (Chrome, Office, etc.)

**GPO Preferences** (mais flexível que Policies):
• **Drive Maps:** mapear unidades de rede por grupo/OU
• **Printers:** instalar impressoras automaticamente
• **Scheduled Tasks:** criar tarefas agendadas remotamente
• **Registry:** modificar chaves do registro
• **Item-Level Targeting:** aplicar com condições (IP, grupo, SO)

**Diagnóstico:**
\`gpresult /r\` → GPOs aplicadas no computador/usuário
\`gpresult /h relatorio.html\` → relatório completo
RSOP (Resultant Set of Policy) no MMC → simulação visual`,
        },
      ],
      keyTopics: [
        "Processamento LSDOU",
        "Computer vs User Configuration",
        "Enforcement e Block Inheritance",
        "Políticas de Senha e Lockout",
        "Administrative Templates (ADMX)",
        "GPO Preferences",
        "gpresult e RSOP",
        "AppLocker",
        "Audit Policy",
      ],
    },

    "Windows Server — Backup e Recuperação": {
      title: "Backup e Recuperação",
      introduction:
        "Backup e recuperação são a última linha de defesa contra perda de dados — seja por falha de hardware, ransomware, erro humano ou desastre natural. O Windows Server oferece ferramentas nativas (Windows Server Backup, VSS) e integra com soluções enterprise. Um plano de backup sólido é tão importante quanto firewalls e antivírus: se tudo falhar, o backup é a salvação.",
      sections: [
        {
          heading: "📦 Estratégias de Backup",
          content: `**Tipos de backup:**
• **Full (Completo):** copia todos os dados. Base para os outros tipos.
• **Incremental:** apenas o que mudou desde o ÚLTIMO backup (qualquer tipo).
  → Restauração: precisa do full + todos os incrementais em ordem.
• **Differential:** o que mudou desde o último FULL.
  → Restauração: precisa do full + último diferencial. Mais rápido que incremental.

**Regra 3-2-1:**
**3** cópias dos dados | **2** mídias diferentes | **1** cópia offsite

**RPO vs RTO:**
• **RPO (Recovery Point Objective):** máxima perda de dados aceitável → define frequência do backup
• **RTO (Recovery Time Objective):** tempo máximo para restaurar o serviço → define o método de recovery

**Retenção:** defina por quanto tempo guardar backups (diário por 7 dias, semanal por 4 semanas, mensal por 12 meses).`,
        },
        {
          heading: "🔧 Windows Server Backup e VSS",
          content: `**Windows Server Backup (wbadmin):**
Feature nativa para backup de volumes, system state e bare-metal recovery.
\`wbadmin start backup -backupTarget:E: -include:C: -allCritical\`
Suporta agendamento, backup para disco local, compartilhamento ou Azure.

**VSS (Volume Shadow Copy Service):**
Cria snapshots point-in-time consistentes, mesmo com arquivos abertos.
**Requestor** (app de backup) → **Writer** (app garante consistência) → **Provider** (cria snapshot)

**Shadow Copies para compartilhamentos:**
Usuários restauram versões anteriores de arquivos via "Previous Versions" — sem precisar de admin!

**System State Backup:** inclui AD (em DCs), Registry, Boot files, COM+ Class Registration. Essencial para restaurar um DC.`,
        },
        {
          heading: "🔄 Disaster Recovery e AD Restore",
          content: `**Bare-Metal Recovery (BMR):**
Restaura sistema completo em hardware novo — SO, configurações, dados.
Requer backup com flag \`-allCritical\` e media de boot (USB/ISO do Windows).

**Restauração do Active Directory:**
• **Non-Authoritative:** restaura DC, depois replica as mudanças recentes de outros DCs (padrão)
• **Authoritative:** após non-authoritative, marca objetos como autoritativos com \`ntdsutil\` → eles "vencem" a replicação. Usado para restaurar objetos deletados.

**AD Recycle Bin:** recupera objetos deletados com todos os atributos, sem precisar de restore! Habilite no AD (forest functional level 2008 R2+).

**Boas práticas:**
• Teste restaurações regularmente (backup não testado = sem backup)
• Mantenha pelo menos 2 DCs — se um morre, o outro mantém o AD
• Documente o procedimento de recovery (runbook)
• Monitore alertas de falha de backup com SCOM ou scripts`,
        },
      ],
      keyTopics: [
        "Full, Incremental, Differential",
        "Regra 3-2-1",
        "RPO e RTO",
        "Windows Server Backup (wbadmin)",
        "VSS e Shadow Copies",
        "Bare-Metal Recovery",
        "AD Restore (Authoritative)",
        "AD Recycle Bin",
        "System State Backup",
      ],
    },
    "Conceitos de Sistemas Operacionais": {
      title: "Conceitos de Sistemas Operacionais",
      introduction:
        "Os conceitos fundamentais de sistemas operacionais são a base teórica que sustenta toda a computação moderna. Compreender gerenciamento de processos, memória, escalonamento de CPU, sincronização e sistemas de arquivos é essencial para qualquer profissional de TI — seja para concursos, certificações, entrevistas técnicas ou para entender profundamente como Linux e Windows funcionam por baixo dos panos.",
      sections: [
        {
          heading: "⚙️ Processos, Threads e Escalonamento",
          content:
            "Um processo é um programa em execução com seu próprio espaço de endereçamento, registradores e recursos. Threads são unidades leves de execução dentro de um processo, compartilhando memória. O escalonador de CPU decide qual processo/thread usa a CPU e por quanto tempo. Algoritmos incluem FCFS (simples, sem preempção), SJF (menor tempo médio de espera), Round Robin (quantum fixo, justo), Prioridade (pode causar starvation) e MLFQ (filas multinível com feedback, usado em SOs modernos). Conceitos como troca de contexto, estados de processo (pronto, execução, bloqueado) e PCB são fundamentais.",
        },
        {
          heading: "🧠 Gerenciamento de Memória",
          content:
            "O SO gerencia a hierarquia de memória: registradores → cache → RAM → disco. Memória virtual permite executar programas maiores que a RAM usando paginação (blocos fixos) ou segmentação (blocos lógicos variáveis). A MMU traduz endereços virtuais em físicos, acelerada pela TLB (cache de traduções). Page faults ocorrem quando uma página não está na RAM. Algoritmos de substituição (LRU, FIFO, Clock) decidem qual página remover. Thrashing acontece quando há paginação excessiva. O modelo de Working Set ajuda a preveni-lo.",
        },
        {
          heading: "🔒 Sincronização e Deadlocks",
          content:
            "Quando processos/threads compartilham recursos, surgem problemas como race conditions. Seções críticas devem garantir exclusão mútua, progresso e espera limitada. Mecanismos incluem mutex (acesso exclusivo), semáforos (contador de acessos) e monitores. Deadlocks ocorrem quando quatro condições de Coffman são satisfeitas simultaneamente: exclusão mútua, posse e espera, não preempção e espera circular. Estratégias: prevenção (negar uma condição), detecção (grafo de alocação) e recuperação. Inversão de prioridade é um problema em sistemas de tempo real.",
        },
        {
          heading: "💾 Sistemas de Arquivos e Kernel",
          content:
            "Sistemas de arquivos organizam dados em dispositivos de armazenamento. Estruturas como inodes (Unix/Linux) armazenam metadados e ponteiros para blocos. Formatos incluem ext4, NTFS, APFS e FAT32. O kernel é o núcleo do SO, operando em modo privilegiado. Arquiteturas incluem kernel monolítico (Linux — tudo no kernel, rápido mas menos isolado), microkernel (QNX — mínimo no kernel, mais estável mas overhead de IPC) e híbrido (Windows NT). O boot segue: firmware → bootloader → kernel → init/systemd → serviços.",
        },
      ],
      keyTopics: [
        "Processos e Threads",
        "Escalonamento de CPU (FCFS, SJF, Round Robin, MLFQ)",
        "Memória Virtual e Paginação",
        "TLB e MMU",
        "Page Fault e Substituição de Páginas (LRU)",
        "Deadlocks e Condições de Coffman",
        "Semáforos, Mutex e Seção Crítica",
        "Kernel Monolítico vs Microkernel",
        "Inodes e Sistemas de Arquivos",
        "Copy-on-Write e fork()",
      ],
    },
  },

  // ─── Governança de TI ──────────────────────────────────────────────────────
  "governanca-de-ti": {
    "ITIL 4 — Conceitos Fundamentais": {
      title: "ITIL 4 — Conceitos Fundamentais",
      introduction:
        "O ITIL 4 (Information Technology Infrastructure Library) é o framework mais adotado no mundo para gerenciamento de serviços de TI (ITSM). A versão 4, lançada em 2019, trouxe uma abordagem holística centrada na co-criação de valor, integrando práticas ágeis, DevOps e governança. Compreender seus conceitos fundamentais é a base para qualquer profissional que deseja atuar com eficiência na entrega e suporte de serviços de TI.",
      sections: [
        {
          heading: "📘 O que é ITIL 4?",
          content:
            "ITIL 4 é um conjunto de boas práticas para planejar, entregar e melhorar serviços de TI. Ele define conceitos-chave como **Serviço** (meio de co-criar valor entregando resultados desejados sem que o cliente gerencie riscos e custos específicos), **Valor** (benefício percebido, utilidade e garantia), **Organização**, **Consumidor de Serviço** (que engloba os papéis de Usuário, Cliente e Patrocinador) e **Provedor de Serviço**. A filosofia central gira em torno do **Sistema de Valor de Serviço (SVS)**, que descreve como todos os componentes e atividades de uma organização trabalham juntos para facilitar a criação de valor.",
        },
        {
          heading: "🔑 Princípios Orientadores",
          content:
            "O ITIL 4 estabelece 7 Princípios Orientadores que guiam todas as decisões e ações:\n\n• **Foco no Valor** — tudo deve mapear para valor ao stakeholder\n• **Comece de Onde Você Está** — avalie o estado atual antes de mudar\n• **Progrida Iterativamente com Feedback** — mudanças pequenas e mensuráveis\n• **Colabore e Promova Visibilidade** — elimine silos, compartilhe informação\n• **Pense e Trabalhe Holisticamente** — nenhum componente funciona isoladamente\n• **Mantenha Simples e Prático** — evite complexidade desnecessária\n• **Otimize e Automatize** — maximize valor dos recursos, automatize o repetitivo",
        },
        {
          heading: "⚙️ Sistema de Valor de Serviço (SVS)",
          content:
            "O SVS é o modelo central do ITIL 4, conectando: **Demanda** e **Oportunidade** como entradas; a **Cadeia de Valor de Serviço** como mecanismo operacional; **Práticas**, **Princípios Orientadores**, **Governança** e **Melhoria Contínua** como elementos de suporte; e **Valor** como saída. O SVS garante que a organização co-crie valor por meio de serviços de TI, respondendo de forma flexível a diferentes cenários de demanda.",
        },
      ],
      keyTopics: [
        "Definição de Serviço e Valor",
        "7 Princípios Orientadores",
        "Sistema de Valor de Serviço (SVS)",
        "Utilidade e Garantia",
        "Co-criação de Valor",
        "Consumidor vs Provedor de Serviço",
        "Governança no ITIL 4",
        "Oportunidade e Demanda",
      ],
    },
    "ITIL 4 — Cadeia de Valor de Serviço": {
      title: "ITIL 4 — Cadeia de Valor de Serviço",
      introduction:
        "A Cadeia de Valor de Serviço (Service Value Chain) é o elemento operacional central do SVS no ITIL 4. Ela descreve seis atividades interconectadas que transformam demanda em valor real para os stakeholders. Ao contrário de modelos lineares, a Cadeia de Valor é flexível e pode ser combinada em diferentes fluxos de valor para atender cenários variados.",
      sections: [
        {
          heading: "🔗 As 6 Atividades da Cadeia de Valor",
          content:
            "As seis atividades são:\n\n• **Planejar (Plan)** — garantir entendimento compartilhado da visão, status atual e direção de melhoria para todas as quatro dimensões e todos os produtos e serviços\n• **Melhorar (Improve)** — assegurar melhoria contínua de produtos, serviços e práticas\n• **Engajar (Engage)** — proporcionar bom entendimento das necessidades dos stakeholders, transparência e engajamento contínuo\n• **Desenhar e Transicionar (Design & Transition)** — garantir que produtos e serviços atendam continuamente às expectativas de qualidade, custo e time-to-market\n• **Obter/Construir (Obtain/Build)** — garantir que componentes de serviço estejam disponíveis quando e onde necessários e atendam às especificações\n• **Entregar e Suportar (Deliver & Support)** — garantir que serviços sejam entregues e suportados conforme especificações e expectativas dos stakeholders",
        },
        {
          heading: "🔄 Fluxos de Valor",
          content:
            "Um Fluxo de Valor é uma combinação específica de atividades da Cadeia de Valor projetada para um cenário particular. Por exemplo, o fluxo de valor para resolver um incidente pode ser: Engajar → Entregar e Suportar → Melhorar. Já o fluxo para lançar um novo serviço pode ser: Engajar → Planejar → Desenhar e Transicionar → Obter/Construir → Entregar e Suportar. A flexibilidade de combinar atividades diferencia o ITIL 4 de modelos processo-lineares anteriores.",
        },
        {
          heading: "📊 Relação com Práticas",
          content:
            "Cada atividade da Cadeia de Valor utiliza diferentes práticas do ITIL 4. Por exemplo, a atividade 'Entregar e Suportar' utiliza práticas como Gerenciamento de Incidentes, Service Desk e Gerenciamento de Problemas. A atividade 'Planejar' utiliza Gerenciamento de Portfólio e Gerenciamento de Arquitetura. Essa integração entre atividades da cadeia e práticas dá ao ITIL 4 enorme adaptabilidade.",
        },
      ],
      keyTopics: [
        "Planejar (Plan)",
        "Melhorar (Improve)",
        "Engajar (Engage)",
        "Desenhar e Transicionar (Design & Transition)",
        "Obter/Construir (Obtain/Build)",
        "Entregar e Suportar (Deliver & Support)",
        "Fluxos de Valor (Value Streams)",
        "Integração com Práticas",
      ],
    },
    "ITIL 4 — Práticas de Gerenciamento": {
      title: "ITIL 4 — Práticas de Gerenciamento",
      introduction:
        "O ITIL 4 define 34 práticas de gerenciamento (substituindo os antigos 'processos' do ITIL v3), organizadas em três grupos: Práticas de Gerenciamento Geral (14), Práticas de Gerenciamento de Serviço (17) e Práticas de Gerenciamento Técnico (3). Cada prática inclui recursos, atividades e informações necessárias para lidar com um tipo específico de trabalho.",
      sections: [
        {
          heading: "🛠️ Práticas de Gerenciamento de Serviço",
          content:
            "As práticas mais cobradas incluem:\n\n• **Gerenciamento de Incidentes** — restaurar operação normal o mais rápido possível, minimizando impacto\n• **Gerenciamento de Problemas** — reduzir probabilidade e impacto de incidentes, identificando causas-raiz e erros conhecidos\n• **Service Desk** — ponto único de contato entre provedor e usuários para comunicação e coordenação\n• **Gerenciamento de Mudanças** — maximizar número de mudanças bem-sucedidas, avaliando riscos com modelos como CAB\n• **Gerenciamento de Nível de Serviço** — definir metas claras de desempenho (SLA, SLO, SLI)\n• **Gerenciamento de Catálogo de Serviço** — manter informação precisa sobre serviços disponíveis",
        },
        {
          heading: "📋 Práticas de Gerenciamento Geral",
          content:
            "Incluem práticas aplicáveis a toda organização:\n\n• **Melhoria Contínua** — alinhar práticas e serviços às necessidades em evolução\n• **Gerenciamento de Segurança da Informação** — proteger informação confidencial, íntegra e disponível\n• **Gerenciamento de Relacionamento** — manter vínculos construtivos com stakeholders\n• **Gerenciamento de Risco** — identificar, avaliar e tratar ameaças\n• **Gerenciamento de Fornecedor** — garantir desempenho adequado de terceiros\n• **Gerenciamento de Portfólio** — garantir mix correto de programas, projetos e serviços",
        },
        {
          heading: "🖥️ Práticas de Gerenciamento Técnico",
          content:
            "São três práticas focadas em aspectos técnicos:\n\n• **Gerenciamento de Implantação (Deployment Management)** — mover componentes para ambientes de produção\n• **Gerenciamento de Infraestrutura e Plataforma** — supervisionar infraestrutura tecnológica\n• **Gerenciamento e Desenvolvimento de Software** — garantir que aplicações atendam às necessidades",
        },
      ],
      keyTopics: [
        "Gerenciamento de Incidentes",
        "Gerenciamento de Problemas",
        "Gerenciamento de Mudanças",
        "Service Desk",
        "SLA, SLO e SLI",
        "Gerenciamento de Risco",
        "Gerenciamento de Implantação",
        "Catálogo de Serviço",
        "Melhoria Contínua (prática)",
      ],
    },
    "ITIL 4 — Quatro Dimensões do Gerenciamento": {
      title: "ITIL 4 — Quatro Dimensões do Gerenciamento de Serviço",
      introduction:
        "O ITIL 4 define Quatro Dimensões que devem ser consideradas para garantir uma abordagem holística ao gerenciamento de serviços. Negligenciar qualquer uma delas pode resultar em serviços que não atendem às expectativas de qualidade. Essas dimensões se aplicam ao SVS como um todo e a cada serviço individualmente.",
      sections: [
        {
          heading: "👥 Organizações e Pessoas",
          content:
            "Esta dimensão abrange estrutura organizacional, papéis e responsabilidades, cultura, capacitação e competências. Perguntas-chave: a organização está estruturada para suportar sua estratégia? As pessoas têm as competências certas? A cultura incentiva colaboração e transparência? Inclui aspectos como liderança, comunicação, habilidades de gerenciamento e conhecimento técnico. Uma organização pode ter processos perfeitos mas falhar se as pessoas não estiverem capacitadas ou engajadas.",
        },
        {
          heading: "📡 Informação e Tecnologia",
          content:
            "Cobre tanto a informação gerenciada (dados, conhecimento) quanto a tecnologia utilizada. Inclui: sistemas de ITSM, bancos de dados de configuração (CMDB), ferramentas de monitoramento, automação, IA, cloud computing, blockchain e outras tecnologias emergentes. Também aborda questões como quais informações são necessárias, como protegê-las, como disponibilizá-las e como usar tecnologia para suportá-las. A escolha tecnológica deve sempre ser guiada pela estratégia de negócio.",
        },
        {
          heading: "🤝 Parceiros e Fornecedores",
          content:
            "Aborda os relacionamentos com outras organizações envolvidas na entrega de serviços. Inclui estratégias de sourcing (insourcing, outsourcing, partnership, multisourcing), gerenciamento de contratos, SLAs com fornecedores e integração de serviços. Uma organização deve decidir quais componentes construir internamente e quais adquirir de terceiros, considerando fatores estratégicos, de custo e de risco.",
        },
        {
          heading: "🔄 Fluxos de Valor e Processos",
          content:
            "Define como as atividades são organizadas para criar valor. Um fluxo de valor é uma série de passos que uma organização usa para criar e entregar produtos e serviços. Processos são conjuntos de atividades interrelacionadas que transformam entradas em saídas. Esta dimensão foca em: como o trabalho flui? Quais atividades são necessárias? Como eliminar desperdícios? Como otimizar? Conceitos de Lean e Agile são especialmente relevantes aqui.",
        },
      ],
      keyTopics: [
        "Organizações e Pessoas",
        "Informação e Tecnologia",
        "Parceiros e Fornecedores",
        "Fluxos de Valor e Processos",
        "CMDB",
        "Estratégias de Sourcing",
        "Fatores Externos (PESTLE)",
        "Abordagem Holística",
      ],
    },
    "ITIL 4 — Melhoria Contínua": {
      title: "ITIL 4 — Melhoria Contínua",
      introduction:
        "A Melhoria Contínua é um dos componentes-chave do SVS do ITIL 4 e também uma prática de gerenciamento geral. Ela atua em todos os níveis da organização — estratégico, tático e operacional — com o objetivo de alinhar práticas e serviços às necessidades em constante mudança do negócio. É o motor de evolução de qualquer organização que adota ITIL.",
      sections: [
        {
          heading: "📈 Modelo de Melhoria Contínua",
          content:
            "O ITIL 4 propõe um modelo de melhoria contínua com 7 passos:\n\n1. **Qual é a visão?** — definir direção de alto nível alinhada à missão e objetivos\n2. **Onde estamos agora?** — avaliar estado atual com avaliações (assessments) e métricas\n3. **Onde queremos estar?** — definir metas mensuráveis e KPIs\n4. **Como chegamos lá?** — criar plano de melhoria com ações, responsáveis e prazos\n5. **Agir** — executar o plano de melhoria\n6. **Chegamos lá?** — avaliar resultados contra as metas definidas\n7. **Como mantemos o ritmo?** — incorporar lições aprendidas e manter momentum",
        },
        {
          heading: "📊 Registro de Melhoria Contínua (CIR)",
          content:
            "O Continual Improvement Register (CIR) é um banco de dados ou documento estruturado que registra e gerencia oportunidades de melhoria. Cada entrada inclui: descrição, justificativa de negócio, prioridade, status, métricas de sucesso e responsável. O CIR é alimentado por múltiplas fontes: análise de incidentes, feedback de clientes, auditorias, avaliações de maturidade e sugestões da equipe. Ele permite priorizar investimentos em melhoria e rastrear progresso.",
        },
        {
          heading: "🔗 Relação com Outros Elementos do ITIL",
          content:
            "A Melhoria Contínua conecta-se a todos os outros elementos do SVS. Ela utiliza os Princípios Orientadores (especialmente 'Progrida Iterativamente com Feedback'), alimenta e é alimentada por todas as atividades da Cadeia de Valor, e interage com práticas como Gerenciamento de Problemas, Gerenciamento de Nível de Serviço e Gerenciamento de Conhecimento. Metodologias como Lean, Kaizen, PDCA e Six Sigma complementam a abordagem ITIL.",
        },
      ],
      keyTopics: [
        "7 Passos da Melhoria Contínua",
        "Registro de Melhoria Contínua (CIR)",
        "KPIs e CSFs",
        "Ciclo PDCA",
        "Lean e Kaizen",
        "Avaliação de Maturidade",
        "Gestão de Mudanças Organizacionais",
        "Lições Aprendidas",
      ],
    },
    "COBIT — Framework e Princípios": {
      title: "COBIT — Framework e Princípios",
      introduction:
        "O COBIT (Control Objectives for Information and Related Technologies) é um framework de governança e gestão de TI corporativa criado e mantido pela ISACA. Atualmente na versão 2019, o COBIT fornece um modelo abrangente que ajuda organizações a alcançar objetivos de governança e gestão de informação e tecnologia corporativa. Ele é amplamente utilizado para auditoria, conformidade regulatória e alinhamento de TI com negócios.",
      sections: [
        {
          heading: "🏛️ Visão Geral do COBIT",
          content:
            "O COBIT é baseado em seis princípios fundamentais de governança:\n\n1. **Prover Valor aos Stakeholders** — a governança de TI existe para criar valor para o negócio\n2. **Abordagem Holística** — governança requer uma visão de ponta a ponta\n3. **Sistema de Governança Dinâmico** — deve se adaptar a mudanças no ambiente\n4. **Governança Distinta de Gestão** — governança define direção; gestão executa\n5. **Ajustado às Necessidades da Organização** — customizado via fatores de design\n6. **Sistema de Governança de Ponta a Ponta** — cobre toda a empresa, não apenas TI\n\nO COBIT integra-se com outros frameworks como ITIL, TOGAF, PMBOK e ISO 27001, servindo como guarda-chuva de governança.",
        },
        {
          heading: "🎯 Cascata de Objetivos",
          content:
            "A Cascata de Objetivos do COBIT conecta necessidades de stakeholders a objetivos concretos de TI:\n\nNecessidades dos Stakeholders → Objetivos de Governança/Gestão → Objetivos de Alinhamento → Objetivos de Governança e Gestão de TI. Essa cascata garante rastreabilidade desde o valor de negócio até processos operacionais de TI. O COBIT 2019 define 13 objetivos de governança/gestão alinhados ao Balanced Scorecard (financeiro, cliente, interno, aprendizado/crescimento).",
        },
        {
          heading: "🔧 Fatores de Design",
          content:
            "O COBIT 2019 introduziu 11 Fatores de Design que permitem customizar o sistema de governança para cada organização. Incluem: estratégia da empresa, modelo de sourcing, ambiente regulatório, tamanho da empresa, modelo de entrega de TI, cenário de ameaças, entre outros. Esses fatores orientam quais objetivos priorizar e quais processos enfatizar, tornando o COBIT altamente adaptável a diferentes contextos organizacionais.",
        },
      ],
      keyTopics: [
        "6 Princípios do COBIT",
        "Governança vs Gestão",
        "Cascata de Objetivos",
        "Fatores de Design (11)",
        "ISACA",
        "COBIT 2019",
        "Integração com ITIL, TOGAF, ISO",
        "Balanced Scorecard de TI",
      ],
    },
    "COBIT — Objetivos de Governança": {
      title: "COBIT — Objetivos de Governança",
      introduction:
        "O COBIT estrutura seus processos em Objetivos de Governança e Gestão organizados em 5 domínios. O domínio de Governança (EDM) foca em avaliar, direcionar e monitorar. Os quatro domínios de Gestão cobrem alinhar/planejar/organizar (APO), construir/adquirir/implementar (BAI), entregar/servir/suportar (DSS) e monitorar/avaliar/analisar (MEA). Juntos, totalizam 40 objetivos de governança e gestão.",
      sections: [
        {
          heading: "👁️ EDM — Avaliar, Direcionar e Monitorar",
          content:
            "O domínio de governança contém 5 processos EDM:\n\n• **EDM01 — Framework de Governança Definido e Mantido** — estabelecer e manter o framework e princípios\n• **EDM02 — Entrega de Benefícios Garantida** — otimizar contribuição de valor dos processos de TI\n• **EDM03 — Otimização de Riscos Garantida** — assegurar que riscos de TI não excedam o apetite da organização\n• **EDM04 — Otimização de Recursos Garantida** — garantir que capacidades adequadas de TI estejam disponíveis\n• **EDM05 — Transparência aos Stakeholders Garantida** — garantir que a medição e o reporte estejam alinhados",
        },
        {
          heading: "📐 APO — Alinhar, Planejar e Organizar",
          content:
            "São 14 processos que cobrem estratégia e organização de TI:\n\n• APO01 — Gerenciar o Framework de Gestão de TI\n• APO02 — Gerenciar Estratégia\n• APO03 — Gerenciar Arquitetura Corporativa\n• APO04 — Gerenciar Inovação\n• APO05 — Gerenciar Portfólio\n• APO06 — Gerenciar Orçamento e Custos\n• APO07 — Gerenciar Recursos Humanos\n• APO08 — Gerenciar Relacionamentos\n• APO09 — Gerenciar Acordos de Serviço\n• APO10 — Gerenciar Fornecedores\n• APO11 — Gerenciar Qualidade\n• APO12 — Gerenciar Risco\n• APO13 — Gerenciar Segurança\n• APO14 — Gerenciar Dados",
        },
        {
          heading: "🏗️ BAI, DSS e MEA",
          content:
            "• **BAI (Construir, Adquirir e Implementar)** — 11 processos focados em definir, construir, testar e implementar soluções: gerenciamento de programas, projetos, requisitos, mudanças, transição, testes, configuração, conhecimento e ativos\n\n• **DSS (Entregar, Servir e Suportar)** — 6 processos focados na operação contínua: gerenciamento de operações, requisições de serviço, problemas, continuidade, serviços de segurança e controles de processos de negócio\n\n• **MEA (Monitorar, Avaliar e Analisar)** — 4 processos focados em conformidade e desempenho: monitoramento de desempenho, avaliação de controles internos, conformidade com requisitos externos e garantia de conformidade",
        },
      ],
      keyTopics: [
        "EDM (Avaliar, Direcionar, Monitorar)",
        "APO (Alinhar, Planejar, Organizar)",
        "BAI (Construir, Adquirir, Implementar)",
        "DSS (Entregar, Servir, Suportar)",
        "MEA (Monitorar, Avaliar, Analisar)",
        "40 Objetivos de Governança/Gestão",
        "RACI Charts",
        "Matriz de Responsabilidades",
      ],
    },
    "COBIT — Componentes do Sistema": {
      title: "COBIT — Componentes do Sistema de Governança",
      introduction:
        "O COBIT 2019 define 7 componentes (anteriormente chamados de 'habilitadores' no COBIT 5) que sustentam o sistema de governança. Esses componentes são os pilares necessários para que a governança de TI funcione efetivamente em uma organização. Cada objetivo de governança/gestão interage com todos os 7 componentes.",
      sections: [
        {
          heading: "📦 Os 7 Componentes do Sistema de Governança",
          content:
            "Os componentes são:\n\n1. **Processos** — conjuntos organizados de práticas e atividades para atingir objetivos e produzir saídas\n2. **Estruturas Organizacionais** — entidades-chave de tomada de decisão (Comitê de TI, Board, CIO)\n3. **Princípios, Políticas e Frameworks** — orientações práticas para gestão do dia a dia\n4. **Informação** — informação produzida e usada pelo sistema de governança (relatórios, dashboards, KPIs)\n5. **Cultura, Ética e Comportamento** — fator frequentemente subestimado que influencia sucesso da governança\n6. **Pessoas, Habilidades e Competências** — necessárias para decisões corretas, ações corretivas e conclusão de atividades\n7. **Serviços, Infraestrutura e Aplicações** — infraestrutura e tecnologia que suportam o processamento de informação",
        },
        {
          heading: "🔄 Interação entre Componentes",
          content:
            "Os componentes trabalham de forma integrada. Por exemplo, um Processo de Gerenciamento de Risco (componente 1) requer uma Estrutura Organizacional definida com um Comitê de Risco (componente 2), Políticas de Risco documentadas (componente 3), Informações de risco atualizadas como registros de risco (componente 4), uma Cultura que valorize gestão de risco (componente 5), Pessoas capacitadas em análise de risco (componente 6) e Ferramentas de GRC (componente 7). A falha em qualquer componente compromete o sistema inteiro.",
        },
        {
          heading: "📊 Modelo de Capacidade de Processos (CMMI)",
          content:
            "O COBIT utiliza um modelo de capacidade baseado no CMMI para avaliar maturidade dos processos em 6 níveis:\n\n• **Nível 0 — Incompleto** — processo não implementado ou não atinge seu propósito\n• **Nível 1 — Realizado** — processo atinge seu propósito mas de forma não gerenciada\n• **Nível 2 — Gerenciado** — processo planejado, monitorado e ajustado\n• **Nível 3 — Definido** — processo padronizado em toda a organização\n• **Nível 4 — Quantitativo** — processo medido e controlado com métricas quantitativas\n• **Nível 5 — Otimizado** — processo é continuamente melhorado para atender objetivos de negócio relevantes",
        },
      ],
      keyTopics: [
        "7 Componentes do Sistema de Governança",
        "Processos e Práticas",
        "Estruturas Organizacionais",
        "Princípios, Políticas e Frameworks",
        "Cultura e Comportamento",
        "Modelo de Capacidade (CMMI)",
        "Níveis de Maturidade (0-5)",
        "Integração dos Componentes",
      ],
    },
    "COBIT — Métricas e Maturidade": {
      title: "COBIT — Métricas e Maturidade",
      introduction:
        "A medição de desempenho e a avaliação de maturidade são elementos centrais do COBIT para garantir que a governança de TI gere resultados tangíveis. O framework fornece métricas em cascata alinhadas a objetivos e um modelo estruturado para avaliar a evolução dos processos de governança ao longo do tempo.",
      sections: [
        {
          heading: "📏 Sistema de Métricas do COBIT",
          content:
            "O COBIT estrutura métricas em três níveis:\n\n• **Métricas de Resultado (Outcome Metrics/Lag)** — medem se objetivos de governança/gestão foram atingidos (ex: % de projetos entregues no prazo e orçamento)\n• **Métricas de Desempenho (Performance Metrics/Lead)** — medem se as práticas estão sendo executadas corretamente (ex: % de riscos identificados e avaliados)\n• **Indicadores de Alinhamento** — verificam se a governança de TI está alinhada aos objetivos de negócio\n\nCada objetivo de governança/gestão possui métricas específicas documentadas no framework. A seleção de métricas deve seguir o princípio SMART (Specific, Measurable, Achievable, Relevant, Time-bound).",
        },
        {
          heading: "📊 Avaliação de Maturidade e Capacidade",
          content:
            "O COBIT 2019 suporta dois tipos de avaliação:\n\n• **Avaliação de Capacidade de Processo** — avalia processos individuais nos níveis 0 a 5, baseado no modelo CMMI. Usa evidências objetivas e pode ser feita internamente ou por auditores externos\n\n• **Avaliação de Maturidade Organizacional** — visão agregada que considera múltiplos processos e componentes. Responde: 'quão madura é nossa governança de TI como um todo?'\n\nAssessments podem ser formais (usando ISO 15504/33001) ou informais (autoavaliação com checklists). O resultado orienta prioridades de investimento em melhoria.",
        },
        {
          heading: "🎯 Balanced Scorecard de TI",
          content:
            "O COBIT conecta-se ao conceito de IT Balanced Scorecard (BSC) com quatro perspectivas:\n\n• **Contribuição Corporativa** — como TI contribui para o negócio?\n• **Orientação ao Usuário** — como os usuários veem TI?\n• **Excelência Operacional** — quão eficientes são os processos de TI?\n• **Orientação Futura** — TI está preparada para demandas futuras?\n\nAs métricas do COBIT alimentam o BSC de TI, permitindo uma visão equilibrada do desempenho que vai além de indicadores puramente financeiros ou técnicos.",
        },
      ],
      keyTopics: [
        "Métricas Lag vs Lead",
        "CMMI Níveis 0-5",
        "Avaliação de Capacidade",
        "Avaliação de Maturidade",
        "IT Balanced Scorecard",
        "Indicadores SMART",
        "ISO 15504/33001",
        "Auditoria e Conformidade",
      ],
    },
    "COBIT — Implementação e Design": {
      title: "COBIT — Implementação e Design",
      introduction:
        "Implementar um sistema de governança de TI baseado no COBIT requer planejamento estruturado, considerando os fatores de design da organização e um roteiro de implementação em fases. O COBIT 2019 fornece orientação detalhada para customizar, implantar e melhorar continuamente o sistema de governança.",
      sections: [
        {
          heading: "🗺️ Roteiro de Implementação",
          content:
            "O COBIT propõe um ciclo de implementação em 7 fases:\n\n1. **Quais são os motivadores?** — identificar pontos de dor, eventos gatilho e mudanças regulatórias que justificam a implementação\n2. **Onde estamos agora?** — avaliar estado atual usando assessments de capacidade e maturidade\n3. **Onde queremos estar?** — definir metas e capacidade-alvo para processos priorizados\n4. **O que precisa ser feito?** — identificar gaps e criar projetos de melhoria\n5. **Como chegamos lá?** — implementar melhorias, gerenciar mudanças, comunicar\n6. **Chegamos lá?** — medir resultados, comparar com metas, ajustar\n7. **Como mantemos o ritmo?** — incorporar lições aprendidas, institucionalizar\n\nEsse ciclo é iterativo e pode ser repetido continuamente.",
        },
        {
          heading: "🎨 Design do Sistema de Governança",
          content:
            "O design uses os 11 Fatores de Design para customizar o sistema:\n\n• **Estratégia da Empresa** — crescimento/inovação, estabilidade, custo/otimização\n• **Objetivos da Empresa** — quais objetivos do BSC são prioritários\n• **Perfil de Risco** — quais riscos de TI são mais relevantes\n• **Questões de TI** — problemas atuais (shadow IT, complexidade, custos)\n• **Cenário de Ameaças** — nível de ameaças cibernéticas\n• **Requisitos de Conformidade** — regulamentos aplicáveis (LGPD, SOX, PCI)\n• **Papel de TI** — suporte, fábrica, reviravolta ou estratégico\n• **Modelo de Sourcing** — terceirizado, cloud, híbrido\n• **Métodos de TI** — ágil, DevOps, tradicional\n• **Estratégia de Adoção de Tecnologia** — first mover, follower, slow adopter\n• **Tamanho da Empresa** — pequena, média, grande, multinacional\n\nCada fator influencia a prioridade dos 40 objetivos de governança/gestão.",
        },
        {
          heading: "⚠️ Desafios e Boas Práticas",
          content:
            "Desafios comuns na implementação:\n\n• Resistência à mudança — equipes veem governança como burocracia\n• Falta de patrocínio executivo — sem apoio do board a iniciativa falha\n• Tentativa de implementar tudo de uma vez — excesso de escopo\n• Foco excessivo em compliance — governança deve criar valor, não apenas conformidade\n\nBoas práticas:\n\n• Começar com quick wins (processos de alto impacto e baixa complexidade)\n• Obter patrocínio executivo desde o início\n• Comunicar benefícios em linguagem de negócio\n• Usar abordagem incremental e iterativa\n• Medir e reportar progresso regularmente\n• Alinhar com outros frameworks já existentes (ITIL, ISO 27001)",
        },
      ],
      keyTopics: [
        "7 Fases de Implementação",
        "11 Fatores de Design",
        "Análise de Gap",
        "Gestão de Mudança Organizacional",
        "Quick Wins",
        "Patrocínio Executivo",
        "Priorização de Processos",
        "Abordagem Incremental",
      ],
    },
  },
};

/**
 * Retorna a documentação de uma categoria específica
 */
export function getCategoryDocumentation(
  track: string,
  category: string,
): CategoryDocumentation | null {
  return documentation[track]?.[category] ?? null;
}

/**
 * Verifica se existe documentação para uma categoria
 */
export function hasDocumentation(track: string, category: string): boolean {
  return !!documentation[track]?.[category];
}
