let openedInstructionList = []
let deassedInstVector = []
let deassedStr = ''
let deassTags = {}
//fist element is source, second is jump to.
let deassPosition
let tagCount
function parseCoe(coeContent){
  // coeContent = coeContent.replace(/;.*/g, '')
  // //remove comments
  // console.log(coeContent);
  // let coeRadix = Number(coeContent.match(/memory_initialization_radix\s*=\s*\d+/)[0]
  //                          .match(/\d+/)[0])
  // let coeVector = coeContent.match(/memory_initialization_vector\s*=\s*[0-9a-fA-F]*/)
  // let instVector = coeVector.split(',')
  // console.log(coeRadix);
  // console.log(instVector);
  openedInstructionList = []
  let instVector = coeContent.match(/[0-9a-fA-F]{8}/g)
  for (inst of instVector)
  {
    inst = parseInt(inst, 16)
    // console.log(inst);
    openedInstructionList.push(inst)
  }
  // console.log(openedInstructionList);
  printBinCode(openedInstructionList)
}
function parseBin(binBuffer){
  // console.log(binBuffer);
  // console.log(binBuffer.length);
  openedInstructionList = []
  for (var i = 0; i < binBuffer.length / 4; i++) {
    openedInstructionList.push(( (binBuffer[i * 4 + 0] << 24) >>> 0)
                              + (binBuffer[i * 4 + 1] << 16)
                              + (binBuffer[i * 4 + 2] << 8)
                              + (binBuffer[i * 4 + 3]))
  }
  printBinCode(openedInstructionList)
}

function getFuncName(inst){
  let funcCode = inst & 0x3F
  // console.log(funcCode);
  let funcName
  for(funcIterator in funcCodeList){
    if (funcCodeList[funcIterator] == funcCode) {
      funcName = funcIterator
      break
    }
  }
  // console.log('funcName = ' + funcName);
  return funcName
}
function getOpName(inst){
  let binOpcode = inst >>> 26
  // console.log(binOpcode);
  // let funcName = 0
  if (binOpcode == 0) {
    return getFuncName(inst)
  }
  for (opIterator in opcodeList) {
    if (opcodeList[opIterator] == binOpcode) {
      break
    }
  }
  // console.log('opiter = ' + opIterator);
  return opIterator
}

function deget2sComplement(imm, length){
  if (imm >> (length - 1)) //negative
  {
    return -((imm - 1) ^ ((1 << length) - 1))
  }
  return imm
}
function immToString(imm, length){
  return deget2sComplement(imm, length).toString(16)
}
function degetRs(thisInst){
  return regList[(thisInst >> 21) & 0x1F]
}
function degetRt(thisInst){
  return regList[(thisInst >> 16) & 0x1F]
}
function degetRd(thisInst){
  return regList[(thisInst >> 11) & 0x1F]
}
function degetSa(thisInst){
  return (thisInst << 6) & 0x1F
}
function maskImm(inst, length){
  return (inst & ((1 << length) - 1))
}
function degetImm(thisInst, length = 16){
  let imm = maskImm(thisInst, length)
  return immToString(imm, length)
  // return '0x' + imm.toString(16)
  // return (imm >> (length - 1)) ?
}
function degetUnsignedImm(thisInst, length = 16){
  let imm = maskImm(thisInst, length)
  // return immToString(imm, length)
  return '0x' + imm.toString(16)
  // return (imm >> (length - 1)) ?
}
function degetOffset(thisInst){
  let rs = degetRs(thisInst)
  let offset = thisInst & ((1 << 16) - 1)
  let offsetStr = immToString(offset, 16)
  return offset + '(' + rs + ')'
}
function generateTag(inst, length = 16){
  let tagName = 'tag' + tagCount
  tagCount ++
  let tagPosition = deget2sComplement(maskImm(inst, length), length) + deassPosition + 1
  if(deassTags[tagPosition] == undefined){
    deassTags[tagPosition] = tagName
  }else {
    tagName = deassTags[tagPosition]
  }
  console.log(tagName);
  console.log(tagPosition, deassPosition);
  console.log(inst.toString(16));
  console.log(tagCount);
  console.log(deassTags);
  return tagName
}
function degetParameter(inst, opName){
  let returnStr = ''
  if (r_dst.includes(opName)) {
    returnStr += degetRd(inst) + ', '
              +  degetRs(inst) + ', '
              +  degetRt(inst)
  }
  if (r_st.includes(opName)) {
    returnStr += degetRs(inst) + ', '
              +  degetRt(inst)
  }
  if (r_dta.includes(opName)) {
    returnStr += degetRd(inst) + ', '
              +  degetRt(inst) + ', '
              +  degetSa(inst)
  }
  if (r_dts.includes(opName)) {
    returnStr += degetRd(inst) + ', '
              +  degetRt(inst) + ', '
              +  degetRs(inst)
  }
  if (r_s.includes(opName)) {
    returnStr += degetRs(inst)
  }
  if (i_tsi.includes(opName)) {
    returnStr += degetRt(inst) + ', '
              +  degetRs(inst) + ', '
              +  degetImm(inst)
  }
  if (i_ti.includes(opName)) {
    returnStr += degetRt(inst) + ', '
              +  degetUnsignedImm(inst)
  }
  if (i_tis.includes(opName)) {
    returnStr += degetRt(inst) + ', '
              +  degetOffset(inst)
  }
  if (i_sti.includes(opName)) {
    returnStr += degetRs(inst) + ', '
              +  degetRt(inst) + ', '
              +  generateTag(inst, 16)
              // +  degetImm(inst)
  }
  if (i_si.includes(opName)) {
    returnStr += degetRs(inst) + ', '
              +  generateTag(inst, 16)
              // +  degetImm(inst)
  }
  if (j_t.includes(opName)) {
    // returnStr += degetImm(inst, 26)
    returnStr += generateTag(inst, 26)
  }
  return returnStr
}
function isJumpInst(opName){
  if (i_sti.includes(opName)
  ||  i_si.includes(opName)
  ||  j_t.includes(opName)) {
    return true
  }
  return  false
}
function deass(){
  deassedStr = ''
  deassedInstVector = []
  deassTags = {}
  deassPosition = 0
  tagCount = 0
  for (binInst of openedInstructionList) {
    let thisInstName = getOpName(binInst)
    // console.log(thisInstName);
    thisInstName = (thisInstName == 0) ? getFuncName(binInst) : thisInstName
    // console.log(thisInstName);
    let thisInst = thisInstName + ' ' + degetParameter(binInst, thisInstName) + ';\n'
    // deassedStr += thisInst
    deassedInstVector.push(thisInst)
    deassPosition++
  }
  deassPosition = 0
  console.log(deassTags);
  for (instStr of deassedInstVector) {
    if (deassTags[deassPosition]) {
      deassedStr += deassTags[deassPosition] + ':\n'
    }
    deassedStr += instStr
    deassPosition ++
  }
}
