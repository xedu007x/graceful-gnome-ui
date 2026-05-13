## Atualização do protótipo TEC conforme HU consolidada

A imagem nova é praticamente idêntica à atual; o foco do trabalho está em alinhar a tela e o fluxo aos critérios de aceite da HU (UFESPs, fonte CVM/TE, validações, recálculo em atraso, histórico, judicialização e listagem de acompanhamento).

### Módulo 1 — Emissão de TEC (`src/pages/EmissaoTEC.tsx`)

1. **Novo campo automático "Qtde total de UFESPs"** ao lado de "Valor corrigido a devolver", com badge AUTO. Calculado como `valor histórico ÷ valor da UFESP parametrizada` (UFESP fixa de referência, ex.: R$ 37,02 — constante em `src/lib/ufespStore.ts` para evolução futura).
2. **Fonte da cota CVM ou planilha TE**: ajustar `getCotaValorPorData` para retornar também a origem (`CVM` quando vier do store oficial / `Planilha TE` como fallback) e mostrar sufixo no campo "Fonte da cota" (ex.: "BB RF CP Automático — Planilha TE (08/04/2025)").
3. **Validação de parcelas por faixa de UFESPs** (CA 11): ao alterar "Nº de parcelas mensais", aplicar limites:
   - ≤ 1.000 → 2; 1.001-5.000 → 6; 5.001-20.000 → 12; 20.001-40.000 → 18; > 40.000 → 24.
   - Bloquear `Salvar Rascunho`, `Solicitar Emissão` e `Gerar TEC` enquanto exceder; exibir mensagem inline abaixo do campo + toast.
4. **Vencimento fixo dia 20** (já existe) — manter; adicionar legenda "Vencimento: todo dia 20" no cabeçalho do grid.
5. **Botão "Finalizar TEC"** (CA 07): só habilita quando todas as parcelas estão com `dataPgto` preenchida (não apenas calculadas). Ao finalizar, bloquear todos os campos e mover status para "TEC Encerrado".
6. **Histórico do TEC (suspensão / judicialização)**: ao suspender, gravar `{ data, usuário, motivo }` em estado `historico` e exibir banner laranja com badge "Processo judicializado" + bloqueio de todas as ações operacionais (somente leitura), conforme CA 08.
7. **Status "Rascunho"**: renomear o estado inicial "Em negociação" para "Rascunho" para alinhar com a HU e com a tela de Acompanhamento.

### Módulo 2 — Gerenciar TEC / Fluxo de Pagamentos

Hoje `GerenciarTEC.tsx` apenas redireciona para `EmissaoTEC`. Vamos transformar a área inferior (grid de parcelas) para atender CA 09–14 dentro da própria EmissaoTEC quando o status for "TEC emitido"/"Em andamento":

1. **Cabeçalho fixo do TEC ativo**: Tomador, Contrato, Valor da Parcela em cotas, Data de emissão.
2. **Campos manuais (azul) por linha**: já existem `dataPgto`, `comunicadoSigam` — adicionar coluna **"Observações"** (Input texto curto).
3. **Indicação visual de atraso**: parcelas com `vencimento < hoje` e sem `dataPgto` ganham linha com fundo `bg-red-50` e badge "Em atraso".
4. **Botão "Recalcular parcela"** (CA 14): aparece somente em parcelas em atraso (>3 dias após vencimento). Faz a mesma chamada de `calcularParcela`, registra no histórico da parcela `{ data, responsável, cotaUtilizada, valorAnterior, valorNovo }`.
5. **Histórico por parcela** (CA 13): popover/Dialog com lista de alterações (campo, valor anterior, valor novo, data, responsável). Estado mantido em memória.
6. **Cálculo automático "3 dias antes do dia 20"**: indicação visual (badge "Calcular agora") nas parcelas cujo vencimento esteja entre hoje e hoje+3 e ainda não calculadas.

### Módulo 3 — Acompanhamento de TECs (`src/pages/AcompanhamentoTEC.tsx`)

1. Atualizar lista de status do filtro para refletir a HU: **Rascunho, Em Formalização, TEC Emitido, Em Andamento, Suspenso, Encerrado**.
2. Atualizar `statusColors` para incluir Suspenso (laranja) e Em Formalização (âmbar).
3. Adicionar filtro por **período (de/até) por data de emissão**.
4. Mostrar ícone de "judicializado" (PauseCircle laranja) ao lado do status quando `Suspenso`.

### Detalhes técnicos

- Criar `src/lib/ufespStore.ts` com `getValorUfespAtual()` retornando R$ 37,02 (placeholder parametrizável).
- Criar `src/lib/parcelasValidation.ts` com `getMaxParcelasPorUfesps(qtdUfesps): number` aplicando a tabela do CA 11.
- Estado `historicoTec` e `historicoParcela[idx]` ficam locais (sem backend) — apenas demonstração protótipo.
- Manter padrão visual atual (Tailwind tokens, badges semânticos). Sem mudanças na cota base nem no `cotasStore.ts`.

### Fora de escopo

- Persistência real, integração CVM, geração de PDF/RTF, autenticação/perfil de usuário (responsável será mockado como "GESUP2").
