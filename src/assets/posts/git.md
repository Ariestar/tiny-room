---
tags:
  - git
  - 版本管理
date created: 2025-08-16 14:37:26
date modified: 2025-08-16 19:33:02
status: publish
---

```shell
git log --all --graph --decorate --oneline # 以单行graph形式完整展示log历史
git status (-s) # 查看git已track的文件状态（unmodified,modified,staged），-s表示short显示
git checkout -
git checkout (-f) <sha-flag|branch>
git diff (sha-flag) <file.txt> # 查看文件相较于暂存区有什么变化
git diff --staged/cached # 查看已暂存文件与最后一次提交的文件差异
git branch # 列出所有branch，参数-vv: 详细列出
git branch -b <branch_name> # 创建并checkout到新分支
git merge
git add (-p) # -p可以交互性添加某些change，这可以实现比如不添加print等测试代码
git blame <filename> # 查看是谁更改的代码
git show <sha-flag> # 在命令行查看某个commit版本
git stash # 将你的本地修改保存起来，并将工作目录还原为与`HEAD`提交相匹配
git rm <filename> # 从暂存区中删除文件
```

# git 基础

## 提交到暂存区

如果想同时将新增，修改，删除的文件添加到暂存区，可以使用 ==`git add -A`==，`git add .` 不包含删除文件  
如果想跳过 add 到暂存区，可以直接使用 `git commit -a`

git 中移动文件使用 `git mv`，它相当于 `mv <file_from> <file_to>` `git rm <file_from>` `git add <file_to>`

## git log

`git log -p|--patch -2` 以补丁形式查看前两次提交的差异

| 选项                | 说明                                                                    |
| ----------------- | --------------------------------------------------------------------- |
| `-p`              | 按补丁格式显示每个提交引入的差异。                                                     |
| `--stat`          | 显示每次提交的文件修改统计信息。                                                      |
| `--shortstat`     | 只显示 --stat 中最后的行数修改添加移除统计。                                            |
| `--name-only`     | 仅在提交信息后显示已修改的文件清单。                                                    |
| `--name-status`   | 显示新增、修改、删除的文件清单。                                                      |
| `--abbrev-commit` | 仅显示 SHA-1 校验和所有 40 个字符中的前几个字符。                                        |
| `--relative-date` | 使用较短的相对时间而不是完整格式显示日期（比如“2 weeks ago”）。                                |
| `--graph`         | 在日志旁以 ASCII 图形显示分支与合并历史。                                              |
| `--pretty`        | 使用其他格式显示历史提交信息。可用的选项包括 oneline、short、full、fuller 和 format（用来定义自己的格式）。 |
| `--oneline`       | `--pretty=oneline --abbrev-commit` 合用的简写。                             |

### 限制输出

| 选项                    | 说明                    |
| --------------------- | --------------------- |
| `-<n>`                | 仅显示最近的 n 条提交。         |
| `--since`, `--after`  | 仅显示指定时间之后的提交。         |
| `--until`, `--before` | 仅显示指定时间之前的提交。         |
| `--author`            | 仅显示作者匹配指定字符串的提交。      |
| `--committer`         | 仅显示提交者匹配指定字符串的提交。     |
| `--grep`              | 仅显示提交说明中包含指定字符串的提交。   |
| `-S`                  | 仅显示添加或删除内容匹配指定字符串的提交。 |

## git 别名

```console
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.ci commit
$ git config --global alias.st status
$ git config --global alias.unstage 'reset HEAD --'
$ git config --global alias.last 'log -1 HEAD'
```

## 撤销更改

`git commit --amend`  
`git checkout -- <file>` 将文件还原为上次提交时状态，注意本地修改会全部消失

## merge

在 git merge 的时候，如果无法 auto-merge，就会出现 conflic，需要手动解决冲突

这时 `HEAD` 指针不变，`MERGE_HEAD` 指向需要 merge 的 branch

冲突部分，使用 `<<<===>>>` 的 3-way 符号包裹，需要手动解决冲突后删除这些符号
```txt
<<<<<<< yours:sample.txt
Conflict resolution is hard;
let's go shopping.
=======
Git makes conflict resolution easy.
>>>>>>> theirs:sample.txt
```
之后，需要重新 `git add` 并 `git merge --continue`

```shell
git merge --abort
git merge --continue
git mergetool
git diff
git show # 查看原始文件
git show :1:filename # 查看共同祖先
git show :2:filename # 查看HEAD版本
git show :3:filename # 查看MERGE_HEAD版本
```

# 分支 branch

fast-forward 指 merge 时，由于 merge 分支是 HEAD ==直接后继==，HEAD 指针可以直接向更新的 commit 移动

merge 操作会自动产生一个新的 merge 快照（commit）

```console
git branch (-b) <branch>
git branch -d <branch>
```

## 分支管理

`git branch --merged/--no-merged` 查看当前分支 merge/未 merge 分支

## branch workflow

可以建立不同的分支完成不同层次的工作。比如，在 master 分支上保留主干稳定版本，develop 分支上进行新功能开发，proposed（建议）分支上实验一些不成熟 feature

同时，使用主题分支来开发不同类型的功能，这样可以无视开发的顺序与进度,更灵活地穿梭于不同功能中，只需要最后 merge 即可

## 远程分支

==远程分支是无法修改的本地引用==，可以当作一个标签指示远程仓库的 branch 位置

`git fetch <remote>` 将远程仓库的 branch 下载到本地，不会合并或修改本地文件，`git pull` 相当于 `git fetch`+`git merge`

```shell
git clone --shallow
git remote add <name> <remote_URL>
git push <name> <local_branch>:<remote_branch>
git remote prune origin # 清理本地不存在的远程分支
git branch --unset-upstream
git branch --set-upstream-to=<name>:<remote_branch> # 设置默认的remote分支
git push origin --delete serverfix # 删除
```

## rebase

rebase 会寻找与目标分支的差别（也就是自两者共同祖先之后的所有变化），应用在目标分支上，然后当前分支会移动到主分支上

应用的对象也可以指定为其他分支
```shell
git rebase --onto master server client # 将 client从 server 分支分歧之后的补丁， 然后把这些补丁在 master 分支上重放一遍，让 client 看起来像直接基于 master 修改一样
```

rebase 能保持提交历史整洁，没有乱七八糟的 merge 分支；同时，项目维护者也能省去 merge 的麻烦，直接 fast-forward 即可

rebase 准则：**如果提交存在于你的仓库之外，而别人可能基于这些提交进行开发，那么不要执行变基。**

# 服务器上的 git

## git 分布式 workflow

### 集中式

git 可以实现传统的集中式工作流，只需要指定一个中心集线器（仓库）即可

### 集成管理者

git 也可以实现集成管理者工作流，因为 git 支持多远程仓库，也就可以从中央仓库 fork 出多个远程仓库，实现某个 feature 之后，请求中央仓库 pull 自己实现的 fork 版本。  
这也是如同 github 这样的 hub-based 工具常用的 pr (pull request) 模式

### 主管副管工作流

[主管副管工作流](https://git-scm.com/book/zh/v2/ch00/wfdiag_c)  
这是多仓库流程的变种，如同 linux 这样的超大型项目，会指定主管（dictator）与副管（lieutenant），这样的分级更易于管理，副管将一些分支合并，主管再合并副管提交的分支


---

[[如何写好 git commit]]