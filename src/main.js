import { Editor, Extension, InputRule } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Markdown } from 'tiptap-markdown'
import './style.css'

const api = window.mdApp // só existe dentro do Electron
const $ = (id) => document.getElementById(id)

let file = { path: null, name: null }
let savedMarkdown = ''
let dirty = false

// "- [ ] " e "- [x] ": dentro de um bullet, "[ ] " vira item de tarefa.
const TaskShortcut = Extension.create({
  name: 'taskShortcut',
  addInputRules() {
    return [
      new InputRule({
        find: /^\[([ xX])\]\s$/,
        handler: ({ state, range, match, chain }) => {
          if (!state.selection.$from.node(-2)?.type.name?.includes('bulletList')) return null
          const checked = match[1].toLowerCase() === 'x'
          chain().deleteRange(range).toggleTaskList().updateAttributes('taskItem', { checked }).run()
        },
      }),
    ]
  },
})

// Digitar ``` numa linha vazia dentro de um bloco de código fecha o bloco.
const CloseFence = Extension.create({
  name: 'closeFence',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleTextInput: (view, from, to, text) => {
            const { $from } = view.state.selection
            if (text !== '`' || $from.parent.type.name !== 'codeBlock') return false
            const before = $from.parent.textBetween(0, $from.parentOffset)
            if (!/(^|\n)``$/.test(before)) return false
            const start = from - 2
            const tr = view.state.tr.delete(start, from)
            view.dispatch(tr)
            return this.editor.commands.exitCode() || this.editor.commands.insertContentAt(view.state.selection.to + 1, { type: 'paragraph' })
          },
        },
      }),
    ]
  },
})

// Listas de tarefas sem linha em branco entre os itens ao salvar.
const TightTaskList = Extension.create({
  name: 'tightTaskList',
  addGlobalAttributes() {
    return [{ types: ['taskList'], attributes: { tight: { default: true, rendered: false } } }]
  },
})

const editor = new Editor({
  element: $('editor'),
  autofocus: 'end',
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false, autolink: true }),
    Image,
    Placeholder.configure({ placeholder: 'Comece a escrever em Markdown…' }),
    TaskList,
    TaskShortcut,
    TightTaskList,
    CloseFence,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Markdown.configure({
      html: false,
      bulletListMarker: '-',
      tightLists: true,
      linkify: true,
      transformPastedText: true,
    }),
  ],
  onUpdate: () => setDirty(getMarkdown() !== savedMarkdown),
})

const getMarkdown = () => editor.storage.markdown.getMarkdown()

function render() {
  const name = file.name || 'Sem título'
  $('filename').textContent = name
  $('dirty').hidden = !dirty
  const title = `${dirty ? '● ' : ''}${name} - Markdown`
  document.title = title
  api?.setTitle(title)
}

function setDirty(v) {
  if (dirty === v) return
  dirty = v
  render()
}

function loadContent(f) {
  file = { path: f.path ?? null, name: f.name ?? null }
  editor.commands.setContent(f.content)
  // Normaliza: o que o editor devolve passa a ser a referência de "salvo".
  savedMarkdown = getMarkdown()
  dirty = false
  render()
  editor.commands.focus('start')
  $('scroll').scrollTop = 0
}

function confirmDiscard() {
  return !dirty || confirm('Há alterações não salvas. Descartá-las?')
}

async function openFile() {
  if (!confirmDiscard()) return
  if (api) {
    const f = await api.open()
    if (f) loadContent(f)
  } else {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.mdown,.txt,text/markdown,text/plain'
    input.onchange = async () => {
      const f = input.files[0]
      if (f) loadContent({ name: f.name, content: await f.text() })
    }
    input.click()
  }
}

async function saveFile() {
  const content = getMarkdown()
  if (api) {
    const r = await api.save({ path: file.path, content })
    if (!r) return
    file = r
  } else {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }))
    a.download = file.name || 'sem-titulo.md'
    a.click()
    URL.revokeObjectURL(a.href)
    file.name = a.download
  }
  savedMarkdown = content
  dirty = false
  render()
}

$('btn-open').onclick = openFile
$('btn-save').onclick = saveFile

// Tema: "system" segue o SO; os demais forçam o tema. Escolha fica salva no navegador.
const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
const themeSelect = $('theme')
let themePref = 'system'

function applyTheme() {
  const resolved = themePref === 'system' ? (systemDark.matches ? 'dark' : 'light') : themePref
  document.documentElement.dataset.theme = resolved
  themeSelect.value = themePref
}

function setTheme(pref) {
  themePref = pref
  try { localStorage.setItem('theme', pref) } catch { /* armazenamento indisponível: segue só na sessão */ }
  applyTheme()
}

try { themePref = localStorage.getItem('theme') || 'system' } catch { /* idem */ }
themeSelect.onchange = () => setTheme(themeSelect.value)
systemDark.addEventListener('change', () => { if (themePref === 'system') applyTheme() })
applyTheme()

window.addEventListener('keydown', (e) => {
  if (!(e.ctrlKey || e.metaKey) || e.altKey) return
  const k = e.key.toLowerCase()
  if (k === 's') { e.preventDefault(); saveFile() }
  else if (k === 'o') { e.preventDefault(); openFile() }
})

// Arrastar e soltar um arquivo .md na janela
window.addEventListener('dragover', (e) => e.preventDefault())
window.addEventListener('drop', async (e) => {
  const f = e.dataTransfer?.files?.[0]
  if (!f || !/\.(md|markdown|mdown|txt)$/i.test(f.name)) return
  e.preventDefault()
  if (!confirmDiscard()) return
  const p = api ? api.pathFor(f) : null
  loadContent(p ? await api.readPath(p) : { name: f.name, content: await f.text() })
})

// Links: Ctrl+clique abre; clique simples só edita
$('editor').addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href]')
  if (a && (e.ctrlKey || e.metaKey)) { e.preventDefault(); window.open(a.href, '_blank') }
})

// Aviso ao fechar com alterações (no Electron o main mostra o diálogo)
window.addEventListener('beforeunload', (e) => {
  if (dirty) { e.preventDefault(); e.returnValue = '' }
})

api?.onOpenPath((f) => { if (confirmDiscard()) loadContent(f) })
render()
api?.ready()

window.__editor = editor // útil para depurar e testar
