const electron = require('electron')
const dialog = electron.dialog
const Menu = electron.Menu
const path = require('path')
const BrowserWindow = require('electron').BrowserWindow
const ipc = require('electron').ipcMain
// const dialog = require('electron').dialog
const {webContents} = require('electron')



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
          // readFile(fileNames[0]))
          // webContents. send('info', fileNames[0])
          rendererWindow.webContents.send('filename', fileNames[0])
          // console.log(fileNames[0])
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



module.exports.template = template
