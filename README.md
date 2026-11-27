# Gestão de Ordens de Serviço — Oficina Mecânica

## Sobre o Projeto

Este projeto consiste em um sistema de gerenciamento de ordens de serviço para oficinas mecânicas. A aplicação permite acompanhar as etapas de atendimento dos veículos, desde a abertura da ordem de serviço até a conclusão e entrega.

A arquitetura utiliza **Next.js** no front-end, **NestJS** no back-end e **PostgreSQL** para armazenamento dos dados, com o **Prisma ORM** como ferramenta de acesso ao banco de dados.

Entre os principais recursos e conceitos trabalhados no projeto, destacam-se:

- **Máquina de Estados Finitos (FSM):** definição das etapas do ciclo de vida de uma Ordem de Serviço (O.S.), com regras para controlar as transições de status.
- **Transações ACID:** utilização de transações do Prisma nas operações de faturamento e baixa de peças, buscando manter a consistência dos dados e permitir o rollback em caso de falhas.
- **Trilha de Auditoria (Audit Log):** registro histórico das alterações de estado e das operações relevantes realizadas nas Ordens de Serviço.
- **Monitoramento de erros (GlitchTip/Sentry):** integração para captura e acompanhamento de exceções e falhas da aplicação.
- **Docker:** utilização de containers para executar a infraestrutura de monitoramento localmente.

---

## Máquina de Estados Finitos (FSM)

O fluxo de trabalho da oficina é organizado por uma máquina de estados que representa as etapas pelas quais uma Ordem de Serviço pode passar.

O diagrama abaixo apresenta as transições previstas no sistema, desde a abertura do atendimento até a entrega do veículo.

```mermaid
stateDiagram-v2
    [*] --> ABERTURA_DIAGNOSTICO : Nova O.S. aberta

    ABERTURA_DIAGNOSTICO --> AGUARDANDO_APROVACAO : Diagnostico preenchido

    AGUARDANDO_APROVACAO --> AGUARDANDO_PECAS : Cliente aprova e faltam pecas
    AGUARDANDO_APROVACAO --> EXECUCAO_TRABALHO : Cliente aprova e pecas disponiveis

    AGUARDANDO_PECAS --> EXECUCAO_TRABALHO : Pecas recebidas e alocadas

    EXECUCAO_TRABALHO --> CONCLUIDO : Faturamento e baixa de estoque

    CONCLUIDO --> ENTREGUE : Veiculo retirado pelo cliente

    ENTREGUE --> [*]
```

---

## Diagrama Entidade-Relacionamento (DER)

O modelo de dados organiza as principais entidades utilizadas pelo sistema: Ordens de Serviço, Histórico de alterações e Peças em Estoque.

```mermaid
erDiagram
    ORDEM_SERVICO {
        String id PK "UUID"
        String cliente
        String veiculo
        String problemaRelatado
        String diagnosticoMecanico "Nullable"
        Json itensOrcamento "Nullable"
        Enum prioridade "BAIXA, MEDIA, ALTA"
        Enum status "FSM: 6 estados"
        DateTime created_at
        DateTime updated_at "Nullable"
        DateTime deleted_at "Nullable"
    }

    HISTORICO_OS {
        String id PK "UUID"
        String id_registro FK "Referencia a OrdemServico"
        Enum estado_anterior
        Enum novo_estado
        String autor_id "Mecanico ou sistema"
        String justificativa
        DateTime timestamp
    }

    PECA_ESTOQUE {
        String id PK "UUID"
        String nome
        Int quantidade "Default: 0"
        Float preco
    }

    ORDEM_SERVICO ||--o{ HISTORICO_OS : possui
    ORDEM_SERVICO }|--|{ PECA_ESTOQUE : utiliza
```

---

## Como Executar o Projeto

O projeto está organizado em duas aplicações principais:

| Diretório | Aplicação | Tecnologia |
|---|---|---|
| `ppw_client` | Front-end | Next.js |
| `ppw_server` | Back-end | NestJS |

Além dessas aplicações, o projeto utiliza Docker para executar a infraestrutura de monitoramento de erros.

### Pré-requisitos

Antes de iniciar, é necessário possuir:

- **Node.js:** versão 18 ou superior.
- **npm:** gerenciador de pacotes do Node.js.
- **Docker e Docker Compose:** para executar o GlitchTip.
- **VPN da instituição:** necessária para acessar o banco de dados PostgreSQL disponibilizado pela faculdade.

### 1. Configuração das variáveis de ambiente

Por questões de segurança, o arquivo `.env` contendo as credenciais reais do banco de dados não está disponível no repositório.

Para configurar o acesso, crie um arquivo chamado `.env` na raiz da aplicação `ppw_server` e adicione a variável de conexão:

```env
DATABASE_URL="postgresql://usuario:senha@10.x.x.x:5432/postgres?schema=bi304128x"
```

Substitua os valores de usuário, senha e endereço pelos dados de acesso fornecidos pela instituição.

**Importante:** não compartilhe ou versione o arquivo `.env` com credenciais reais.

### 2. Inicialização do GlitchTip com Docker

O GlitchTip é utilizado para centralizar o monitoramento e a visualização dos erros da aplicação.

Na raiz do projeto, no diretório em que está localizado o arquivo `docker-compose.yml`, execute:

```bash
docker compose up -d
```

Após a inicialização:

1. Acesse o painel em `http://localhost:8000`.
2. Crie uma conta de acesso.
3. Configure uma organização e um projeto para o Next.js.
4. Copie a chave DSN disponibilizada pela plataforma.
5. Na raiz da aplicação `ppw_client`, crie o arquivo `.env.local`.

Adicione a seguinte variável, substituindo o endereço pelo DSN gerado no painel:

```env
NEXT_PUBLIC_SENTRY_DSN=http://suachaveaqui@localhost:8000/1
```

### 3. Inicialização do Back-end (NestJS)

Abra um terminal e acesse o diretório do servidor:

```bash
cd ppw_server
```

Instale as dependências e gere o cliente do Prisma:

```bash
npm install
npx prisma generate
```

Em seguida, inicie o servidor:

```bash
npm run start:dev
```

O servidor NestJS será iniciado na porta definida em sua configuração.

### 4. Inicialização do Front-end (Next.js)

Abra um segundo terminal e acesse o diretório do cliente:

```bash
cd ppw_client
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

Após a inicialização, acesse:

`http://localhost:3000`

---

## Testando a Captura de Erros

A aplicação possui um painel de testes para verificar a integração com o GlitchTip.

Na tela principal de Ordens de Serviço, acesse:

`http://localhost:3000`

Role até o final da página para localizar o **Painel de Testes — GlitchTip**.

O painel disponibiliza duas opções:

**1. Forçar erro Client-Side**

Dispara um erro relacionado à renderização da interface, permitindo verificar o comportamento do `error.tsx` e o envio do evento ao serviço de monitoramento.

**2. Forçar erro assíncrono**

Simula uma falha durante a execução de uma operação assíncrona. A captura é realizada explicitamente por meio de `Sentry.captureException()`, permitindo registrar erros que não são tratados automaticamente pelos Error Boundaries.

Após realizar os testes, acesse o painel do GlitchTip:

`http://localhost:8000/issues`

Verifique se os eventos foram registrados e se as informações de diagnóstico, como o *stack trace*, estão disponíveis.

---

## Tecnologias Utilizadas

| Tecnologia | Utilização |
|---|---|
| Next.js | Desenvolvimento do front-end |
| NestJS | Desenvolvimento do back-end |
| TypeScript | Linguagem de programação |
| PostgreSQL | Banco de dados relacional |
| Prisma ORM | Mapeamento e acesso aos dados |
| Docker | Execução da infraestrutura de monitoramento |
| GlitchTip | Monitoramento e registro de erros |
| Sentry SDK | Captura e envio de exceções |

---

**Projeto acadêmico desenvolvido para a disciplina de PRW2.**