# VTT RPG System - D&D 5e

## Estrutura do Projeto

- `/docs`: Contém o relatório completo em LaTeX (`relatorio.tex`).
- `/sql`: Contém o script SQL do Supabase e regras de RLS (`schema.sql`).
- `/types`: Definições TypeScript dos dados de personagens e rolagens.
- `/utils`: Motor do interpretador de rolagens de dados (`diceParser.ts`).
- `/components`: Componentes da interface, incluindo o Mapa Tático 2D.

## Como Executar

1. **Relatório LaTeX:** Copia o ficheiro `docs/relatorio.tex` para o Overleaf ou compila-o no PyCharm com o plugin TeXify IDEA.
2. **Base de Dados:** Copia o conteúdo de `sql/schema.sql` para o SQL Editor do Supabase.
3. **Aplicação Web:** Executa `npm install` e depois `npm run dev`.
