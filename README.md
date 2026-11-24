# Metropolitana Locações

Site de aluguel de carros em Next.js 15, TypeScript e Tailwind CSS 4.

## Rodando

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção
npm start        # serve o build
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Contato, endereço, mapa e horários | `src/config/site.ts` |
| Simulador: descontos, fim de semana, km, proteções, adicionais, planos mensais, taxa e caução | `src/config/simulador.ts` |
| Frota e categorias | `src/data/cars.ts` |
| Textos da página inicial e perguntas frequentes | `src/app/page.tsx` |
| Cores e fontes | `src/app/globals.css` (bloco `@theme`) |

O que mudou em relação ao modelo original está em [ALTERACOES.md](ALTERACOES.md).
