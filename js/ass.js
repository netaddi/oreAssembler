let positionCnt = 0
let tagPosition = {}
let binCode = []

function getRs(token){
  return regList.indexOf(token) << 21
}
function getRt(token){
  return regList.indexOf(token) << 16
}
function getRd(token){
  return regList.indexOf(token) << 11
}
function getSa(token){
  return token << 6
}
function getNegative2sComplement(absValue, length)
{
  return (((1 << length) - 1) ^ absValue) + 1
}
function parseImmFromInt(imm, length)
{
  return imm < 0 ? getNegative2sComplement(-imm, length) : imm
}
function parseImmFromString(imm, length)
{
  let result = parseInt(imm, 16)
  return parseImmFromInt(result, length)
}
function getImm(token, length = 16)
{
  if(tagPosition[token] != undefined)
  {
    console.log(positionCnt + ' called ' + token + ' at ' + tagPosition[token]);
    return parseImmFromInt(tagPosition[token] - positionCnt - 1, length)
  }
  else
  {
    return parseImmFromString(token, length)
  }
}

function getOffset(token) {
  let offset = Number(token.replace(/\(.*\)/g, ''), 16)
  // console.log(offset);
  let rs = token.match(/\$[a-z0-9]+/)[0]
  // console.log(rs);
  if (rs) {
    rs = regList.indexOf(rs)
  }
  // console.log(rs);
  return (rs << 21) + parseImmFromInt(offset, 16)
}

function printBinCode(binCode)
{
  let binDiv = document.getElementById('binText')
  binDiv.value = ""
  for (binItem of binCode)
  {
    let thisHex = binItem.toString(16)
    let thisBin = binItem.toString(2)
    while(thisHex.length < 8)
    {
      thisHex = '0' + thisHex
    }
    while(thisBin.length < 32)
    {
      thisBin = '0' + thisBin
    }
    binDiv.value += thisHex + ' ' + thisBin + '\n'
  }
}

function preprocess(code){
  code = code.replace(/\/\/.*/g, '')
  code = code.replace(/#.*/g, '')
  // remove the comments
  code = code.replace(/;/g, '')
  // replace ';'
  code = code.replace(/^[ \t]*/g, '')
  code = code.replace(/\n\s*/g, '\n')
  //remove space and tab
  code = code.replace(/:\s*\n/g, ': ')
  code = code.replace(/:/g, ': ')
  //change tag line.
  console.log(code);
  return code.toLowerCase()
}


function assemble(code) {
  let sentences = code.split(/\n/g)
  binCode = []
  let usedSetences = []
  openedInstructionList = []
  positionCnt = 0
  tagPosition = {}
  for (sentence of sentences){
    if (sentence.replace(/\s/g, '') != '') {
      usedSetences.push(sentence);
      // remove blank setences.
      let decoloned = sentence.replace(/:.*/g, '')
      // console.log(decoloned);
      if (decoloned != sentence) {
        tagPosition[decoloned] = positionCnt;
      }
      positionCnt++;
    }
  }
  // console.log(usedSetences)
  console.log(tagPosition)
  positionCnt = -1
  for (sentence of usedSetences){
    positionCnt++
    let thisBinCode
    let tokens = sentence.split(/\s+|\s*,\s*|\s*:\s*/g)
    if (sentence.includes(':'))
    {
        tokens.shift();
    }//remove tag

    console.log(tokens)
    let inst = tokens[0]
    let thisOpcode
    let thisFuncCode
    // let overflow = true
    if (opcodeList[inst] != undefined) {
      thisOpcode = opcodeList[inst]
      thisBinCode = (thisOpcode << 26) >>> 0
    }
    if (thisOpcode == 0) {
      thisFuncCode = funcCodeList[inst]
      thisBinCode += thisFuncCode
      console.log(thisFuncCode);
    }
    console.log(thisOpcode);
    if (inst == 'syscall') {
      thisBinCode = 0xC
    }
    // thisBinCode = (thisOpcode << 26) + thisFuncCode
    if (r_dst.includes(inst)) {
      thisBinCode += getRd(tokens[1]) // rd
                  +  getRs(tokens[2]) // rs
                  +  getRt(tokens[3]) // rt
    }
    if (r_st.includes(inst)) {
      thisBinCode += getRs(tokens[1])  //rs
                  +  getRt(tokens[2])  //rt
    }
    if (r_dta.includes(inst)) {
      thisBinCode += getRd(tokens[1])  //d
                  +  getRt(tokens[2])
                  +  getSa(tokens[3])
    }
    if (r_dts.includes(inst)) {
      thisBinCode += getRd(tokens[1])
                  +  getRt(tokens[2])
                  +  getRs(tokens[3])
    }
    if (r_s.includes(inst)) {
      thisBinCode += getRs(tokens[1])
    }
    if (i_tsi.includes(inst)) {
      thisBinCode += getRt(tokens[1])
                  +  getRs(tokens[2])
                  +  getImm(tokens[3])
    }
    if (i_ti.includes(inst)) {
      thisBinCode += getRt(tokens[1])
                  + getImm(tokens[2])
    }
    if (i_tis.includes(inst)) {
      thisBinCode += getRt(tokens[1])
                  +  getOffset(tokens[2])
    }
    if (i_sti.includes(inst)) {
      thisBinCode += getRs(tokens[1])
                  +  getRt(tokens[2])
                  +  getImm(tokens[3])
    }
    if (i_si.includes(inst)) {
      thisBinCode += getRs(tokens[1])
                  +  getImm(tokens[2])
    }
    if (j_t.includes(inst)) {
      thisBinCode += getImm(tokens[1], 26)
    }
    binCode.push(thisBinCode)
    openedInstructionList.push(thisBinCode)
    // console.log(thisBinCode.toString(16));
  }
  // console.log(binCode);
  // alert(binCode);
  printBinCode(binCode);
}

function writeCoe(filename)
{
  const fs = require('fs')
  const stream = fs.createWriteStream(filename);
  stream.once('open', function(fd)
  {
    stream.write("memory_initialization_radix=16; \nmemory_initialization_vector=\n");
    for (binItem of binCode)
    {
      let strToWrite = binItem.toString(16)
      while(strToWrite.length < 8)
      {
        strToWrite = '0' + strToWrite
      }
      strToWrite += ', '
      stream.write(strToWrite)
    }
    stream.write(';');
    stream.end();
  });
}

function writeBin(filename)
{
  const fs = require('fs')
  let buf = new Buffer(binCode.length * 4)
  for (var i = 0; i < binCode.length; i++)
  {
    buf[i * 4]     = (binCode[i] >> 24) & 0xFF
    buf[i * 4 + 1] = (binCode[i] >> 16) & 0xFF
    buf[i * 4 + 2] = (binCode[i] >> 8)  & 0xFF
    buf[i * 4 + 3] = (binCode[i] )      & 0xFF
  }
  const stream = fs.createWriteStream(filename);
  // console.log(buf)
  stream.write(buf)
  stream.end()
  // stream.once('open', function(fd)
  // {
  //   for (binItem of binCode)
  //   {
  //     stream.write(binItem)
  //   }
  //   stream.end();
  // });
}
