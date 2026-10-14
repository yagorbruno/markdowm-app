# Markdown

Editor/leitor de `.md` minimalista, em uma única tela. Não há painel dividido:
o que você escreve em Markdown vira formatação na hora (`# ` vira título,
`- ` vira bullet, `**texto**` vira negrito, `> ` vira citação, ```` ``` ```` vira
bloco de código, `- [ ] ` vira checkbox, `---` vira linha). O arquivo é salvo
como Markdown puro.

## Usar

```bash
npm install
npm start          # compila e abre o app
npm run dev        # versão web em http://localhost:5173 (abrir/salvar via navegador)
```

Atalhos: `Ctrl+O` abrir, `Ctrl+S` salvar. Também dá para arrastar um `.md` para
a janela ou abrir com "Abrir com" (o instalador associa `.md`). `Ctrl+clique`
abre links.

## Gerar o instalador do Windows

Rode `npm run dist` no Windows, ou use a aba **Actions → Build → Run workflow**
no GitHub: os instaladores (`.exe`, `.dmg`, `.AppImage`) saem como artefatos.

## Stack

Electron + Vite + TipTap (ProseMirror) com `tiptap-markdown` para ler/gravar `.md`.
