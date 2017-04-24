function highlightLine(line){
  let lineHtml = ''
  let blocks = line.split('&nbsp;')
  for(block of blocks){
    let blockHtml = ''
    let tokens = block.split(',')
    for(token of tokens)
    {
      blockHtml += ','
      if (regList.indexOf(token) > -1) {
        //this token is a register
        blockHtml += '<span class="reg">' + token + '</span>'
        continue
      }
      if (opcodeList[token] != undefined) {
        //opcode
        blockHtml += '<span class="instruct">' + token + '</span>'
        continue
      }
      if (token.match(/.+\:/)) {
        //assemble tag
        blockHtml += '<span class="tag">' + token + '</span>'
        continue
      }
      blockHtml += token
    }
    lineHtml += blockHtml.slice(1)
    // delete the ',' at the start
    lineHtml += '&nbsp;'
  }
  return lineHtml
}

function highlight(){
  let assTextElement = document.getElementById('assText')
  let colorTextElement = document.getElementById('colorText')
  let codeBlockElement = document.getElementById('codeBlock')
  let code = assTextElement.value
  code = code.replace(' ', '&nbsp;')
  // assTextElement.value = code
  //get code from textarea


  // add span for comments

  let codeLines = code.split('\n')
  let lineCnt = 0
  htmlToWrite = ''
  for (line of codeLines) {
    let doubleLineComment = line.match(/\/\/.*/)
    code = line.replace(/\/\/.*/g, '')
    let sharpComment = code.match(/#.*/)
    code = line.replace(/#.*/g, '')
    //filter comments
    htmlToWrite += highlightLine(line)
    if (doubleLineComment) {
      htmlToWrite += '<span class="comment">' + doubleLineComment[0] + '</span>'
    }
    if (sharpComment) {
      htmlToWrite += '<span class="comment">' + sharpComment[0] + '</span>'
    }

    htmlToWrite += '<br>'


    ++lineCnt
  }

  colorTextElement.innerHTML = htmlToWrite
  if (colorTextElement.scrollHeight > 20) {
    assTextElement.rows =
    colorTextElement.scrollHeight / 20 + 2
  }
}
