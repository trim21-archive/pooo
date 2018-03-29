'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

import CONFIG from './config/index'

import bus from './bus'

import startProxy from './proxy/index'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let proxyUp = false

ipcMain.on('update-config', (event, data) => {
  Object.assign(CONFIG, data)
  console.log(data)
})

ipcMain.on('start-proxy', (event, data) => {
  if (!proxyUp) {
    console.log('trying to start proxy server')
    startProxy(() => {
      console.log('proxy server is ready')
      mainWindow.webContents.send('proxy-ready')
      proxyUp = true
    })
  }
})

bus.$on('http', data => {
  mainWindow.webContents.send('http', data)
})

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
