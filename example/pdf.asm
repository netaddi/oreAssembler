#baseAddr 0000
j start; //0
add $zero, $zero, $zero; //4
add $zero, $zero, $zero; //8
add $zero, $zero, $zero; //C
add $zero, $zero, $zero; //10
add $zero, $zero, $zero; //14
add $zero, $zero, $zero; //18
add $zero, $zero, $zero; //1C
start:
lui $v1, f000; //r3=F0000000
lui $a0, e000; //r4=E0000000
lui $t0, 8000; //r8=80000000
addi $s4, $zero, 003f; //r20=0000003F
lui $a2, f800; //r6=F8000000
loop:
nor $at, $zero, $zero; //r1=FFFFFFFF
slt $v0, $zero, $at; //r2=00000001
addi $t2, $at, -1; //r10=FFFFFFFE
loop1:
sw $a2, 4($v1); //计数器端口:F0000004，送计数常数r6=F8000000
lw $a1, 0($v1); //读GPIO端口F0000000状态:{out0，out1，out2，D28-D20，LED7-LE
add $a1, $a1, $a1; //左移
add $a1, $a1, $a1; //左移2位将SW与LED对齐，同时D1D0置00，选择计数器通道0
sw $a1, 0($v1); //r5输出到GPIO端口F0000000，设置计数器通道counter_set=00端口
addi $t1, $t1, 1; //r9=r9+1
sw $t1, 0($a0); //r9送r4=E0000000七段码端口
lw $t5, 14($zero); //取存储器20单元预存数据至r13,程序计数延时常数
loop2:
lw $a1, 0($v1); //读GPIO端口F0000000状态:{out0，out1，out2，D28-D20，LED7-LE
add $a1, $a1, $a1;
add $a1, $a1, $a1; //左移2位将SW与LED对齐，同时D1D0置00，选择计数器通道0
sw $a1, 0($v1); //r5输出到GPIO端口F0000000，计数器通道counter_set=00端口不变
lw $a1, 0($v1); //再读GPIO端口F0000000状态
and $t3, $a1,$t0; //取最高位=out0，屏蔽其余位送r11
// bne $t3,$t0,l_next; //out0计数=0,Counter通道0溢出,转计数器初始化,修改7段码显示
addi $t5, $t5, 1; //程序计数延时
bne $t5, $zero,l_next;
jal C_init; //程序计数r13=0,转计数器初始化,修改7段码显示:C_init
l_next: //判断7段码显示模式：SW[4:3]控制
lw $a1, 0($v1); //再读GPIO端口F0000000开关SW状态
addi $s2, $zero, 0008; //r18=00000008
add $s6, $s2, $s2; //r22=00000010
add $s2, $s2, $s6; //r18=00000018(00011000)
and $t3, $a1, $s2; //取SW[4:3]
beq $t3, $zero, L00; //SW[4:3]=00,7段显示"点"循环移位：L00，SW0=0
beq $t3, $s2, L11; //SW[4:3]=11,7段显示显示七段图形：L11，SW0=0
addi $s2, $zero, 0008; //r18=8
beq $t3, $s2, L01; //SW[4:3]=01,七段显示预置数字，L01，SW0=1
sw $t1, 0($a0); //SW[4:3]=10，显示r9，SW0=1
j loop2;
L00:
bne $t2, $at, L3; //r10=ffffffff,转移L4
L4:
nor $t2, $zero, $zero; //r10=ffffffff
add $t2, $t2, $t2; //r10=fffffffe
L3:
sw $t2, 0($a0); //SW[4:3]=00,7段显示点移位后显示
j loop2;
L11:
lw $t1, 60($s1); //SW[4:3]=11，从内存取预存七段图形
sw $t1, 0($a0); //SW[4:3]=11，显示七段图形
j loop2;
L01:
lw $t1, 20($s1); //SW[4:3]=01，从内存取预存数字
sw $t1, 0($a0); //SW[4:3]=01,七段显示预置数字
j loop2;
C_init:
lw $t5, 14($zero); //取程序计数延时初始化常数
add $t2, $t2, $t2; //r10=fffffffc，7段图形点左移
ori $t2, $t2, 1; //r10末位置1，对应右上角不显示
addi $s1, $s1, 4; //r17=00000004，LED图形访存地址+4
and $s1, $s1, $s4; //r17=000000XX，屏蔽地址高位，只取6位
add $t1, $t1, $v0; //r9+1
bne $t1, $at, L7; //若r9=ffffffff,重置r9=5
addi $t1, $t1, 5; //重置r9=5
L7:
lw $a1, 0($v1); //读GPIO端口F0000000状态
add $t3, $a1, $a1;
add $t3, $t3, $t3; //左移2位将SW与LED对齐，同时D1D0置00，选择计数器通道0
sw $t3, 0($v1); //r5输出到GPIO端口F0000000，计数器通道counter_set=00端口不变
sw $a2,4($v1); //计数器端口:F0000004，送计数常数r6=F8000000
jr $ra; //j l_next;
