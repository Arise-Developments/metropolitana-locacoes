# Resumo das alterações em relação ao modelo

O modelo original tinha **uma única página** com duas seções (hero e localização) e um rodapé simples.
O site em Next.js mantém a identidade visual do modelo e expande o conteúdo para **6 telas** com fluxo de reserva completo.

## O que foi mantido do modelo

- **Paleta**: azul-marinho escuro (`#071630`), azul-claro de destaque (`#7cb8f7`), fundo claro azulado e verde do WhatsApp.
- **Logo**: quadrado com ícone de carro, detalhe no canto e "METROPOLITANA LOCAÇÕES" em caixa alta.
- **Hero**: os mesmos textos ("A cidade muda. Seu caminho é você quem faz."), o sobretítulo "METROPOLITANA / LOCAÇÕES", os botões "Alugar carro" e "Falar no WhatsApp", a linha "M / 01 · Seu trajeto começa aqui", o texto vertical na lateral e a composição em duas colunas.
- **Seção "Encontre a Metropolitana"**: título "A sua próxima viagem começa aqui.", borda lateral, mapa OpenStreetMap com moldura branca e sombra deslocada.
- **Cabeçalho**: tagline "Seu destino, no seu ritmo." e o ícone de usuário.
- **Botão flutuante do WhatsApp** e a frase do rodapé "Seu caminho começa com uma boa escolha."
- **Tipografia**: títulos bold com espaçamento negativo (Manrope) e texto em DM Sans, com rótulos pequenos em caixa alta espaçada.

## O que mudou no design

| Modelo | Agora | Motivo |
|---|---|---|
| Foto de carro no hero | Ilustração vetorial de cidade à noite com um sedan | Não há foto própria da frota; a ilustração não tem direitos autorais e fica nítida em qualquer tela. Dá para trocar por foto depois. |
| Campo "Endereço da loja (configurar depois)" visível para o visitante | O endereço fica em `src/config/site.ts` | Era uma instrução interna aparecendo para o cliente. |
| Marcador ilustrativo no centro do Brasil | O marcador só aparece com as coordenadas reais configuradas; até lá o mapa mostra o Brasil sem marcador | Um marcador falso pode levar o cliente ao lugar errado. |
| Cabeçalho só com logo, tagline e ícone | Adicionados menu (Início, Frota, Planos, Como funciona, Contato), botão "Reservar" e menu móvel | Navegação entre as novas telas. |
| Rodapé de uma linha | Rodapé com navegação, categorias, endereço e horário | Mais informação e mais links internos para SEO. |
| Seção de localização só com o WhatsApp | Inclui horário de atendimento e o botão "Como chegar" (Google Maps), que aparece quando a loja estiver configurada | |

## Novas seções na página inicial

1. **Busca rápida**: retirada, devolução e categoria, que levam direto para a reserva.
2. **Faixa de benefícios**: carros revisados, do dia ao mês, assistência e sem burocracia.
3. **Categorias**: Econômico, Compacto, Sedan, SUV, Executivo e Utilitário, com o preço "a partir de".
4. **Planos**: Diária, Semanal (-10%) e Mensal (-25%).
5. **Como funciona**: os 4 passos da reserva.
6. **Frota em destaque**.
7. **Perguntas frequentes** (acordeão).

## Novas telas

| Rota | Tela |
|---|---|
| `/frota` | Catálogo com busca, filtros por categoria, câmbio e diária máxima, ordenação por preço e estado vazio. Os filtros ficam na URL, então o link pode ser compartilhado. |
| `/frota/[id]` | Detalhes do carro: ficha técnica, itens de série, valor por diária nos planos diário, semanal e mensal, botões de reserva e WhatsApp e carros semelhantes. |
| `/reserva` | **Reserva em 4 etapas**: período e local (loja ou entrega), veículo, proteção e extras, dados do cliente. O resumo e o valor estimado aparecem em tempo real. Cada etapa é validada (datas no passado, devolução antes da retirada, telefone etc.). No fim, o pedido formatado é enviado pelo WhatsApp. |
| `/contato` | Formulário (nome, telefone, assunto e mensagem) enviado pelo WhatsApp, mais a seção de localização. |
| `/entrar` | Área do cliente (destino do ícone de usuário). Por enquanto avisa que está "em breve" e direciona ao WhatsApp, porque uma área com login exige back-end. |
| 404 | Página de erro personalizada. |

## Melhorias técnicas

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS 4.**
- **Configuração central** em `src/config/site.ts`: WhatsApp, telefone, e-mail, endereço, coordenadas, horários, descontos, taxa de entrega e extras.
- **Frota** em `src/data/cars.ts`: para adicionar, remover ou alterar um carro, basta editar a lista.
- **SEO**: título e descrição por página, Open Graph, `sitemap.xml` e `robots.txt` gerados automaticamente, e páginas dos carros pré-renderizadas.
- **Acessibilidade**: link "Pular para o conteúdo", foco visível, rótulos nos campos, mensagens de erro com `role="alert"` e `aria-*` nos filtros e no menu.
- **Responsivo**: menu móvel e layout adaptado do celular ao desktop.
- **Mapa** carregado só no navegador, com marcador próprio (evita o problema clássico de ícones quebrados do Leaflet).

## Pendências antes de publicar

Preencha em `src/config/site.ts`:

- [ ] `contact.whatsapp`: número com DDI e DDD, só dígitos (ex.: `5511999999999`). Enquanto estiver vazio, o WhatsApp abre sem destinatário.
- [ ] `contact.phone` e `contact.email`.
- [ ] `store.address` e `store.location`: latitude e longitude da loja, com `configured: true`.
- [ ] `url`: domínio definitivo.
- [ ] Revise preços, descontos, extras e a frota em `src/data/cars.ts`. **Os valores atuais são exemplos.**
- [ ] Revise as respostas das perguntas frequentes em `src/app/page.tsx` (documentos, idade mínima, devolução antecipada) conforme as regras reais da empresa.
