---
tags:
  - minecraft
  - mc
  - 服务器
  - Linux
  - ubuntu
date created: 2025-07-16 00:32:39
date modified: 2025-07-16 03:02:10
status: publish
---
设备：ubuntu24

通过 scp 将 paper.jar 上传到服务器

同意 elua 协议，将 `elua.txt` 中 `elua=false` 改为 `true`

启动！
```shell
java -server -XX:+UseG1GC  -Xms1024M -Xmx4096M -jar paper.jar nogui -noverify -XX:+AggressiveOpts -XX:+UseCompressedOops
```