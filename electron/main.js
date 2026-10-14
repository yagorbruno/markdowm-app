const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron')
const fs = require('node:fs/promises')
const path = require('node:path')

const MD_FILTERS = [
  { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'txt'] },
  { name: 'Todos os arquivos', extensions: ['*'] },
]

let win = null
let rendererReady = false
let pendingPath = findPathArg(process.argv)

function findPathArg(argv) {
  const args = app.isPackaged ? argv.slice(1) : argv.slice(2)
  return args.find((a) => !a.startsWith('-') && /\.(md|markdown|mdown|txt)$/i.test(a)) || null
}

async function readFile(p) {
  const content = await fs.readFile(p, 'utf8')
  return { path: p, name: path.basename(p), content }
}

async function sendOpen(p) {
  if (!win) return
  try {
    win.webContents.send('file:opened', await readFile(p))
  } catch (err) {
    dialog.showErrorBox('Não foi possível abrir o arquivo', String(err.message || err))
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  win.webContents.on('will-prevent-unload', (e) => {
    const choice = dialog.showMessageBoxSync(win, {
      type: 'question',
      buttons: ['Sair sem salvar', 'Cancelar'],
      defaultId: 1,
      cancelId: 1,
      message: 'Há alterações não salvas.',
    })
    if (choice === 0) e.preventDefault()
  })
  win.on('closed', () => { win = null; rendererReady = false })
}

ipcMain.on('renderer:ready', () => {
  rendererReady = true
  if (pendingPath) { sendOpen(pendingPath); pendingPath = null }
})

ipcMain.on('window:title', (_e, title) => win && win.setTitle(title))

ipcMain.handle('file:read', (_e, p) => readFile(p))

ipcMain.handle('file:open', async () => {
  const r = await dialog.showOpenDialog(win, { properties: ['openFile'], filters: MD_FILTERS })
  if (r.canceled || !r.filePaths[0]) return null
  return readFile(r.filePaths[0])
})

ipcMain.handle('file:save', async (_e, { path: p, content }) => {
  let target = p
  if (!target) {
    const r = await dialog.showSaveDialog(win, { defaultPath: 'sem-titulo.md', filters: MD_FILTERS })
    if (r.canceled || !r.filePath) return null
    target = r.filePath
  }
  await fs.writeFile(target, content, 'utf8')
  return { path: target, name: path.basename(target) }
})

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', (_e, argv) => {
    const p = findPathArg(argv)
    if (win) { if (win.isMinimized()) win.restore(); win.focus() }
    if (p) sendOpen(p)
  })
  // macOS: double click on a file
  app.on('open-file', (e, p) => {
    e.preventDefault()
    if (rendererReady) sendOpen(p); else pendingPath = p
  })
  app.whenReady().then(() => {
    Menu.setApplicationMenu(null)
    createWindow()
  })
  app.on('window-all-closed', () => app.quit())
}
