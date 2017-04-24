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
function getImm(token)
{
  let result = Number(token)
  if (isNaN(result)) {
    result = tagPosition[token] - positionCnt;
  }
}
function getOffset(token) {
  let offset = Number(token.replace(/\(.*\)/g, ''))
  let rs = token.match(/\$[a-z]+/)
  if (rs) {
    rs = regList.indexOf(rs)
  }
  return (rs << 21) + offset
}

function preprocess(code){
  code = code.replace(/\/\/.*/g, '')
  code = code.replace(/#.*/g, '')
  // remove the comments
  code = code.replace(/;/g, '')
  // replace ';'
  code = code.replace(/^[ \t]*/g, '')
  //remove space and tab
  code = code.replace(/:\s*\n/g, ':')
  code = code.replace(/:/g, ': ')
  //change tag line.
  return code.toLowerCase()
}
function assemble(code) {
  let binCode = []
  let sentences = code.split(/\n/g)
  let positionCnt = 0
  let tagPosition = {}
  let usedSetences = []
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
  // console.log(tagPosition)
  positionCnt = -1
  for (sentence of usedSetences){
    positionCnt++
    let thisBinCode
    let tokens = sentence.split(/\s|,\s*/g)
    console.log(tokens)
    let inst = tokens[0].replace(/.*:/g, '')
    let thisOpcode
    let thisFuncCode
    if (opcodeList[inst] != undefined) {
      thisOpcode = opcodeList[inst]
      thisBinCode = thisOpcode << 26
    }
    if (thisOpcode == 0) {
      thisFuncCode = funcCodeList[inst]
      thisBinCode += thisFuncCode
    }
    if (inst == 'syscall') {
      thisBinCode = 0xC
    }
    // thisBinCode = (thisOpcode << 26) + thisFuncCode
    if (r_dst.includes(inst)) {
      thisBinCode += getRd(tokens[1]) // rd
                  +  getRs(tokens[2]) // rs
                  +  getRt(tokens[3]) // rt
      // console.log(inst);
      // console.log(thisOpcode)
      // console.log(thisFuncCode)
      // console.log(regList.indexOf(tokens[1]));
      // console.log(regList.indexOf(tokens[2]));
      // console.log(regList.indexOf(tokens[3]));
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
      thisBinCode += getRt(tokens[0])
                  +  getOffset(tokens[1])
    }
    if (i_sti.includes(inst)) {
      thisBinCode += getRs(tokens[0])
                  +  getRt(tokens[1])
                  +  getImm(tokens[2])
    }
    if (i_si.includes(inst)) {
      thisBinCode += getRs(tokens[0])
                  +  getImm(tokens[1])
    }
    if (j_t.includes(inst)) {
      let temp = getImm
    }
    binCode.push(thisBinCode)
  }
  console.log(binCode);
  // alert(binCode);
}
