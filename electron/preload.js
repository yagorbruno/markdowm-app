const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('mdApp', {
  open: () => ipcRenderer.invoke('file:open'),
  save: (data) => ipcRenderer.invoke('file:save', data),
  setTitle: (title) => ipcRenderer.send('window:title', title),
  onOpenPath: (cb) => ipcRenderer.on('file:opened', (_e, file) => cb(file)),
  onMenu: (cb) => ipcRenderer.on('menu', (_e, action) => cb(action)),
  ready: () => ipcRenderer.send('renderer:ready'),
  // File dropped onto the window
  pathFor: (file) => require('electron').webUtils.getPathForFile(file),
  readPath: (p) => ipcRenderer.invoke('file:read', p),
})
