Este documento regista as consultas aos agentes de Inteligência Artificial durante o desenvolvimento e refatoração da arquitetura do projeto. A IA foi utilizada como apoio para modelagem de banco de dados, design patterns, tratamento de infraestrutura de rede (VPN) e transações ACID.

### Desafio 1: Estratégia de Versionamento e Segurança de Credenciais

**1. O Desafio:** Configurar o repositório Git local e remoto garantindo que credenciais sensíveis (conexão à VPN/banco da faculdade) e diretórios pesados não fossem expostos publicamente, sem inviabilizar a avaliação.
**2. O Prompt Utilizado:** *"Como estruturar o versionamento de um projeto acadêmico no Git através do .gitignore, garantindo a segurança de credenciais de banco de dados e arquivos pesados, permitindo ao avaliador testar a aplicação?"*
**3. A Resposta Bruta da IA:** A IA forneceu um modelo padrão de `.gitignore` para bloquear as pastas `node_modules` e o ficheiro `.env`, sugerindo enviar o `.env` real isoladamente ou usar um `.env.example`.
**4. A Crítica e Refatoração do Aluno:** A recomendação do `.env.example` foi adotada, mas a IA não previu que o Git já havia rastreado arquivos pesados (como o `node.exe` de 88MB) antes da criação da regra. Tive que intervir manualmente executando `git rm -r --cached nodejs/` para limpar o índice local e garantir commits atômicos e leves.

### Desafio 2: Refatoração do Domínio (Tickets para Ordem de Serviço)

**1. O Desafio:** Migrar toda a base estrutural do projeto do domínio genérico de "Ticket" para "Ordem de Serviço", mantendo a integridade do banco de dados após a perda de tabelas do servidor.
**2. O Prompt Utilizado:** *"Qual a abordagem correta para recriar o esquema do banco de dados e manter a integridade estrutural após a perda de dados, migrando simultaneamente o domínio, DTOs e Mappers de 'Ticket' para 'Ordem de Serviço'?"*
**3. A Resposta Bruta da IA:** A IA propôs comandos SQL manuais para reconstruir as tabelas via DBeaver e instruiu a renomeação de arquivos físicos e classes.
**4. A Crítica e Refatoração do Aluno:** A execução de SQL manual geraria falhas de permissão no schema da faculdade. Corrigi a modelagem abandonando o DBeaver e delegando a reconstrução diretamente ao Prisma ORM (`npx prisma db push`), o que garantiu a integridade referencial automática e sincronizou os tipos de forma segura.

### Desafio 3: Modelagem da Máquina de Estados Finita (FSM)

**1. O Desafio:** Proibir alterações arbitrárias de status, implementando um ciclo de vida restrito (FSM) para os veículos da oficina (ex: proibir avanço sem diagnóstico).
**2. O Prompt Utilizado:** *"Como modelar uma Máquina de Estados Finita e aplicar Transições Restritas (Transition Guards) no fluxo de uma Ordem de Serviço?"*
**3. A Resposta Bruta da IA:** Explicou o padrão de projeto *State* (orientação a objetos) com múltiplas classes separadas para cada estado do veículo.
**4. A Crítica e Refatoração do Aluno:** O *State Pattern* clássico geraria sobrecarga excessiva na arquitetura atual. Refatorei a solução mapeando os estados em *Enums* rígidos (`ABERTURA_DIAGNOSTICO`, `EXECUCAO_TRABALHO`, `CONCLUIDO`) e apliquei a "Transition Guard" no front-end, interceptando os saltos de etapa nos botões de ação da interface.

### Desafio 4: Conflitos de Tipagem e Nomenclatura de DTOs

**1. O Desafio:** Resolver erros críticos de compilação (ex: `Cannot find module` e TS2307) e inconsistência de mapeamento após a mudança de domínio e renomeação de ficheiros físicos.
**2. O Prompt Utilizado:** *"Como refatorar os Value Objects e os Mappers do Prisma para garantir a tipagem estrita e corrigir os erros de 'Cannot find module' nas transferências de DTO?"*
**3. A Resposta Bruta da IA:** A IA enviou o código atualizado dos Mappers, mas presumiu o padrão da documentação do Prisma (`updatedAt`), ignorando a implementação da entidade base legada.
**4. A Crítica e Refatoração do Aluno:** O código gerado pela IA quebrou o projeto devido à divergência entre `updatedAt` (IA) e `updateAt` (Minha base). Identifiquei o erro de tipagem no TypeScript, e ajustei manualmente a assinatura no `OrdemServicoMapper` e no DTO para respeitar a estrutura original (`updateAt: entity.props.updateAt ?? null`).

### Desafio 5: Reestruturação da Injeção de Dependências (NestJS)

**1. O Desafio:** Reestabelecer o módulo principal do NestJS para resolver falhas de injeção de dependência (`Property does not exist`) na inicialização do servidor.
**2. O Prompt Utilizado:** *"Como reconfigurar o módulo principal do NestJS após renomear casos de uso, repositórios e controladores?"*
**3. A Resposta Bruta da IA:** A IA gerou o código do arquivo `OrdemServicoModule` vinculando os novos providers, tokens e controllers perfeitamente.
**4. A Crítica e Refatoração do Aluno:** A IA ignorou que os arquivos físicos no sistema (ex: `ticket.prisma.write.repository.ts`) ainda mantinham nomes antigos, o que sustentava os alertas vermelhos. Renomeei manualmente os paths dos arquivos no painel Explorer do VS Code e vinculei o novo módulo no `app.module.ts` no lugar do antigo.

### Desafio 6: Validação de Dados (Zod) e UI Actions

**1. O Desafio:** Integrar a FSM com o formulário de abertura de O.S. no Next.js, garantindo validação estrita (Server-Side) e *fallback* visual de mensagens de erro.
**2. O Prompt Utilizado:** *"Como adaptar o formulário de criação (Dialog) e o schema do Zod para respeitar a nova Máquina de Estados e acionar as Server Actions corretamente?"*
**3. A Resposta Bruta da IA:** Gerou o `ordem-servico.schema.ts` restringindo o campo de `status` a um Enum validado e orientou o uso de `useActionState` no modal.
**4. A Crítica e Refatoração do Aluno:** A validação sugerida era sólida, mas na interface o envio da Action perdia a referência dos inputs se enviada cruamente. Apliquei um wrapper via `React Hooks` (`react-hook-form` com `zodResolver`) antes do `formAction(ticket as any)` no `onSubmit`, garantindo que apenas dados limpos acionassem a API, bloqueando envios nulos.

### Desafio 7: Trilha de Auditoria (Audit Log) e Transações ACID

**1. O Desafio:** Garantir que nenhuma alteração de estado sobrescreva dados sem gerar um histórico imutável (Append-Only) identificando autor, justificativa e timestamp.
**2. O Prompt Utilizado:** *"Como implementar uma trilha de auditoria vinculada à mudança de estados utilizando transações ACID no Prisma, garantindo o 'rollback' em caso de falhas?"*
**3. A Resposta Bruta da IA:** A IA recomendou envolver as operações num bloco genérico, realizando primeiro um `update` da O.S. e depois um `create` isolado na tabela de histórico.
**4. A Crítica e Refatoração do Aluno:** Executar duas queries separadas no código Node.js, mesmo em transação, abria brechas de segurança e latência. Refatorei a implementação utilizando o recurso de **Criação Aninhada** do Prisma (`historico: { create: {} }`). Isso acoplou as tabelas nativamente no banco (PostgreSQL), blindando a trilha de auditoria em um único comando SQL.

### Desafio 8: Infraestrutura de Rede, VPN e Comunicação HTTP

**1. O Desafio:** Solucionar falhas de comunicação severas (`ECONNREFUSED` / `fetch failed`) entre o Frontend Next.js e o Backend NestJS.
**2. O Prompt Utilizado:** *"Por que a Server Action do Next.js está retornando ECONNREFUSED ao tentar fazer o fetch para a API do NestJS na porta 8000?"*
**3. A Resposta Bruta da IA:** A IA presumiu que havia erros na configuração de payload (`JSON.stringify`) da rota de faturamento, ou falhas na tipagem dos status do Prisma bloqueando a resposta do backend.
**4. A Crítica e Refatoração do Aluno:** O diagnóstico da IA estava equivocado. A requisição HTTP sequer alcançava a rota porque o servidor NestJS estava "crashing" silenciosamente devido à ausência das credenciais do banco na VPN. A falha era de infraestrutura (o arquivo `.env` não versionado no PC local). Copiei o `.env` correto da faculdade e executei os serviços em terminais separados para garantir a conectividade real.

### Desafio 9: Acoplamento do Gatilho da Transação (FSM e UI)

**1. O Desafio:** Disparar o painel visual da Máquina de Estados (Card) a partir da tabela principal do Next.js para poder realizar a transição atômica de "Boss Final" via botão.
**2. O Prompt Utilizado:** *"O botão de editar não abre o painel. Como integrar o componente de Cartão da OS na tabela principal para acionar o faturamento atômico?"*
**3. A Resposta Bruta da IA:** A IA analisou exaustivamente o código do componente filho (`OrdemServicoCard`), garantindo que a tipagem e os hooks estavam corretos, demorando a observar a arquitetura pai.
**4. A Crítica e Refatoração do Aluno:** A IA ignorou inicialmente que a função `handleOpenUpdate` no arquivo pai (`OrdemServico.tsx`) havia ficado vazia na refatoração. Tive que alterar a arquitetura do front-end inserindo o Modal (`Dialog`) nativamente no root da tabela e forçar a injeção do estado (`setOsSelecionada`) ao clicar no lápis para viabilizar a injeção do Card.

### Desafio 10: Regra de Alta Complexidade (Baixa Atômica de Peças em Concorrência)

**1. O Desafio:** Alocar peças do estoque e faturar a OS simultaneamente, lidando com concorrência para evitar que dois mecânicos esgotem a última peça disponível ao mesmo tempo (Race Conditions).
**2. O Prompt Utilizado:** *"Como garantir consistência ao baixar estoque e faturar a OS em concorrência simultânea?"*
**3. A Resposta Bruta da IA:** A IA sugeriu um fluxo de leitura e escrita sequencial na API: `findUnique` para checar o saldo de peças na memória do Node.js, seguido de um `update` manual.
**4. A Crítica e Refatoração do Aluno:** A abordagem sequencial permitiria leitura "suja" em concorrência, negativando o estoque. Descartei essa sugestão e implementei uma **Transação ACID** do Prisma usando a operação de baixa matemática direta (`decrement: quantidadeUsada`). Isso força o PostgreSQL a aplicar um *Row-Level Locking*, fazendo o cálculo atômico diretamente no motor do banco. Se o saldo resultante ficar negativo, o banco reverte toda a operação (Rollback), blindando a lógica .