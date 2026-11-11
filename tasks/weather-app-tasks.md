# Backlog de Tarefas — Aplicação de Previsão do Tempo

Este backlog deriva de [plans/weather-app-plan.md](../plans/weather-app-plan.md) e
de [specs/weather-app-spec.md](../specs/weather-app-spec.md). A ordem das entregas
organiza as tarefas por área técnica para facilitar a execução, mas a recomendação
de entrega é seguir as fatias verticais abaixo. Tarefas sem dependência entre si
podem ser executadas em paralelo. Cada tarefa cita os requisitos da spec que atende.
Os testes usam respostas controladas e não chamam a Open-Meteo real. Quando a
verificação for manual ou depender de ambiente, o resultado e as condições da
execução devem ser registrados.

### Legenda de prioridade e tamanho

- **P0:** necessário para a primeira versão funcional e para os requisitos
  obrigatórios da spec.
- **P1:** completar requisitos `Should` e validar robustez antes da entrega.
- **P2:** hardening operacional e validações de publicação, após o fluxo principal.
- **P:** pequeno (uma mudança localizada); **M:** médio (mais de um caso ou
  integração delimitada); **G:** grande (orquestração ampla, jornada ou validação
  que envolve múltiplas superfícies).

A prioridade indica ordem de entrega, não autorização para omitir tarefas: todas
as tarefas e requisitos aplicáveis devem estar concluídos antes do *ship*.

### Sequência recomendada — fatias verticais

1. **Primeira experiência integrada — buscar uma cidade e ver o tempo.** Entregar
   busca explícita, seleção de cidade, clima atual e previsão, alternância de
   unidade, estados de carregamento/erro/vazio e layout responsivo básico. Inclui
   `T-01`–`T-04`, `T-06`–`T-09`, `T-11`–`T-13`, `T-15`–`T-19`, `T-24`,
   `T-27`–`T-28`, `T-34`–`T-38` e `T-53`, mais os testes `T-05`, `T-10`,
   `T-20`–`T-21`, `T-25`–`T-26`,
   `T-29`–`T-33`, `T-39`–`T-44` e `T-54`–`T-55`. A composição
   (`T-19`) é o marco que torna a fatia visível e navegável; implemente-a assim
   que seus componentes e hooks necessários estiverem prontos.
2. **Uso contínuo e recuperação.** Validar persistência da unidade após recarga,
   troca de cidade, concorrência, dados vazios/parciais e recuperação de falhas
   sem exibir dados antigos: `T-14` e `T-45`–`T-48`.
3. **Pronto para entrega.** Validar acessibilidade/responsividade, privacidade,
   desempenho, navegadores, publicação segura e gates: `T-22`–`T-23` e
   `T-49`–`T-52`.

Dentro de cada fatia, respeite as dependências indicadas em cada tarefa. As
primeiras tarefas de UI podem ser desenvolvidas em paralelo com seus serviços,
mas a fatia só conta como entregue quando a jornada estiver integrada e testada.

## Entrega 1 — Tipos e contratos

### T-01 — Definir o tipo de domínio de cidade [P0 · P]
- **Descrição:** Criar o contrato compartilhado da cidade brasileira selecionável.
- **Critérios de aceite:** `City` declara `id: number`, `name: string`, `state: string | null` (mapeado de `admin1`), `countryCode: 'BR'`, `latitude: number`, `longitude: number` e `timezone: string`; latitude e longitude aceitam somente números finitos.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/types/city.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-02.

### T-27 — Definir modelos de clima e estados de domínio [P0 · M]
- **Descrição:** Criar os modelos de clima, unidade e estados discriminados de busca e clima.
- **Critérios de aceite:** Os tipos exportam `CurrentWeather`, `ForecastDay`, `WeatherData`, `Unit`, `SearchState` e `WeatherState`; `Unit` só admite Celsius ou Fahrenheit, valores meteorológicos ausentes são representados por `null` e os estados de busca/clima são discriminados pelo campo `status`.
- **Dependências:** T-01.
- **Arquivos:** `src/types/weather.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-03, RF-04, RF-05, RF-06, RF-12.

### T-28 — Definir DTOs da Open-Meteo [P0 · M]
- **Descrição:** Declarar os formatos externos usados pelos serviços, sem expô-los às camadas de UI e hooks.
- **Critérios de aceite:** DTOs tipam os campos consumidos das respostas de geocodificação e forecast; referências a `src/types/api.ts` fora de `src/services/` não existem.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/types/api.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-01, RF-03, RF-04.

## Entrega 2 — Funções puras

### T-02 — Implementar normalização e validação do termo de busca [P0 · P]
- **Descrição:** Implementar funções puras para normalizar espaços, diacríticos e texto de busca e validar os limites da entrada.
- **Critérios de aceite:** Espaços periféricos/repetidos e acentos são normalizados; entradas vazias, menores que 2 e maiores que 80 caracteres retornam mensagens específicas; caracteres especiais permanecem texto puro.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/lib/search-term.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-01, RF-14.

### T-03 — Implementar conversão e apresentação de temperaturas [P0 · P]
- **Descrição:** Criar conversão Celsius/Fahrenheit e formatação de temperaturas disponíveis ou ausentes.
- **Critérios de aceite:** Para qualquer valor disponível, Fahrenheit é calculado como `C × 9/5 + 32` a partir do Celsius de origem; `null` resulta exatamente em “Dados indisponíveis”; a saída numérica inclui `°C` ou `°F` conforme a unidade solicitada.
- **Dependências:** T-27.
- **Arquivos:** `src/lib/units.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-03, RF-04, RF-06.

### T-04 — Implementar rótulos de condições meteorológicas [P0 · P]
- **Descrição:** Mapear códigos WMO para rótulos em português e chaves de ícones.
- **Critérios de aceite:** Cada código WMO listado na tabela da spec retorna o rótulo pt-BR e uma chave de ícone; código não listado retorna “Condição desconhecida” e campo ausente retorna “Dados indisponíveis”.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/lib/wmo.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-03, RF-04.

### T-24 — Implementar arredondamento inteiro consistente [P0 · P]
- **Descrição:** Criar função pura de arredondamento *half away from zero*.
- **Critérios de aceite:** Empates arredondam para longe de zero, valores próximos aos empates preservam o lado correto e `-0` resulta em `0`.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/lib/rounding.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-16.

### T-53 — Implementar formatação de datas e frescor [P0 · M]
- **Descrição:** Criar funções puras para rótulos da previsão, horário local e validade do clima em cache.
- **Critérios de aceite:** O rótulo do dia atual segue “Hoje, DD/MM”, os seguintes usam dia da semana abreviado e `DD/MM`, e o horário é `HH:MM` em formato 24h no fuso informado; `isFresh` retorna `true` até 5 minutos inclusive e `false` acima de 5 minutos.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/lib/dates.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-03, RF-04.

## Entrega 3 — Services

### T-06 — Implementar transporte HTTP com timeout e erros tipados [P0 · M]
- **Descrição:** Isolar `fetch`, timeout de 10 segundos, cancelamento e classificação de falhas de transporte.
- **Critérios de aceite:** Falhas de rede, timeout, HTTP, erro da API e resposta inválida são classificadas; timer é limpo ao concluir; nenhuma mensagem técnica do provedor é exposta à UI.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/services/http.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-09, RF-12.

### T-07 — Implementar serviço de geocodificação brasileira [P0 · M]
- **Descrição:** Consultar a API de geocodificação com parâmetros definidos e converter respostas para cidades do domínio.
- **Critérios de aceite:** Envia termo normalizado, limite de 10, país BR e idioma pt; valida/filtra país; preserva ordem e estado ausente; resposta sem resultados produz lista vazia e resultados excedentes não são exibidos.
- **Dependências:** T-01, T-02, T-06, T-28.
- **Arquivos:** `src/services/geocoding.ts`, `src/types/api.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-01, RF-02, RF-08, RF-14.

### T-08 — Implementar serviço de clima e mapeamento da previsão [P0 · G]
- **Descrição:** Consultar clima atual e cinco dias e validar/mapear os DTOs para os modelos de domínio em Celsius.
- **Critérios de aceite:** Requisição usa coordenadas da cidade, `forecast_days=5`, `timezone=auto`, Celsius e vento em km/h; dados parciais viram `null`, previsão sem dias vira lista vazia e estruturas/dados presentes malformados geram erro tipado.
- **Dependências:** T-01, T-06, T-27, T-28.
- **Arquivos:** `src/services/forecast.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-03, RF-04, RF-09, RF-12.

### T-09 — Implementar cache em memória com TTL por domínio [P0 · M]
- **Descrição:** Criar cache em memória para geocodificação e clima com chaves e validade distintas.
- **Critérios de aceite:** Busca é reutilizada por termo normalizado por 10 minutos; clima é reutilizado por ID da cidade por até 5 minutos; itens vencidos e falhas não são reutilizados; cache não persiste após recarga.
- **Dependências:** T-01, T-27, T-53.
- **Arquivos:** `src/services/cache.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-03, RF-11, RNF-16.

## Entrega 4 — Hooks e orquestração

### T-11 — Implementar preferência de unidade com fallback em memória [P0 · M]
- **Descrição:** Criar hook que inicializa em Celsius, lê e grava a unidade no armazenamento local e continua funcionando se ele falhar.
- **Critérios de aceite:** Restaura unidade salva; falha de leitura inicia em Celsius; falha de escrita mantém a alteração na sessão e sinaliza que a preferência não será salva; não envia preferência à API.
- **Dependências:** T-27.
- **Arquivos:** `src/hooks/useUnitPreference.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-05, RF-07, RF-13.

### T-12 — Implementar busca com validação, cache, retry e descarte de respostas antigas [P0 · G]
- **Descrição:** Orquestrar os estados da busca, acionada explicitamente, e repetir o último termo em caso de falha.
- **Critérios de aceite:** Valida antes da rede; distingue loading, vazio e erro; remove resultados anteriores ao iniciar busca; usa cache; retry é manual e único enquanto pendente; respostas/cancelamentos obsoletos não substituem a busca mais recente.
- **Dependências:** T-02, T-07, T-09, T-27.
- **Arquivos:** `src/hooks/useCitySearch.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-01, RF-08, RF-09, RF-10, RF-14.

### T-13 — Implementar consulta de clima e seleção de cidade [P0 · G]
- **Descrição:** Orquestrar seleção explícita, estados de clima, cache e nova tentativa.
- **Critérios de aceite:** Seleção limpa imediatamente os dados anteriores; consulta usa cache válido; falha não apresenta dados antigos; retry é manual; consultas concorrentes descartam respostas obsoletas; estado vazio de previsão preserva clima atual válido.
- **Dependências:** T-08, T-09, T-27, T-53.
- **Arquivos:** `src/hooks/useWeather.ts`.
- **Tipo:** Data.
- **Requisitos:** RF-03, RF-04, RF-09, RF-10, RF-11, RF-12.

## Entrega 5 — Componentes

### T-15 — Criar formulário de busca [P0 · M]
- **Descrição:** Implementar campo e envio explícito da consulta.
- **Critérios de aceite:** O formulário envia somente por botão ou Enter, associa validações ao campo e não inicia busca durante a digitação.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/components/SearchForm.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-01, RF-14.

### T-16 — Criar apresentação do clima atual [P0 · M]
- **Descrição:** Implementar cartão de condições atuais e ícone meteorológico.
- **Critérios de aceite:** Exibe campos atuais, horário local, unidade e rótulo pt-BR; valores ausentes e códigos desconhecidos usam as mensagens especificadas.
- **Dependências:** T-03, T-04, T-24, T-27, T-53.
- **Arquivos:** `src/components/WeatherIcon.tsx`, `src/components/CurrentWeatherCard.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-03, RF-06, RF-16, RNF-06.

### T-17 — Criar controle acessível de unidade [P0 · P]
- **Descrição:** Exibir e alterar a unidade, incluindo anúncio da mudança e aviso de falha de persistência.
- **Critérios de aceite:** Celsius/Fahrenheit têm estado selecionado perceptível e acessível; mudança atualiza a unidade sem nova consulta; falha de armazenamento apresenta aviso não bloqueante anunciado sem interromper a leitura.
- **Dependências:** T-11, T-27.
- **Arquivos:** `src/components/UnitToggle.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-05, RF-06, RF-07, RF-13.

### T-18 — Criar rodapé de atribuição e aviso [P0 · P]
- **Descrição:** Adicionar atribuição Open-Meteo e aviso de variação da previsão em todas as telas.
- **Critérios de aceite:** Rodapé exibe o texto definido na spec; link oficial é acessível por teclado e tem rótulo acessível; não sobrepõe conteúdo em telas estreitas.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/components/Footer.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-15.

### T-34 — Criar resultados de busca selecionáveis [P0 · M]
- **Descrição:** Implementar a lista de cidades com seleção explícita e rótulos desambiguadores.
- **Critérios de aceite:** Cada opção mostra estado ou fallback; cidade única não é pré-selecionada; ativação por teclado, clique ou toque envia a cidade correta.
- **Dependências:** T-01.
- **Arquivos:** `src/components/CityResultList.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-02.

### T-35 — Criar mensagens de estado e ação de retry [P0 · M]
- **Descrição:** Implementar componentes visuais para loading, erro, vazio e nova tentativa.
- **Critérios de aceite:** Falha de busca exibe “Não foi possível buscar cidades. Tente novamente.” e falha de clima exibe “Não foi possível carregar o clima. Tente novamente.”; loading é anunciado por tecnologia assistiva; erros usam alerta acessível; retry fica desabilitado enquanto a requisição está pendente.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/components/StatusMessage.tsx`, `src/components/RetryButton.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-08, RF-09, RF-10, RF-12.

### T-36 — Criar itens e lista da previsão diária [P0 · M]
- **Descrição:** Apresentar os cinco dias, suas temperaturas e condições com rótulos localizados.
- **Critérios de aceite:** Cada dia exibe data local, máxima, mínima e condição; dados ausentes e previsão vazia têm mensagens apropriadas.
- **Dependências:** T-03, T-04, T-24, T-27, T-53.
- **Arquivos:** `src/components/ForecastDayItem.tsx`, `src/components/ForecastList.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-04, RF-06, RF-16, RNF-06.

### T-37 — Compor o painel meteorológico [P0 · M]
- **Descrição:** Agrupar a apresentação do clima atual e da previsão em um único painel.
- **Critérios de aceite:** O painel recebe os dados por props e apresenta clima atual e previsão sem acessar serviços ou estado persistente.
- **Dependências:** T-16, T-36.
- **Arquivos:** `src/components/WeatherPanel.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-03, RF-04, RF-12.

### T-38 — Implementar tema e estilos responsivos [P0 · M]
- **Descrição:** Aplicar o tema escuro fixo e os estilos de layout da aplicação.
- **Critérios de aceite:** Estilos preservam contraste e permitem layout entre 320 px e 1920 px sem rolagem horizontal; não há seletor de tema nem adaptação ao tema do sistema.
- **Dependências:** Nenhuma.
- **Arquivos:** `src/index.css`, `tailwind.config.js`.
- **Tipo:** UI.
- **Requisitos:** RF-12, RNF-01, RNF-02, RNF-17.

## Entrega 6 — Integração da aplicação

### T-19 — Compor a aplicação [P0 · G]
- **Descrição:** Conectar hooks e componentes na tela única, sem roteamento.
- **Critérios de aceite:** Tela inicial, busca, loading, vazio, sucesso e erro são compostos; trocar de cidade mantém a aplicação e limpa dados antigos; a unidade e o rodapé aparecem nos estados aplicáveis.
- **Dependências:** T-11, T-12, T-13, T-15, T-16, T-17, T-18, T-34, T-35, T-37, T-38.
- **Arquivos:** `src/App.tsx`, `src/main.tsx`.
- **Tipo:** UI.
- **Requisitos:** RF-11, RF-12, RF-15, RNF-01, RNF-02, RNF-17.

## Entrega 7 — Testes

### T-05 — Testar normalização e validação da busca [P0 · P]
- **Descrição:** Cobrir regras de busca com funções puras e casos de borda determinísticos.
- **Critérios de aceite:** Testes Vitest cobrem acentos, espaços, texto especial, entradas vazias e limites de tamanho; não dependem de rede, DOM ou armazenamento.
- **Dependências:** T-02.
- **Arquivos:** `tests/unit/lib/search-term.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-01, RF-14.

### T-25 — Testar conversão e apresentação de temperaturas [P0 · P]
- **Descrição:** Cobrir exclusivamente a conversão Celsius/Fahrenheit e a apresentação de temperaturas disponíveis ou ausentes.
- **Critérios de aceite:** Testes unitários verificam `celsiusToFahrenheit` com valores positivos, negativos e zero; `displayTemperature` apresenta Celsius/Fahrenheit com a unidade correta, converte antes de formatar e retorna exatamente “Dados indisponíveis” para `null`. Os casos de arredondamento ficam na tarefa T-55.
- **Dependências:** T-03, T-24.
- **Arquivos:** `tests/unit/lib/units.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-04, RF-06, RF-16.

### T-55 — Testar arredondamento half away from zero [P0 · P]
- **Descrição:** Cobrir a regra de arredondamento em testes unitários isolados da conversão de unidade.
- **Critérios de aceite:** Testes verificam empates positivos e negativos, valores imediatamente abaixo/acima de empates, `-0` convertido em `0` e valores meteorológicos inteiros apresentados conforme a regra da spec.
- **Dependências:** T-24.
- **Arquivos:** `tests/unit/lib/rounding.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-04, RF-16.

### T-26 — Testar rótulos meteorológicos [P0 · P]
- **Descrição:** Cobrir o mapeamento WMO com códigos previstos e desconhecidos.
- **Critérios de aceite:** Todos os códigos da tabela da spec retornam rótulos pt-BR; código não mapeado retorna “Condição desconhecida”.
- **Dependências:** T-04.
- **Arquivos:** `tests/unit/lib/wmo.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-04.

### T-54 — Testar datas e frescor [P0 · P]
- **Descrição:** Verificar rótulos de dia, horário local e limites de validade.
- **Critérios de aceite:** Testes usam datas fixas e cobrem hoje, dias seguintes, fusos distintos, cinco minutos exatos e expiração após esse limite.
- **Dependências:** T-53.
- **Arquivos:** `tests/unit/lib/dates.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-04.

### T-10 — Testar transporte HTTP [P0 · M]
- **Descrição:** Verificar classificação de falhas e timeout com `fetch` simulado.
- **Critérios de aceite:** Testes cobrem rede, timeout, HTTP, erro do provedor, JSON inválido e limpeza do timer; nenhuma chamada alcança a rede real.
- **Dependências:** T-06.
- **Arquivos:** `tests/unit/services/http.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-09, RF-12.

### T-29 — Testar geocodificação e mapeamento de cidades [P0 · M]
- **Descrição:** Verificar parâmetros, filtros e mapeamento da resposta de geocodificação.
- **Critérios de aceite:** Testes substituem `globalThis.fetch` com `vi.stubGlobal` e respostas controladas; cobrem URL/parâmetros (país, idioma e limite), ordem, estado ausente, lista vazia e resposta inválida. Nenhum teste acessa a rede real.
- **Dependências:** T-07.
- **Arquivos:** `tests/unit/services/geocoding.test.ts`, `tests/fixtures/geocoding.json`.
- **Tipo:** Test.
- **Requisitos:** RF-01, RF-02, RF-08, RF-14.

### T-30 — Testar mapeamento do serviço de previsão [P0 · M]
- **Descrição:** Verificar parâmetros da consulta e mapeamento de respostas completas, parciais e inválidas.
- **Critérios de aceite:** Testes substituem `globalThis.fetch` com `vi.stubGlobal` e respostas controladas; cobrem URL/parâmetros (Celsius, fuso e cinco dias), campos ausentes, arrays curtos, ausência de dias e estruturas malformadas. Nenhum teste acessa a rede real.
- **Dependências:** T-08.
- **Arquivos:** `tests/unit/services/forecast.test.ts`, `tests/fixtures/forecast.json`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-04, RF-09, RF-12.

### T-31 — Testar cache e expiração [P0 · M]
- **Descrição:** Verificar chaves, TTL e comportamento de falha do cache em memória.
- **Critérios de aceite:** Testes com relógio controlado cobrem TTL de geocodificação e clima, expiração e ausência de cache para falhas.
- **Dependências:** T-09.
- **Arquivos:** `tests/unit/services/cache.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-11, RNF-16.

### T-14 — Testar preferência de unidade [P1 · P]
- **Descrição:** Cobrir leitura, gravação e fallback em memória do hook de preferência.
- **Critérios de aceite:** Testes verificam Celsius inicial, unidade salva, falha de leitura e falha de escrita sem bloquear a sessão.
- **Dependências:** T-11.
- **Arquivos:** `tests/unit/hooks/useUnitPreference.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-07, RF-13.

### T-32 — Testar hook de busca [P0 · M]
- **Descrição:** Cobrir validação, estados, cache, retry e concorrência da busca.
- **Critérios de aceite:** Testes verificam validação sem rede, vazio/erro, retry único, cache e descarte de resposta antiga.
- **Dependências:** T-12.
- **Arquivos:** `tests/unit/hooks/useCitySearch.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-01, RF-08, RF-09, RF-10, RF-14.

### T-33 — Testar hook de clima [P0 · M]
- **Descrição:** Cobrir seleção, cache, retry e limpeza de dados de cidades anteriores.
- **Critérios de aceite:** Testes verificam seleção, expiração, erro sem dados antigos e descarte de resposta obsoleta.
- **Dependências:** T-13.
- **Arquivos:** `tests/unit/hooks/useWeather.test.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-04, RF-09, RF-10, RF-11, RNF-16.

### T-20 — Testar formulário e resultados de busca [P0 · M]
- **Descrição:** Validar interações e semântica acessível dos controles de busca.
- **Critérios de aceite:** Testes cobrem envio por botão/Enter, ausência de busca durante digitação, seleção explícita, rótulos e fallback de estado.
- **Dependências:** T-15, T-34.
- **Arquivos:** `tests/components/SearchForm.test.tsx`, `tests/components/CityResultList.test.tsx`.
- **Tipo:** Test.
- **Requisitos:** RF-01, RF-02, RF-14.

### T-39 — Testar mensagens de estado e retry [P0 · M]
- **Descrição:** Verificar conteúdo, acessibilidade e ação dos estados de interface.
- **Critérios de aceite:** Testes de componentes renderizam e verificam explicitamente os estados loading, vazio e erro (com mensagens distintas para busca e clima); validam `role="alert"`, anúncio acessível do loading e retry desabilitado enquanto a requisição está pendente.
- **Dependências:** T-35.
- **Arquivos:** `tests/components/StatusMessage.test.tsx`, `tests/components/RetryButton.test.tsx`.
- **Tipo:** Test.
- **Requisitos:** RF-08, RF-09, RF-10, RF-12, RNF-05, RNF-13.

### T-40 — Testar apresentação do clima atual [P0 · P]
- **Descrição:** Validar conteúdo do cartão atual e tratamento de ícones meteorológicos.
- **Critérios de aceite:** Testes cobrem campos disponíveis/ausentes, unidade, arredondamento inteiro, rótulo pt-BR e ícone decorativo.
- **Dependências:** T-16.
- **Arquivos:** `tests/components/CurrentWeatherCard.test.tsx`, `tests/components/WeatherIcon.test.tsx`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-06, RF-16.

### T-41 — Testar itens e lista da previsão [P0 · P]
- **Descrição:** Verificar rótulos de data, temperaturas e estado vazio da previsão.
- **Critérios de aceite:** Testes cobrem ordenação apresentada, máximas/mínimas, campos ausentes e previsão indisponível.
- **Dependências:** T-36.
- **Arquivos:** `tests/components/ForecastDayItem.test.tsx`, `tests/components/ForecastList.test.tsx`.
- **Tipo:** Test.
- **Requisitos:** RF-04, RF-06, RF-16.

### T-42 — Testar controle de unidade [P0 · P]
- **Descrição:** Verificar seleção da unidade, anúncio e aviso de persistência.
- **Critérios de aceite:** Testes cobrem unidade selecionada, mensagem anunciada e falha de armazenamento sem bloquear a interação.
- **Dependências:** T-17.
- **Arquivos:** `tests/components/UnitToggle.test.tsx`.
- **Tipo:** Test.
- **Requisitos:** RF-05, RF-06, RF-07, RF-13.

### T-43 — Testar rodapé de atribuição [P0 · P]
- **Descrição:** Verificar atribuição, link oficial e aviso de precisão.
- **Critérios de aceite:** Teste confirma texto, destino e nome acessível do link.
- **Dependências:** T-18.
- **Arquivos:** `tests/components/Footer.test.tsx`.
- **Tipo:** Test.
- **Requisitos:** RF-15.

### T-44 — Testar composição do painel meteorológico [P0 · M]
- **Descrição:** Validar a composição visual dos dados atuais e da previsão.
- **Critérios de aceite:** Teste confirma que os dados recebidos por props são apresentados sem dependência de rede ou estado global.
- **Dependências:** T-37.
- **Arquivos:** `tests/components/WeatherPanel.test.tsx`.
- **Tipo:** Test.
- **Requisitos:** RF-03, RF-04, RF-12.

### T-21 — Testar jornada principal de busca e consulta [P0 · G]
- **Descrição:** Validar no navegador o fluxo desde a busca explícita até a exibição do clima.
- **Critérios de aceite:** Testes com rotas interceptadas executam o fluxo principal em viewport desktop (1280 × 800) e mobile (390 × 844), confirmando envio explícito, normalização de acentos, seleção de homônimo e apresentação do clima atual e previsão diária. Em ambas as viewports, não há rolagem horizontal e nenhuma chamada alcança a API real.
- **Dependências:** T-19.
- **Arquivos:** `tests/e2e/search-weather.spec.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-01, RF-02, RF-03, RF-04, RF-14, RNF-06.

### T-45 — Testar persistência da unidade e recarga [P1 · M]
- **Descrição:** Verificar alternância de unidade e retorno ao estado inicial após recarregar.
- **Critérios de aceite:** Fahrenheit permanece salvo quando o armazenamento funciona e atualiza todas as temperaturas sem nova consulta; recarga limpa cidade/consulta e não muda a URL.
- **Dependências:** T-19.
- **Arquivos:** `tests/e2e/unit-reload.spec.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-05, RF-06, RF-07, RF-13.

### T-46 — Testar troca de cidade e concorrência [P1 · M]
- **Descrição:** Verificar que uma nova seleção substitui dados e respostas anteriores.
- **Critérios de aceite:** Teste retém uma resposta antiga e confirma que somente a cidade selecionada mais recentemente aparece.
- **Dependências:** T-19.
- **Arquivos:** `tests/e2e/city-switch.spec.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-11, RF-12.

### T-47 — Testar estados vazios e dados parciais [P1 · M]
- **Descrição:** Validar busca sem correspondência, campos ausentes e previsão sem dias.
- **Critérios de aceite:** Mensagens corretas aparecem; nenhum `undefined` ou `NaN` é exibido; campos válidos permanecem visíveis.
- **Dependências:** T-19.
- **Arquivos:** `tests/e2e/empty-partial-data.spec.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-08, RF-12.

### T-48 — Testar falhas e recuperação dos serviços [P1 · M]
- **Descrição:** Validar mensagens específicas e retry manual para geocodificação e clima.
- **Critérios de aceite:** Com erro HTTP/rede ou timeout de 10 s interceptado em cada serviço, o loading termina e aparece a mensagem correspondente definida na spec; retry manual bem-sucedido remove o erro e mostra os novos dados/resultados; múltiplos cliques durante a pendência produzem exatamente uma requisição adicional.
- **Dependências:** T-19.
- **Arquivos:** `tests/e2e/retry.spec.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-09, RF-10, RF-12.

## Entrega 8 — Hardening e entrega

### T-22 — Testar acessibilidade e responsividade [P1 · G]
- **Descrição:** Verificar navegação por teclado, auditoria automatizada e layout em viewports representativos.
- **Critérios de aceite:** A execução registra o resultado da auditoria axe e da inspeção manual; teclado alcança e opera todos os controles sem armadilha e com foco visível; contraste medido é ≥ 4,5:1 para texto normal e ≥ 3:1 para texto grande e controles; em larguras de 320 px a 1920 px, retrato e paisagem, `scrollWidth <= clientWidth` e cada alvo interativo mede no mínimo 44 × 44 px.
- **Dependências:** T-19.
- **Arquivos:** `tests/e2e/accessibility-responsive.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test.
- **Requisitos:** RNF-01, RNF-02, RNF-04, RNF-17.

### T-49 — Medir LCP com rede controlada [P2 · M]
- **Descrição:** Verificar o limite de desempenho para tela inicial e tela de clima em build de produção.
- **Critérios de aceite:** Em build de produção e viewport mobile, a medição usa 150 ms RTT, 1,6 Mbps de download e throttling de CPU 4x; registra LCP separado para tela inicial e tela de clima, indicando para cada uma aprovação se `LCP <= 2,5 s` ou falha se exceder o limite.
- **Dependências:** T-19.
- **Arquivos:** `tests/e2e/performance.spec.ts`, `playwright.config.ts`.
- **Tipo:** Test.
- **Requisitos:** RNF-03.

### T-50 — Verificar privacidade do tráfego [P1 · M]
- **Descrição:** Inspecionar requisições e permissões usadas pelos fluxos de aplicação.
- **Critérios de aceite:** Em todos os fluxos E2E, a lista de requisições interceptadas não contém destinos de telemetria, nenhuma API de geolocalização do dispositivo é chamada e nenhuma requisição inclui a preferência de unidade; evidência da inspeção é registrada.
- **Dependências:** T-19.
- **Arquivos:** `tests/e2e/privacy.spec.ts`.
- **Tipo:** Test.
- **Requisitos:** RF-07, RNF-07.

### T-51 — Validar matriz de navegadores [P2 · G]
- **Descrição:** Executar jornadas principais nos navegadores definidos na spec e registrar versões e limitações.
- **Critérios de aceite:** A jornada principal passa nas duas versões estáveis mais recentes de Chrome (desktop e Android), Safari (macOS e iOS/iPadOS ≥ 16), Edge (desktop) e Firefox (desktop); para cada execução são registrados navegador, versão, plataforma e resultado. Limitações do Playwright/WebKit e validações manuais pendentes ficam identificadas, sem serem contabilizadas como aprovação automatizada.
- **Dependências:** T-21.
- **Arquivos:** `playwright.config.ts`, documentação de validação aplicável.
- **Tipo:** Test.
- **Requisitos:** RNF-08.

### T-52 — Preparar publicação estática segura [P2 · G]
- **Descrição:** Confirmar build estático sem segredos e configuração de publicação sob HTTPS.
- **Critérios de aceite:** `pnpm build` gera artefatos estáticos; busca por chaves/segredos e configuração de telemetria não encontra ocorrências no artefato/configuração de deploy; a URL publicada redireciona ou responde em HTTPS; configuração ou documentação de operação declara a meta de disponibilidade mensal de 99,5% da aplicação e exclui falhas da Open-Meteo da indisponibilidade da aplicação.
- **Dependências:** T-19.
- **Arquivos:** configuração de CI/deploy existente, `package.json`.
- **Tipo:** Infra.
- **Requisitos:** RNF-14, RNF-15.

### T-23 — Executar gates de qualidade [P0 · G]
- **Descrição:** Executar os gates automatizados do projeto após as tarefas de implementação, teste e hardening.
- **Critérios de aceite:** `pnpm lint`, `pnpm build`, `pnpm test` e `pnpm test:e2e` concluem com código de saída zero; se um script não existir ou não puder ser executado, a limitação e o comando alternativo aprovado são registrados, sem marcar o gate como aprovado.
- **Dependências:** T-05, T-10, T-14, T-20, T-21, T-22, T-25, T-26, T-29, T-30, T-31, T-32, T-33, T-39, T-40, T-41, T-42, T-43, T-44, T-45, T-46, T-47, T-48, T-49, T-50, T-51, T-52, T-54, T-55.
- **Arquivos:** `package.json`.
- **Tipo:** Infra.
- **Requisitos:** RNF-09.

## Rastreabilidade dos requisitos funcionais

A tabela relaciona cada requisito funcional de [specs/weather-app-spec.md](../specs/weather-app-spec.md)
às tarefas de implementação e às tarefas que verificam seu comportamento.

| Requisito | Tarefas de implementação | Tarefas de teste/verificação |
| --- | --- | --- |
| RF-01 — Buscar cidades brasileiras por nome, após envio explícito. | T-02, T-07, T-12, T-15 | T-05, T-20, T-21, T-29, T-32 |
| RF-02 — Distinguir resultados pelo estado e exigir seleção explícita. | T-01, T-07, T-34 | T-20, T-21, T-29 |
| RF-03 — Exibir clima atual, atualizado, com métricas, condição e hora local. | T-03, T-04, T-08, T-13, T-16, T-27, T-28, T-53 | T-21, T-25, T-26, T-30, T-33, T-40, T-44, T-54, T-55 |
| RF-04 — Exibir a previsão diária de hoje e dos quatro dias seguintes. | T-03, T-04, T-08, T-13, T-27, T-28, T-36, T-53 | T-21, T-25, T-26, T-30, T-33, T-41, T-44, T-54, T-55 |
| RF-05 — Alternar entre Celsius e Fahrenheit. | T-11, T-17 | T-14, T-42, T-45 |
| RF-06 — Aplicar a unidade selecionada a todas as temperaturas. | T-03, T-16, T-17, T-27, T-36 | T-25, T-40, T-41, T-42, T-45 |
| RF-07 — Persistir a unidade localmente ou informar o fallback em memória. | T-11, T-17 | T-14, T-42, T-45, T-50 |
| RF-08 — Informar quando nenhuma cidade corresponder à busca. | T-07, T-12, T-35 | T-29, T-32, T-39, T-47 |
| RF-09 — Informar falhas de geocodificação ou consulta de clima. | T-06, T-08, T-12, T-13, T-35 | T-10, T-30, T-32, T-33, T-39, T-48 |
| RF-10 — Permitir nova tentativa após uma falha. | T-12, T-13, T-35 | T-32, T-33, T-39, T-48 |
| RF-11 — Consultar outra cidade sem recarga nem dados antigos. | T-09, T-13, T-19 | T-31, T-33, T-46 |
| RF-12 — Apresentar estados compreensíveis de carregamento, erro e vazio. | T-06, T-08, T-13, T-19, T-27, T-35, T-37, T-38 | T-10, T-30, T-33, T-39, T-44, T-46, T-47, T-48 |
| RF-13 — Usar Celsius quando não houver preferência salva. | T-11 | T-14, T-42, T-45 |
| RF-14 — Normalizar o termo de busca na aplicação. | T-02, T-07, T-12, T-15 | T-05, T-20, T-21, T-29, T-32 |
| RF-15 — Exibir atribuição e aviso em todas as telas. | T-18, T-19 | T-43 |
| RF-16 — Exibir valores inteiros com arredondamento *half away from zero*. | T-16, T-24, T-36 | T-25, T-40, T-41, T-55 |

**Lacunas:** nenhum requisito funcional da spec (RF-01 a RF-16) está sem tarefa correspondente.