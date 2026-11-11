# Discovery — Aplicação de Previsão do Tempo

> Análise de discovery a partir do briefing de negócio. Documento de entrada para
> `specs/weather-app-spec.md`. Narrativa em pt-BR.

## Briefing original

> "Sua empresa solicitou uma aplicação de previsão do tempo. Usuários devem poder:
> buscar cidades, ver o clima atual, ver a previsão de 5 dias, alternar entre
> Celsius e Fahrenheit e usar em dispositivos móveis."

## 1. Contexto

- **Problema:** usuários precisam consultar rapidamente as condições do tempo de
  uma cidade específica, com informação atual e uma visão de curto prazo, sem
  cadastro e sem fricção.
- **Solicitante:** a empresa (stakeholder de negócio ainda não identificado).
- **Produto:** aplicação web responsiva, com foco em uso mobile, consumida
  diretamente pelo navegador.
- **Objetivo de negócio:** entregar uma ferramenta de consulta de clima simples,
  confiável e utilizável em qualquer dispositivo. Métricas de sucesso ainda não
  definidas (ver Perguntas em Aberto).
- **Fora do contexto deste briefing:** contas de usuário, alertas push,
  previsões além de 5 dias, mapas, histórico de consultas.

### Personas

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso (perspectiva da persona) |
| ------- | ------------------ | --------------- | ------------------------------------------- |
| Pessoa que se desloca diariamente | Decidir se precisa levar guarda-chuva ou mudar o trajeto | Mobile, antes de sair | Tomar uma decisão em poucos segundos |
| Pessoa que planeja atividades ao ar livre | Escolher o melhor horário considerando a previsão | Desktop para planejar; mobile no local | Realizar a atividade sem ser surpreendida pelo tempo |
| Pessoa que cuida da família | Antecipar condições que afetem a rotina e o conforto de casa | Mobile, ao longo do dia | Preparar a família a tempo para mudanças relevantes no clima |

## 2. Requisitos Funcionais

Identificadores `RF-XX` para rastreabilidade nas próximas fases.

| ID | Requisito | Prioridade (MoSCoW) |
| -- | --------- | ------------------- |
| RF-01 | O usuário deve poder buscar uma cidade pelo nome, digitando texto livre. | Must |
| RF-02 | A busca deve exibir uma lista de cidades correspondentes quando houver mais de um resultado (ex.: homônimas), identificando país/estado para diferenciá-las. | Must |
| RF-03 | Ao selecionar uma cidade, o sistema deve exibir o clima atual: temperatura, sensação térmica, umidade, vento e condição (ex.: ensolarado, chuva). | Must |
| RF-04 | O sistema deve exibir a previsão para os próximos 5 dias, com, no mínimo, temperatura máxima e mínima e condição por dia. | Must |
| RF-05 | O usuário deve poder alternar a unidade de temperatura entre Celsius e Fahrenheit. | Must |
| RF-06 | A escolha de unidade deve ser aplicada a todas as temperaturas exibidas (atual e previsão). | Must |
| RF-07 | A escolha de unidade deve persistir entre sessões do mesmo navegador. | Should |
| RF-08 | O sistema deve informar ao usuário quando nenhuma cidade for encontrada para a busca. | Must |
| RF-09 | O sistema deve informar ao usuário quando a consulta de clima falhar (indisponibilidade ou erro de rede). | Must |
| RF-10 | O sistema deve permitir nova tentativa após falha. | Should |
| RF-11 | O usuário deve poder consultar mais de uma cidade na mesma sessão, sem recarregar a aplicação. | Should |
| RF-12 | O sistema deve exibir estados de carregamento, erro e vazio em todas as telas. | Must |
| RF-13 | O sistema deve iniciar com Celsius como unidade de temperatura padrão. | Must |
| RF-14 | A busca deve ignorar acentos e variações de grafia, de modo que "São Paulo" e "Sao Paulo" retornem o mesmo resultado (decisão 4, seção 5.1). | Must |

## 3. Requisitos Não-Funcionais

| ID | Categoria | Requisito |
| -- | --------- | --------- |
| RNF-01 | Responsividade | Layout adaptado a telas de smartphone (a partir de 320 px de largura) e a tablet e desktop, sem rolagem horizontal. |
| RNF-02 | Usabilidade mobile | Alvos de toque com tamanho adequado; controles acessíveis com um polegar. |
| RNF-03 | Desempenho | Maior elemento visível da tela inicial e dos dados de clima carregado em até 2,5 s em rede 4G. Consolida RNF-03 e RNF-11 (decisão 2, seção 5.1). Cache tratado em RNF-16. |
| RNF-04 | Acessibilidade | Conformidade com WCAG 2.1 nível AA (contraste, labels, foco visível, navegação por teclado). |
| RNF-05 | Disponibilidade de dados | Dependência de API externa de clima; a aplicação deve degradar de forma controlada, sem quebrar, quando ela estiver indisponível. |
| RNF-06 | Idioma | Interface em português do Brasil. |
| RNF-07 | Privacidade | Não coletar dados pessoais nem exigir cadastro. Localização do dispositivo, se usada, requer consentimento explícito. |
| RNF-08 | Compatibilidade | Navegadores modernos em Android e iOS (versões a definir). Recursos principais (busca, clima atual, previsão, unidade) disponíveis nesses navegadores. Unifica RNF-08 e RNF-10 (decisão 3, seção 5.1). |
| RNF-09 | Manutenibilidade | Funcionalidades cobertas por testes automatizados e verificáveis contra os critérios de aceite da spec. |
| RNF-10 | — | Removido: unificado em RNF-08 (decisão 3, seção 5.1). |
| RNF-11 | — | Removido: consolidado em RNF-03 (decisão 2, seção 5.1). |
| RNF-12 | Responsividade | Sem rolagem horizontal entre 320 px e 1920 px, em retrato e paisagem. |
| RNF-13 | Acessibilidade | Resultados de busca e troca de unidade anunciados a leitores de tela (`aria-live`). |
| RNF-14 | Disponibilidade | Disponibilidade mensal da aplicação de no mínimo 99,5% (a validar). |
| RNF-15 | Segurança | Acesso exclusivamente por HTTPS; nenhuma chave de API exposta no cliente. |
| RNF-16 | Desempenho | Respostas de geocodificação e clima em cache por no mínimo 10 min, reduzindo chamadas à API. |

## 4. Riscos

| ID | Risco | Impacto | Probabilidade | Mitigação sugerida |
| -- | ----- | ------- | ------------- | ------------------ |
| R-01 | Indisponibilidade ou limite de uso da API de clima. | Alto | Média | Tratar erros e timeouts com mensagem clara e retry; avaliar fallback ou cache curto; validar limites de uso contratuais. |
| R-02 | Dados de API de terceiros com licença ou termos de uso incompatíveis com o uso comercial da empresa. | Alto | Baixa/Média | Validar termos e atribuição exigida antes da implementação. |
| R-03 | Ambiguidade na busca (cidades homônimas, nomes com acentos ou grafias diferentes). | Médio | Alta | Exibir lista de desambiguação com país/estado; busca tolerante a acentos (RF-14). |
| R-04 | Escopo mal definido (ex.: "previsão" pode ser interpretada como horária, semanal ou com alertas). | Alto | Média | Fechar requisitos na spec com critérios de aceite; manter lista explícita de "fora de escopo". |
| R-05 | Desempenho ruim em redes móveis lentas. | Médio | Média | Metas de tempo de resposta; estados de carregamento; minimizar requisições. |
| R-06 | Problemas de acessibilidade em componentes customizados (seletor de unidade, lista de busca). | Médio | Média | Usar semântica HTML e roles adequados; testes de teclado e leitor de tela. |
| R-07 | Diferenças de comportamento entre navegadores móveis. | Baixo | Média | Testes E2E em viewports móveis e navegadores principais. |
| R-08 | Ausência de métricas de sucesso definidas, dificultando avaliar se o produto atende ao objetivo. | Médio | Alta | Definir KPIs antes do Ship (ver Perguntas em Aberto). |
| R-09 | Dados desatualizados exibidos como "clima atual" por causa do cache de 10 min (RNF-16) e da ausência de carimbo de horário (pergunta 20). | Alto | Alta | Definir idade máxima do dado; exibir "atualizado às HH:MM"; aplicar TTL explícito ao clima e cache mais longo apenas à geocodificação. |
| R-10 | Data e horário errados para cidades em outro fuso (pergunta 19), com "hoje" e os dias da previsão calculados no fuso do dispositivo. | Médio | Média | Usar o fuso da cidade retornado pela API (ex.: `timezone=auto` no Open-Meteo); testar cidades em fusos distintos. |
| R-11 | Conversão e arredondamento de temperatura inconsistentes entre telas, ou ida e volta de unidade alterando o valor (pergunta 21). | Médio | Média | Converter sempre a partir do valor original da API; definir regra única de arredondamento; cobrir a conversão com testes unitários de funções puras. |
| R-12 | Campos nulos ou ausentes na API (sensação térmica, umidade, vento) exibidos como "undefined°" ou quebrando a tela (pergunta 22). | Médio | Média | Tipar campos opcionais na camada de `src/services/`; exibir placeholder por campo ausente; testar com respostas parciais. |
| R-13 | Falta de aviso de isenção sobre a precisão da previsão e de atribuição do provedor na UI (pergunta 29), gerando risco legal, de licença e decisões de viagem com base em dado impreciso. | Alto | Média | Incluir aviso de precisão e atribuição exigida pelo provedor em local fixo da UI; validar o texto com o jurídico (ver R-02). |
| R-14 | Coleta de dados pessoais ou de localização sem consentimento por telemetria (ex.: Sentry, GA) ou geolocalização, violando a LGPD e RNF-07 (pergunta 28, pergunta 5). | Alto | Baixa | Não adotar telemetria sem decisão formal; se adotada, anonimizar dados e obter consentimento; solicitar localização somente por ação explícita do usuário. |
| R-15 | Injeção de conteúdo (XSS) a partir de textos vindos da API ou da entrada de busca renderizados na UI, sobretudo se houver uso de `dangerouslySetInnerHTML`. | Alto | Baixa | Renderizar apenas como texto (React escapa por padrão); proibir `dangerouslySetInnerHTML` sem revisão; validar a entrada de busca; definir Content Security Policy. |
| R-16 | Excesso de requisições à API a cada tecla digitada na busca, consumindo o limite de uso (R-01) e degradando o desempenho (pergunta 23). | Médio | Alta | Aplicar debounce e tamanho mínimo de busca; reutilizar o cache de geocodificação (RNF-16); cancelar requisições obsoletas com `AbortController`. |
| R-17 | Mudança de versão, descontinuação de endpoint ou de campos pelo provedor de dados, quebrando a aplicação sem aviso. | Alto | Baixa | Isolar o cliente da API em `src/services/` com tipos e adaptadores próprios; testes de contrato; acompanhar o changelog do provedor. |
| R-18 | Testes unitários e E2E instáveis por dependerem da rede e da API externa real, gerando falsos negativos no pipeline. | Médio | Alta | Mockar a API nos testes (ex.: MSW ou fixtures); usar chamadas reais apenas em um smoke test opcional e fora do gate de CI. |

## 5. Perguntas em Aberto

Decisões que precisam de resposta do negócio antes de fechar a spec.

1. **Público e objetivo:** quem é o público-alvo principal e qual problema de negócio a empresa quer resolver (engajamento, tráfego, serviço interno, produto para venda)?
   - **Impacto:** sem persona prioritária, RF-02 a RF-11 não têm ordem de valor. Alto risco de construir a feature errada (R-04).
2. **Métricas de sucesso:** como o sucesso será medido (ex.: número de buscas, tempo até primeiro resultado, taxa de erro)?
   - **Impacto:** não há critério de sucesso no Ship. R-08 se materializa e a telemetria (item 28) não tem o que medir.
3. **Escopo de previsão:** "previsão de 5 dias" deve ser diária (máx./mín.) ou também horária? Quais variáveis além de temperatura e condição?
   - **Impacto:** se a previsão horária for exigida, mudam modelo de dados, layout e chamadas de API, com retrabalho grande. S-03 pode estar errada.
4. **Busca:** qual cobertura geográfica (apenas Brasil ou global)? Aceita CEP, coordenadas ou apenas nome de cidade?
   - **Impacto:** cobertura global ou só Brasil define o provedor de geocodificação e o idioma dos nomes. CEP ou coordenadas exigem outra API. Afeta R-03 (acentos).
5. **Localização automática:** deve sugerir a cidade atual via geolocalização do dispositivo? Se sim, é requisito ou melhoria futura?
   - **Impacto:** se for requisito, exige permissão, fallback e tratamento de negação. Sem resposta, a tela inicial fica indefinida e há risco de coletar localização sem consentimento (RNF-07).
6. **Histórico e favoritos:** cidades recentes ou favoritas estão no escopo desta versão?
   - **Impacto:** risco de scope creep ou de rejeição tardia. Afeta a persistência local (S-06) e a interpretação de RF-11.
7. **Unidades:** além de temperatura, quais unidades são esperadas (vento: km/h ou m/s; pressão; precipitação)?
   - **Impacto:** RF-03 cita vento sem unidade. Pode-se exibir dado sem unidade ou com conversão errada.
8. **Idioma:** apenas português do Brasil ou também outros idiomas?
   - **Impacto:** se houver múltiplos idiomas, toda string precisa de i18n desde o início. Adaptar depois é caro. RNF-06 hoje assume pt-BR.
9. **Plataforma móvel:** deve ser apenas web responsiva ou haverá app nativo (iOS/Android) ou PWA instalável?
   - **Impacto:** define service worker, manifest, instalação e comportamento offline. S-01 assume web sem confirmação.
10. **Navegadores e versões mínimas:** quais são os suportados?
   - **Impacto:** RNF-08 fica indeterminado. Sem matriz definida, a cobertura E2E (R-07) não é planejável.
11. **Dados de API:** a empresa já tem preferência ou contrato com provedor de dados meteorológicos? Há requisitos de atribuição (incluindo onde ela deve aparecer na UI), limites de chamadas ou custos?
   - **Impacto:** se o provedor gratuito (S-07) não aprovar uso comercial, a arquitetura muda inteira. R-01 e R-02 são altos, e o cache de RNF-16 depende dos limites.
12. **Desempenho:** qual o tempo máximo aceitável para exibir o maior elemento visível em 3G e 4G? O limite de 2,5 s em 4G é aceitável, e qual a meta para a primeira busca e para as consultas seguintes?
   - **Impacto:** RNF-03 não é testável e não há gate de performance no pipeline. A meta de 2,5 s pode ser inatingível com API externa.
13. **Acessibilidade:** o nível WCAG AA é obrigatório ou desejado?
   - **Impacto:** se for desejável, a auditoria pode ser adiada e o Review perde critério. Se for obrigatório, exige checklist e testes de a11y desde o início.
14. **Prazo e entrega:** há data-alvo, MVP definido ou marcos intermediários?
   - **Impacto:** sem MVP, os itens Should (RF-07, RF-10, RF-11) ficam sem decisão. Risco de entregar tudo ou nada.
15. **Hospedagem e operação:** onde a aplicação será publicada e quem é responsável pela operação e suporte?
   - **Impacto:** sem dono, não há responsável por HTTPS (RNF-15), monitoramento ou incidente. RNF-14 não tem responsável.
16. **Marca e design:** existe guia de marca, logotipo ou paleta a seguir, ou o visual é livre (dentro do tema definido pelo projeto)?
   - **Impacto:** define tokens do Tailwind e a paleta. Sem resposta, o visual é refeito a cada revisão.
17. **Meta de disponibilidade (RNF-14):** 99,5% mensal é suficiente? Há exigência de SLA formal ou janela de manutenção aceitável?
   - **Impacto:** sem SLA, o número não tem consequência. Não está definido se a app está "disponível" quando a API de clima cai (RNF-05).
18. **Período da previsão:** "previsão de 5 dias" inclui hoje ou são os 5 dias seguintes? Começa na data local da cidade?
   - **Impacto:** erro de um dia (off-by-one). Critérios de aceite de RF-04 ficam sem oráculo único.
19. **Fuso horário:** data e hora exibidas usam o fuso da cidade consultada ou o do dispositivo?
   - **Impacto:** cidades em outro fuso mostram "hoje" errado. Bug difícil de reproduzir e de testar.
20. **Frescor do clima atual:** qual a idade máxima aceitável do "clima atual" e haverá carimbo "atualizado às HH:MM"?
   - **Impacto:** contradição entre RF-03 ("atual") e RNF-16 (cache de 10 min). O usuário pode ver dado defasado sem aviso.
21. **Arredondamento:** a temperatura é exibida inteira ou com decimal? Qual a regra de arredondamento na conversão °C/°F?
   - **Impacto:** valores diferentes entre telas e testes. Ida e volta de unidade pode não retornar ao valor original.
22. **Dados ausentes da API:** o que exibir quando a API retorna campo nulo (sensação térmica, umidade, vento)?
   - **Impacto:** apareceria "undefined°" ou a tela quebraria. RF-12 não cobre dado parcial.
23. **Regras da busca:** mínimo de caracteres, máximo de resultados, ordenação (relevância ou população), debounce e tratamento de entrada vazia ou só com espaços.
   - **Impacto:** muitas requisições à API (com risco ao limite de R-01), lista imprevisível e testes sem critério.
24. **Estado vazio:** o que é "estado vazio" em cada tela? A tela inicial sem busca conta como vazia? Previsão sem dados também?
   - **Impacto:** RF-12 exige estados "em todas as telas" sem lista de telas. QA não consegue validar a cobertura.
25. **Retry:** quantas tentativas (RF-10), com qual intervalo e qual timeout? Erro de rede se diferencia de "cidade sem dados"?
   - **Impacto:** retry infinito ou inexistente. RNF-05 fica sem métrica verificável.
26. **Armazenamento bloqueado:** o que acontece se o `localStorage` estiver bloqueado (navegação privada ou política corporativa)?
   - **Impacto:** a unidade não persiste sem aviso, ou a aplicação quebra ao inicializar. Conflita com RF-07.
27. **Rotas e URL:** cada cidade tem URL própria (deep link)? Botão Voltar e recarregar a página preservam a consulta?
   - **Impacto:** decisão de roteamento tomada tarde. Usuário perde a cidade ao recarregar ou usar Voltar. RF-11 não define isso.
28. **Telemetria e LGPD:** haverá telemetria de uso ou erros (ex.: Sentry, GA)? Como conciliar isso com RNF-07 ("não coletar dados pessoais")?
   - **Impacto:** retrabalho jurídico e falta de banner de consentimento. As métricas da pergunta 2 também não podem ser medidas sem instrumentação.
29. **Aviso de precisão:** haverá aviso de isenção sobre a precisão da previsão na UI?
   - **Impacto:** risco jurídico por ausência de aviso sobre a precisão da previsão. Sem local definido na UI, o aviso pode ser omitido. A atribuição do provedor é tratada na pergunta 11.
30. **Condições e ícones:** quais condições textuais e ícones serão exibidos? Qual a fonte dos ícones e as traduções pt-BR dos códigos meteorológicos?
   - **Impacto:** strings inconsistentes e licença de ícones desconhecida. Textos vindos da API podem ficar em inglês.
31. **Tema visual:** o tema é claro, escuro ou segue `prefers-color-scheme`? O "dark glassmorphism" é decisão do negócio ou do projeto?
   - **Impacto:** retrabalho de design. O contraste exigido por RNF-04 não pode ser garantido nos dois temas.

### 5.1 Decisões sobre inconsistências internas

| # | Inconsistência | Decisão |
| - | -------------- | ------- |
| 1 | Largura mínima: RNF-01 (~360 px) x RNF-12 (320 px) | Usar **320 px** como referência para layout e testes E2E. |
| 2 | Sobreposição de performance: RNF-03, RNF-11 e RNF-16 | **Consolidar** em um único RNF de performance com meta de 2,5 s em 4G e cache tratado à parte. |
| 3 | Compatibilidade: RNF-08 x RNF-10 | **Unificar** em um único RNF (mantém RNF-08 e remove RNF-10). |
| 4 | Busca sem acentos (R-03 sem RF correspondente) | Criar novo RF como **Must**: a busca ignora acentos. |

## 6. Decisões

| Decisão | Justificativa | Perguntas em aberto resolvidas |
| ------- | ------------- | ------------------------------ |
| Priorizar como persona a pessoa que se desloca diariamente; pessoas que planejam atividades ao ar livre e cuidam da família permanecem como personas secundárias. | O uso mobile e a necessidade de decidir em poucos segundos são os sinais mais fortes do briefing; essa prioridade orienta a primeira experiência sem excluir os demais usos. | **1 (validada):** público prioritário e objetivo principal. |
| Avaliar o sucesso inicial por testes de usabilidade, observando a conclusão da busca até a exibição da previsão e o tempo para concluir a tarefa. Não coletar telemetria na v1. | Permite verificar se a consulta é rápida e compreensível sem introduzir coleta de dados antes de uma decisão sobre telemetria e LGPD (pergunta 28). | **2 (validada):** testes de usabilidade, sem telemetria. |
| Usar a Open-Meteo como fonte de dados, sem chave de API. | Atende à consulta de geocodificação e previsão sem exigir credencial no cliente. | **11 (parcialmente):** define o provedor e elimina a necessidade de chave; termos de uso, atribuição e limites de chamadas ainda precisam ser validados. |
| Limitar a v1 à previsão diária de hoje e dos 4 dias seguintes, com máxima, mínima e condição; não incluir previsão horária. | Mantém o escopo alinhado ao RF-04 e define um período único, reduzindo complexidade de dados e interface. | **3 (validada) e 18:** previsão diária, sem horária, incluindo hoje e os 4 dias seguintes. |
| Limitar a busca a cidades do Brasil, pesquisadas pelo nome e desambiguadas por estado; não aceitar CEP nem coordenadas na v1. | Mantém a busca simples e concentra os resultados no público geográfico definido para a primeira versão. | **4 (validada):** cobertura Brasil, busca por nome de cidade; CEP e coordenadas fora do escopo da v1. |
| Usar Celsius como unidade padrão. | Mantém a configuração inicial simples e confirma o requisito existente de iniciar em Celsius. | **7 (parcialmente):** define a unidade inicial de temperatura; as unidades de vento, pressão e precipitação continuam em aberto. |
| Não oferecer autenticação nem persistência de dados no servidor. | Evita contas e infraestrutura de dados de usuário, mantendo a consulta sem cadastro. | **6 (parcialmente):** descarta histórico ou favoritos persistidos no servidor, mas não define se haverá armazenamento local dessas funcionalidades. |
| Usar português do Brasil como idioma da interface. | Mantém a experiência consistente com o público e os requisitos atuais do produto. | **8:** define o idioma da UI; suporte a outros idiomas fica fora das decisões desta versão. |
| Entregar somente uma aplicação web responsiva, sem aplicativo nativo nem instalação como PWA na v1. | Corresponde ao briefing de uso pelo navegador e reduz escopo de implementação e operação. | **9 (validada):** plataforma móvel é web responsiva. |

## 7. Suposições

Premissas adotadas para seguir com a análise. Devem ser validadas com o solicitante.

- **S-01:** A aplicação é web responsiva (acessível pelo navegador do celular), sem app nativo nesta versão.
- **S-02:** Não há contas de usuário, login nem cadastro.
- **S-03:** "Previsão de 5 dias" significa uma visão diária com temperatura máxima e mínima e condição do tempo.
- **S-04:** A busca é por nome de cidade no Brasil, com desambiguação por estado quando houver homônimas.
- **S-05:** A unidade padrão é Celsius; a troca para Fahrenheit é global na aplicação.
- **S-06:** A preferência de unidade é guardada localmente no navegador, sem envio a servidor.
- **S-07:** Os dados meteorológicos vêm de um provedor externo gratuito e sem necessidade de chave de API pessoal, adequado ao contexto de treinamento.
- **S-08:** Não há requisito de notificações, alertas, mapas ou histórico de consultas nesta versão.
- **S-09:** A interface é em português do Brasil.
- **S-10:** Não há tratamento de dados pessoais; a localização do dispositivo, se usada no futuro, exigirá consentimento.
- **S-11:** Os requisitos de acessibilidade seguem WCAG 2.1 AA, por ser a referência usual.

## 8. Próximos passos

1. Incorporar na spec as decisões validadas para as perguntas 1, 2, 3, 4 e 9.
2. Validar com o solicitante as demais perguntas em aberto e ajustar as suposições afetadas.
3. Criar `specs/weather-app-spec.md` (Module 02), com user stories, critérios de aceite e casos de borda.
