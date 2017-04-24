// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const shell = require('electron').shell
const fs = require('fs')
const exLinksBtn = document.getElementById('githubLink')
const assBtn = document.getElementById('assembleBtn')
const deassBtn = document.getElementById('deassembleBtn')
let binCode = [];
let hexCode = [];
// let code;

if (exLinksBtn)
{
  exLinksBtn.addEventListener('click', function (event) {
      shell.openExternal('https://github.com/netaddi/oreAssembler')
  })
}

//compile stage
if (assBtn) {
  assBtn.addEventListener('click', function compile(event) {
    let code = document.getElementById('assText').value;
    // console.log(code)
    let preprocessedCode = preprocess(code);
    binCode = assemble(preprocessedCode);

    // document.getElementById('binText').innerHTML = preprocessedCode;
  })
}

if (deassBtn) {
  deassBtn.addEventListener('click', function decompile(event){
    deass()
    document.getElementById('assText').value = deassedStr
  })
}

function writeId(id, content) {
  document.getElementById(id).innerHTML = content;
}

function appendId(id, content){
  document.getElementById(id).innerHTML += content;
}

let clearLog = function () {
  document.getElementById('log').innerHTML = '';
}

let updateLog = function (newLog) {
  // clearLog()
  document.getElementById('log').innerHTML = newLog;
}

const ipc = require('electron').ipcRenderer
let fileContent
ipc.on('open-filename', function (event, filename) {
    // fileContent = text;
    // document.getElementById('assText').innerHTML = fileContent;
    // console.log('open signal: ' + filename);
    fs.readFile(filename, 'utf8', function fileOpened(err, fileData) {
      // document.getElementById('as sText').innerHTML = fileData;
      // console.log(fileData);
      document.getElementById('assText').value = fileData
      // highlight();
    })
})
//receive filename signal to call system dialog to open file.

ipc.on('write-filename' ,function (event, filename) {
  // console.log('write signal: ' + filename);
  let fileContent = document.getElementById('assText').value.replace('&nbsp;', ' ')

  fs.writeFile(filename, fileContent, function fileSaved(err) {
    // console.log(err);
    // console.log(fileContent);
    updateLog("asm file " + filename + " saved.")
    // document.getElementById('log').innerHTML =  "saving " + filename + " successed."
    // setTimeout(document.getElementById('log').innerHTML = '', 2000)
  })
})
//on receiving write signal, write the file.

ipc.on('write-coe', function(event, coeFilename){
  // console.log('coe signal: ' + coeFilename);
  writeCoe(coeFilename)
  updateLog("coe file " + coeFilename + " saved.")
})
ipc.on('write-bin', function(event, filename){
  // console.log('bin signal: ' + filename);
  writeBin(filename)
  updateLog("bin file " + filename + " saved.")
})
ipc.on('clear-content', function(){
  document.getElementById('assText').value = ''
})

ipc.on('open-coe', function(event, filename){
  fs.readFile(filename, 'utf8', function fileOpened(err, fileData){
    parseCoe(fileData)
  })
})

ipc.on('open-bin', function(event, filename){
  fs.readFile(filename, function fileOpened(err, fileData){
    parseBin(fileData)
  })
})
