const {app, BrowserWindow, dialog, ipcMain} = require('electron')
const path = require('path')
const sharp = require("sharp")

async function handleFileOpen() {
  const {canceled, filePaths} = await dialog.showOpenDialog({
    filters: [
      {name: 'SVG', extensions: ['svg']},
    ],
  })
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

async function handleConvertImage(_, imagePath) {
  const outputPath = `${imagePath}.png`;

  await sharp(imagePath, {limitInputPixels: 2684026890})
    .flatten({background: {r: 255, g: 255, b: 255}})
    .png()
    .toFile(outputPath);
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: 500,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  win.loadFile('index.html')

  return win;
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('process:convert', handleConvertImage)

  let mainWindow = createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })

  if (mainWindow) {
    // mainWindow.webContents.send('convert-success');
  }
})

app.on('window-all-closed', () => {
  app.quit()
})