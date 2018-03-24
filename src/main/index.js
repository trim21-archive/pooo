'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

import CONFIG from '../config'

import bus from '../bus'

import proxy from './proxy/index'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let proxyStatus = 'stop'

ipcMain.on('update-config', (event, data) => {
  Object.assign(CONFIG, data)
  console.log(data)
})

ipcMain.on('start-proxy', (event, data) => {
  if (proxyStatus === 'stop') {
    mainWindow.webContents.send('config-data', CONFIG)
    proxy.start()
    proxyStatus = 'starting'
    event.returnValue = proxyStatus
  } else {
    event.returnValue = proxyStatus
  }
})

ipcMain.on('stop-proxy', (event, data) => {
  proxy.close()
})

bus.$on('proxy-ready', () => {
  proxyStatus = 'started'
  mainWindow.webContents.send('proxy-ready')
})

bus.$on('skill', (data) => {
  // console.log(data)
  mainWindow.webContents.send('render-skill', data)
})

bus.$on('attack', (data) => {
  // console.log(data)
  mainWindow.webContents.send('render-attack', data)
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
