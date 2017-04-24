计算机组成这门课要求实现一个MIPS汇编器，带GUI。对于这个作业，我使用了electron进行开发。
electron说白了就是把一个html网页包在本地程序里，但不同的是可以使用node.js API进行本地操作，electron本身也提供了大量API。
使用这个框架另一个目的是复习JS，这篇文章用于记录遇到的坑。

## JS的变量作用域问题（未解决）

electron使用renderer.js来操作页面渲染。
我使用了这样一段代码：
```JavaScript
function writeId(id, content) {
  document.getElementById(id).innerHTML = content;
}

ipc.on('open-filename', function (event, filename) {
    //接收open-filename 信号。在mian.js中当尝试打开文件会发送该信号。
    fs.readFile(filename, 'utf8', function fileOpened(err, fileData) {
    //调用node API打开文件内容
      writeId('oreAss', fileData);
      //调用之前定义的writeId函数操作DOM
    })
})
```
然而这段代码却执行失败了。在console中进行调试，发现同样找不到writeId这个函数。
因此，我猜测renderer.js并非在页面中顺序执行，这个writeId函数没有被正确定义。

## js操作textarea

在尝试读取textarea中的文件时，起初使用的是
```JavaScript
let fileContent = document.getElementById('assText').innerHTML
```
并不能正确读取。
改为
```JavaScript
let fileContent = document.getElementById('assText').value
```
后一切正常。

## javascript弱类型：int和unsigned int

如果在js中计算```39 << 26```，得到的是一个负数。因为js会默认使用32位有符号整数来标识，而上面的计算结果溢出了。

js中唯一操作32位无符号整数的运算符是```>>>```

使用```>>> 0```可以把别的数据转换成32位无符号整数。
