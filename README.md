<div align="center">

# Markdown

**A minimalist single-pane Markdown editor and reader for Windows.**<br>
**Editor e leitor de Markdown minimalista, em uma única tela, para Windows.**

[**⬇ Download**](../../releases/latest) · [English](#english) · [Português](#português)

</div>

---

## English

Markdown is a tiny desktop app that behaves like Notepad, but for `.md` files. There is no split view and no
separate preview: you type Markdown and it turns into formatted text right away. The file on disk stays plain
Markdown.

### Features

- **Live formatting in one pane.** Type `# ` for a heading, `- ` for a bullet, `1. ` for a numbered list,
  `> ` for a quote, ```` ``` ```` for a code block, `---` for a divider, `- [ ] ` for a checkbox,
  `**bold**`, `*italic*`, `` `code` ``.
- **Plain Markdown on disk.** Nothing proprietary is written to your files.
- **Renders tables, images and links.** Links open with `Ctrl+Click`; a plain click just edits.
- **A real Windows app.** Installer or portable `.exe`, no browser needed.
- **Default app for `.md`.** The installer registers `.md`, `.markdown` and `.mdown`, so double-clicking a file opens it.
  If the app is already running, the file opens in the same window.
- **Drag and drop** a Markdown file onto the window.
- **Unsaved-changes warning** when you open another file or close the window.

Shortcuts: `Ctrl+O` open · `Ctrl+S` save.

> The interface (buttons and placeholder) is currently in Portuguese.

### Install

1. Go to the [latest release](../../releases/latest).
2. Download **`Markdown Setup x.y.z.exe`** (installer) or **`Markdown x.y.z.exe`** (portable, no install).
3. Run it.

The app is not code-signed, so Windows SmartScreen may show *"Windows protected your PC"* the first time.
Click **More info → Run anyway**.

### Make it the default app for `.md`

Windows does not let apps set themselves as the default, so do this once:

1. Right-click any `.md` file → **Open with → Choose another app**.
2. Pick **Markdown**, check **Always use this app**, and click OK.

Or go to **Settings → Apps → Default apps**, search for `.md` and choose Markdown.

### Build from source

Requires [Node.js](https://nodejs.org) 22+.

```bash
npm install
npm start          # build and run the desktop app
npm run dev        # web version at http://localhost:5173 (open/save through the browser)
npm run dist       # build the installer and portable .exe into release/
```

A GitHub Actions workflow (`.github/workflows/build.yml`) builds Windows, macOS and Linux packages on `v*` tags
or manually from the **Actions** tab.

### Stack

Electron + Vite + [TipTap](https://tiptap.dev) (ProseMirror), with `tiptap-markdown` to read and write `.md`.

### License

[MIT](LICENSE)

---

## Português

Markdown é um app de desktop pequeno que funciona como o Bloco de Notas, mas para arquivos `.md`. Não há painel
dividido nem preview separado: você escreve em Markdown e o texto já vira formatação na hora. O arquivo no disco
continua sendo Markdown puro.

### Recursos

- **Formatação ao vivo em uma única tela.** `# ` vira título, `- ` vira bullet, `1. ` vira lista numerada,
  `> ` vira citação, ```` ``` ```` vira bloco de código, `---` vira linha, `- [ ] ` vira checkbox,
  `**negrito**`, `*itálico*`, `` `código` ``.
- **Markdown puro no disco.** Nada proprietário é gravado nos seus arquivos.
- **Renderiza tabelas, imagens e links.** Links abrem com `Ctrl+clique`; clique simples só edita.
- **Um app de verdade para Windows.** Instalador ou `.exe` portátil, sem precisar de navegador.
- **App padrão para `.md`.** O instalador associa `.md`, `.markdown` e `.mdown`, então dois cliques no arquivo
  abrem o app. Se ele já estiver aberto, o arquivo carrega na mesma janela.
- **Arrastar e soltar** um arquivo Markdown na janela.
- **Aviso de alterações não salvas** ao abrir outro arquivo ou fechar a janela.

Atalhos: `Ctrl+O` abrir · `Ctrl+S` salvar.

### Instalar

1. Abra a [última release](../../releases/latest).
2. Baixe **`Markdown Setup x.y.z.exe`** (instalador) ou **`Markdown x.y.z.exe`** (portátil, sem instalar).
3. Execute.

O app não é assinado digitalmente, então o SmartScreen do Windows pode mostrar *"O Windows protegeu seu PC"* na
primeira vez. Clique em **Mais informações → Executar assim mesmo**.

### Definir como app padrão para `.md`

O Windows não deixa um programa se definir como padrão sozinho, então faça isto uma vez:

1. Clique com o botão direito em qualquer `.md` → **Abrir com → Escolher outro aplicativo**.
2. Selecione **Markdown**, marque **Sempre usar este aplicativo** e clique em OK.

Ou vá em **Configurações → Aplicativos → Aplicativos padrão**, procure `.md` e escolha o Markdown.

### Compilar do código-fonte

Requer [Node.js](https://nodejs.org) 22+.

```bash
npm install
npm start          # compila e abre o app de desktop
npm run dev        # versão web em http://localhost:5173 (abrir/salvar via navegador)
npm run dist       # gera o instalador e o .exe portátil em release/
```

Um workflow do GitHub Actions (`.github/workflows/build.yml`) gera pacotes para Windows, macOS e Linux em tags
`v*` ou manualmente pela aba **Actions**.

### Stack

Electron + Vite + [TipTap](https://tiptap.dev) (ProseMirror), com `tiptap-markdown` para ler e gravar `.md`.

### Licença

[MIT](LICENSE)
