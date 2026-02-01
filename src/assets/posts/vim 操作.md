---
tags: [vim, 操作, 键盘]
status: publish
created: 2025-08-07 18:37:04
modified: 2026-01-22 22:26:10
---

# Nomal 模式操作

## 移动

- h j k l：左、下、上、右移动。- { }: 整段移动
- 单词
	- w **e**：下一个 word（单词） 开头/结尾
	- **b** ge: 上一个字符开头/结尾
	- W E B gE：将所有非空白字符中间的部分看作一个单词，比如 `This*is_a,word` 是一个单词
- 0 $：移动到行首、行尾。
- ^ g_: 移动到非空白字符的行首行尾
- g
	- gg G：移动到文件开头、文件结尾。
	- {line number}gg: 移动到某一行
- Ctrl-f Ctrl-b：向下翻页、向上翻页。
- c-d c-u: 向下/上翻半页，
- %：在配对的括号 (), [], {} 之间跳转。
- f t
	- f{character}，搜索整行中下一次出现这个字符
	- t{character}，搜索整行直到 (until) 下一次出现这个字符前（这在修改时候很有用，比如替换 `(` 前的所有内容为…）
	- F T，反向搜索
	- 配合 `;`，重复搜索操作
- : 后跟 s/old/new/g：在当前行全局替换 old 为 new。  
- :%s/old/new/g：在整个文件全局替换 old 为 new。  
- 语义移动
	- gd: 跳转到定义
	- gf: 跳转到导入的文件

## 操作符  

- c(change), d(delete), y(yanking 复制), p(put 粘贴), =(format **格式化**), g~(切换大小写), u(undo), c-r(redo)
- x X 删除光标下/前字符（等于 dl 和 dh），s
- s 删除光标下字符并进入插入模式，S 删除整行并进入插入模式（等于 ddi）
- r(replace)，替换光标下的字符为…
- 大写为升级版  
	- C D: 从光标修改/删除到行末  
	- P: 粘贴到光标前  
- 常见操作  
	- c/hello: change 所有 hello 为…  
	- ggyG: 复制全文  
	- gUw: 把 word 切换为大写  
- 重复操作符视作对整行操作  
- 操作符通常配合 text-object
	- `{i|a}{text-object-id}`
	- 内置 text-object
	- `w`word, `s`sentence, `p`paragraph
	- `b(`, `B{` 等括号体系
	- `"`, `'`
- i a: 包含/不包含左右空白

### 复制粘贴

- yyp yyP: duplicate 整行到后/前面，yy{count}p，duplicatee 多次
- ddp ddP: swap 两行
- xp: swap 两个字符

### 快速修改  

- : 后跟 s/old/new/g：在当前行全局替换 old 为 new。  
- :%s/old/new/g：在整个文件全局替换 old 为 new。  

## 重复操作  

- .：重复上一个命令。这是一个非常强大的功能。  
- 数字 + 命令：重复执行某个命令。比如 5dd 删除 5 行，3w 向前移动 3 个单词。  
	- {number}/{word}: 搜索到整个文件中第 n 次出现某 word

# 自动切换输入法

由于在中文输入模式无法使用 vim normal 模式指令，所以需要切换成英文输入法，在 input 模式又要切换为中文输入，非常影响 vim 操作体验，需要一个工具**自动切换输入法**，[im-select-mspy](https://github.com/daipeihust/im-select/tree/master/win-mspy)

指令
```shell
path\to\im-select.exe # 获取当前输入法句柄
path\to\im-select.exe locale # 切换下一个输入法 
path\to\im-select.exe 1031 # 根据句柄切换为某个输入法
```

参考配置
```json
{
    "vim.autoSwitchInputMethod.enable": true,
    "vim.autoSwitchInputMethod.defaultIM": "英语模式",
    "vim.autoSwitchInputMethod.obtainIMCmd": "D:\\workspace\\im-select-mspy\\build\\Release\\im-select-mspy.exe",
    "vim.autoSwitchInputMethod.switchIMCmd": "D:\\workspace\\im-select-mspy\\build\\Release\\im-select-mspy.exe {im}",
}
```