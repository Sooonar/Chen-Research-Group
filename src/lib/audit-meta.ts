// 操作日志的公共元数据：前后端共用，不依赖 Prisma，客户端组件可直接引入。

export type LogAction = "CREATE" | "UPDATE" | "DELETE" | "REVIEW" | "LOGIN";

export const ACTION_LABELS: Record<LogAction, string> = {
  CREATE: "新增",
  UPDATE: "修改",
  DELETE: "删除",
  REVIEW: "审核",
  LOGIN: "登录",
};

/** 动作对应的徽标配色（与后台其他页面的状态色保持一致）。 */
export const ACTION_STYLES: Record<LogAction, string> = {
  CREATE: "bg-green-500/20 text-green-400",
  UPDATE: "bg-blue-500/20 text-blue-400",
  DELETE: "bg-red-500/20 text-red-400",
  REVIEW: "bg-purple-500/20 text-purple-400",
  LOGIN: "bg-gray-500/20 text-gray-300",
};

/** 记录范围。新增模块时只需在这里补一行，写入端与筛选下拉共用。 */
export const MODULE_LABELS = {
  paper: "论文",
  patent: "专利",
  copyright: "软著",
  award: "获奖",
  project: "科研项目",
  member: "团队成员",
  news: "新闻动态",
  algorithm: "算法资源",
  submission: "成果提交",
  user: "用户账号",
  profile: "个人资料",
  setting: "网站设置",
  log: "操作日志",
  auth: "登录",
} as const;

export type ModuleKey = keyof typeof MODULE_LABELS;

export const MODULE_KEYS = Object.keys(MODULE_LABELS) as ModuleKey[];

export const ACTION_KEYS = Object.keys(ACTION_LABELS) as LogAction[];

export function isModuleKey(value: string): value is ModuleKey {
  return Object.prototype.hasOwnProperty.call(MODULE_LABELS, value);
}

export function isLogAction(value: string): value is LogAction {
  return Object.prototype.hasOwnProperty.call(ACTION_LABELS, value);
}

/** 一次操作中被改动的字段（before/after 均已格式化为可读文本）。 */
export interface FieldChange {
  field: string;
  label: string;
  before: string;
  after: string;
}

/** 解析数据库里存的 changes JSON，损坏或为空时返回空数组。 */
export function parseChanges(raw?: string | null): FieldChange[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FieldChange =>
        !!item &&
        typeof item === "object" &&
        typeof (item as FieldChange).label === "string" &&
        typeof (item as FieldChange).before === "string" &&
        typeof (item as FieldChange).after === "string"
    );
  } catch {
    return [];
  }
}
