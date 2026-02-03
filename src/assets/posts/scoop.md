---
tags:
  - scoop
  - 包管理器
  - windows
created: 2026-02-03 12:20:17
modified: 2026-02-03 12:30:40
status: publish
---

在 Windows 开发环境中，安装软件通常意味着“下载 .exe、点击下一步、配置环境变量”。Scoop 的出现打破了这种低效模式，它通过命令行提供了类 Unix 系统的包管理体验。

---

# 1. 为什么选择 Scoop？

相比于传统的安装方式或其他包管理器（如 Winget 或 Chocolatey），Scoop 具有以下核心优势：

* **隔离性与便携性**：Scoop 默认将所有软件安装在自己的目录下（通常是 `~/scoop`），不会散落在 `C:\Program Files` 各处。
* **权限友好**：大多数软件不需要管理员权限即可安装，避免了系统环境被随意污染。
* **环境变量自动配置**：安装完成后，Scoop 会自动处理 `PATH` 变量和相关的别名（Shim），即装即用。
* **干净的卸载**：由于采用目录隔离，卸载软件只需删除对应文件夹，不会在注册表中留下冗余垃圾。
* **易于备份**：只需备份 `~/scoop` 目录和配置文件，即可在另一台设备上快速还原开发环境。

---

# 2. 工作原理

Scoop 的核心逻辑建立在 **Manifest（清单）** 和 **Buckets（软件源）** 之上：

## Manifest (JSON)

每个软件对应一个 JSON 清单文件，其中定义了：
* 下载地址（通常是 GitHub Release 或官网静态链接）。
* 哈希值校验（确保文件安全性）。
* 需要添加至环境变量的可执行文件。
* 依赖关系。

## Shims（垫片）

Scoop 不会修改全局注册表，而是通过在 `~/scoop/shims` 目录下创建“垫片”程序。当你运行一个命令时，实际上是运行了对应的垫片，由它引导至真正的程序路径。

---

# 3. 快速上手

## 安装 Scoop

在 PowerShell 中运行以下命令（确保已开启脚本执行权限）：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
iwr -useb get.scoop.sh | iex
```

### 常见指令指南

| **操作**   | **命令**                   | **说明**           |
| -------- | ------------------------ | ---------------- |
| **搜索**   | `scoop search <name>`    | 在已添加的软件库中搜索      |
| **安装**   | `scoop install <name>`   | 安装指定软件           |
| **更新**   | `scoop update <name>`    | 更新特定软件（`*` 代表全部） |
| **卸载**   | `scoop uninstall <name>` | 彻底移除软件           |
| **查看**   | `scoop list`             | 查看已安装软件列表        |
| **状态检查** | `scoop status`           | 检查哪些软件有更新        |
| **清理**   | `scoop cleanup`          | 删除旧版本的安装包以释放空间   |
| 缓存       | `scoop cache (show/rm)`  | 管理缓存             |

> 你也可以在<https://scoop.sh/>搜索软件

## 扩展 Bucket

Scoop 官方维护的库（Main）较为保守。为了安装更多常用工具（如 Chrome、VsCode、各种字体），建议添加扩展库：

PowerShell

```cpp
# 添加官方推荐的 extras 库（通常带ui界面）
scoop bucket add extras

# 添加包含开发工具的库
scoop bucket add versions
```