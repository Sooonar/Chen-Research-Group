# 陈老师课题组网站

课题组官方介绍网站，展示团队研究成果、成员信息、科研项目、竞赛获奖和算法资源。

## 技术栈

| 类别   | 技术                             | 版本 |
| ------ | -------------------------------- | ---- |
| 框架   | Next.js (App Router)             | 16.x |
| 前端   | React + Tailwind CSS + shadcn/ui | 19 / 4 |
| 动效   | Framer Motion                    | -    |
| 图标   | Lucide React                     | -    |
| 数据库 | MySQL                            | 8.x  |
| ORM    | Prisma（mariadb driver adapter） | 7.x  |
| 认证   | NextAuth.js                      | 4.x  |
| 语言   | TypeScript                       | 5.x  |
| 运行时 | Node.js                          | 22（Docker 镜像 node:22-bookworm-slim） |
| 部署   | Docker Compose                   | -    |

## 项目结构

```
Chen-Research-Group/
├── prisma/
│   └── schema.prisma          # 数据库模型定义
├── scripts/
│   └── import-existing-data.cjs  # 存量数据导入脚本（成员/项目/成果）
├── src/
│   ├── app/
│   │   ├── page.tsx           # 首页
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式
│   │   ├── members/           # 成员页面
│   │   │   ├── page.tsx       # 成员列表
│   │   │   └── [id]/page.tsx  # 成员详情
│   │   ├── publications/      # 科研成果页面（论文/专利/软著）
│   │   ├── awards/            # 获奖页面（科研/教学/竞赛/学业四分类）
│   │   ├── projects/          # 科研项目页面
│   │   │   ├── page.tsx       # 项目列表
│   │   │   └── [id]/page.tsx  # 项目详情
│   │   ├── news/              # 新闻动态页面
│   │   ├── algorithms/        # 算法资源页面
│   │   ├── profile/           # 个人中心
│   │   │   ├── page.tsx       # 个人资料
│   │   │   └── submissions/   # 我的成果
│   │   ├── admin/             # 管理后台
│   │   │   ├── page.tsx       # 后台首页
│   │   │   ├── login/         # 登录
│   │   │   ├── register/      # 注册
│   │   │   ├── users/         # 用户审核
│   │   │   ├── submissions/   # 成果审核
│   │   │   ├── members/       # 成员管理
│   │   │   ├── papers/        # 论文管理
│   │   │   ├── patents/       # 专利管理
│   │   │   ├── copyrights/    # 软著管理
│   │   │   ├── awards/        # 获奖管理
│   │   │   ├── projects/      # 项目管理
│   │   │   ├── news/          # 新闻管理
│   │   │   ├── algorithms/    # 算法管理
│   │   │   └── settings/      # 网站设置
│   │   └── api/               # API 路由
│   │       ├── auth/          # 认证 API
│   │       ├── user/          # 用户 API
│   │       ├── users/         # 用户管理 API（含 sync 同步）
│   │       ├── submissions/   # 成果提交 API
│   │       ├── members/       # 成员 API
│   │       ├── papers/        # 论文 API
│   │       ├── patents/       # 专利 API
│   │       ├── copyrights/    # 软著 API
│   │       ├── awards/        # 获奖 API
│   │       ├── projects/      # 项目 API
│   │       ├── news/          # 新闻 API
│   │       ├── algorithms/    # 算法 API
│   │       ├── upload/        # 头像上传 API
│   │       └── settings/      # 设置 API
│   ├── components/
│   │   ├── layout/            # 布局组件（navbar / footer）
│   │   ├── sections/          # 首页模块（hero / team / stats / admission）
│   │   ├── ui/                # 通用 UI 组件（含分页）
│   │   ├── upload/            # 上传组件（头像裁剪）
│   │   └── providers.tsx      # SessionProvider
│   ├── lib/
│   │   ├── prisma.ts          # Prisma 客户端
│   │   ├── auth.ts            # 认证工具
│   │   ├── auth-options.ts    # NextAuth 配置
│   │   ├── pagination.ts      # 分页公共约定（前后端共用）
│   │   └── use-paginated-list.ts  # 列表分页 Hook
│   ├── types/
│   │   └── next-auth.d.ts     # NextAuth 类型扩展
│   └── middleware.ts          # 认证中间件
├── public/                    # 静态资源
├── Dockerfile                 # 三阶段构建（deps → builder → runner）
├── docker-compose.yml         # 部署编排（阶段二）
├── prisma.config.ts           # Prisma 7 配置（加载 .env.local）
├── .env.local                 # 开发环境变量（不提交）
├── .env.production            # 生产环境变量（仅服务器，不提交）
├── package.json
└── next.config.ts
```

## 开发环境搭建

### 1. 安装依赖

```bash
npm install
```

### 2. 安装 MySQL

Windows 推荐使用 winget 安装：

```bash
winget install Oracle.MySQL
```

安装后需要：

1. 将 MySQL 添加到 PATH：`C:\Program Files\MySQL\MySQL Server 8.4\bin`
2. 初始化数据库：`mysqld --initialize-insecure`
3. 注册为 Windows 服务：`mysqld --install MySQL84`
4. 启动服务：`net start MySQL84`

### 3. 创建数据库

```bash
mysql -u root -e "CREATE DATABASE group_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### 4. 配置环境变量

在项目根目录直接创建 `.env.local`：

```env
# 数据库连接
DATABASE_URL="mysql://root:@localhost:3306/group_website"

# NextAuth
NEXTAUTH_SECRET="随机生成的密钥"
NEXTAUTH_URL="http://localhost:3000"
```

> Prisma 7 的 CLI 不会自动加载 `.env` 文件，项目根目录的 `prisma.config.ts` 通过 `@next/env` 加载 `.env.local`，与 Next.js 应用行为保持一致。

### 5. 初始化数据库表

```bash
npx prisma db push
npx prisma generate
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 7. 导入存量数据（可选）

从 JSON 文件导入成员、项目、成果等存量数据：

```bash
node scripts/import-existing-data.cjs <json-path> [--dry-run]
```

## 数据库模型

### 核心表

| 表名                    | 说明                             |
| ----------------------- | -------------------------------- |
| `users`               | 用户账号（登录、注册审核、角色） |
| `members`             | 成员展示信息                     |
| `publications`        | 论文                             |
| `patents`             | 专利                             |
| `software_copyrights` | 软件著作权                       |
| `awards`              | 获奖记录（含 category 四分类）   |
| `competitions`        | 竞赛记录（模块已下线，表保留存档） |
| `algorithms`          | 算法资源                         |
| `projects`            | 科研项目                         |
| `project_progress`    | 项目进展                         |
| `news`                | 新闻动态                         |
| `site_settings`       | 网站配置                         |
| `operation_logs`      | 操作日志                         |

### 关联表

| 表名                     | 说明          |
| ------------------------ | ------------- |
| `project_members`      | 项目-成员关联 |
| `project_publications` | 项目-论文关联 |
| `project_patents`      | 项目-专利关联 |
| `project_copyrights`   | 项目-软著关联 |
| `project_awards`       | 项目-获奖关联 |
| `achievements`         | 成果提交审核  |

### 枚举类型

```prisma
enum Role {
  SUPER_ADMIN  // 超级管理员
  ADMIN        // 管理员
  MEMBER       // 普通成员
}

enum UserStatus {
  PENDING      // 待审核
  APPROVED     // 已通过
  REJECTED     // 已拒绝
}

enum MemberTitle {
  TEACHER      // 老师
  MASTER       // 硕士生
  ALUMNI       // 已毕业
}

enum ProjectStatus {
  COMPLETED    // 结题
  APPROVED     // 获准
  APPLIED      // 申请
}

enum CompetitionResult {
  WON          // 获奖胜出
  NOT_WON      // 未胜出
}

enum AwardCategory {
  RESEARCH     // 科研获奖
  TEACHING     // 教学获奖
  COMPETITION  // 竞赛获奖
  ACADEMIC     // 学业获奖
}

enum NewsCategory {
  GROUP        // 组内新闻
  ACADEMIC     // 学术动态
  AWARD        // 获奖通知
}
```

### Member 模型字段

| 字段              | 类型        | 说明                                  |
| ----------------- | ----------- | ------------------------------------- |
| `id`            | String      | 主键                                  |
| `userId`        | String?     | 关联用户 ID                           |
| `name`          | String      | 姓名                                  |
| `title`         | MemberTitle | 职称（TEACHER/MASTER/ALUMNI）         |
| `grade`         | Int?        | 年级（1=研一, 2=研二, 3=研三，仅硕士生）<br>由入学年份推算后回写，仅作冗余 |
| `enrollmentYear`| Int?        | 入学年份（如 2024）。年级由此按学年实时推算，每年 9 月自动升级 |
| `studentNo`     | String?     | 学号（从 bio 拆出，也会与 `users.studentId` 同步） |
| `phone`         | String?     | 手机号（从 bio 拆出）                 |
| `department`    | String?     | 院系（从 bio 拆出）                   |
| `major`         | String?     | 专业（从 bio 拆出）                   |
| `programType`   | String?     | 学生类别（从 bio 拆出，如「全日制学术学位硕士」） |
| `thesisTitle`   | String?     | 论文题目（从 bio 拆出）               |
| `researchDirection` | String?   | 研究方向                              |
| `bio`           | String?     | 个人简介（历史数据的档案文本仍保留在这里，可自行精简） |
| `email`         | String?     | 邮箱                                  |
| `avatarUrl`     | String?     | 头像 URL                              |
| `displayOrder`  | Int         | 排序权重                              |
| `isGraduated`   | Boolean     | 是否已毕业                            |
| `graduationYear`| Int?        | 毕业年份                              |

## API 路由

> 列表类接口（成员、论文、专利、软著、获奖、竞赛、项目）统一支持 `?page=&pageSize=` 分页（公共约定见 `src/lib/pagination.ts`，默认每页 10 条、上限 100）。请求不带分页参数时返回全量数组，供下拉选择、首页统计等场景使用。

### 认证

| 方法     | 路径                        | 说明          |
| -------- | --------------------------- | ------------- |
| POST     | `/api/auth/register`      | 用户注册      |
| POST/GET | `/api/auth/[...nextauth]` | NextAuth 登录 |

### 用户

| 方法 | 路径                  | 说明                   |
| ---- | --------------------- | ---------------------- |
| GET  | `/api/user/profile` | 获取当前登录用户信息   |
| PUT  | `/api/user/profile` | 更新当前用户信息（含成员信息） |

### 用户管理（管理员）

| 方法   | 路径                  | 说明                   |
| ------ | --------------------- | ---------------------- |
| GET    | `/api/users`        | 获取用户列表           |
| PUT    | `/api/users/[id]`   | 审核用户/修改角色      |
| DELETE | `/api/users/[id]`   | 删除用户               |
| POST   | `/api/users/sync`   | 同步用户与成员数据（为已审核用户补建成员记录） |

### 成果提交

| 方法   | 路径                     | 说明                   |
| ------ | ------------------------ | ---------------------- |
| GET    | `/api/submissions`      | 获取提交列表           |
| POST   | `/api/submissions`      | 提交新成果             |
| PUT    | `/api/submissions/[id]` | 审核提交（通过/拒绝）  |
| DELETE | `/api/submissions/[id]` | 删除提交               |

### 上传

| 方法 | 路径                  | 说明                                    |
| ---- | --------------------- | --------------------------------------- |
| POST | `/api/upload/avatar` | 上传头像（JPG/PNG/GIF/WebP，≤ 2MB） |

### 成员

| 方法   | 路径                  | 说明         |
| ------ | --------------------- | ------------ |
| GET    | `/api/members`      | 获取成员列表（自动排序，支持 `search`/`title`/`grade` 筛选） |
| POST   | `/api/members`      | 创建成员     |
| GET    | `/api/members/[id]` | 获取单个成员 |
| PUT    | `/api/members/[id]` | 更新成员     |
| DELETE | `/api/members/[id]` | 删除成员     |

### 论文

| 方法   | 路径                 | 说明         |
| ------ | -------------------- | ------------ |
| GET    | `/api/papers`      | 获取论文列表 |
| POST   | `/api/papers`      | 创建论文     |
| GET    | `/api/papers/[id]` | 获取单篇论文 |
| PUT    | `/api/papers/[id]` | 更新论文     |
| DELETE | `/api/papers/[id]` | 删除论文     |

### 专利

| 方法   | 路径                  | 说明         |
| ------ | --------------------- | ------------ |
| GET    | `/api/patents`      | 获取专利列表 |
| POST   | `/api/patents`      | 创建专利     |
| GET    | `/api/patents/[id]` | 获取单个专利 |
| PUT    | `/api/patents/[id]` | 更新专利     |
| DELETE | `/api/patents/[id]` | 删除专利     |

### 软件著作权

| 方法   | 路径                     | 说明         |
| ------ | ------------------------ | ------------ |
| GET    | `/api/copyrights`      | 获取软著列表 |
| POST   | `/api/copyrights`      | 创建软著     |
| GET    | `/api/copyrights/[id]` | 获取单个软著 |
| PUT    | `/api/copyrights/[id]` | 更新软著     |
| DELETE | `/api/copyrights/[id]` | 删除软著     |

### 获奖记录

| 方法   | 路径                 | 说明                                       |
| ------ | -------------------- | ------------------------------------------ |
| GET    | `/api/awards`      | 获取获奖列表（支持 `?category=` 分类筛选） |
| POST   | `/api/awards`      | 创建获奖                                   |
| GET    | `/api/awards/[id]` | 获取单个获奖                               |
| PUT    | `/api/awards/[id]` | 更新获奖                                   |
| DELETE | `/api/awards/[id]` | 删除获奖                                   |

> 竞赛记录 API（`/api/competitions`）已随竞赛模块下线移除；`competitions`
> 表保留存档，历史「未获奖」参赛记录已通过 `scripts/backfill-award-category.sql`
> 转入 `awards`（竞赛获奖分类）。

### 科研项目

| 方法   | 路径                            | 说明         |
| ------ | ------------------------------- | ------------ |
| GET    | `/api/projects`               | 获取项目列表 |
| POST   | `/api/projects`               | 创建项目     |
| GET    | `/api/projects/[id]`          | 获取单个项目 |
| PUT    | `/api/projects/[id]`          | 更新项目     |
| DELETE | `/api/projects/[id]`          | 删除项目     |
| POST   | `/api/projects/[id]/progress` | 添加项目进展 |

### 新闻动态

| 方法   | 路径               | 说明                                            |
| ------ | ------------------ | ----------------------------------------------- |
| GET    | `/api/news`      | 获取新闻列表（支持 ?category=&published= 筛选） |
| POST   | `/api/news`      | 创建新闻                                        |
| GET    | `/api/news/[id]` | 获取单条新闻                                    |
| PUT    | `/api/news/[id]` | 更新新闻                                        |
| DELETE | `/api/news/[id]` | 删除新闻                                        |

### 算法资源

| 方法   | 路径                     | 说明         |
| ------ | ------------------------ | ------------ |
| GET    | `/api/algorithms`      | 获取算法列表 |
| POST   | `/api/algorithms`      | 创建算法     |
| GET    | `/api/algorithms/[id]` | 获取单个算法 |
| PUT    | `/api/algorithms/[id]` | 更新算法     |
| DELETE | `/api/algorithms/[id]` | 删除算法     |

### 网站设置

| 方法 | 路径              | 说明         |
| ---- | ----------------- | ------------ |
| GET  | `/api/settings` | 获取所有设置 |
| PUT  | `/api/settings` | 批量更新设置 |

## 页面路由

### 访客端

除首页外的所有页面均需登录（`src/middleware.ts` 统一门禁，未登录重定向到
`/admin/login?callbackUrl=原路径`，登录后回跳原页面）；未登录状态下导航栏
只显示「首页」和「登录」。

| 路径               | 说明                         |
| ------------------ | ---------------------------- |
| `/`              | 首页                         |
| `/members`       | 成员列表                     |
| `/members/[id]`  | 成员详情                     |
| `/publications`  | 科研成果（论文、专利、软著） |
| `/awards`        | 获奖荣誉（科研/教学/竞赛/学业四分类） |
| `/projects`      | 科研项目列表                 |
| `/projects/[id]` | 项目详情（含进展时间线）     |
| `/news`          | 新闻动态列表                 |
| `/news/[id]`     | 新闻详情                     |
| `/algorithms`    | 算法资源                     |
| `/profile`       | 个人中心                     |
| `/profile/submissions`     | 我的成果           |
| `/profile/submissions/new` | 提交新成果         |

### 管理后台

| 路径                              | 说明         |
| --------------------------------- | ------------ |
| `/admin/login`                  | 登录         |
| `/admin/register`               | 注册         |
| `/admin`                        | 后台首页     |
| `/admin/users`                  | 用户审核     |
| `/admin/submissions`            | 成果审核     |
| `/admin/members`                | 成员管理     |
| `/admin/members/new`            | 添加成员     |
| `/admin/members/[id]/edit`      | 编辑成员     |
| `/admin/papers`                 | 论文管理     |
| `/admin/papers/new`             | 添加论文     |
| `/admin/papers/[id]/edit`       | 编辑论文     |
| `/admin/patents`                | 专利管理     |
| `/admin/patents/new`            | 添加专利     |
| `/admin/patents/[id]/edit`      | 编辑专利     |
| `/admin/copyrights`             | 软著管理     |
| `/admin/copyrights/new`         | 添加软著     |
| `/admin/copyrights/[id]/edit`   | 编辑软著     |
| `/admin/awards`                 | 获奖管理     |
| `/admin/awards/new`             | 添加获奖     |
| `/admin/awards/[id]/edit`       | 编辑获奖     |
| `/admin/projects`               | 项目管理     |
| `/admin/projects/new`           | 添加项目     |
| `/admin/projects/[id]/edit`     | 编辑项目     |
| `/admin/news`                   | 新闻管理     |
| `/admin/news/new`               | 发布新闻     |
| `/admin/news/[id]/edit`         | 编辑新闻     |
| `/admin/algorithms`             | 算法管理     |
| `/admin/algorithms/new`         | 添加算法     |
| `/admin/algorithms/[id]/edit`   | 编辑算法     |
| `/admin/settings`               | 网站设置     |

## 认证与权限

### 角色

| 角色        | 说明                             | 可见导航项                   |
| ----------- | -------------------------------- | ---------------------------- |
| SUPER_ADMIN | 超级管理员，拥有所有权限         | 个人中心、管理后台、退出     |
| ADMIN       | 管理员，可管理内容               | 个人中心、管理后台、退出     |
| MEMBER      | 普通成员，可查看和录入自己的成果 | 个人中心、退出（无后台入口） |
| 未登录      | 访客                             | 登录                         |

### 导航栏权限

- **未登录用户**：显示「登录」入口
- **普通成员 (MEMBER)**：显示「个人中心」和「退出」，**不显示「管理后台」**
- **管理员/超级管理员**：显示「个人中心」、「管理后台」和「退出」

### 注册流程

1. 用户访问 `/admin/register` 注册
2. 选择身份（**只有老师 / 硕士生**）和**入学年份**（下拉：下限固定 **2000 年**，
   上限 = 当前学年 + 2，每年 9 月只后移上限，老校友永远能选到 2000），
   年级和「是否已毕业」都由后台按学年自动判定（不再手选「研几」「已毕业」）：
   - 在读年份按学年显示研一 / 研二 / 研三
   - 入学超过 3 年学制 → **自动记为「已毕业」**（保留入学年份供查档）
   - 未来年份（如 2027）→ 记为「预入学」，`grade` 留空，到该学年 9 月自动变成研一
3. 默认状态为 `PENDING`（待审核）
4. 管理员在「用户审核」页面审核通过
5. **系统自动创建成员记录**，同步用户信息
6. 用户登录后可在「个人中心」编辑成员信息

### 成果提交流程

1. 用户在「个人中心」→「我的成果」→「提交新成果」
2. 选择成果类型（论文/专利/软著/获奖）
3. 填写表单提交
4. 管理员在「成果审核」页面审核
5. 审核通过后成果显示在网站上

### 成员排序规则

成员列表按以下规则排序：
1. **老师** 排最前
2. **硕士生** 按年级排序：研三 > 研二 > 研一
3. **已毕业** 排最后

年级不再手工维护：数据库只存 `enrollment_year`（入学年份），
`src/lib/member-grade.ts` 按「9 月开学」的学年实时推算（入学当年为研一，满 3 年后不再显示年级，
管理员把它改成「已毕业」即可）。没有填入学年份的历史数据会回退使用 `grade` 字段。

「已毕业」成员**保留入学年份**（方便日后查档），只是不再展示「研几」——`resolveMemberGrade()`
对非硕士生一律返回空年级；改为「老师」时才会清空学籍字段。

学籍类字段（学号/手机/院系/专业/学生类别/论文题目）已从 `bio` 拆成独立列，历史数据用
`scripts/backfill-enrollment-year.sql`（入学年份）和 `scripts/backfill-member-profile.sql`
（其余六项，从 bio 里按「院系：…；学号：…」格式解析）回填，两个脚本都是幂等的。

### 获奖分类与竞赛模块下线

获奖记录分四类：**科研获奖 / 教学获奖 / 竞赛获奖 / 学业获奖**（`awards.category`，
枚举定义见上）。前台独立的「获奖」页 `/awards` 按分类筛选，`/publications`
只保留论文/专利/软著三个 tab。

竞赛模块（前台页、管理页、API）已下线，`competitions` 表保留存档。历史获奖数据
用 `scripts/backfill-award-category.sql` 回填（幂等）：存量 86 条按证书来源分类
（教学 42 / 竞赛 38 / 科研 5 / 学业 1），并把 2 条「未获奖」竞赛参赛记录转入
竞赛获奖。部署时先 `npx prisma db push` 加列，再执行该脚本。

### 首次部署

1. 注册第一个账号
2. 在数据库中手动设置为超级管理员：

```sql
UPDATE users SET status = 'APPROVED', role = 'SUPER_ADMIN' WHERE email = 'your@email.com';
```

3. 登录后台管理其他用户

## 部署（阶段二：Docker Compose）

当前采用 Docker Compose 单容器部署，访问方式为 `http://你的域名:3000`，阶段三再切换为 HTTPS 纯域名。

当前部署链路：

```text
浏览器
  ↓
域名:3000
  ↓
服务器 3000 端口
  ↓
chen-group-app 容器:3000
  ↓
Next.js 应用
  ↓
Prisma
  ↓
host.docker.internal:3306
  ↓
服务器已有 MySQL 容器
  ↓
group_website 数据库
```

### 涉及文件

| 文件                | 说明                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| `Dockerfile`      | 三阶段构建（deps → builder → runner），基于 `node:22-bookworm-slim`。各阶段安装 OpenSSL（Prisma 依赖），并切换清华镜像源加速 apt |
| `docker-compose.yml` | 定义 `app` 服务：容器名 `chen-group-app`，加载 `.env.production`，映射 `3000:3000`，配置 `host.docker.internal:host-gateway` |
| `.env.production` | 服务器生产环境变量（数据库连接、NextAuth 配置）。**不提交 Git、不进镜像** |
| `deploy.sh`       | 一键更新脚本，保留在服务器项目目录，**不提交 Git**（完整内容见下文）  |

### 首次部署

前提条件：

- 服务器已安装 Docker 与 Docker Compose
- 服务器已有 MySQL 容器（3306 端口），且已创建 `group_website` 数据库（utf8mb4）
- 域名已解析到服务器，防火墙/安全组放行 3000 端口

#### 1. 准备项目目录

不要混用 `sudo git clone` 和普通 `git pull`，先把目录授权给部署用户：

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/Sooonar/Chen-Research-Group.git
cd Chen-Research-Group
```

#### 2. 创建 .env.production

```env
NODE_ENV=production
DATABASE_URL=mysql://chen_app:数据库密码@host.docker.internal:3306/group_website
NEXTAUTH_SECRET=服务器上的随机密钥
NEXTAUTH_URL=http://你的域名:3000
```

> 阶段二 `NEXTAUTH_URL` 需要带 `:3000` 端口；阶段三切换 HTTPS 后改为 `https://你的域名`。

`.gitignore` 与 `.dockerignore` 已排除 `.env*`，环境变量文件不会被提交或打进镜像。

#### 3. 创建 deploy.sh 并首次部署

`deploy.sh` 不在仓库中，在服务器项目目录手动创建，内容如下（**注意保存为 LF 换行**）：

```bash
#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/Chen-Research-Group"
BACKUP_ROOT="/var/www/backups/chen-group"
APP_CONTAINER="chen-group-app"

cd "$APP_DIR"

echo "==> 当前版本"
git status --short --branch

echo "==> 拉取远端更新"
git fetch origin

BEFORE="$(git rev-parse HEAD)"
git merge --ff-only origin/main
AFTER="$(git rev-parse HEAD)"

echo "==> 备份当前目录"
mkdir -p "$BACKUP_ROOT"
cp -a "$APP_DIR" "$BACKUP_ROOT/Chen-Research-Group-$(date +%F-%H%M%S)"

echo "==> 检查是否更新 Prisma schema"
PRISMA_CHANGED=0
if [ "$BEFORE" != "$AFTER" ]; then
  if git diff --name-only "$BEFORE" "$AFTER" | grep -q '^prisma/schema.prisma$'; then
    PRISMA_CHANGED=1
  fi
fi

echo "==> 构建并重启 Docker"
docker compose up -d --build

if [ "$PRISMA_CHANGED" = "1" ]; then
  echo "==> 同步 Prisma 数据库结构"
  docker compose run --rm app npx prisma db push
  docker compose up -d --force-recreate
fi

echo "==> 查看容器状态"
docker ps | grep "$APP_CONTAINER" || true

echo "==> 最近日志"
docker logs --tail=80 "$APP_CONTAINER"

echo "==> 部署完成"
```

执行：

```bash
chmod +x deploy.sh
bash deploy.sh
```

### 日常更新

服务器能访问 GitHub 时，最短流程：

```bash
cd /var/www/Chen-Research-Group
bash deploy.sh
```

脚本流程：查看 Git 状态 → `git fetch origin` → `git merge --ff-only origin/main` → 备份当前目录到 `/var/www/backups/chen-group/` → 检测 `prisma/schema.prisma` 是否变更 → `docker compose up -d --build` → 如 schema 有变更自动执行 `prisma db push` 并重建容器 → 输出容器状态和最近日志。

不用脚本时的手动等价命令：

```bash
cd /var/www/Chen-Research-Group
git fetch origin
git merge --ff-only origin/main
docker compose up -d --build
docker logs --tail=100 chen-group-app
```

按变更内容选择命令：

| 场景                         | 命令                                         |
| ---------------------------- | -------------------------------------------- |
| 普通代码更新                 | `docker compose up -d --build`             |
| 只改了 `.env.production`   | `docker compose up -d --force-recreate`    |
| 代码和环境变量都改了         | `docker compose up -d --build --force-recreate` |
| `prisma/schema.prisma` 有变更 | 见下节                                       |

### Prisma schema 更新时

`prisma db push` 只同步表结构，不创建数据库本身，也不负责插入初始数据：

```bash
cd /var/www/Chen-Research-Group
docker compose run --rm app npx prisma db push
docker compose up -d --force-recreate
```

`deploy.sh` 会在检测到 schema 变更时自动执行以上步骤。如果日志出现 `Unknown column` / `Table doesn't exist`，优先检查是否漏了这一步。

### 注意事项

- **通常不需要 `docker compose down`**：`up -d --build` 会自动重建镜像并重建容器，`down` 只会增加停机时间。
- **切勿随手执行 `docker compose down -v`**：`-v` 会删除 Compose 管理的数据卷，可能造成数据丢失。
- 只处理 `chen-group-app` 容器，不要动服务器上已有的 `mysql`、`redis`、`heatfront`、`heatend` 容器。
- 没有确认和备份时不要执行：`git reset --hard origin/main`、`docker compose down -v`、`docker volume rm`、`sudo rm -rf /var/www/Chen-Research-Group`。

### 常用检查命令

```bash
# 容器状态
docker ps | grep chen-group-app

# 最近日志
docker logs --tail=100 chen-group-app

# 端口监听（期望看到 0.0.0.0:3000，表示对公网开放）
sudo ss -lntp | grep ':3000'

# 检查数据库表
docker exec -it mysql mysql -uroot -p
# 进入后：USE group_website; SHOW TABLES;
```

### 常见部署问题

**1. 拉取代码报 GnuTLS 错误**

```text
fatal: unable to access 'https://github.com/Sooonar/Chen-Research-Group.git':
GnuTLS recv error (-110): The TLS connection was non-properly terminated.
```

通常是服务器访问 GitHub 的网络不稳定，可用 `curl -I https://github.com` 验证。可尝试强制 Git 使用 HTTP/1.1：

```bash
git config --global http.version HTTP/1.1
```

如果服务器长期访问 GitHub 不稳定，改用「本地上传版部署」：本地更新代码后通过 `scp`/`rsync` 上传到服务器，再执行 `docker compose up -d --build`。

**2. git clone 报 Permission denied**

当前用户没有 `/var/www` 写权限。按「首次部署」第 1 步执行 `chown` 授权；如果之前用 `sudo git clone` 生成过目录，用 `sudo chown -R $USER:$USER /var/www/Chen-Research-Group` 修正归属。

**3. 执行 deploy.sh 报 `invalid option name: pipefail`**

脚本是 Windows CRLF 换行导致（`pipefail` 后多了 `^M`）。在服务器上修复：

```bash
sed -i 's/\r$//' deploy.sh   # 或安装 dos2unix 后执行 dos2unix deploy.sh
bash deploy.sh
```

避免复发：仓库中增加 `.gitattributes`（`*.sh text eol=lf`），或编辑 `.sh` 时保持 LF 换行。

### 阶段三预告

阶段三将切换为 `https://你的域名`：宿主机 Nginx 监听 80/443，本项目只绑定 `127.0.0.1:3000` 由 Nginx 反向代理，同时需要处理 `heatfront` 占用 80 端口的问题并申请 HTTPS 证书。建议先把阶段二的一键部署跑稳定，再规划阶段三。

## 开发规范

### 代码风格

- 使用 TypeScript
- 使用 Tailwind CSS 样式
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名
- API 返回统一格式：`{ data }` 或 `{ error }`
- 列表分页统一使用 `src/lib/pagination.ts` 的公共约定和 `PageResult` 响应结构

### Git 提交规范

```
type(scope): 描述

feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试
chore: 构建/工具变更
```

### 数据库迁移

修改 `prisma/schema.prisma` 后执行：

```bash
npx prisma db push        # 同步到数据库
npx prisma generate       # 重新生成客户端
```

## 已完成功能

- [x] 首页展示（课题组简介、团队卡片、成果统计、招生信息）
- [x] 成员管理（CRUD、头像上传与裁剪、分类筛选、自动排序）
- [x] 列表分页（通用分页约定与组件，默认每页 10 条，成员页每页 9 条）
- [x] 科研成果（论文、专利、软著、获奖）
- [x] 科研项目（项目列表、详情、进展时间线、成果关联）
- [x] 竞赛获奖展示（获奖结果筛选、分页）
- [x] 新闻动态（分类筛选、富文本内容）
- [x] 算法资源（展示、下载、使用说明）
- [x] 管理后台（全部模块的 CRUD 操作）
- [x] 用户注册审核机制（选择身份和年级）
- [x] 审核通过自动创建成员记录 + 用户/成员数据同步
- [x] 角色权限系统（超级管理员/管理员/普通成员）
- [x] 个人中心（查看/编辑个人信息、成员信息）
- [x] 导航栏权限控制（根据角色显示/隐藏后台入口）
- [x] 成员自主成果提交 + 审核流程
- [x] 存量数据导入脚本（成员、项目、成果）
- [x] Docker Compose 部署 + 一键部署脚本

## 待完成功能

- [ ] 操作日志记录
- [ ] 附件上传（头像已支持，附件待做）
- [ ] 富文本编辑器集成
- [ ] 数据可视化图表
- [ ] 响应式优化
- [ ] 阶段三 HTTPS 部署（Nginx 反向代理 + 证书）

## 常见问题（本地开发）

### MySQL 连接失败

检查 MySQL 服务是否启动：

```powershell
Get-Service -Name "MySQL*"
net start MySQL84
```

### Prisma 生成失败

```bash
npx prisma generate
```

### 构建错误

```bash
rm -rf .next
npm run build
```

## 联系方式

如有问题，请联系苏诺。
