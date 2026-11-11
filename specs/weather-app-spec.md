# Especificação de Produto — Aplicação de Previsão do Tempo

## Overview

Aplicação web responsiva para consultar o clima atual e a previsão diária de cidades brasileiras. A experiência prioriza quem se desloca diariamente e precisa tomar uma decisão rápida antes de sair, sem impedir o uso por pessoas que planejam atividades ao ar livre ou cuidam da rotina da família.

O usuário pode buscar uma cidade pelo nome, escolher o resultado correto quando houver homônimos, consultar as condições atuais e a previsão de cinco dias e alternar a temperatura entre Celsius e Fahrenheit. A aplicação não exige cadastro e, na v1, não coleta telemetria nem usa a localização do dispositivo.

O sucesso inicial será avaliado por testes de usabilidade: observar se participantes concluem a busca até a exibição da previsão e medir o tempo necessário para essa tarefa. Não haverá coleta de telemetria na v1.

## Functional Requirements

Os IDs RF-01 a RF-14 preservam a rastreabilidade com o discovery; RF-15 e RF-16 foram criados nesta especificação. Na v1, tanto os requisitos **Must** quanto os **Should** são obrigatórios na entrega (confirmado pelo solicitante); nenhum item **Should** será postergado. Cada requisito abaixo tem ao menos um critério verificável na seção **Acceptance Criteria**.

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF-01 | Permitir buscar cidades brasileiras pelo nome, usando texto livre validado pela aplicação e enviado somente por ação explícita (botão de busca ou tecla `Enter`), sem consulta durante a digitação. | Must |
| RF-02 | Apresentar cada cidade encontrada identificada pelo seu estado (ou indicação de estado ausente), permitindo distinguir cidades homônimas, e exigir a seleção explícita da cidade, mesmo quando houver um único resultado. | Must |
| RF-03 | Após a seleção de uma cidade, exibir o clima atual (considerado atual quando obtido há no máximo 5 minutos): temperatura (°C ou °F), sensação térmica (°C ou °F), umidade relativa (%), velocidade do vento (km/h), condição meteorológica em português do Brasil com ícone ilustrativo acessível e horário da atualização em formato 24h (`HH:MM`) no fuso da cidade. | Must |
| RF-04 | Exibir previsão diária para hoje e os quatro dias seguintes no fuso da cidade, com identificação da data em português do Brasil, temperatura máxima, mínima e condição meteorológica com ícone ilustrativo acessível de cada dia. Não inclui previsão horária. | Must |
| RF-05 | Permitir alternar a unidade de temperatura entre Celsius e Fahrenheit. | Must |
| RF-06 | Aplicar a unidade escolhida a todas as temperaturas mostradas, tanto no clima atual quanto na previsão. | Must |
| RF-07 | Persistir a unidade escolhida entre sessões no mesmo navegador, sem enviar essa preferência a um servidor. Quando o armazenamento do navegador estiver indisponível, manter a unidade em memória na sessão e informar de forma discreta e não bloqueante que a preferência não será salva. | Should |
| RF-08 | Informar quando a busca não encontrar uma cidade correspondente. | Must |
| RF-09 | Informar quando uma consulta de geocodificação ou de clima falhar por indisponibilidade do serviço, erro de rede ou timeout. | Must |
| RF-10 | Permitir que o usuário solicite nova tentativa depois de uma falha por meio de clique no botão “Tentar novamente”. | Should |
| RF-11 | Permitir consultar outra cidade na mesma sessão sem recarregar a aplicação e sem manter dados antigos da cidade anterior. | Should |
| RF-12 | Apresentar estados compreensíveis de carregamento, erro e ausência de conteúdo nos contextos em que se aplicam. | Must |
| RF-13 | Usar Celsius como unidade inicial quando não houver preferência previamente salva. | Must |
| RF-14 | Normalizar na própria aplicação o termo de busca — removendo acentos/diacríticos, normalizando espaços e tratando caracteres especiais como texto puro — de modo que nomes equivalentes com e sem acentuação retornem resultados correspondentes. | Must |
| RF-15 | Exibir, em todas as telas, rodapé com atribuição à Open-Meteo (com link para o site oficial do provedor) e aviso de que as previsões estão sujeitas a variações. | Must |
| RF-16 | Exibir temperaturas, sensação térmica, velocidade do vento e umidade como números inteiros, arredondando o valor de origem (após a conversão de unidade, quando aplicável) pela regra *half away from zero*. | Must |

## User Stories

| ID | História |
| --- | --- |
| US-01 | Como pessoa que se desloca diariamente, quero buscar uma cidade pelo nome, inclusive sem acentos ou com espaços extras, para verificar rapidamente o tempo antes de sair. (RF-01, RF-14) |
| US-02 | Como pessoa que se desloca diariamente, quero distinguir cidades com o mesmo nome pelo estado para consultar o lugar correto. (RF-02) |
| US-03 | Como pessoa que se desloca diariamente, quero ver as condições atuais atualizadas (com até 5 minutos e horário de atualização informado) e a previsão dos próximos cinco dias para decidir como me preparar. (RF-03, RF-04, RF-16, RNF-16) |
| US-04 | Como pessoa que planeja atividades ao ar livre, quero alternar a unidade de temperatura entre Celsius e Fahrenheit e manter essa preferência salva entre sessões (iniciando em Celsius por padrão) para interpretar as condições na unidade que prefiro. (RF-05, RF-06, RF-07, RF-13, RNF-13) |
| US-05 | Como pessoa que se desloca diariamente, quero receber uma mensagem clara quando não houver cidade correspondente ou quando o serviço falhar e poder tentar novamente clicando em um botão para concluir minha consulta. (RF-08, RF-09, RF-10) |
| US-06 | Como pessoa que planeja atividades ao ar livre, quero consultar outras cidades na mesma sessão sem recarregar a aplicação e sem ver dados antigos da consulta anterior para continuar planejando com segurança. (RF-11, RF-12) |
| US-07 | Como pessoa que cuida da família, quero identificar visualmente, por teclado, em telas móveis e com apoio de tecnologias assistivas os estados de carregamento, resultados de busca, erro e ausência de conteúdo para saber quando a consulta está pronta ou precisa de atenção. (RF-12, RNF-01, RNF-02, RNF-04, RNF-13, RNF-17) |
| US-08 | Como pessoa que se desloca diariamente, quero ver a fonte dos dados e um aviso de que a previsão pode variar para interpretar as informações com a cautela adequada. (RF-15) |

## Acceptance Criteria

Cada critério usa Given/When/Then (Dado/Quando/Então), descreve um resultado observável e pode ser verificado com respostas de serviço controladas, sem depender de telemetria de usuários.

### US-01 — Busca de cidade e normalização na aplicação

- **CA-01.1 (RF-01):** **Given** que a busca contém a cidade brasileira “Recife” como resultado; **When** a pessoa envia a consulta “Recife”; **Then** os resultados incluem Recife, identificada como cidade do Brasil.
- **CA-01.2 (RF-14):** **Given** que “São Paulo” está disponível nos resultados da busca; **When** a pessoa pesquisa “São Paulo” e depois “Sao Paulo”; **Then** a aplicação normaliza os acentos do termo antes da consulta e as duas buscas retornam o mesmo identificador de cidade nos resultados.
- **CA-01.3 (RF-01):** **Given** que o campo de busca está vazio ou contém somente espaços; **When** a pessoa envia a busca; **Then** nenhuma consulta é enviada ao serviço de geocodificação, aparece “Digite o nome de uma cidade para buscar.” junto ao campo e nenhuma cidade é apresentada como resultado.
- **CA-01.4 (RF-01, RF-14):** **Given** que o texto digitado é “  São   Paulo  ”, com espaços nas extremidades e repetidos entre as palavras; **When** a pessoa envia a busca; **Then** a aplicação normaliza os espaços e acentos antes do envio e retorna os mesmos resultados da busca por “São Paulo”.
- **CA-01.5 (RF-08, RF-14):** **Given** que o texto contém caracteres especiais ou emojis sem correspondência com nomes de cidades, como “@#$ 🌧”; **When** a pessoa envia a busca; **Then** a aplicação trata e normaliza a entrada apenas como texto puro (sem interpretá-la como marcação), nenhum erro técnico é exibido e, não havendo correspondência, aparece “Nenhuma cidade encontrada.”.
- **CA-01.6 (RF-01):** **Given** que o texto excede 80 caracteres; **When** a pessoa envia a busca; **Then** nenhuma consulta é enviada e a interface exibe “O nome da cidade deve ter no máximo 80 caracteres.” junto ao campo.
- **CA-01.7 (RF-01):** **Given** que o texto tem menos de 2 caracteres após a aplicação remover espaços das extremidades; **When** a pessoa envia a busca; **Then** nenhuma consulta é enviada e aparece “Digite pelo menos 2 caracteres.” junto ao campo.
- **CA-01.8 (RF-01):** **Given** que a busca retorna mais de 10 resultados; **When** a lista é exibida; **Then** no máximo 10 resultados são apresentados, na ordem retornada pelo serviço.
- **CA-01.9 (RF-01):** **Given** que a pessoa digita um termo válido no campo de busca; **When** ainda não aciona o botão de busca nem a tecla `Enter`; **Then** nenhuma consulta de geocodificação é enviada e nenhuma sugestão é exibida; a consulta ocorre somente após o envio explícito.
- **CA-01.10 (RF-01, RF-14, RNF-16):** **Given** que uma busca por um termo normalizado (ex.: “São Paulo”) retornou resultados há menos de 10 minutos na sessão atual; **When** a pessoa envia novamente o mesmo termo normalizado, inclusive sem acentos (“Sao Paulo”); **Then** a lista é exibida a partir dos dados armazenados na sessão, sem nova consulta ao serviço de geocodificação. **When** a mesma busca é enviada com resultados com mais de 10 minutos de idade; **Then** os dados antigos não são reutilizados e uma nova consulta é realizada. **When** a consulta anterior resultou em falha ou erro; **Then** a falha não é armazenada e a nova tentativa é enviada ao serviço.

### US-02 — Desambiguação

- **CA-02.1 (RF-02):** **Given** que a busca retorna cidades brasileiras (incluindo duas ou mais homônimas em estados diferentes); **When** a lista de resultados é exibida; **Then** cada opção mostra o nome da cidade acompanhado do estado correspondente (padrão “Cidade — Estado”) de forma visível e no rótulo acessível da opção.
- **CA-02.2 (RF-02):** **Given** que a lista contém cidades homônimas de estados diferentes; **When** a pessoa seleciona uma delas; **Then** a cidade ativa exibida no cabeçalho do clima e a consulta realizada correspondem exatamente à opção selecionada, incluindo seu estado.
- **CA-02.3 (RF-02):** **Given** que a resposta de geocodificação traz uma cidade sem informação de estado; **When** a lista de resultados é exibida; **Then** a opção permanece selecionável, mostra “Cidade — Estado não informado” e nenhuma outra opção é ocultada.
- **CA-02.4 (RF-02):** **Given** que a busca retorna exatamente uma cidade; **When** a lista de resultados é exibida; **Then** a cidade aparece como única opção, nenhuma opção é selecionada automaticamente, nenhuma consulta de clima é realizada e a consulta só ocorre depois que a pessoa ativa a opção por clique, toque ou teclado.

### US-03 — Clima atual, frescor e previsão

- **CA-03.1 (RF-03, RNF-06):** **Given** que a resposta de clima atual foi obtida há no máximo 5 minutos e contém temperatura, sensação térmica, umidade, vento, código de condição meteorológica e horário de referência; **When** a pessoa seleciona a cidade correspondente; **Then** são exibidos temperatura, sensação térmica, umidade em `%`, velocidade do vento em `km/h`, descrição textual da condição em português do Brasil acompanhada de ícone ilustrativo e a indicação “Atualizado às HH:MM” em formato 24 horas no fuso horário da cidade consultada.
- **CA-03.2 (RF-04, RNF-06):** **Given** uma data de referência e o fuso horário da cidade selecionada; **When** a previsão é exibida; **Then** ela contém exatamente cinco datas diárias na ordem cronológica local da cidade (hoje e os quatro dias seguintes, sem registros horários), com o rótulo “Hoje, DD/MM” no primeiro item e “Dia, DD/MM” nos quatro seguintes, usando o dia da semana abreviado em português do Brasil (`Dom.`, `Seg.`, `Ter.`, `Qua.`, `Qui.`, `Sex.`, `Sáb.`), por exemplo “Qui., 12/11”.
- **CA-03.3 (RF-04):** **Given** que a resposta contém previsão diária para os cinco dias; **When** a previsão é exibida; **Then** cada dia mostra temperatura máxima, temperatura mínima e descrição textual da condição meteorológica em português do Brasil com ícone ilustrativo correspondente àquela data.
- **CA-03.4 (RF-03, RNF-16):** **Given** dados de clima previamente armazenados em cache para uma cidade; **When** a cidade é consultada com dados de até 5 minutos de idade; **Then** os dados em cache são exibidos como clima atual mantendo o horário original em “Atualizado às HH:MM”. **When** os dados em cache têm mais de 5 minutos de idade; **Then** são tratados como dados antigos, não são exibidos como clima atual e uma nova consulta ao serviço é realizada.
- **CA-03.5 (RF-03, RF-04):** **Given** que a resposta da consulta omite ou traz valor nulo para qualquer campo individual do clima atual (temperatura, sensação térmica, umidade, vento ou condição) ou de qualquer dia da previsão (máxima, mínima ou condição); **When** os dados são exibidos; **Then** cada campo ausente exibe “Dados indisponíveis”, os demais campos e dias válidos continuam exibidos normalmente e nenhum “undefined” ou “NaN” aparece na tela.
- **CA-03.6 (RF-03, RF-04, RNF-04, RNF-06):** **Given** um código numérico de condição meteorológica (padrão WMO da Open-Meteo) no clima atual ou na previsão; **When** a condição é renderizada; **Then** o código mapeado exibe seu rótulo em português do Brasil conforme a tabela de referência abaixo e um ícone vetorial ilustrativo, de conjunto próprio do projeto ou de licença livre compatível, marcado como decorativo (sem duplicar a leitura do texto em tecnologias assistivas); se o código numérico não estiver mapeado, exibe “Condição desconhecida”.

#### Tabela de referência — Condições meteorológicas (códigos WMO em pt-BR)

| Código(s) WMO | Rótulo em português do Brasil |
| --- | --- |
| 0 | Céu limpo |
| 1 | Predominantemente limpo |
| 2 | Parcialmente nublado |
| 3 | Encoberto |
| 45, 48 | Nevoeiro |
| 51, 53, 55 | Garoa leve / Garoa moderada / Garoa intensa |
| 56, 57 | Garoa congelante |
| 61, 63, 65 | Chuva leve / Chuva moderada / Chuva forte |
| 66, 67 | Chuva congelante |
| 71, 73, 75 | Neve fraca / Neve moderada / Neve forte |
| 77 | Grãos de neve |
| 80, 81, 82 | Pancadas de chuva leves / Pancadas de chuva moderadas / Pancadas de chuva fortes |
| 85, 86 | Pancadas de neve |
| 95 | Tempestade |
| 96, 99 | Tempestade com granizo |
| Outro código numérico | Condição desconhecida |

- **CA-03.7 (RF-03, RF-04, RF-06, RF-16):** **Given** valores de origem em °C, km/h e % com casas decimais; **When** são exibidos; **Then** temperatura atual, sensação térmica, máxima, mínima, velocidade do vento e umidade aparecem como números inteiros, sem casas decimais, obtidos por arredondamento *half away from zero* do valor de origem (após a conversão para °F, quando selecionada). Exemplos: 23,5 °C → “24 °C” e “74 °F”; -1,5 °C → “-2 °C” e “29 °F”; 20,3 °C → “20 °C” e “69 °F”; 12,5 km/h → “13 km/h”; 64,5 % → “65 %”. Um resultado que arredonde para zero negativo é exibido como “0”.

### US-04 — Unidade de temperatura

- **CA-04.1 (RF-05):** **Given** que os dados de clima estão visíveis em Celsius; **When** a pessoa seleciona Fahrenheit no controle de unidade; **Then** Fahrenheit passa a ser a unidade selecionada.
- **CA-04.2 (RF-06):** **Given** dados de teste com valores em Celsius para o clima atual e cada dia da previsão; **When** a pessoa seleciona Fahrenheit; **Then** toda temperatura atual, sensação térmica, máxima e mínima é convertida pela fórmula °F = (°C × 9/5) + 32 a partir do valor de origem, arredondada conforme CA-03.7 e identificada como °F. Com Celsius selecionado, todas são identificadas como °C.
- **CA-04.3 (RF-13):** **Given** que o navegador não tem preferência de unidade salva; **When** a aplicação é iniciada; **Then** Celsius está selecionado e as temperaturas disponíveis são identificadas como °C.
- **CA-04.4 (RF-07):** **Given** que o armazenamento local do navegador está disponível e a pessoa selecionou Fahrenheit; **When** a aplicação é encerrada e iniciada novamente no mesmo navegador; **Then** Fahrenheit continua selecionado. As requisições enviadas pela aplicação não incluem essa preferência como dado de usuário.
- **CA-04.5 (RNF-13):** **Given** que uma tecnologia assistiva acompanha as mensagens da interface; **When** a pessoa muda a unidade para Fahrenheit; **Then** uma mensagem anunciada informa a unidade ativa e o controle indica Fahrenheit como selecionado.
- **CA-04.6 (RF-07, RNF-13):** **Given** que o armazenamento local do navegador está indisponível ou bloqueado; **When** a pessoa altera a unidade e a aplicação não consegue salvar a preferência; **Then** a nova unidade é aplicada imediatamente e mantida em memória durante a sessão, e o aviso “Não foi possível salvar sua preferência de unidade. Ela valerá apenas nesta sessão.” é exibido junto ao controle de unidade e anunciado por tecnologias assistivas sem interromper a leitura em curso. O aviso permanece visível enquanto a persistência estiver indisponível e nenhuma funcionalidade fica bloqueada. Se a leitura do armazenamento falhar na inicialização, a unidade inicial é Celsius (RF-13).

### US-05 — Resultado sem correspondência, falha e nova tentativa

- **CA-05.1 (RF-08):** **Given** que a busca foi concluída sem cidades correspondentes; **When** os resultados são exibidos; **Then** aparece “Nenhuma cidade encontrada.” e nenhuma cidade é marcada como selecionada.
- **CA-05.2 (RF-09):** **Given** que a consulta de clima responde com erro de serviço, falha de rede ou não responde em até 10 s; **When** a pessoa consulta uma cidade; **Then** o carregamento é encerrado, aparece “Não foi possível carregar o clima. Tente novamente.”, nenhum dado da consulta malsucedida é apresentado como clima atual e o botão “Tentar novamente” é exibido.
- **CA-05.3 (RF-10):** **Given** que uma consulta de clima falhou e a mensagem de erro e o botão “Tentar novamente” estão visíveis; **When** a pessoa clica no botão “Tentar novamente” e a nova consulta retorna dados válidos; **Then** os dados da nova resposta são exibidos e a mensagem de erro deixa de ser exibida.
- **CA-05.4 (RF-09, RF-12):** **Given** que a busca de cidades falha por erro de rede, indisponibilidade ou não responde em até 10 s; **When** a interface apresenta o resultado; **Then** o carregamento é encerrado, aparece “Não foi possível buscar cidades. Tente novamente.” (distinta da falha de clima), resultados de buscas anteriores não são exibidos e o botão “Tentar novamente” é apresentado.
- **CA-05.5 (RF-10):** **Given** que uma busca de cidades falhou e o botão “Tentar novamente” está visível; **When** a pessoa clica no botão “Tentar novamente” e o serviço responde com cidades válidas; **Then** a busca é refeita para o termo consultado, a mensagem de erro desaparece e os resultados correspondentes são exibidos.
- **CA-05.6 (RF-10):** **Given** que uma nova tentativa de busca ou de consulta de clima foi iniciada; **When** a pessoa clica no botão “Tentar novamente” mais de uma vez enquanto a resposta está pendente; **Then** o botão permanece desabilitado durante a pendência, apenas uma requisição é enviada e o estado de carregamento continua visível até a conclusão.

### US-06 — Consultar outras cidades e descarte de dados antigos

- **CA-06.1 (RF-11):** **Given** que uma cidade já foi consultada; **When** a pessoa busca e seleciona outra cidade; **Then** a nova consulta é realizada sem navegação ou recarregamento da página.
- **CA-06.2 (RF-11):** **Given** que a segunda cidade retorna dados diferentes da primeira; **When** a consulta da segunda cidade é concluída; **Then** o nome da cidade ativa, o clima atual, o horário de atualização e a previsão exibidos correspondem exclusivamente à segunda cidade.
- **CA-06.3 (RF-11, RF-12):** **Given** que os dados de clima de uma primeira cidade estão visíveis na tela; **When** a pessoa seleciona uma segunda cidade e a nova consulta está pendente ou termina com falha; **Then** os dados antigos da primeira cidade deixam de ser exibidos imediatamente, apresentando apenas “Carregando clima...” durante a pendência ou a mensagem de erro e o botão “Tentar novamente” em caso de falha.
- **CA-06.4 (RF-11):** **Given** que uma busca de cidades ou consulta de clima para uma primeira entrada ainda está pendente; **When** a pessoa inicia uma segunda busca ou seleciona outra cidade antes da resposta da primeira chegar; **Then** a resposta atrasada da primeira requisição é descartada e a tela reflete exclusivamente o resultado da ação mais recente.
- **CA-06.5 (RF-11):** **Given** que uma cidade foi consultada e seus dados estão visíveis; **When** a pessoa recarrega a página; **Then** a aplicação retorna ao estado inicial descrito em CA-07.1, preservando apenas a unidade salva (quando o armazenamento estiver disponível). A URL não contém cidade nem termo de busca em nenhum momento e selecionar cidades não adiciona entradas ao histórico de navegação (o botão Voltar do navegador não percorre cidades anteriores).

### US-07 — Estados da interface, acessibilidade e responsividade

- **CA-07.1 (RF-12):** **Given** que nenhuma cidade foi selecionada e não há dados de clima; **When** a tela inicial é exibida; **Then** a interface mostra “Busque uma cidade para consultar o clima.” e não mostra dados meteorológicos.
- **CA-07.2 (RF-12):** **Given** que uma busca de cidades ou uma consulta de clima foi enviada e a resposta ainda não chegou; **When** a requisição está pendente; **Then** a interface mostra “Buscando cidades...” para geocodificação ou “Carregando clima...” para clima até a conclusão, desativando esse estado assim que houver sucesso ou erro.
- **CA-07.3 (RF-12):** **Given** que a consulta de clima foi concluída sem nenhum registro de previsão diária; **When** a área de previsão é exibida; **Then** aparece “Previsão indisponível para esta cidade.” e nenhum dia é apresentado como previsão válida.
- **CA-07.4 (RNF-13):** **Given** que uma tecnologia assistiva acompanha as regiões dinâmicas da interface; **When** uma busca de cidades é concluída com resultados ou sem correspondência; **Then** a tecnologia assistiva anuncia a quantidade de resultados disponíveis ou a mensagem “Nenhuma cidade encontrada.”.
- **CA-07.5 (RNF-13):** **Given** que uma tecnologia assistiva acompanha as mensagens de estado da interface; **When** a aplicação entra em carregamento de busca de cidades ou de consulta de clima; **Then** o estado “Buscando cidades...” ou “Carregando clima...” é anunciado pela tecnologia assistiva.
- **CA-07.6 (RNF-13):** **Given** que uma tecnologia assistiva acompanha os alertas da interface; **When** ocorre erro de validação da busca, falha na busca de cidades ou falha na consulta de clima; **Then** a mensagem de erro correspondente exibida na tela é anunciada imediatamente pela tecnologia assistiva.
- **CA-07.7 (RNF-04):** **Given** que a pessoa navega exclusivamente por teclado em qualquer estado da aplicação; **When** percorre e aciona o campo de busca, o envio da busca, as opções de cidades, o seletor de unidade e o botão “Tentar novamente”; **Then** todos os controles possuem rótulo acessível, indicador de foco visível, contraste mínimo WCAG 2.1 AA (4,5:1 para texto normal e 3:1 para texto grande e controles) e não ocorre armadilha de foco.
- **CA-07.8 (RNF-01, RNF-02):** **Given** larguras de tela entre 320 px e 1920 px em orientação retrato ou paisagem; **When** qualquer estado da interface (inicial, lista de resultados, carregamento, dados de clima ou erro) é exibido; **Then** não há rolagem horizontal e todos os controles interativos possuem área clicável/tocável mínima de 44 × 44 px.
- **CA-07.9 (RNF-17, RNF-04):** **Given** que o sistema operacional ou o navegador da pessoa prefere tema claro ou escuro; **When** a aplicação é exibida em qualquer estado; **Then** o tema escuro é aplicado, nenhum seletor de tema é oferecido, nenhuma marca ou logotipo corporativo externo é exibido e os critérios de contraste de CA-07.7 são atendidos.

### US-08 — Atribuição e aviso de precisão

- **CA-08.1 (RF-15):** **Given** qualquer estado da aplicação (inicial, carregamento, resultados, dados de clima, ausência de conteúdo ou erro); **When** a tela é exibida; **Then** há um rodapé com o texto “Dados meteorológicos por Open-Meteo. Previsões sujeitas a variações.”, em que “Open-Meteo” é um link para o site oficial do provedor, acessível por teclado e com rótulo acessível. O rodapé não sobrepõe outros conteúdos nem causa rolagem horizontal (RNF-01).

### Rastreabilidade

#### Por User Story

| User Story | Requisitos Funcionais | Requisitos Não-Funcionais | Critérios de Aceite |
| --- | --- | --- | --- |
| US-01 | RF-01, RF-08, RF-14 | RNF-06, RNF-16 | CA-01.1 a CA-01.10 |
| US-02 | RF-02 | RNF-04, RNF-06 | CA-02.1 a CA-02.4 |
| US-03 | RF-03, RF-04, RF-16 | RNF-03, RNF-04, RNF-06, RNF-16 | CA-03.1 a CA-03.7 |
| US-04 | RF-05, RF-06, RF-07, RF-13 | RNF-07, RNF-13 | CA-04.1 a CA-04.6 |
| US-05 | RF-08, RF-09, RF-10, RF-12 | RNF-05, RNF-13 | CA-05.1 a CA-05.6 |
| US-06 | RF-11, RF-12 | RNF-03, RNF-16 | CA-06.1 a CA-06.5 |
| US-07 | RF-12 | RNF-01, RNF-02, RNF-04, RNF-13, RNF-17 | CA-07.1 a CA-07.9 |
| US-08 | RF-15 | RNF-01, RNF-04, RNF-06 | CA-08.1 |

Requisitos não-funcionais transversais, sem vínculo direto com uma User Story: RNF-08 (compatibilidade), RNF-09 (qualidade e cobertura de testes), RNF-14 (disponibilidade) e RNF-15 (HTTPS e segurança de chaves).

#### Por Requisito

| Requisito | Critérios de aceite / Verificação |
| --- | --- |
| RF-01 | CA-01.1, CA-01.3, CA-01.4, CA-01.6, CA-01.7, CA-01.8, CA-01.9, CA-01.10 |
| RF-02 | CA-02.1, CA-02.2, CA-02.3, CA-02.4 |
| RF-03 | CA-03.1, CA-03.4, CA-03.5, CA-03.6, CA-03.7 |
| RF-04 | CA-03.2, CA-03.3, CA-03.5, CA-03.6, CA-03.7 |
| RF-05 | CA-04.1 |
| RF-06 | CA-04.2, CA-03.7 |
| RF-07 | CA-04.4, CA-04.6 |
| RF-08 | CA-01.5, CA-05.1 |
| RF-09 | CA-05.2, CA-05.4 |
| RF-10 | CA-05.3, CA-05.5, CA-05.6 |
| RF-11 | CA-06.1, CA-06.2, CA-06.3, CA-06.4, CA-06.5 |
| RF-12 | CA-05.4, CA-06.3, CA-07.1, CA-07.2, CA-07.3 |
| RF-13 | CA-04.3 |
| RF-14 | CA-01.2, CA-01.4, CA-01.5, CA-01.10 |
| RF-15 | CA-08.1 |
| RF-16 | CA-03.7 |
| RNF-01, RNF-02 | CA-07.8 (testes E2E em viewports mobile e desktop) |
| RNF-03 | Medição de LCP ≤ 2,5 s sob perfil 4G simulado com respostas controladas |
| RNF-04 | CA-03.6, CA-07.7 (auditoria automatizada e inspeção manual de teclado/contraste) |
| RNF-05 | CA-05.2, CA-05.3, CA-05.4, CA-05.5 |
| RNF-06 | CA-01.3, CA-03.1, CA-03.2, CA-03.6, CA-05.1, CA-05.2, CA-05.4, CA-07.1, CA-07.2, CA-07.3 |
| RNF-07 | CA-04.4 e inspeção de tráfego de rede (ausência de cadastro, geolocalização e telemetria) |
| RNF-08 | Execução E2E dos fluxos principais na matriz de navegadores definida em RNF-08 |
| RNF-09 | Suíte automatizada cobrindo os critérios CA-01 a CA-07 |
| RNF-13 | CA-04.5, CA-04.6, CA-07.4, CA-07.5, CA-07.6 |
| RNF-14, RNF-15 | Verificação de publicação sob HTTPS e ausência de chaves expostas (RNF-15); disponibilidade mensal de 99,5% medida sobre a entrega da aplicação web (RNF-14) |
| RNF-16 | CA-01.10, CA-03.4 |
| RNF-17 | CA-07.9 |

## Non-Functional Requirements

| ID | Categoria | Requisito |
| --- | --- | --- |
| RNF-01 | Responsividade | A interface deve funcionar em larguras de 320 px a 1920 px, em retrato e paisagem, sem rolagem horizontal em nenhum estado (consolida o antigo RNF-12). |
| RNF-02 | Usabilidade mobile | Todos os controles interativos devem ter alvos de toque de no mínimo 44 × 44 px e espaçamento suficiente para evitar acionamento acidental em telas a partir de 320 px. |
| RNF-03 | Desempenho | O Largest Contentful Paint (LCP) da tela inicial e da tela de dados do clima deve ocorrer em até 2,5 s sob perfil de rede 4G simulado (150 ms RTT, 1,6 Mbps download, throttling de CPU 4x em viewport mobile) com respostas controladas documentadas. Não há metas adicionais para outras redes (ex.: 3G) na v1. |
| RNF-04 | Acessibilidade | A interface deve atender WCAG 2.1 nível AA, verificável por auditoria automatizada e inspeção manual: contraste mínimo de 4,5:1 para texto normal e 3:1 para texto grande e controles, rótulos acessíveis em todos os campos e botões, foco visível e operação integral via teclado sem armadilhas de foco. |
| RNF-05 | Disponibilidade de dados | A interface deve degradar de forma controlada quando o provedor externo de dados estiver indisponível, sem falhar integralmente. |
| RNF-06 | Idioma e convenções locais | A interface, os rótulos de condições meteorológicas, as mensagens ao usuário e a formatação de datas (`DD/MM` e dia da semana abreviado) e horários (`HH:MM` em 24h) devem seguir o português do Brasil; os valores numéricos meteorológicos são exibidos como inteiros (RF-16). |
| RNF-07 | Privacidade | A aplicação não deve exigir cadastro nem coletar dados pessoais ou telemetria na v1. Não deve solicitar localização do dispositivo. |
| RNF-08 | Compatibilidade | As funcionalidades principais devem operar nas últimas 2 versões estáveis de Chrome (Android e desktop), Safari (iOS/iPadOS ≥ 16 e macOS), Edge (desktop) e Firefox (desktop). Navegadores fora dessa matriz não têm suporte garantido (unifica o antigo RNF-10 do discovery). |
| RNF-09 | Manutenibilidade e qualidade | As funcionalidades devem ter cobertura por testes automatizados verificáveis contra os critérios desta especificação. |
| RNF-10, RNF-11, RNF-12 | — | Consolidados respectivamente em RNF-08, RNF-03 e RNF-01 para preservar a numeração do discovery sem duplicidade. |
| RNF-13 | Acessibilidade | Resultados de busca, estados de carregamento, mensagens de erro e mudança de unidade devem ser anunciados a leitores de tela. |
| RNF-14 | Disponibilidade | A meta de disponibilidade mensal de 99,5% aplica-se à entrega da própria aplicação web sob HTTPS. Falhas do provedor Open-Meteo são tratadas como degradação controlada de dados (RNF-05) e não contam como indisponibilidade da aplicação. |
| RNF-15 | Segurança | O acesso publicado deve usar HTTPS e nenhuma chave de API deve ser exposta ao usuário. |
| RNF-16 | Desempenho e frescor | Respostas de geocodificação devem ser reutilizadas em cache dentro da sessão atual por no mínimo 10 minutos. Respostas de clima devem ser reutilizadas em cache por no máximo 5 minutos, prazo em que o dado é considerado atual. |
| RNF-17 | Tema visual | A interface usa tema escuro fixo (*dark glassmorphism*), sem seletor de tema, sem adaptação à preferência de tema do sistema e sem marca corporativa externa, atendendo aos critérios de contraste de RNF-04. |

## Edge Cases

- **Busca vazia ou composta somente por espaços:** não iniciar consulta nem apresentar cidade como resultado. Exibir a mensagem “Digite o nome de uma cidade para buscar.” junto ao campo de busca. Entradas com menos de 2 caracteres, após a aplicação remover espaços das extremidades, exibem “Digite pelo menos 2 caracteres.” e também não iniciam consulta.
- **Cidade não encontrada:** exibir o estado sem resultados definido em CA-05.1 e permitir que o usuário faça outra busca.
- **Cidades homônimas:** exigir escolha explícita entre resultados identificados pelo estado; não presumir qual cidade o usuário quis dizer. Mesmo com um único resultado, a cidade não é selecionada automaticamente (CA-02.4).
- **Digitação sem envio:** a aplicação não consulta o serviço nem exibe sugestões enquanto a pessoa digita; a busca ocorre somente por botão de busca ou tecla `Enter` (CA-01.9).
- **Normalização de acentos, espaços e caracteres especiais:** é responsabilidade da própria aplicação normalizar o termo antes do envio/comparação — removendo espaços nas extremidades, colapsando espaços repetidos entre palavras, removendo acentos/diacríticos para equivalência de grafia (CA-01.2) e tratando caracteres especiais apenas como texto puro, sem interpretá-los como código ou marcação. Maiúsculas e minúsculas não alteram o resultado. Entradas sem correspondência com nomes de cidades resultam em “Nenhuma cidade encontrada.”, sem erro técnico. Entradas com mais de 80 caracteres têm o envio bloqueado com a mensagem “O nome da cidade deve ter no máximo 80 caracteres.”.
- **Falha de rede ou indisponibilidade no clima:** comunicar erro conforme CA-05.2, encerrar o carregamento e exibir o botão “Tentar novamente”, acionado por clique. Nenhum dado antigo de consulta anterior deve ser apresentado como resultado atual. Não há tentativas automáticas; a nova tentativa é sempre solicitada manualmente pelo usuário.
- **Falha na geocodificação:** quando a busca de cidades falhar por erro ou timeout de 10 s, exibir “Não foi possível buscar cidades. Tente novamente.”, distinta da mensagem de falha do clima, remover da tela os resultados de buscas anteriores e exibir o botão “Tentar novamente” para refazer a busca por clique.
- **Resposta parcial ou campo ausente:** aplicar regra única em toda a aplicação — qualquer campo individual ausente ou nulo no clima atual ou na previsão diária exibe “Dados indisponíveis”, sem mostrar valores como `undefined` ou `NaN`, sem inventar valores e sem ocultar os demais campos ou dias válidos (CA-03.5).
- **Código meteorológico não mapeado:** quando o provedor retornar um código numérico de condição meteorológica não previsto na tabela de referência, exibir “Condição desconhecida” (CA-03.6), diferenciando-o de campo nulo ou ausente (“Dados indisponíveis”).
- **Previsão sem dados:** quando não houver nenhum registro diário de previsão na resposta, mostrar “Previsão indisponível para esta cidade.” (CA-07.3), em vez de preencher dias inexistentes.
- **Dados em cache e frescor:** um dado meteorológico é considerado atual somente se tiver até 5 minutos desde sua obtenção, devendo exibir o horário correspondente em “Atualizado às HH:MM” no fuso da cidade consultada. Dados em cache com mais de 5 minutos são tratados como antigos, descartados para exibição imediata como clima atual e substituídos por nova consulta (CA-03.4).
- **Fuso horário diferente do dispositivo:** as datas da previsão, a definição de hoje e o horário de atualização devem corresponder ao fuso horário local da cidade consultada.
- **Alternância repetida de unidade:** converter sempre a partir dos valores de origem em Celsius, sem acumular conversões que alterem progressivamente a temperatura exibida; o arredondamento é aplicado somente na exibição (CA-03.7).
- **Arredondamento para zero negativo:** valores que arredondem para “-0” são exibidos como “0” (CA-03.7).
- **Recarregar a página ou usar Voltar:** recarregar retorna ao estado inicial, preservando apenas a unidade salva; a cidade não consta na URL nem no histórico de navegação (CA-06.5).
- **Armazenamento local indisponível:** a aplicação deve continuar utilizável durante a sessão, aplicando a unidade escolhida em memória; a persistência entre sessões não ocorre e a pessoa é informada pelo aviso não bloqueante definido em CA-04.6.
- **Dados antigos ao consultar outra cidade:** ao selecionar uma nova cidade enquanto já existem dados exibidos de uma cidade anterior, os dados antigos devem ser imediatamente removidos da visualização durante o carregamento e em caso de falha da nova consulta (CA-06.3).
- **Consultas concorrentes ou respostas fora de ordem:** se o usuário iniciar uma nova busca de cidade ou selecionar outra cidade enquanto uma consulta anterior estiver em andamento, a resposta pendente anterior deve ser descartada para nunca sobrescrever a consulta mais recente (CA-06.4).
- **Timeout:** considerar falha qualquer consulta que não responda em até 10 s, tanto para geocodificação quanto para clima, encerrando o carregamento e apresentando a mensagem de erro correspondente e o botão “Tentar novamente”.
- **Homônimo sem estado informado:** se a resposta de geocodificação não trouxer o estado de uma cidade, a opção continua selecionável e exibe “Cidade — Estado não informado”, sem ocultar a cidade (CA-02.3).
- **Clique repetido no botão “Tentar novamente”:** enquanto uma nova tentativa estiver pendente, o botão deve permanecer desabilitado, sem disparar requisições adicionais para a mesma consulta, mantendo o estado de carregamento visível.

## Assumptions

- **A-01:** O público prioritário é a pessoa que se desloca diariamente; as demais personas do discovery são secundárias.
- **A-02:** A v1 é uma aplicação web responsiva, usada no navegador, sem aplicativo nativo ou instalação como PWA.
- **A-03:** A busca cobre cidades do Brasil e aceita nome de cidade normalizado pela aplicação; CEP e coordenadas não são aceitos.
- **A-04:** A previsão de cinco dias é diária e inclui hoje mais os quatro dias seguintes, na data local da cidade; não há previsão horária.
- **A-05:** Celsius é a unidade inicial, e a preferência de unidade é armazenada localmente no navegador quando possível.
- **A-06:** A fonte de dados é a Open-Meteo, sem chave de API pessoal, usada em contexto não comercial/educacional sob licença CC BY 4.0, com atribuição obrigatória conforme RF-15. Uso comercial corporativo exige nova decisão e validação dos termos comerciais do provedor.
- **A-07:** Não há contas, login, dados persistidos no servidor, telemetria, notificações, mapas ou histórico/favoritos na v1.
- **A-08:** A interface da v1 é somente em português do Brasil.
- **A-09:** Não será usada geolocalização do dispositivo na v1; se isso mudar, será necessária ação explícita e consentimento do usuário.
- **A-10:** WCAG 2.1 AA é a referência obrigatória de acessibilidade desta especificação.
- **A-11:** O critério inicial de sucesso do produto será observado em testes de usabilidade, sem instrumentação de telemetria.
- **A-12:** As unidades meteorológicas fixas seguem o padrão adotado no Brasil: velocidade do vento em `km/h`, umidade relativa em `%`, pressão atmosférica em `hPa` e precipitação em `mm`. Na v1, são exibidos os campos definidos em RF-03 e RF-04; pressão e precipitação não compõem a tela inicial da v1.
- **A-13:** Os requisitos classificados como `Must` e `Should` são obrigatórios na v1 (confirmado pelo solicitante, sem cortes previstos).
- **A-14:** A v1 usa tema escuro fixo e não há guia de marca externo a seguir.
- **A-15:** A v1 não possui roteamento por cidade (sem deep links); o estado da consulta não sobrevive ao recarregamento da página.

## Risks

| ID | Risco | Mitigação ou acompanhamento |
| --- | --- | --- |
| R-01 | Indisponibilidade ou limite de uso do provedor pode impedir consultas. | Exibir estados de erro, permitir nova tentativa por clique no botão “Tentar novamente” e validar limites do serviço antes da publicação. |
| R-02 | Termos de uso, atribuição ou licença do provedor podem ser incompatíveis com o uso pretendido. | Manter uso não comercial/educacional com atribuição CC BY 4.0 (RF-15); qualquer uso comercial exige nova validação de termos antes da entrega. |
| R-03 | Homônimos e grafias diferentes podem levar a uma cidade incorreta. | Distinguir resultados pelo estado e normalizar acentos e espaços na própria aplicação (RF-14). |
| R-04 | Mudanças de decisão após a validação podem causar retrabalho ou expectativa divergente. | Decisões D-01 a D-10 registradas na seção Open Questions; qualquer alteração exige nova validação do solicitante e atualização desta especificação. |
| R-05 | Latência de redes móveis ou do serviço externo pode exceder a meta de desempenho. | Validar LCP ≤ 2,5 s nas condições documentadas em RNF-03 e apresentar carregamento e falha de forma controlada. |
| R-06 | Componentes de busca, estados assíncronos e seletor de unidade podem falhar em teclado ou leitor de tela. | Validar WCAG 2.1 AA e cobrir anúncios de resultados, carregamento, erros e troca de unidade nos critérios de aceite. |
| R-07 | Diferenças entre navegadores podem afetar a experiência. | Validar as funcionalidades principais na matriz de navegadores definida em RNF-08. |
| R-08 | Sem KPIs de negócio ou telemetria, o sucesso em produção não pode ser quantificado. | Usar testes de usabilidade na v1 e decidir métricas e política de privacidade antes de qualquer telemetria futura. |
| R-09 | Cache longo poderia exibir como atual um dado meteorológico defasado. | Limitar a validade de clima atual a no máximo 5 minutos, exibir “Atualizado às HH:MM” e descartar dados antigos (CA-03.4, RNF-16). |
| R-10 | Fuso horário do dispositivo pode deslocar a data dos dias previstos e o horário de atualização. | Usar o fuso horário local da cidade consultada nos critérios de previsão e de atualização e validar cidades em fusos diferentes. |
| R-11 | Conversão e arredondamento inconsistentes podem confundir o usuário. | Converter sempre a partir do valor de origem e aplicar a regra única de arredondamento *half away from zero* (RF-16, CA-03.7). |
| R-12 | Campos ausentes na resposta externa podem produzir valores inválidos ou interromper a tela. | Exibir “Dados indisponíveis” para qualquer campo ausente, mantendo os demais dados válidos (CA-03.5). |
| R-13 | Ausência de aviso de precisão ou atribuição pode gerar risco legal e expectativas excessivas. | Exibir atribuição e aviso de precisão no rodapé de todas as telas (RF-15, CA-08.1). |
| R-14 | Adição futura de telemetria ou geolocalização pode contrariar requisitos de privacidade. | Manter essas capacidades fora da v1; exigir decisão formal, avaliação de privacidade e consentimento quando aplicável. |
| R-15 | Conteúdo externo ou entrada do usuário pode ser interpretado de forma insegura se não for tratado como texto. | Normalizar e tratar entradas e respostas apenas como texto puro na aplicação. |
| R-16 | Consultas excessivas ou concorrentes na busca podem exceder limites do provedor e exibir resultados obsoletos. | Validar entrada mínima antes de requisitar, reutilizar cache (RNF-16), descartar respostas anteriores fora de ordem (CA-06.4) e disparar a busca somente por envio explícito (CA-01.9). |
| R-17 | Alteração ou descontinuação da interface do provedor pode interromper os dados. | Acompanhar mudanças do provedor e validar respostas usadas pelo produto. |
| R-18 | Testes que dependem do serviço externo podem falhar intermitentemente. | Manter todos os critérios verificáveis com respostas controladas em testes automatizados. |

## Out of Scope

- **Plataformas e modo offline:** aplicativos nativos (iOS/Android), empacotamento desktop, instalação como PWA e funcionamento offline fora do cache temporário da sessão ativa na v1.
- **Entradas de busca e geolocalização:** busca por CEP, coordenadas geográficas, endereço, bairro ou ponto de interesse; cidades fora do Brasil; detecção ou sugestão automática da cidade por geolocalização do dispositivo.
- **Horizonte de previsão e alertas:** previsão horária, previsão para além de cinco dias (hoje + quatro dias seguintes), histórico meteorológico passado e alertas ou notificações de eventos severos.
- **Variáveis meteorológicas adicionais na v1:** exibição de precipitação acumulada (`mm`), probabilidade de chuva, pressão atmosférica (`hPa`), índice UV, qualidade do ar, visibilidade, ponto de orvalho, direção ou rajadas de vento e horários de nascer ou pôr do sol.
- **Configuração de outras unidades:** alternância de unidade para velocidade do vento (fixa em `km/h`) ou umidade relativa (fixa em `%`).
- **Recursos visuais e sociais extras:** mapas interativos, radar meteorológico, imagens de satélite, comparação simultânea lado a lado entre cidades, compartilhamento em redes sociais e exportação de dados.
- **Histórico e favoritos:** lista de buscas recentes ou cidades favoritas, tanto em armazenamento local quanto em servidor.
- **Contas e infraestrutura de servidor próprio:** cadastro, login, autenticação, perfis de usuário, painel administrativo, banco de dados e sincronização de preferências em servidor.
- **Telemetria, rastreamento e KPIs em produção na v1:** coleta de dados pessoais, cookies de rastreamento, ferramentas de análise de uso ou monitoramento de erros de cliente e instrumentação de KPIs de negócio em produção (avaliação da v1 restrita a testes de usabilidade).
- **Internacionalização:** idiomas, traduções ou formatações regionais diferentes de português do Brasil (`pt-BR`).
- **Busca assistida:** sugestões automáticas durante a digitação (autocomplete) e seleção automática de resultado único.
- **Navegação por URL:** cidade ou termo de busca na URL, links diretos ou compartilháveis, restauração da consulta ao recarregar e histórico de navegação por cidade.
- **Aparência e marca:** tema claro, alternância de tema, adaptação à preferência de tema do sistema e identidade visual ou logotipo corporativo externo.
- **Uso comercial do provedor:** operação sob plano comercial da Open-Meteo ou texto jurídico próprio de atribuição.
- **Suporte ampliado:** navegadores fora da matriz de RNF-08 e metas de desempenho em 3G ou específicas para consultas em cache.
- **SLA do provedor:** contabilização de indisponibilidade da Open-Meteo na disponibilidade mensal da aplicação.
- **Provedor alternativo (fallback):** consulta a outra API meteorológica quando a Open-Meteo estiver indisponível; na v1 a falha é tratada apenas como erro recuperável (RF-09, RF-10).
- **Localização por IP:** estimativa automática da cidade a partir do endereço IP da pessoa usuária, em complemento à geolocalização do dispositivo já excluída (A-09).

## Open Questions

Nenhuma pergunta em aberto. As decisões abaixo foram validadas pelo solicitante em 11/11/2026 e já estão incorporadas aos requisitos, critérios de aceite, edge cases, premissas e riscos. Qualquer mudança exige nova validação e atualização desta especificação.

| ID | Tema | Decisão validada | Onde está refletida |
| --- | --- | --- | --- |
| D-01 | Arredondamento | Temperaturas (°C e °F), sensação térmica, máximas, mínimas, vento (`km/h`) e umidade (`%`) como números inteiros, com arredondamento *half away from zero* sobre o valor de origem. | RF-16, CA-03.7, CA-04.2 |
| D-02 | Disparo da busca | Busca somente por envio explícito (botão ou `Enter`), com seleção explícita na lista mesmo quando houver um único resultado. | RF-01, RF-02, CA-01.9, CA-02.4 |
| D-03 | Armazenamento bloqueado | Manter a unidade em memória na sessão e exibir aviso discreto e não bloqueante de que a preferência não será salva. | RF-07, CA-04.6, Edge Cases |
| D-04 | Navegação e URL | Sem cidade na URL; recarregar retorna ao estado inicial (mantendo só a unidade salva) e o botão Voltar não percorre cidades. | CA-06.5, A-15, Out of Scope |
| D-05 | Atribuição e aviso | Uso não comercial/educacional (CC BY 4.0) com rodapé em todas as telas: “Dados meteorológicos por Open-Meteo. Previsões sujeitas a variações.”, com link para o site oficial. | RF-15, CA-08.1, A-06, R-02, R-13 |
| D-06 | Tema e marca | Tema escuro fixo (*dark glassmorphism*), sem seletor de tema e sem logotipo corporativo externo, com contraste WCAG 2.1 AA. | RNF-17, CA-07.9, A-14 |
| D-07 | Navegadores | Últimas 2 versões estáveis de Chrome (Android e desktop), Safari (iOS/iPadOS ≥ 16 e macOS), Edge (desktop) e Firefox (desktop). | RNF-08, R-07 |
| D-08 | Desempenho e disponibilidade | Apenas a meta de LCP ≤ 2,5 s em 4G simulado; disponibilidade de 99,5% mensal sobre a entrega da aplicação web sob HTTPS, tratando falhas da Open-Meteo como degradação controlada. | RNF-03, RNF-05, RNF-14 |
| D-09 | Requisitos `Should` | RF-07, RF-10 e RF-11 são obrigatórios na v1, sem cortes. | Functional Requirements, A-13 |
| D-10 | Rótulos, datas e ícones | Tabela WMO em pt-BR, ícones vetoriais decorativos e datas no formato “Hoje, DD/MM” e “dia da semana abreviado, DD/MM” (ex.: “Qui., 12/11”). | CA-03.2, CA-03.6 |