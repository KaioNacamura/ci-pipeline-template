# ci-pipeline-template

Modelo de pipeline de integração contínua no GitHub Actions para projetos Node com TypeScript e PostgreSQL.

Montei esse modelo depois de passar por um problema real: num projeto em que trabalho, havia mais de 30 testes escritos e nenhum rodava no CI, porque o job de teste nunca tinha sido ligado. Aqui cada verificação é um job separado, e um job final mostra se tudo passou.

## O que a pipeline faz

| Job | O que confere |
| --- | --- |
| Lint | ESLint com as regras recomendadas de TypeScript |
| Type Check | `tsc --noEmit` com `strict` ligado |
| Testes unitários | Vitest nos arquivos de `src/` |
| Testes com PostgreSQL | sobe um PostgreSQL 16 como service e roda os testes de `tests-db/` contra ele |
| Build | só roda se os quatro de cima passarem; guarda o `dist/` como artefato |
| Security Audit | `npm audit` nas dependências de produção, falhando com vulnerabilidade alta |
| Pipeline Status | junta o resultado de todos e falha se algum falhou |

Outros detalhes:

- `npm ci` com cache, para instalar exatamente o que está no `package-lock.json`.
- `concurrency` cancela a execução antiga quando chega um push novo no mesmo branch.
- O banco só é usado depois do health check (`pg_isready`), então o teste não falha por o banco ainda estar subindo.

## Código de exemplo

Para a pipeline ter o que testar, o projeto traz um módulo pequeno de dinheiro em centavos (`src/dinheiro.ts`): converte texto como `1.234,56` para centavos, formata em reais e divide um valor em parcelas sem perder centavo. Valor em dinheiro fica em inteiro porque `0.1 + 0.2` não dá `0.3` em ponto flutuante.

O teste de banco cria a tabela `pedidos` e confere que o próprio PostgreSQL recusa um total negativo.

## Rodando na sua máquina

Precisa de Node 20 ou mais novo.

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

Para o teste de banco, tenha um PostgreSQL rodando e aponte a variável `DATABASE_URL`:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ci_test npm run test:db
```

## Usando em outro projeto

Copie `.github/workflows/ci.yml` e ajuste os scripts do `package.json` para os nomes que o seu projeto usa. Se o projeto não tem banco, apague o job `db-tests` e tire ele da lista `needs` do `build` e do `status`.

No GitHub, em Settings > Branches, dá para exigir que o job **Pipeline Status** passe antes de aceitar um pull request no `main`.
