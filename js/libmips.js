const regList = ['$zero', '$at',
'$v0', '$v1',
'$a0', '$a1', '$a2', '$a3',
'$t0', '$t1', '$t2', '$t3', '$t4', '$t5', '$t6', '$t7',
'$s0', '$s1', '$s2', '$s3', '$s4', '$s5', '$s6', '$s7',
'$t8', '$t9',
'$k0', '$k1',
'$gp', '$sp', '$fp', '$ra']
//use indexOf() to find the code of a reg

const opcodeList = {
  lw: 0x23,
  lb: 0x20,
  lbu: 0x24,
  lh: 0x21,
  lhu: 0x25,
  sw: 0x2b,
  sb: 0x28,
  sh: 0x29,
  add: 0x0,
  addu: 0x0,
  sub: 0x0,
  subu: 0x0,
  slt: 0x0,
  sltu: 0x0,
  and: 0x0,
  or: 0x0,
  xor : 0x0,
  nor : 0x0,
  sll: 0x0,
  srl: 0x0,
  sra: 0x0,
  mult: 0x0,
  multu: 0x0,
  div: 0x0,
  divu: 0x0,
  addi: 0x8,
  addiu: 0x9,
  andi: 0xc,
  ori: 0xd,
  xori: 0xe,
  lui: 0xf,
  slti: 0xa,
  sltiu: 0xb,
  beq: 0x4,
  bne: 0x5,
  blez: 0x6,
  bgtz: 0x7,
  bltz: 0x1,
  bgez: 0x1,
  j: 0x2,
  jal: 0x3,
  jalr: 0x0,
  jr: 0x0,
  mfhi: 0x0,
  mflo: 0x0,
  mthi: 0x0,
  mtlo: 0x0,
  eret: 0x10,
  mfco: 0x10,
  mtco: 0x10,
  break: 0x0,
  syscall: 0x0,
}


const funcCodeList = {
  add: 0x20,
  addu: 0x21,
  and: 0x24,
  div: 0x1a,
  divu: 0x1b,
  jr: 0x08,
  jalr: 0x09,
  mfhi: 0x10,
  mflo: 0x12,
  mtlo: 0x13,
  mthi: 0x11,
  mult: 0x18,
  multu: 0x19,
  nor: 0x27,
  xor: 0x26,
  or: 0x25,
  slt: 0x2a,
  sltu: 0x2b,
  sll: 0x00,
  srl: 0x02,
  sra: 0x03,
  sub: 0x22,
  subu: 0x23,
  syscal: 0x0c,
  breal: 0x0d
}
//jump instructions : r_s, i_sti, i_si, j_t
const r_dst = ['add', 'addu', 'and', 'nor', 'or', 'slt', 'sltu', 'sub', 'subu', 'xor']
const r_st = ['div', 'divu', 'mult', 'multu']
const r_dta = ['sll', 'srl', 'sra']
const r_dts = ['sllv', 'srlv', 'srav']
const r_s = ['jr', 'jalr']
const i_tsi = ['addi', 'addiu', 'ori', 'andi', 'xori', 'slti', 'sltiu']
const i_ti = ['lui']
const i_tis = ['lb', 'lbu', 'lh', 'lhu', 'sw', 'sh', 'sb', 'lw']
const i_sti = ['beq', 'bne']
const i_si = ['bgez', 'bgezal', 'bgtz', 'blez', 'bltz', 'bltzal']
const j_t = ['j', 'jal']
