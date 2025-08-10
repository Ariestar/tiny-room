---
status: publish
tags: vim obsidian 快捷键
date created: 2025-08-07 18:36:43
date modified: 2025-08-10 02:19:24
---

[[vim 操作]]

# obsidian 快捷键绑定

`<alt+enter>` 跳转链接  
`<ctrl+alt+enter>` 在新 tab 打开链接  
`<ctrl+P>` 打开 quick switcher，输入 `>` 键入指令  
`<ctrl+H>` focus on tab on the left  
`<ctrl+L>` focus on tab on the right

# 相对行号显示

vim 中通过相对行号，可以更准确地用 jk 行定位

下载 relative line numbers 插件  
由于插件 bug，行号的字体没有适配 obsidian，需要修改一下样式文件
```css
.markdown-source-view .cm-lineNumbers {
	font-family: var(--font-monospace);
	font-size: medium;
	max-width: 1em;
}
.relative-line-numbers-mono {
	font-family: var(--font-monospace);
	font-weight: bold;
	position: relative;
	font-size:large;
}
```