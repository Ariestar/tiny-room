---
created: 2024-07-18 09:52:49
modified: 2025-06-10 02:51:03
tags:
  - Coding/npm
---
1. **npm init**: 初始化一个新的 Node.js 项目。这个命令会创建一个 `package.json` 文件，用于管理项目的依赖和配置。
2. **npm install [package]**: 安装一个 Node.js 包（依赖）。你可以指定要安装的包的名称，例如 `npm install react`。
3. `npm install <pn> --force`: 强制重新安装
4. `@<版本号>`: 安装特定版本
5. **npm install [package] --save**: 安装一个包并将其保存到 `dependencies` 中，这意味着它是生产环境的依赖。
6. **npm install [package] --save-dev**: 安装一个包并将其保存到 `devDependencies` 中，这意味着它是开发环境的依赖，通常用于构建、测试等任务。
7. **npm uninstall [package]**: 卸载一个包。
8. **npm update [package]**: 更新一个包到它的最新版本。 
9. **npm list**: 列出当前项目中安装的所有包及其版本。
10. **npm start**: 启动项目，通常用于开发服务器的启动。
11. **npm test**: 运行项目的测试套件。通常需要在 `package.json` 中配置测试脚本。
12. **npm run [script]**: 运行在 `package.json` 中定义的自定义脚本。例如，如果在 `package.json` 中定义了一个名为 "build" 的脚本，你可以运行 `npm run build` 来执行它。
13. **npm run-script [script]**: 这是 `npm run` 的别名，用于运行自定义脚本。
14. **npm outdated**: 检查项目中的依赖是否有过时的版本。
15. **npm prune**: 移除项目中未列在 `dependencies` 或 `devDependencies` 中的无用依赖。
16. **npm info [package]**: 查看有关特定包的信息，包括可用的版本、依赖等。
17. npm config list -l: 查看 npm 配置
18. npm search: 搜索包，字符串或正则表达式

# 安装指南

==工具模块可以全局安装==  
`npm install -g <pn>`

`--save` 或者 `-S`，可以在安装的时候更新 `package.json` 里面模块的版本号

`--production`  
npm install 默认会安装 dependencies 字段和 devDependencies 字段中的所有模块，如果使用 `--production` 参数，可以只安装 dependencies 字段的模块


> [!Warning]  
> 从 `npm v2.6.1` 开始，npm update 只更新顶层模块，而不更新依赖的依赖，以前版本是递归更新的。如果想取到老版本的效果，要使用下面的命令。  
> 如果想要递归更新，可以用 `npm --depth 9999 update`

## 包的发布

- 如何发布一个包 先注册 npm 账号
- 一定要在官方源上发
- npm addUser 添加用户
- npm status: publish 发布包