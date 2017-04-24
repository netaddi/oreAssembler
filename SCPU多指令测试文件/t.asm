j tag0;
add $zero, $zero, $zero;
add $zero, $zero, $zero;
add $zero, $zero, $zero;
add $zero, $zero, $zero;
add $zero, $zero, $zero;
add $zero, $zero, $zero;
add $zero, $zero, $zero;
tag0:
lui $v1, 0x-1000;
lui $a0, 0x-2000;
lui $t0, 0x-8000;
addi $s4, $zero, 0x3f;
lui $a2, 0x-800;
nor $at, $zero, $zero;
slt $v0, $at, $zero;
addi $t2, $at, 0x-1;
sw $a2, 4($v1);
lw $a1, 0($v1);
add $a1, $a1, $a1;
add $a1, $a1, $a1;
sw $a1, 0($v1);
addi $t1, $t1, 0x1;
sw $t1, 0($a0);
lw $t5, 20($zero);
lw $a1, 0($v1);
add $a1, $a1, $a1;
add $a1, $a1, $a1;
sw $a1, 0($v1);
lw $a1, 0($v1);
and $t3, $a1, $t0;
addi $t5, $t5, 0x1;
bne $t5, $zero, tag1;
jal tag2;
tag1:
lw $a1, 0($v1);
addi $s2, $zero, 0x8;
add $s6, $s2, $s2;
add $s2, $s2, $s6;
and $t3, $a1, $s2;
beq $t3, $zero, tag3;
beq $t3, $s2, tag4;
addi $s2, $zero, 0x8;
beq $t3, $s2, tag5;
sw $t1, 0($a0);
j tag6;
tag3:
bne $t2, $at, tag7;
nor $t2, $zero, $zero;
add $t2, $t2, $t2;
tag7:
sw $t2, 0($a0);
j tag8;
tag4:
lw $t1, 96($s1);
sw $t1, 0($a0);
j tag9;
tag5:
lw $t1, 32($s1);
sw $t1, 0($a0);
j tag10;
tag2:
lw $t5, 20($zero);
add $t2, $t2, $t2;
ori $t2, $t2, 0x1;
addi $s1, $s1, 0x4;
and $s1, $s1, $s4;
add $t1, $t1, $v0;
bne $t1, $at, tag11;
addi $t1, $t1, 0x5;
tag11:
lw $a1, 0($v1);
add $t3, $a1, $a1;
tag6:
add $t3, $t3, $t3;
sw $t3, 0($v1);
sw $a2, 4($v1);
jr $ra;
