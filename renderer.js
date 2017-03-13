// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const shell = require('electron').shell

const exLinksBtn = document.getElementById('githubLink')

exLinksBtn.addEventListener('click', function (event) {
    shell.openExternal('https://github.com/netaddi/oreAssembler')
})