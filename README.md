# 🛠️ Gestão de Ordens de Serviço (Oficina Mecânica)
# **Aluno:** Aaron Kenzo Hukuda Castro Kanashiro (RA: bi304128x)


# Diagrama de Máquina de Estados (FSM)

O fluxo de trabalho da oficina obedece à seguinte máquina de estados, modelada para refletir a jornada real do veículo, do diagnóstico à entrega:

```mermaid
stateDiagram-v2
    [*] --> ABERTURA_DIAGNOSTICO : Nova O.S. Aberta
    
    ABERTURA_DIAGNOSTICO --> AGUARDANDO_APROVACAO : Diagnóstico Técnico Preenchido
    
    AGUARDANDO_APROVACAO --> AGUARDANDO_PECAS : Cliente Aprova + Falta Peça
    AGUARDANDO_APROVACAO --> EXECUCAO_TRABALHO : Cliente Aprova + Peças Disponíveis
    
    AGUARDANDO_PECAS --> EXECUCAO_TRABALHO : Peças Chegaram/Alocadas
    
    %% Transition Guard e Regra Complexa ACID
    EXECUCAO_TRABALHO --> CONCLUIDO : Faturar (Baixa Atômica de Estoque ACID)
    
    CONCLUIDO --> ENTREGUE : Cliente Retirou Veículo
    ENTREGUE --> [*]

  #Diagrama Entidade Relacionamento

  erDiagram
    ORDEM_SERVICO {
        String id PK "uuid"
        String cliente
        String veiculo
        String problemaRelatado
        String diagnosticoMecanico "nullable"
        Json itensOrcamento "nullable"
        Enum prioridade "BAIXA, MEDIA, ALTA"
        Enum status "FSM: 6 Estados"
        DateTime created_at
        DateTime updated_at "nullable"
        DateTime deleted_at "nullable"
    }

    HISTORICO_OS {
        String id PK "uuid"
        String id_registro FK "Ref: OrdemServico"
        Enum estado_anterior
        Enum novo_estado
        String autor_id "Mecânico/Sistema"
        String justificativa "Log de Baixa ACID"
        DateTime timestamp
    }

    PECA_ESTOQUE {
        String id PK "uuid"
        String nome
        Int quantidade "Default: 0"
        Float preco
    }

    ORDEM_SERVICO ||--o{ HISTORICO_OS : "Possui trilha de auditoria"
    ORDEM_SERVICO }|--|{ PECA_ESTOQUE : "Consome peças (Atomic Decrement)"

 **Como Executar o Projeto Localmente**
O projeto está dividido em dois microsserviços: ppw_client (Front-end) e ppw_server (Back-end).

Pré-requisitos
Node.js (v18+) e npm.

Estar conectado à VPN da Instituição (necessário para acesso ao banco de dados PostgreSQL interno).

1. Configuração de Variáveis de Ambiente
Por questões de segurança, o ficheiro .env com as credenciais do banco da faculdade não foi versionado no repositório.

Na pasta ppw_server, crie um arquivo chamado .env (baseie-se no .env.example, se disponível).

Solicite ou insira a string de conexão correta da rede da faculdade na variável DATABASE_URL.

2.Iniciando o Back-end (NestJS)
Abra um terminal, navegue até a pasta do servidor e execute os comandos abaixo para instalar as dependências e sincronizar as tabelas do Prisma com o banco de dados:
cd ppw_server
npm install
npx prisma generate
npx prisma db push
npm run start:dev

3. Iniciando o Front-end (Next.js)
Abra um segundo terminal, navegue até a pasta do cliente e instale as dependências visuais:
cd ppw_client
npm install
npm run dev

O sistema estará disponível no navegador através do endereço http://localhost:3000