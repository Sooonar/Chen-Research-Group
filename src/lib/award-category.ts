/** 获奖分类：与 Prisma 的 AwardCategory 枚举一致。 */
export type AwardCategory = "RESEARCH" | "TEACHING" | "COMPETITION" | "ACADEMIC";

export const AWARD_CATEGORIES: AwardCategory[] = [
  "RESEARCH",
  "TEACHING",
  "COMPETITION",
  "ACADEMIC",
];

export const awardCategoryLabels: Record<AwardCategory, string> = {
  RESEARCH: "科研获奖",
  TEACHING: "教学获奖",
  COMPETITION: "竞赛获奖",
  ACADEMIC: "学业获奖",
};

/** 校验并归一化分类值，非法值回落为 RESEARCH。 */
export function toAwardCategory(value: unknown): AwardCategory {
  return AWARD_CATEGORIES.includes(value as AwardCategory)
    ? (value as AwardCategory)
    : "RESEARCH";
}
