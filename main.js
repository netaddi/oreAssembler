const electron = require('electron')
const Menu = require('electron').Menu
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow


const path = require('path')
const url = require('url')

const dialog = electron.dialog
const {webContents} = require('electron')
// const path = require('path')
const ipc = require('electron').ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1280, height: 960})
  // mainWindow.setMenu(null)
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// let menuJs = require('./lib/menu');

let template = [{
  label: 'File',
  submenu: [{
    label: 'New',
    accelerator: 'Ctrl+N'
  }, {
    label: 'Open',
    accelerator: 'Ctrl+O',
    click: function () {
      dialog.showOpenDialog(function (fileNames) {
        // fileNames is an array that contains all the selected
        if(fileNames === undefined){
          console.log("No file selected");
        }else{
          console.log(mainWindow.webContents.send)
          mainWindow.webContents.send('info-1', fileNames[0])
        }
      });
    }
  }, {
    label: 'Save',
    accelerator: 'Ctrl+S'
  }, {
    label: 'Save As',
    accelerator: 'Ctrl+Shift+S'
  }, {
    label: 'Exit'
  }]
}, {
  label: 'Help',
  role: 'help',
  submenu: [{
    label: 'About',
    click: function () {
      const modalPath = path.join('file://', __dirname, '../html/about.html')
      let win = new BrowserWindow({ frame: false })
      win.on('close', function () { win = null })
      win.loadURL(modalPath)
      win.show()
    }
  }]
}]


const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
