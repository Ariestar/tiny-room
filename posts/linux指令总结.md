---
tags:
  - Linux
  - Unix
  - 指令
  - 总结 
date created: 2025-07-16 00:36:48
date modified: 2025-08-20 10:34:23
status: publish
---

换源
```shell
sed -i 's@^\(deb.*stable main\)$@#\1\ndeb https://mirrors.tuna.tsinghua.edu.cn/termux/termux-packages-24 stable main@' $PREFIX/etc/apt/sources.list
```
---

监听端口
```shell
ss -ntlp | grep 25565
```

---
刷新 dns
```shell
sudo resolvectl flush-caches
```
---

scp
```shell
sudo scp -P port /directory/to/file user@ip/directory/ 
sudo scp -r -P port /directory/ user@ip/directory/ 
```
---

ufw
```shell
ufw allow 25565/tcp # 开启25565端口
ufw enable # 开启防火墙
```

---

tmux
```shell
tmux new-session -s mc
tmux attach-session -t mc
```
前置按键 `Ctrl+b`  
[[tmux操作快捷键]]


---

访问 github 被拒绝  
添加 github.com 和 raw.githubusercontent.com 的 ip 到 `/etc/hosts`

---

安装 java-sdk  
安装默认版本用 `default-jdk`

---

zsh 与 ohmyzsh  
安装 ohmyzsh
```shell
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```
设置 zsh 为默认终端
```shell
chsh -s $(which zsh)
```
查看当前 shell
```shell
echo $SHELL
```

---
nohup 挂起
```shell
nohup command &
```
---
systemctl
```shell
systemctl status xxx.service
systemctl start xxx.service
systemctl enable xxx.service # 开机自启
systemctl daemon-reload # 刷新
```
---

实用命令  
`pwd` 显示当前路径  
`tail` 查看文件最新内容  
`htop` 查看内存占用