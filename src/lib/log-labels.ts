// 日志展示用的枚举中文名（与各管理页面的下拉选项保持一致）。

export const patentTypeLabels: Record<string, string> = {
  INVENTION: "发明专利",
  UTILITY: "实用新型",
  DESIGN: "外观设计",
};

export const patentStatusLabels: Record<string, string> = {
  APPLIED: "申请中",
  AUTHORIZED: "已授权",
};

export const awardCategoryLabels: Record<string, string> = {
  RESEARCH: "科研获奖",
  TEACHING: "教学获奖",
  COMPETITION: "竞赛获奖",
  ACADEMIC: "学业获奖",
};

export const projectStatusLabels: Record<string, string> = {
  COMPLETED: "结题",
  APPROVED: "获准",
  APPLIED: "申请",
  ONGOING: "申请",
  SUSPENDED: "申请",
};

export const memberTitleLabels: Record<string, string> = {
  TEACHER: "老师",
  MASTER: "硕士生",
  ALUMNI: "已毕业",
};

export const newsCategoryLabels: Record<string, string> = {
  GROUP: "组内新闻",
  ACADEMIC: "学术动态",
  AWARD: "获奖通知",
};

export const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "超级管理员",
  ADMIN: "管理员",
  MEMBER: "普通成员",
};

export const userStatusLabels: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
};

export const reviewStatusLabels: Record<string, string> = {
  PENDING: "待审核",
  APPROVED: "已通过",
  REJECTED: "已拒绝",
};

export const achievementTypeLabels: Record<string, string> = {
  PUBLICATION: "论文",
  PATENT: "专利",
  COPYRIGHT: "软著",
  AWARD: "获奖",
};

/** 网站设置的配置项中文名，见 admin/settings 页面。 */
export const settingKeyLabels: Record<string, string> = {
  lab_name: "课题组名称",
  lab_short_name: "导航栏简称",
  lab_subtitle: "副标题",
  lab_description: "课题组简介",
  admission_info: "招生信息",
  contact_email: "联系邮箱",
};
