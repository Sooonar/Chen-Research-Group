# 陈老师课题组网站

课题组官方介绍网站，展示团队研究成果、成员信息、科研项目和算法资源。

## 技术栈

| 类别   | 技术                             | 版本 |
| ------ | -------------------------------- | ---- |
| 框架   | Next.js (App Router)             | 16.x |
| 前端   | React + Tailwind CSS + shadcn/ui | -    |
| 动效   | Framer Motion                    | -    |
| 图标   | Lucide React                     | -    |
| 数据库 | MySQL                            | 8.x  |
| ORM    | Prisma                           | 7.x  |
| 认证   | NextAuth.js                      | -    |
| 语言   | TypeScript                       | 5.x  |

## 项目结构

```
chen-group-website/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── config.ts              # Prisma 配置
├── src/
│   ├── app/
│   │   ├── page.tsx           # 首页
│   │   ├── layout.tsx         # 根布局
│   │   ├── globals.css        # 全局样式
│   │   ├── members/           # 成员页面
│   │   │   ├── page.tsx       # 成员列表
│   │   │   └── [id]/page.tsx  # 成员详情
│   │   ├── publications/      # 科研成果页面
│   │   ├── projects/          # 科研项目页面
│   │   │   ├── page.tsx       # 项目列表
│   │   │   └── [id]/page.tsx  # 项目详情
│   │   ├── news/              # 新闻动态页面
│   │   │   ├── page.tsx       # 新闻列表
│   │   │   └── [id]/page.tsx  # 新闻详情
│   │   ├── algorithms/        # 算法资源页面
│   │   ├── profile/           # 个人中心
│   │   │   ├── page.tsx       # 个人资料
│   │   │   └── submissions/   # 我的成果
│   │   │       ├── page.tsx   # 成果列表
│   │   │       └── new/       # 提交新成果
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
│   │       ├── users/         # 用户管理 API
│   │       ├── submissions/   # 成果提交 API
│   │       ├── members/       # 成员 API
│   │       ├── papers/        # 论文 API
│   │       ├── patents/       # 专利 API
│   │       ├── copyrights/    # 软著 API
│   │       ├── awards/        # 获奖 API
│   │       ├── projects/      # 项目 API
│   │       ├── news/          # 新闻 API
│   │       ├── algorithms/    # 算法 API
│   │       └── settings/      # 设置 API
│   ├── components/
│   │   ├── layout/            # 布局组件
│   │   │   ├── navbar.tsx     # 导航栏
│   │   │   └── footer.tsx     # 页脚
│   │   ├── sections/          # 首页模块
│   │   │   ├── hero-section.tsx
│   │   │   ├── team-preview.tsx
│   │   │   ├── stats-section.tsx
│   │   │   └── admission-section.tsx
│   │   └── providers.tsx      # SessionProvider
│   ├── lib/
│   │   ├── prisma.ts          # Prisma 客户端
│   │   └── auth.ts            # 认证工具
│   ├── types/
│   │   └── next-auth.d.ts     # NextAuth 类型扩展
│   └── middleware.ts          # 认证中间件
├── public/                    # 静态资源
├── .env.local                 # 环境变量（不提交）
├── package.json
├── tsconfig.json
├── tailwind.config.ts
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

复制 `.env.example` 为 `.env.local`，修改数据库连接信息：

```env
# 数据库连接
DATABASE_URL="mysql://root:@localhost:3306/group_website"

# NextAuth
NEXTAUTH_SECRET="随机生成的密钥"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. 初始化数据库表

```bash
npx prisma db push
```

### 6. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 数据库模型

### 核心表

| 表名                    | 说明                             |
| ----------------------- | -------------------------------- |
| `users`               | 用户账号（登录、注册审核、角色） |
| `members`             | 成员展示信息                     |
| `publications`        | 论文                             |
| `patents`             | 专利                             |
| `software_copyrights` | 软件著作权                       |
| `awards`              | 获奖记录                         |
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
  ONGOING      // 进行中
  COMPLETED    // 已结题
  SUSPENDED    // 已暂停
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
| `grade`         | Int?        | 年级（1=研一, 2=研二, 3=研三，仅硕士生） |
| `researchDirection` | String?   | 研究方向                              |
| `bio`           | String?     | 个人简介                              |
| `email`         | String?     | 邮箱                                  |
| `avatarUrl`     | String?     | 头像 URL                              |
| `displayOrder`  | Int         | 排序权重                              |
| `isGraduated`   | Boolean     | 是否已毕业                            |
| `graduationYear`| Int?        | 毕业年份                              |

## API 路由

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

| 方法   | 路径              | 说明                   |
| ------ | ----------------- | ---------------------- |
| GET    | `/api/users`     | 获取用户列表           |
| PUT    | `/api/users/[id]` | 审核用户/修改角色      |
| DELETE | `/api/users/[id]` | 删除用户               |

### 成果提交

| 方法   | 路径                     | 说明                   |
| ------ | ------------------------ | ---------------------- |
| GET    | `/api/submissions`      | 获取提交列表           |
| POST   | `/api/submissions`      | 提交新成果             |
| PUT    | `/api/submissions/[id]` | 审核提交（通过/拒绝）  |
| DELETE | `/api/submissions/[id]` | 删除提交               |

### 成员

| 方法   | 路径                  | 说明         |
| ------ | --------------------- | ------------ |
| GET    | `/api/members`      | 获取成员列表（自动排序） |
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

| 方法   | 路径                 | 说明         |
| ------ | -------------------- | ------------ |
| GET    | `/api/awards`      | 获取获奖列表 |
| POST   | `/api/awards`      | 创建获奖     |
| GET    | `/api/awards/[id]` | 获取单个获奖 |
| PUT    | `/api/awards/[id]` | 更新获奖     |
| DELETE | `/api/awards/[id]` | 删除获奖     |

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

| 路径               | 说明                         |
| ------------------ | ---------------------------- |
| `/`              | 首页                         |
| `/members`       | 成员列表                     |
| `/members/[id]`  | 成员详情                     |
| `/publications`  | 科研成果（论文、专利、软著） |
| `/projects`      | 科研项目列表                 |
| `/projects/[id]` | 项目详情（含进展时间线）     |
| `/news`          | 新闻动态列表                 |
| `/news/[id]`     | 新闻详情                     |
| `/algorithms`    | 算法资源                     |
| `/profile`       | 个人中心（需登录）           |
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
2. 选择身份（老师/硕士生）和年级（研一/研二/研三）
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

### 首次部署

1. 注册第一个账号
2. 在数据库中手动设置为超级管理员：

```sql
UPDATE users SET status = 'APPROVED', role = 'SUPER_ADMIN' WHERE email = 'your@email.com';
```

3. 登录后台管理其他用户

## 部署

### 腾讯云 Linux 服务器部署

#### 1. 安装环境

```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 安装 Nginx
sudo apt install nginx
```

#### 2. 上传项目

```bash
# 将项目上传到服务器
scp -r ./chen-group-website user@server:/var/www/

# 或使用 Git
git clone <repository-url> /var/www/chen-group-website
```

#### 3. 安装依赖并构建

```bash
cd /var/www/chen-group-website
npm install
npx prisma generate
npx prisma db push
npm run build
```

#### 4. 配置环境变量

```bash
cp .env.example .env.production
# 编辑 .env.production，配置生产环境数据库连接
```

#### 5. 使用 PM2 启动

```bash
pm2 start npm --name "chen-group-website" -- start
pm2 save
pm2 startup
```

#### 6. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

## 开发规范

### 代码风格

- 使用 TypeScript
- 使用 Tailwind CSS 样式
- 组件使用 PascalCase 命名
- 文件使用 kebab-case 命名
- API 返回统一格式：`{ data }` 或 `{ error }`

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
- [x] 成员管理（CRUD、头像、分类筛选、自动排序）
- [x] 科研成果（论文、专利、软著、获奖）
- [x] 科研项目（项目列表、详情、进展时间线、成果关联）
- [x] 新闻动态（分类筛选、富文本内容）
- [x] 算法资源（展示、下载、使用说明）
- [x] 管理后台（全部模块的 CRUD 操作）
- [x] 用户注册审核机制（选择身份和年级）
- [x] 审核通过自动创建成员记录
- [x] 角色权限系统（超级管理员/管理员/普通成员）
- [x] 个人中心（查看/编辑个人信息、成员信息）
- [x] 导航栏权限控制（根据角色显示/隐藏后台入口）
- [x] 成员自主成果提交 + 审核流程
- [x] 用户审核管理
- [x] 成果审核管理
- [x] 成员排序（老师 > 研三 > 研二 > 研一）

## 待完成功能

- [ ] 操作日志记录
- [ ] 文件上传功能（头像、附件）
- [ ] 批量导入论文
- [ ] 富文本编辑器集成
- [ ] 数据可视化图表
- [ ] 响应式优化

## 常见问题

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
