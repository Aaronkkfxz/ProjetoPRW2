Registro de uso de inteligência artificial no desenvolvimento do projeto
Durante o desenvolvimento do projeto, utilizei uma ferramenta de inteligência artificial como apoio para investigar dúvidas, entender mensagens de erro e comparar possíveis soluções. Nem todas as sugestões funcionaram diretamente no projeto. Em alguns casos, foi necessário conferir a estrutura existente, testar alternativas e adaptar o código. As perguntas deste registro estão resumidas para facilitar a leitura; as respostas e intervenções descrevem o que foi observado durante o desenvolvimento.
PARTE 1 — Arquitetura, máquina de estados e transações
Nesta etapa, os desafios estiveram relacionados à organização do código, à estrutura do banco de dados e ao controle das operações realizadas pelas ordens de serviço.
Desafio 1 — Versionamento e proteção de credenciais
Desafio: Configurar o Git para ignorar arquivos pesados e proteger informações sensíveis, sem impedir que outra pessoa consiga preparar e executar o projeto.

Pergunta feita à IA (resumo): Como organizar o .gitignore e disponibilizar um exemplo de configuração para que o projeto possa ser executado sem expor as credenciais reais?

Síntese da resposta: A IA sugeriu ignorar diretórios como node_modules e o arquivo .env. Também recomendou criar um .env.example com os nomes das variáveis necessárias, mas sem os valores confidenciais.

Análise e intervenção: A sugestão do .env.example foi aproveitada. Durante os testes, percebi que incluir uma regra no .gitignore não remove arquivos que já estavam sendo rastreados pelo Git. Por isso, usei o comando git rm -r --cached nodejs/ para retirar a pasta do índice do repositório, mantendo os arquivos na máquina local.
Desafio 2 — Mudança do domínio de Ticket para Ordem de Serviço
Desafio: Adaptar a estrutura do projeto para trabalhar com o domínio de Ordem de Serviço e reconstruir a estrutura do banco após a perda de tabelas no ambiente utilizado.

Pergunta feita à IA (resumo): Qual seria uma forma segura de atualizar o modelo do banco e ajustar entidades, DTOs e mappers durante a mudança de Ticket para Ordem de Serviço?

Síntese da resposta: A IA sugeriu recriar as tabelas por meio de comandos SQL e renomear os arquivos e as classes relacionadas ao domínio.

Análise e intervenção: Como o ambiente acadêmico tinha restrições de permissão para executar determinadas operações diretamente no schema, optei por atualizar o modelo no Prisma e utilizar npx prisma db push para sincronizar a estrutura definida no schema.prisma com o banco. Depois, conferi as relações e os nomes utilizados pelas entidades para evitar divergências.
Desafio 3 — Controle dos estados da Ordem de Serviço
Desafio: Impedir que uma Ordem de Serviço avance ou retorne para qualquer status sem respeitar as etapas previstas no fluxo.

Pergunta feita à IA (resumo): Como definir quais mudanças de status são permitidas e impedir que a Ordem de Serviço passe diretamente para uma etapa inválida?

Síntese da resposta: A IA apresentou o padrão State Pattern, com a criação de classes específicas para representar cada estado.

Análise e intervenção: Para o tamanho e a estrutura do projeto, considerei essa abordagem mais complexa do que o necessário. Utilizei enums para representar os estados e implementei verificações na interface antes de permitir as ações disponíveis. Essa validação melhora o fluxo de uso, mas não substitui a validação no servidor: a API também precisa conferir se a transição é permitida, evitando que a regra dependa apenas dos botões da interface.
Desafio 4 — Tipagem e nomenclatura dos DTOs
Desafio: Corrigir erros de compilação e de importação que apareceram depois da mudança do domínio e da renomeação de arquivos.

Pergunta feita à IA (resumo): Como ajustar os Value Objects e os mappers para manter os tipos compatíveis com as entidades existentes e corrigir os erros de importação?

Síntese da resposta: A IA sugeriu alterações nos mappers, mas utilizou o nome updatedAt, seguindo um padrão comum em projetos Prisma, sem considerar a nomenclatura que já existia na entidade base do projeto.

Análise e intervenção: A alteração sugerida gerou incompatibilidade com a estrutura existente. Revisei o mapper e mantive o nome utilizado pela entidade, updateAt, ajustando o trecho para updateAt: entity.props.updateAt ?? null. Assim, o mapper passou a respeitar a tipagem que já estava definida no projeto.
Desafio 5 — Registro do histórico de alterações
Desafio: Registrar as mudanças de estado da Ordem de Serviço com informações de autoria e justificativa, mantendo o histórico sem sobrescrever registros anteriores.

Pergunta feita à IA (resumo): Como atualizar a Ordem de Serviço e registrar o histórico da mudança de forma que as duas operações não fiquem inconsistentes?

Síntese da resposta: A primeira orientação tratava a atualização da Ordem de Serviço e a criação do histórico como operações separadas, sem detalhar como garantir que ambas fossem confirmadas ou desfeitas em conjunto.

Análise e intervenção: Para manter as operações relacionadas no mesmo fluxo, utilizei uma escrita aninhada do Prisma (historico: { create: {} }). Esse recurso permite executar a alteração do registro principal e a criação do histórico como uma operação transacional, evitando que uma parte seja gravada sem a outra.
Desafio 6 — Integração entre a tabela e o modal de edição
Desafio: Fazer com que o botão de edição da tabela principal abrisse o painel correspondente à Ordem de Serviço selecionada.

Pergunta feita à IA (resumo): Por que o botão de edição não estava abrindo o painel e como ligar o componente da Ordem de Serviço à tabela principal?

Síntese da resposta: A IA concentrou a análise no componente filho, verificando sua estrutura e tipagem, mas não identificou de início o problema no componente responsável pela tabela.

Análise e intervenção: Ao revisar o componente pai (OrdensServicoPage), encontrei a função handleOpenUpdate declarada, mas sem implementação. Ajustei o fluxo para selecionar a Ordem de Serviço clicada por meio de setOsSelecionada e abrir o componente Dialog utilizado como modal de edição.
Desafio 7 — Atualização do estoque e concorrência
Desafio: Baixar as peças utilizadas em uma Ordem de Serviço e registrar a operação sem que requisições simultâneas causem divergências no estoque.

Pergunta feita à IA (resumo): Como atualizar o estoque e concluir a Ordem de Serviço sem depender de uma leitura que pode ficar desatualizada quando duas requisições acontecem ao mesmo tempo?

Síntese da resposta: A IA sugeriu consultar o saldo com findUnique e, em seguida, executar a atualização. Essa sequência poderia utilizar um valor que já tivesse sido alterado por outra requisição.

Análise e intervenção: Passei a utilizar uma transação do Prisma e a operação decrement para realizar a subtração diretamente no banco, em vez de calcular o novo saldo apenas com um valor previamente lido pela aplicação. Durante a revisão, identifiquei um cuidado importante: decrement, sozinho, não impede que o estoque fique negativo. Para garantir esse limite, a atualização também precisa verificar a disponibilidade no próprio banco ou contar com uma restrição adequada, além do tratamento da transação.
PARTE 2 — Observabilidade, telemetria e Docker
Nesta etapa, os problemas estiveram relacionados à conexão com o banco, ao processamento de eventos no ambiente Docker e ao envio de erros para a ferramenta de monitoramento.
Desafio 8 — Conexão com o schema no Prisma
Desafio: Ao configurar a conexão com o banco, as consultas tentavam utilizar o schema public e retornavam o erro 42501: permission denied for schema public, embora o projeto precisasse acessar o schema acadêmico bi304128x.

Pergunta feita à IA (resumo): Como configurar a conexão do Prisma com o schema acadêmico correto quando as consultas estão sendo direcionadas para o schema public?

Síntese da resposta: A IA sugeriu utilizar um Pool da biblioteca pg com o adaptador @prisma/adapter-pg e executar SET search_path TO bi304128x no evento de conexão do Pool.

Análise e intervenção: A abordagem com o evento connect não resolveu o problema. Como o callback assíncrono não garantia que o comando SET search_path terminasse antes das consultas, essa solução poderia gerar uma condição de corrida. Durante os testes, retirei as adaptações extras de conexão e simplifiquei a configuração; depois disso, o ambiente voltou a conectar ao schema esperado.

A explicação original também dizia que a remoção dos arquivos de configuração teria reativado o motor Rust do Prisma. Essa conclusão não foi mantida: no Prisma ORM 7, o cliente padrão utiliza o compilador em TypeScript, sem os engines Rust, e a conexão direta exige um driver adapter. Por isso, o resultado observado no projeto não deve ser apresentado como uma regra geral para o Prisma 7. Antes da entrega, é importante conferir as versões de prisma, @prisma/client e @prisma/adapter-pg instaladas no projeto. A revisão desse ponto foi feita com base na documentação oficial do Prisma ORM 7 e no respectivo guia de atualização.
Desafio 9 — Processamento de eventos no GlitchTip
Desafio: O frontend enviava os eventos de erro e recebia o status HTTP 200, mas as ocorrências não apareciam no painel local do GlitchTip.

Pergunta feita à IA (resumo): O envio dos eventos retorna sucesso, mas o painel não registra os erros. Como verificar se o serviço responsável por processar a fila está funcionando?

Síntese da resposta: A IA identificou que o container responsável pelo worker estava encerrando logo após iniciar e sugeriu revisar o comando configurado no docker-compose.yml.

Análise e intervenção: O primeiro comando indicado, ./bin/run-celery-with-beat.sh, não existia na imagem utilizada. Conferi o comando disponível no ambiente e alterei a inicialização do serviço para celery -A glitchtip worker -l info. Depois do ajuste, o container permaneceu em execução e os eventos que estavam na fila começaram a aparecer no painel.
Desafio 10 — Captura de erros em funções assíncronas no Next.js
Desafio: O arquivo error.tsx capturava falhas durante a renderização, mas não registrava automaticamente erros lançados dentro de funções assíncronas acionadas por eventos da interface, como o clique de um botão.

Pergunta feita à IA (resumo): Por que um erro lançado dentro de uma função async chamada por um botão não é tratado pelo Error Boundary e não aparece no GlitchTip?

Síntese da resposta: A primeira orientação da IA direcionou a investigação para possíveis problemas de configuração do SDK e para os arquivos de inicialização do monitoramento.

Análise e intervenção: Depois de conferir a inicialização do SDK, identifiquei que o problema estava no local em que a exceção acontecia. Erros originados em manipuladores de eventos não são encaminhados automaticamente para os Error Boundaries de renderização. Ajustei a função assíncrona para tratar a falha com try/catch e enviar a exceção explicitamente por meio de Sentry.captureException(err), permitindo que o erro também fosse registrado no GlitchTip.
