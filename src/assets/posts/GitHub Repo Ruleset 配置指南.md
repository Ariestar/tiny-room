---
tags:
  - github
  - devops
  - repo
  - governance
  - ruleset
created: 2026-01-02 02:21:15
modified: 2026-01-02 03:05:27
status: publish
---


# 目标

用 **Ruleset** 统一约束仓库分支/标签的修改方式，降低误操作（强推、直接推 main、绕过 CI 等）风险。

---

# 适用范围与术语

- **Ruleset**：对 *branch* 或 *tag* 生效的一组规则（可以按名称模式匹配）。
- **Target**：`branch` / `tag`
- **Enforcement**
  - `active`：强制执行
  - `disabled`：不启用
  - `evaluate`：评估模式（不拦截，但记录是否会拦截；是否可用取决于你的版本/权限）
- **Bypass**：允许指定角色/团队/App 在特定条件下绕过（建议仍要求走 PR）。

---

# 配置入口（Repo 级）

Repo → **Settings** → **Rules** → **Rulesets** → **New ruleset**
- 选择：**Branch ruleset** 或 **Tag ruleset**
- 命名建议：`protect-main`、`protect-releases`、`protect-tags`（一眼可读）

---

# 配置步骤（推荐流程）

## 1) 先写策略，再点 UI

在动手前先明确：
- 要保护哪些引用（main、release 分支、tags）
- 谁可以绕过（是否允许机器人/管理员绕过）
- 合并门槛（审批数、CODEOWNERS、CI checks、线性历史、签名提交等）

## 2) 新建 Ruleset 并设置范围（Conditions / Target）

### 分支匹配（Include / Exclude）

常用 include：
- `refs/heads/main`
- `refs/heads/master`
- `refs/heads/release/**` 或 `refs/heads/releases/**`

> 注意：模式匹配通常是 fnmatch 语义：`*` 不跨 `/`；跨层一般用 `**/*` 这类写法（不同版本 UI 表达可能不同）。

### 标签匹配（Tag ruleset）

- 例如只保护版本号标签：`refs/tags/v*`
- 或只允许发布系统创建：限制 create/update/delete

## 3) 设置 Bypass（绕过者）

**建议默认：**
- 仅允许极少数团队/角色绕过（例如 Release Managers）
- 能设置的话优先选 **“仅通过 PR 才能绕过（for pull requests only）”**
- 明确哪些 GitHub App（如 release bot）需要写入 bypass

## 4) 选择规则（Rules）

下面按“最常用、风险最高”优先级排列。

---

# 推荐规则模板

## 模板 A：保护默认分支（main/master）

**目标：** 禁止直接推主分支，必须走 PR；PR 必须过 CI 与审批；禁止强推。

**建议勾选：**
1. **Require a pull request before merging**
   - 最少审批数：`1~2`（按团队规模）
   - 建议开启：Require review from CODEOWNERS（若你使用 CODEOWNERS）
   - 建议开启：Dismiss stale approvals（代码变更后审批失效）
2. **Require status checks to pass**
   - 勾选必须通过的 checks（例如：`ci/test`, `ci/lint`, `build`）
   - 如有 strict/loose 选项：主分支建议倾向 strict（更严）
3. **Block force pushes**（强烈建议）
4. **Require linear history**（可选：避免 merge commit，强制 rebase/squash）
5. **Require signed commits**（可选：需要组织层面准备好签名流程）
6. **Restrict deletions / Restrict updates**（视组织治理强度决定）
   - 如果你希望“只有 PR 合并能更新 main”，通常不需要额外 restrict updates；但如果你要彻底禁 push，可配合 restrict。

---

## 模板 B：保护发布分支（releases/**）

**目标：** 发布分支只允许少数人/机器人维护，禁止随意改动与删除。

**范围：** `refs/heads/releases/**`（或你实际命名）

**建议勾选：**
- **Restrict updates**：仅允许 Release 团队 / 发布机器人
- **Restrict deletions**：禁止删除
- **Require status checks**：发布前构建与回归必须通过
- （可选）**Require deployments to succeed**：若你用 GitHub Environments 部署门禁

---

## 模板 C：保护标签（tags）

**目标：** 防止篡改已发布版本标签（重打 tag 会造成供应链与追溯问题）。

**范围：** `refs/tags/v*`

**建议勾选：**
- **Restrict creations**：只允许 release bot / release 团队创建
- **Restrict updates**：禁止移动已存在 tag（非常关键）
- **Restrict deletions**：禁止删除（或仅允许极少数人）

---

# 与 Branch Protection 的关系

- Ruleset 可能与传统 **Branch protection rules** 同时存在。
- 生效结果通常是 **叠加/取更严格**：命中多个规则时，以更严格约束为准。
- 迁移建议：逐步把旧 branch protection 收敛到 ruleset，避免双重配置造成困惑。

---

# 变更上线建议（降低翻车）

1. 先在 `evaluate`（若可用）观察一段时间：看看会拦截哪些流程
2. 补齐 CI：确保必须 checks 在 PR 上稳定产出
3. 再切到 `active`
4. 对关键仓库：发布一次内部公告（“从今天起 main 禁止直推”）

---

# API / 自动化（进阶）

如果你要用脚本批量配置（多仓库一致性），一般用 REST API 创建/更新 ruleset。

## 示例：创建 ruleset（示意结构）

> 字段名会因版本迭代有差异；实际以 GitHub API 文档为准。

```bash
curl -L -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/rulesets \
  -d '{
    "name": "protect-main",
    "target": "branch",
    "enforcement": "active",
    "conditions": {
      "ref_name": {
        "include": ["refs/heads/main"],
        "exclude": []
      }
    },
    "rules": [
      { "type": "pull_request" , "parameters": { "required_approving_review_count": 1 } },
      { "type": "required_status_checks", "parameters": { "required_checks": ["ci/test","ci/lint"] } },
      { "type": "non_fast_forward" }
    ]
  }'
```

**实践建议：**

- 先用 `GET /repos/{owner}/{repo}/rulesets` 拉取现有配置当“导出模板”
- 再做小范围修改与复用（最少踩坑）

---

# 常见问题排查

## 1) PR 明明过了 CI 还是不让 merge

- required checks 名称是否匹配（大小写/前缀）
- checks 是否跑在“合并前最终提交”（merge commit / rebase 后 commit）
- strict 模式下，分支是否落后于 base（需要先更新分支）

## 2) 管理员/机器人被拦截

- 是否加入 bypass actors
- bypass 是否被设置为“仅 PR 可绕过”，但你在直接 push

## 3) 分支匹配不生效

- include/exclude 的 ref 写法是否正确：`refs/heads/…`
- 模式是否能匹配多级路径（`*` vs `**` 语义）

---

# 快速检查清单（上线前）

-  main/master 只能通过 PR 更新
-  PR 需要至少 N 个审批
-  PR 必须通过关键 CI checks（名称已核对）
- 禁止 force push（至少对 main）
-  release 分支/标签只有少数主体可写
-  bypass 名单最小化，且尽量要求走 PR
- 规则命中范围（include/exclude）已验证
