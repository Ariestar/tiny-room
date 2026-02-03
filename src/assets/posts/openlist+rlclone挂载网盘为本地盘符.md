---
tags:
  - openlist
  - rclone
  - 网盘
  - Automation
created: 2026-02-03 12:08:52
modified: 2026-02-03 12:32:47
status: publish
---

# 0. 工具简介

- **Rclone**: 存储界的“瑞士军刀”，支持 40+ 种云存储协议，能将远程存储映射为本地文件系统。
- **OpenList**: 聚合网盘索引工具，将阿里云盘、百度网盘、OneDrive 等转化为标准 WebDAV 协议。
- **winfsp**: **本方案的底层基石**。Windows 上的文件系统代理，充当内核与用户空间之间的“翻译官”。没有它，Rclone 无法将抽象的网络请求转化为资源管理器中可见的盘符

---

# 1. 为什么值得玩？（可玩性分析）

- **统一入口**: 告别几十个网盘客户端，一个盘符管理所有资源。
- 本地文件同步至云端，可以实现**多端同步编辑**

---

# 2. Windows 部署方案

## 核心环境

推荐 [[scoop]] 安装
- **驱动**: `scoop install winfsp-np`。
- **核心工具**: `scoop install rclone`。

## 自动化挂载脚本 (`mount_openlist.vbs`)

为了实现开机静默运行、无黑窗口闪烁，采用 VBS 调用方案：

```vbs
Dim shell, rcloneCmd, scoopPath
Set shell = CreateObject("WScript.Shell")

' 延迟 10s 确保网络就绪
WScript.Sleep 10000 

' 清理旧进程防止 I/O 错误
On Error Resume Next
shell.Run "taskkill /F /IM rclone.exe", 0, True
On Error GoTo 0

' 动态获取 Scoop 路径
scoopPath = shell.ExpandEnvironmentStrings("%USERPROFILE%") & "\scoop\shims\rclone.exe"

rcloneCmd = """" & scoopPath & """ mount openlist:/ T: " & _
            "--vfs-cache-mode full " & _
            "--vfs-cache-max-size 20G " & _
            "--vfs-disk-space-total-size 10T " & _
            "--no-modtime " & _
            "--network-mode " & _
            "--header ""User-Agent: Mozilla/5.0"" " & _
            "--vfs-read-chunk-size 64M " & _
            "--buffer-size 32M " & _
            "--dir-cache-time 24h"

shell.Run rcloneCmd, 0, False
```

## 参数说明

- **`mount openlist:/ T:`**：将 Rclone 配置中名为 `openlist` 的远程根目录挂载为本地 **T: 盘**。
- **`--vfs-cache-mode full`**：开启全量缓存模式，使云端存储支持像本地硬盘一样的随机读写和流媒体播放。
- **`--vfs-cache-max-size 20G`**：限制本地最大缓存占用空间为 **20GB**，防止撑爆你的 C 盘。
- **`--vfs-disk-space-total-size 10T`**：虚报磁盘总容量为 **10TB**，解决因服务器无法响应容量查询导致的 405 报错和 I/O 错误。
- **`--no-modtime`**：不读取和写入文件修改时间，显著提升大文件夹的首次加载速度。
- **`--network-mode`**：将盘符挂载为“网络驱动器”，在 Windows 下能提供比“本地磁盘”模式更好的稳定性和加载响应。
- **`--header "User-Agent: Mozilla/5.0"`**：自定义 HTTP 请求头，模拟浏览器访问以绕过部分云盘对 Rclone 默认标识的封禁。
- **`--vfs-read-chunk-size 64M`**：设置按需分块读取的大小，在观看视频或读取大数据集时能有效平衡加载速度和流量消耗。
- **`--buffer-size 32M`**：设置每个读取流的内存缓冲区大小，减少在高并发读取时的网络波动抖动。
- **`--dir-cache-time 24h`**：将目录树结构在本地缓存 **24 小时**，确保秒开文件夹而无需每次都向服务器请求目录列表。

## 自动启动配置

1. **快捷方式**: 为该 `.vbs` 创建快捷方式。
2. **入库**: `Win + R` 输入 `shell:startup`，将快捷方式拖入即可。