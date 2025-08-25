---
tags: vim 操作 键盘
status: publish
date created: 2025-08-07 18:37:04
date modified: 2025-08-25 10:16:08
---

# 插入模式操作

1. 移动
	- h j k l：左、下、上、右移动。
	- w b：向前、向后移动一个单词。
	- 0 $：移动到行首、行尾。
	- gg G：移动到文件开头、文件结尾。
	- Ctrl-f Ctrl-b：向下翻页、向上翻页。
	- %：在配对的括号 (), [], {} 之间跳转。
2. 编辑与删除
	- x：删除光标下的字符。
	- dd：删除光标所在的整行。
	- dw：删除光标到单词结尾。
	- diw：删除光标下的整个单词。
	- yy：复制（yank）光标所在的整行。
	- p：粘贴。
	- u：撤销（undo）。
	- Ctrl-r：取消撤销（redo）。
3. 快速修改
	- r：替换光标下的单个字符。
	- ci: 在内部修改
		- ciw: 在单词内部修改，进入插入模式
		- ci": 在两个 `"` 内部修改，`"` 也可以是 `()``[]``{}` 等
	- ca: 在外部修改，包括识别的字符
		- ci": 包括 "" 及内部内容一起修改，进入插入模式
	- cc：修改光标所在的整行。
	- 4. 搜索与替换
	- /：向后搜索。
	- ?：向前搜索。
	- n N：下一个、上一个匹配项。
	- : 后跟 s/old/new/g：在当前行全局替换 old 为 new。
	- :%s/old/new/g：在整个文件全局替换 old 为 new。
4. 重复操作
	- .：重复上一个命令。这是一个非常强大的功能。
	- 数字 + 命令：重复执行某个命令。比如 5dd 删除 5 行，3w 向前移动 3 个单词。

# 自动切换输入法

由于在中文输入模式无法使用 vim normal 模式指令，所以需要切换成英文输入法，在 input 模式又要切换为中文输入，非常影响 vim 操作体验，需要一个工具**自动切换输入法**，[im-select-mspy](https://github.com/daipeihust/im-select/tree/master/win-mspy)

指令
```shell
path\to\im-select.exe # 获取当前输入法句柄
path\to\im-select.exe locale # 切换下一个输入法 
path\to\im-select.exe 1031 # 根据句柄切换为某个输入法
```

参考配置
```cpp
{
    "vim.autoSwitchInputMethod.enable": true,
    "vim.autoSwitchInputMethod.defaultIM": "英语模式",
    "vim.autoSwitchInputMethod.obtainIMCmd": "D:\\workspace\\im-select-mspy\\build\\Release\\im-select-mspy.exe",
    "vim.autoSwitchInputMethod.switchIMCmd": "D:\\workspace\\im-select-mspy\\build\\Release\\im-select-mspy.exe {im}",
}
```