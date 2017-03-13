const electron = require('electron')
const Menu = electron.Menu
const path = require('path')
const BrowserWindow = require('electron').BrowserWindow


let template = [{
  label: 'File',
  submenu: [{
    label: 'New',
    accelerator: 'Ctrl+N'
  }, {
    label: 'Open',
    accelerator: 'Ctrl+O'
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
